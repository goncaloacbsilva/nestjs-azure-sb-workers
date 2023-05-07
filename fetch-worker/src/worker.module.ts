import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AzureSBWorkerService } from './azure-sb-worker.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [AzureSBWorkerService],
})
export class WorkerModule {}
