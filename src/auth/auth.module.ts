import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminStrategy } from './strategy/admin.strategy';
import { RecruiterStrategy } from './strategy/recruiter.strategy';
import { StudentStrategy } from './strategy/student.strategy';
import { LookForUser } from './look-for-user.service';
import { MailModule } from '../mail/mail.module';
import { LogoutStrategy } from './strategy/logout.strategy';

@Module({
  imports: [forwardRef(() => MailModule)],
  controllers: [AuthController],
  providers: [
    AuthService,
    AdminStrategy,
    RecruiterStrategy,
    StudentStrategy,
    LookForUser,
    LogoutStrategy,
  ],
  exports: [AdminStrategy, RecruiterStrategy, StudentStrategy, LogoutStrategy],
})
export class AuthModule {}
