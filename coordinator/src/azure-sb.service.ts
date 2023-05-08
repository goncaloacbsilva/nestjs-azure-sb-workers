import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import {
  ServiceBusClient,
  ServiceBusReceiver,
  ServiceBusSender,
} from '@azure/service-bus';
import { ConfigService } from '@nestjs/config';
import { Job } from './job';
import { JobService } from './job.service';

@Injectable()
export class AzureSBService implements OnModuleDestroy {
  private readonly logger = new Logger(AzureSBService.name);
  private sbClient: ServiceBusClient;
  private sbJobRequestsQueueSender?: ServiceBusSender;
  private sbJobUpdatesQueueReceiver?: ServiceBusReceiver;

  constructor(
    private configService: ConfigService,
    private jobService: JobService,
  ) {
    this.sbClient = new ServiceBusClient(
      configService.getOrThrow<string>('AZURE_SB_CONNECTION_STRING'),
    );

    this.sbJobRequestsQueueSender = this.sbClient.createSender(
      configService.getOrThrow<string>('AZURE_SB_JOB_REQUESTS_QUEUE'),
    );

    this.sbJobUpdatesQueueReceiver = this.sbClient.createReceiver(
      configService.getOrThrow<string>('AZURE_SB_JOB_UPDATES_QUEUE'),
    );

    this.sbJobUpdatesQueueReceiver.subscribe({
      processMessage: async (msg) => this.jobService.updateJob(msg.body),
      processError: async (error) => this.logger.error(error),
    });
  }

  onModuleDestroy() {
    this.logger.log('Closing Service Bus connection...');
    this.sbJobRequestsQueueSender?.close();
    this.sbJobUpdatesQueueReceiver?.close();
    this.sbClient?.close();
  }

  async addJobToQueue(job: Job) {
    await this.sbJobRequestsQueueSender.sendMessages({
      body: job,
    });

    // Update in memory db
    this.jobService.updateJob({
      worker: null,
      job: job,
      progress: 0,
      hasStarted: false,
      completed: false,
    });
  }
}
