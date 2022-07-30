import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminStrategy } from './strategy/admin.strategy';
import { RecruiterStrategy } from './strategy/recruiter.strategy';
import { StudentStrategy } from './strategy/student.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AdminStrategy, RecruiterStrategy, StudentStrategy],
  exports: [AdminStrategy, RecruiterStrategy, StudentStrategy],
})
export class AuthModule {}
