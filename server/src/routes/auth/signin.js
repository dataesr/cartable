import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { totp } from 'otplib';
import { db } from '../../services/mongo.service';
import config from '../../config';
// import Mailer from '../../services/mailer.service'
import { BadRequestError, UnauthorizedError } from '../../errors';

const { otpHeader, otpMethodHeader, jwtSecret, accessTokenExpiresIn, refreshTokenExpiresIn } = config;

const dtOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

export default async function signin(req, res, next) {
  const { email, password } = req.body;
  const userAgent = req.headers['user-agent'];
  const userOtp = req.headers[otpHeader];
  const otpMethod = req.headers[otpMethodHeader];
  const user = await db.collection('users').findOne({ email });
  if (!user) throw new BadRequestError('Utilisateur inconnu');
  const { password: _password } = user;
  const isMatch = await bcrypt.compare(password, _password);
  if (!isMatch) throw new BadRequestError('Mauvaise combinaison utilisateur/mot de passe');
  totp.options = { window: [20, 0] };
  if (!userOtp && user['2fa']) {
    res.setHeader(otpHeader, 'required');
    res.setHeader(otpMethodHeader, 'email;');
    if (otpMethod === 'email') {
      const otp = totp.generate(user.otpSecret);
      console.log(otp);
      // TODO: Envoyer un mail
      // Mailer.sendEmail();
      const expiresAt = new Date().setMinutes(new Date().getMinutes() + 10).toLocaleString('fr-FR', dtOptions);
      res.status(202).json({
        message: `Un nouveau code a été envoyé à l'adresse ${user.email}.
         Code utilisable jusqu'au ${expiresAt}`,
      });
      return next();
    }
  }
  if (userOtp && !totp.check(userOtp, user.otpSecret)) throw new UnauthorizedError('Code invalide');
  const { _id, role } = user;
  const accessToken = jwt.sign({ user: { _id, email, role } }, jwtSecret, { expiresIn: accessTokenExpiresIn });
  const refreshToken = jwt.sign({ user: { _id, email, role } }, jwtSecret, { expiresIn: refreshTokenExpiresIn });
  const expireAt = new Date(jwt.verify(refreshToken, jwtSecret).exp * 1000);
  await db.collection('tokens').updateOne(
    { userId: user._id, userAgent },
    { $set: { userId: user._id, userAgent, refreshToken, expireAt } },
    { upsert: true },
  );
  res.status(200).json({ accessToken, refreshToken });
  return next();
}
