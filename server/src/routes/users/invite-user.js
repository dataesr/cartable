import { ObjectId } from 'mongodb';
import { authenticator } from 'otplib';
import { db } from '../../services/mongo.service';
import Mailer from '../../services/mailer.service';
import { BadRequestError, ServerError } from '../../errors';

export default async function inviteUser(req, res) {
  const { body } = req;
  const exists = await db.collection('users').findOne({ email: body.email });
  if (exists) throw new BadRequestError('Ce compte existe déja');
  const _id = new ObjectId();
  const otpSecret = authenticator.generateSecret();
  const userData = {
    ...body,
    _id,
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    createdBy: _id,
    createdAt: new Date(),
    otpSecret,
    '2fa': false,
    role: body.role || 'user',
    status: 'pending',
    invitedBy: new ObjectId(req.currentUser._id),
  };
  await db.collection('users')
    .insertOne(userData)
    .catch(() => { throw new ServerError(); });
  // TODO: Send email
  Mailer.sendWelcomeEmail({ email: body.email });
  res.status(201).json({ message: `Compte crée. Un email d'invitation va être envoyé à ${body.email}` });
}
