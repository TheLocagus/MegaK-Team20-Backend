import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';
import { RecruiterModule } from './recruiter/recruiter.module';

@Module({
  imports: [DatabaseModule, AdminModule, MailModule, RecruiterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
