import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const jobDetails = this.inMemoryJobDB.get(jobId);

    if (!jobDetails) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }

    return jobDetails;
  }
}
