import { Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Student } from '../../student/student.entity';

export interface JwtPayload {
  id: string;
}

function cookieExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class StudentStrategy extends PassportStrategy(Strategy, 'student') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey:
        'jfhsjkfhkjsf878947289378978*&(*&*(&YUHJJBHGI&#Y78937893oUO*#UIOU#*U#*U*(#UOIJJhuHUH#iuhU*#&*(&#*(&#*&',
    });
  }

  async validate(payload: JwtPayload, done: (error, user) => void) {
    if (!payload || !payload.id) {
      return done(new UnauthorizedException(), false);
    }
    const student = await Student.findOne({
      where: { currentTokenId: payload.id },
    });
    if (!student) {
      return done(new UnauthorizedException(), false);
    }
    done(null, student);
  }
}
