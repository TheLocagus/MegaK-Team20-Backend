import { Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Admin } from '../../admin/admin.entity';
import { salt } from '../../config/config-salt';
import { Recruiter } from '../../recruiter/recruiter.entity';
import { StudentImport } from '../../studentImport/studentImport.entity';
import { Student } from '../../student/student.entity';

export interface JwtPayload {
  id: string;
}

function cookieExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class LogoutStrategy extends PassportStrategy(Strategy, 'logout') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: salt,
    });
  }

  async validate(payload: JwtPayload, done: (error, user) => void) {
    if (!payload || !payload.id) {
      return done(new UnauthorizedException(), false);
    }
    let user: Admin | Recruiter | Student;
    const admin = await Admin.findOne({
      where: { currentTokenId: payload.id },
    });
    if (admin) {
      user = admin;
    }
    const recruiter = await Recruiter.findOne({
      where: {
        currentTokenId: payload.id,
      },
    });

    if (recruiter) {
      user = recruiter;
    }

    const studentImport = await StudentImport.findOne({
      where: {
        currentTokenId: payload.id,
      },
    });

    if (studentImport) {
      const student = await Student.findOne({
        where: {
          studentImport: {
            id: studentImport.id,
          },
        },
      });
      student.studentImport = studentImport;
      user = student;
    }

    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}
