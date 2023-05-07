import { Injectable } from '@nestjs/common';
import { AzureSBService } from './azure-sb.service';
import { generate } from 'randomstring';
import { Job, JobDetails } from './job';
import { JobService } from './Job.service';

@Injectable()
export class AppService {
  constructor(
    private readonly sbService: AzureSBService,
    private jobService: JobService,
  ) {}

  async fetchProfile() {
    const newJob: Job = {
      id: generate(10),
      data: 'new_request',
    };

    await this.sbService.addJobToQueue(newJob);

    return {
      id: newJob.id,
    };
  }

  async fetchProgress(id: string): Promise<JobDetails> {
    return this.jobService.getJob(id);
  }
}