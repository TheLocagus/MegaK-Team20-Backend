import * as crypto from 'crypto';

export const hashPwd = (p: string): string => {
  const hmac = crypto.createHmac(
    'sha512',
    'skjdhfkjsdhfkjshfkjhskjfhsjkhfjkshfkjshfkjher8389yncemxu3ynye2nu2gngxueihgm2xhjkhqwie897348264782ynxiuy',
  );
  hmac.update(p);
  return hmac.digest('hex');
};
