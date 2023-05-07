import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { JobDetails } from './job';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('fetch')
  async fetchProfile() {
    return await this.appService.fetchProfile();
  }

  @Get('fetch/:id')
  async getFetchProgress(@Param('id') id: string): Promise<JobDetails> {
    return await this.appService.fetchProgress(id);
  }
}
