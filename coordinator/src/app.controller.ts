import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { JobDetails } from './job';

@Controller('api/jobs')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('request')
  async requestJob() {
    return await this.appService.requestJob();
  }

  @Get(':id')
  async fetchJob(@Param('id') id: string): Promise<JobDetails> {
    return await this.appService.fetchJob(id);
  }
}
