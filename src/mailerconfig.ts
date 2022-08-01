import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export = {
  transport: `smtp://admin123:admin456@localhost:2500`,
  // transport: {
  //   service: 'gmail',
  //   auth: {
  //     type: 'OAuth2',
  //     user: configMail.user,
  //     clientSecret: configMail.clientSecret,
  //     clientId: configMail.clientId,
  //     refreshToken: configMail.refreshToken,
  //   },
  // },
  defaults: {
    from: 'test@test.com',
  },
  template: {
    dir: './templates/email',
    adapter: new HandlebarsAdapter(),
    option: {
      strict: true,
    },
  },
};
