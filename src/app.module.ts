import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { StudentModule } from "./student/student.module";
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';
import { RecruiterModule } from './recruiter/recruiter.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, StudentModule, AdminModule, MailModule, RecruiterModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
