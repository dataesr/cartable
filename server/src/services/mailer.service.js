import SibApiV3Sdk from 'sib-api-v3-sdk';

import logger from './logger.service';

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SEND_IN_BLUE_APIKEY;
const sendInBlue = new SibApiV3Sdk.TransactionalEmailsApi();
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

const mailer = {
  sendEmail: (datas) => new Promise((resolve) => {
    sendSmtpEmail = datas;
    sendInBlue.sendTransacEmail(sendSmtpEmail).then((data) => {
      resolve(data.messageId);
    }, (error) => {
      logger.error(error);
      resolve('failure');
    });
  }),
};

async function sendWelcomeEmail({ email, firstName = '', lastName = '' }) {
  return mailer.sendEmail({
    to: [{ email }],
    templateId: 214,
    params: {
      PRENOM: firstName,
      NOM: lastName,
    },
  });
}

async function sendPasswordRecoveryEmail({ email, otp, firstName = '', lastName = '' }) {
  return mailer.sendEmail({
    to: [{ email }],
    templateId: 213,
    params: {
      PRENOM: firstName,
      NOM: lastName,
      EMAIL: email,
      CODE: otp,
    },
  });
}

export default {
  sendWelcomeEmail,
  sendPasswordRecoveryEmail,
};
