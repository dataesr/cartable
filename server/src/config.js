const production = {
  jwtSecret: process.env.JWT_SECRET,
  totpWindow: [20, 0],
  accessTokenExpiresIn: '1d',
  refreshTokenExpiresIn: '20d',
  otpHeader: 'x-cartable-otp',
  otpMethodHeader: 'x-cartable-otp-method',
  systemName: 'cartable',
  mongo: {
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017',
    mongoDbName: 'cartable',
  },
  s3: {
    endpoint: process.env.S3_ENDPOINT,
    bucket: process.env.APP_NAME,
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
  },
  logger: {
    logLevel: 'info',
  },
};

const staging = {
  ...production,
  s3: {
    ...production.s3,
    bucket: `${process.env.APP_NAME}-staging`,
  },
};

const development = {
  ...production,
  jwtSecret: 'VerYvErySecrREt',
  mongo: {
    ...production.mongo,
    mongoDbName: 'cartable-dev',
  },
  s3: {
    ...production.s3,
    forcePathStyle: true,
    bucket: `${process.env.APP_NAME}-dev`,
  },
  logger: {
    logLevel: 'debug',
  },
};

const configs = {
  development,
  production,
  staging,
};

export default configs[process.env.NODE_ENV];
