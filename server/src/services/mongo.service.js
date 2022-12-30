import { MongoClient } from 'mongodb';

import config from '../config';
import logger from './logger.service';

const { mongoDbName, mongoUri } = config.mongo;

const client = new MongoClient(mongoUri, { directConnection: true });

logger.info(`Try to connect to mongo... ${mongoUri}`);
await client.connect().catch((e) => {
  logger.info(`Connexion to mongo instance failed... Terminating... ${e.message}`);
  process.kill(process.pid, 'SIGTERM');
});

logger.info(`Connected to mongo database... ${mongoDbName}`);
const db = client.db(mongoDbName);

export { client, db };
