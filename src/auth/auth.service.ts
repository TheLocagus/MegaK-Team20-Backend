import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { DataSource } from 'typeorm';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Admin } from '../admin/admin.entity';
import { Student } from '../student/student.entity';
import { Recruiter } from '../recruiter/recruiter.entity';
import { hashPwd } from '../utils/hash-pwd';
import { v4 as uuid } from 'uuid';
import { JwtPayload } from './strategy/admin.strategy';
import { sign } from 'jsonwebtoken';
import { configCookie } from '../config/configCookie.example';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => DataSource)) private dataSource: DataSource,
  ) {}

  async login(req: AuthLoginDto, res: Response): Promise<any> {
    let user: Admin | Student | Recruiter | null = null;
    try {
      const admin = await Admin.findOne({
        where: {
          email: req.email,
          pwdHash: hashPwd(req.pwd),
        },
      });
      if (!admin) {
        const student = await this.dataSource
          .getRepository(Student)
          .createQueryBuilder('student')
          .leftJoinAndSelect('student.studentImport', 'studentImport')
          .where('studentImport.email = :email', {
            email: req.email,
          })
          .andWhere('student.pwdHash = :pwdHash', {
            pwdHash: hashPwd(req.pwd),
          })
          .getOne();
        if (!student) {
          const recruiter = await Recruiter.findOne({
            where: {
              email: req.email,
              pwdHash: hashPwd(req.pwd),
            },
          });
          if (!recruiter) {
            return res.json({ error: 'Invalid login data!' });
          } else {
            user = recruiter;
          }
        } else {
          user = student;
        }
      } else {
        user = admin;
      }

      if (!user) {
        return res.json({ error: 'Invalid login data!' });
      }

      const token = await this.createToken(await this.generateToken(user));

      return res
        .cookie('jwt', token.accessToken, {
          secure: configCookie.secure,
          domain: configCookie.domain,
          httpOnly: true,
        })
        .json({
          ok: true,
          role: user.constructor.name,
          id: user.id,
        });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }

  async logout(user: Admin | Student | Recruiter, res: Response) {
    console.log({ user });

    try {
      user.currentTokenId = null;
      await user.save();
      res.clearCookie('jwt', {
        secure: configCookie.secure,
        domain: configCookie.domain,
        httpOnly: true,
      });
      return res.json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }

  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 60 * 60 * 24;
    const accessToken = sign(
      payload,
      'jfhsjkfhkjsf878947289378978*&(*&*(&YUHJJBHGI&#Y78937893oUO*#UIOU#*U#*U*(#UOIJJhuHUH#iuhU*#&*(&#*(&#*&',
      { expiresIn },
    );
    return {
      accessToken,
      expiresIn,
    };
  }

  private async generateToken(
    user: Admin | Student | Recruiter,
  ): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
      token = uuid();
      if (user instanceof Admin) {
        userWithThisToken = await Admin.findOne({
          where: { currentTokenId: token },
        });
      }
      if (user instanceof Student) {
        userWithThisToken = await Student.findOne({
          where: { currentTokenId: token },
        });
      }
      if (user instanceof Recruiter) {
        userWithThisToken = await Recruiter.findOne({
          where: { currentTokenId: token },
        });
      }
    } while (!!userWithThisToken);
    user.currentTokenId = token;
    await user.save();

    return token;
  }
}
