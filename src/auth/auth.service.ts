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
import { salt } from '../config/config-salt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LookForUser } from './look-for-user.service';
import { MailService } from '../mail/mail.service';
import { recoverPassword } from '../templates/email/recover-password';
import { ChangePasswordDto } from './dto/change-password.dto';
import { StudentImport } from '../studentImport/studentImport.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => DataSource)) private dataSource: DataSource,
    @Inject(forwardRef(() => LookForUser)) private lookForUser: LookForUser,
    @Inject(MailService) private mailService: MailService,
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
      if (admin) {
        user = admin;
      } else {
        const recruiter = await Recruiter.findOne({
          where: {
            email: req.email,
            pwdHash: hashPwd(req.pwd),
            isActive: true,
          },
        });
        if (recruiter) {
          user = recruiter;
        } else {
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
            .andWhere('studentImport.isActive = :isActive', {
              isActive: true,
            })
            .getOne();
          if (student) {
            user = student;
          }
        }
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
          role: user.constructor.name.toLowerCase(),
          id: user instanceof Student ? user.studentImport.id : user.id,
        });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }

  async logout(user: Admin | Student | Recruiter, res: Response) {
    console.log('logout');
    console.log({ user });
    try {
      user instanceof Student
        ? (user.studentImport.currentTokenId = null)
        : (user.currentTokenId = null);
      await user.save();
      res.clearCookie('jwt', {
        secure: configCookie.secure,
        domain: configCookie.domain,
        httpOnly: true,
      });
      return res.json({ success: true });
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
    const accessToken = sign(payload, salt, { expiresIn });
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
          where: {
            studentImport: {
              currentTokenId: token,
            },
          },
        });
      }
      if (user instanceof Recruiter) {
        userWithThisToken = await Recruiter.findOne({
          where: { currentTokenId: token },
        });
      }
    } while (!!userWithThisToken);
    if (user instanceof Student) {
      user.studentImport.currentTokenId = token;
      await user.studentImport.save();
    } else {
      user.currentTokenId = token;
    }
    await user.save();

    return token;
  }

  async forgotPassword(email: ForgotPasswordDto) {
    const user = await this.lookForUser.lookForUser(email);

    console.log(user);

    if (user) {
      const token = uuid();
      let email;
      const id = user.id;
      if (user instanceof Student) {
        email = user.studentImport.email;
        user.studentImport.registerToken = token;
      } else {
        email = user.email;
        user.registerToken = token;
      }
      await this.mailService.sendMail(
        email,
        'Odzyskiwanie hasła',
        recoverPassword(id, token),
      );
      await user.save();
      return {
        success: true,
      };
    } else {
      throw new Error('User does not exist');
    }
  }

  async checkUser(id: string, token: string) {
    let user: Admin | Student | Recruiter | null;
    const admin = await Admin.findOne({
      where: {
        id,
        registerToken: token,
      },
    });
    const studentImport = await StudentImport.findOne({
      where: {
        id,
      },
    });
    const student = await Student.findOne({
      where: {
        studentImport: {
          id,
          registerToken: token,
        },
      },
    });
    student.studentImport = studentImport;
    const recruiter = await Recruiter.findOne({
      where: {
        id,
        registerToken: token,
      },
    });
    user = admin !== null ? admin : student;
    user = user !== null ? user : recruiter;

    console.log({ user });

    if (user) {
      return {
        success: true,
        role: user.constructor.name.toLowerCase(),
        id: user instanceof Student ? user.studentImport.id : user.id,
        token:
          user instanceof Student
            ? user.studentImport.registerToken
            : user.registerToken,
      };
    } else {
      return {
        success: false,
      };
    }
  }

  async changePassword(userCheck: ChangePasswordDto) {
    let user: Admin | Student | Recruiter | null = null;
    switch (userCheck.role) {
      case 'admin':
        {
          user = await Admin.findOneOrFail({
            where: {
              id: userCheck.id,
              registerToken: userCheck.token,
            },
          });
          if (user) {
            user.pwdHash = hashPwd(userCheck.pwd);
            user.registerToken = null;
            await user.save();
            return {
              success: true,
            };
          }
        }
        break;
      case 'student':
        {
          const studentImport = await StudentImport.findOne({
            where: {
              id: userCheck.id,
            },
          });
          user = await Student.findOne({
            where: {
              studentImport: {
                id: userCheck.id,
                registerToken: userCheck.token,
              },
            },
          });
          if (user) {
            user.pwdHash = hashPwd(userCheck.pwd);
            user.studentImport = studentImport;
            studentImport.registerToken = null;
            await user.save();
            await studentImport.save();
            return {
              success: true,
            };
          }
        }
        break;
      case 'recruiter':
        {
          user = await Recruiter.findOneOrFail({
            where: {
              id: userCheck.id,
              registerToken: userCheck.token,
            },
          });
          if (user) {
            user.pwdHash = hashPwd(userCheck.pwd);
            user.registerToken = null;
            await user.save();
            return {
              success: true,
            };
          }
        }
        break;
      default: {
        throw new Error('Unauthorized change password');
      }
    }
  }
}
