import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import {
  ServiceBusClient,
  ServiceBusReceiver,
  ServiceBusSender,
} from '@azure/service-bus';
import { ConfigService } from '@nestjs/config';
import { Job, JobDetails } from './job';
import { hostname } from 'os';

@Injectable()
export class AzureSBWorkerService implements OnModuleDestroy {
  private readonly logger = new Logger(AzureSBWorkerService.name);
  private sbClient: ServiceBusClient;
  private sbJobUpdatesQueueSender?: ServiceBusSender;
  private sbJobRequestsQueueReciver?: ServiceBusReceiver;
  private instanceName: string;
  private ongoingJob: JobDetails | null;

  constructor(private configService: ConfigService) {
    this.instanceName = hostname();
    this.ongoingJob = null;

    this.sbClient = new ServiceBusClient(
      configService.getOrThrow<string>('AZURE_SB_CONNECTION_STRING'),
    );

    this.sbJobUpdatesQueueSender = this.sbClient.createSender(
      configService.getOrThrow<string>('AZURE_SB_JOB_UPDATES_QUEUE'),
    );

    this.sbJobRequestsQueueReciver = this.sbClient.createReceiver(
      configService.getOrThrow<string>('AZURE_SB_JOB_REQUESTS_QUEUE'),
    );

    this.sbJobRequestsQueueReciver.subscribe({
      processMessage: (msg) => this.processJob(msg.body),
      processError: async (error) => this.logger.error(error.error),
    });
  }

  onModuleDestroy() {
    this.logger.log('Closing Service Bus connection...');
    this.sbJobRequestsQueueReciver?.close();
    this.sbJobUpdatesQueueSender?.close();
    this.sbClient?.close();
  }

  async updateStatus() {
    if (this.ongoingJob) {
      const ongoingJobDetails = { ...this.ongoingJob };

      this.sbJobUpdatesQueueSender.sendMessages({
        body: ongoingJobDetails,
      });

      // Refresh status
      setTimeout(() => this.updateStatus(), 1000);
    }
  }

  async processJob(job: Job) {
    const details: JobDetails = {
      worker: this.instanceName,
      job: job,
      progress: 0,
      hasStarted: true,
      completed: false,
    };

    this.logger.log(`Processing job #${job.id} with data: ${job.data}`);

    this.ongoingJob = details;
    this.updateStatus();

    // Fake task
    for (let i = 0; i < 100; i++) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, Math.floor(Math.random() * 200));
      });
      this.ongoingJob.progress += 1;
    }

    this.ongoingJob.completed = true;

    // Send one last update
    this.sbJobUpdatesQueueSender.sendMessages({
      body: this.ongoingJob,
    });

    this.ongoingJob = null;
  }
}
