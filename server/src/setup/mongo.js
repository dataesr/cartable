import 'dotenv/config';
import { authenticator } from 'otplib';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

import logger from '../services/logger.service';
import { client, db } from '../services/mongo.service';

async function generateAdminUser() {
  const { ROOT_PASSWORD, ROOT_EMAIL } = process.env;
  if (!ROOT_EMAIL || !ROOT_PASSWORD) {
    logger.info('NO ROOT USER CONFIG');
    return;
  }
  const exists = await db.collection('users').findOne({ email: ROOT_EMAIL });
  if (exists) {
    logger.info('ROOT USER ALREADY SET');
    return;
  }
  const password = await bcrypt.hash(ROOT_PASSWORD, 10);
  logger.info(ROOT_EMAIL);
  const _id = new ObjectId();
  const otpSecret = authenticator.generateSecret();
  const data = {
    _id,
    email: ROOT_EMAIL,
    createdBy: _id,
    createdAt: new Date(),
    otpSecret,
    password,
    role: 'admin',
  };
  try {
    await db.collection('users').insertOne(data);
    logger.info(`ROOT USER SET: ${ROOT_EMAIL}/${ROOT_PASSWORD}`);
    return;
  } catch (e) {
    logger.error('FAILED SETTING ROOT USER');
    logger.error(e.message);
  }
}

async function setupMongo() {
  await db.collection('tokens').createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection('tokens').createIndex({ refreshToken: 1, userAgent: 1 });
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ createdAt: 1 });
  await db.collection('folders').createIndex({ name: 1 }, { unique: true });
  await db.collection('folders').createIndex({ _id: 1, 'permissions.userId': 1 }, { unique: true });
  await db.collection('folders').createIndex({ isArchived: 1 });
  await generateAdminUser().catch((e) => logger.error(e));
  logger.info('Mongodb setup successful');
  if (client) {
    await client.close();
  }
  logger.info('Mongodb connexion closed');
  process.exit(0);
}

setupMongo().catch(async (e) => {
  logger.error({ ...e, message: 'Mongodb setup failed' });
  if (client) {
    await client.close();
  }
  process.exit(1);
});
