import { Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Recruiter } from '../../recruiter/recruiter.entity';
import { salt } from '../../config/config-salt';

export interface JwtPayload {
  id: string;
}

function cookieExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class RecruiterStrategy extends PassportStrategy(Strategy, 'recruiter') {
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
    const recruiter = await Recruiter.findOne({
      where: { currentTokenId: payload.id },
    });
    if (!recruiter) {
      return done(new UnauthorizedException(), false);
    }
    done(null, recruiter);
  }
}
