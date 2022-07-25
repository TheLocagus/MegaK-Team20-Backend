import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { configMail } from './configMail';

export = {
  transport: {
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: configMail.user,
      clientSecret: configMail.clientSecret,
      clientId: configMail.clientId,
      refreshToken: configMail.refreshToken,
    },
  },
  defaults: {
    from: 'MegaK Head Hunters',
  },
  template: {
    dir: './templates/email',
    adapter: new HandlebarsAdapter(),
    option: {
      strict: true,
    },
  },
};
