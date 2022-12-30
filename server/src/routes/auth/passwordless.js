import { totp } from 'otplib';
import bcrypt from 'bcryptjs';
import { db } from '../../services/mongo.service';
import config from '../../config';
import Mailer from '../../services/mailer.service';
import { BadRequestError, NotFoundError } from '../../errors';

const { otpHeader, otpMethodHeader } = config;

const dtOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

export default async function resetPassword(req, res, next) {
  if (req.currentUser.id) { throw new BadRequestError('Vous êtes déja connecté.'); }
  const { password, email, firstName, lastName } = req.body;
  const userOtp = req.headers[otpHeader];
  const otpMethod = req.headers[otpMethodHeader];
  const user = await db.collection('users').findOne({ email });
  if (!user) throw new NotFoundError();
  totp.options = { window: [20, 0] };
  if (!userOtp) {
    res.setHeader(otpHeader, 'required');
    res.setHeader(otpMethodHeader, 'email;');
    if (otpMethod === 'email') {
      const otp = totp.generate(user.otpSecret);
      // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      Mailer.sendPasswordRecoveryEmail({ email, otp });
      const expiresAt = new Date().setMinutes(new Date().getMinutes() + 10).toLocaleString('fr-FR', dtOptions);
      res.status(202).json({
        message: `Un nouveau code a été envoyé à l'adresse ${user.email}.
         Code utilisable jusqu'au ${expiresAt}`,
      });
      return next();
    }
  }
  if (!totp.check(userOtp, user.otpSecret)) throw new BadRequestError('Code invalide');
  if (!password) throw new BadRequestError('Un nouveau mot de passe est requis.');
  const data = { password: await bcrypt.hash(password, 10) };
  if (user.status === 'pending') data.status = 'active';
  if (firstName) data.firstName = firstName;
  if (lastName) data.lastName = lastName;
  await db.collection('users').updateOne({ email }, { $set: { ...data } });
  res.status(200).json({ message: 'Mot de passe modifié. Vous pouvez vous connecter.' });
  return next();
}
