import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AzureSBService } from './azure-sb.service';
import { JobService } from './job.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [JobService, AzureSBService, AppService],
})
export class AppModule {}
