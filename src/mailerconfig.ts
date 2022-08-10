import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { configMail } from './configMail';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

const OAuth2Client = new OAuth2(
  configMail.clientId,
  configMail.clientSecret,
  configMail.redirect_uri,
);

OAuth2Client.setCredentials({ refresh_token: configMail.refreshToken });
const accessToken = new Promise((resolve, reject) => {
  OAuth2Client.getAccessToken((err, token) => {
    if (err) {
      reject(err);
    }
    resolve(token);
  });
});
export = {
  // transport: `smtp://admin123:admin456@localhost:2500`,
  transport: {
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: configMail.user,
      clientSecret: configMail.clientSecret,
      clientId: configMail.clientId,
      refreshToken: configMail.refreshToken,
      accessToken,
    },
  },
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
