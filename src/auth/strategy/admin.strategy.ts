import { Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Admin } from '../../admin/admin.entity';
import { salt } from '../../config/config-salt';

export interface JwtPayload {
  id: string;
}

function cookieExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
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
    const admin = await Admin.findOne({
      where: { currentTokenId: payload.id },
    });
    if (!admin) {
      return done(new UnauthorizedException(), false);
    }
    done(null, admin);
  }
}
