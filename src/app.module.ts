import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecruiterController } from './recruiter/recruiter.controller';
import { RecruiterService } from './recruiter/recruiter.service';
import { RecruiterModule } from './recruiter/recruiter.module';

@Module({
  imports: [RecruiterModule],
  controllers: [AppController, RecruiterController],
  providers: [AppService, RecruiterService],
})
export class AppModule {}
