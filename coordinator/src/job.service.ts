import { Injectable } from '@nestjs/common';
import { JobDetails } from './job';

@Injectable()
export class JobService {
  private readonly inMemoryJobDB: Map<string, JobDetails>;

  constructor() {
    this.inMemoryJobDB = new Map<string, JobDetails>();
  }

  updateJob(details: JobDetails) {
    this.inMemoryJobDB.set(details.job.id, details);
  }

  getJob(jobId: string) {
    return this.inMemoryJobDB.get(jobId);
  }
}
