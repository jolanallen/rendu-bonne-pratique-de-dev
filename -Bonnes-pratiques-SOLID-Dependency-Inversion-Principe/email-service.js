// Simule la lib externe (ex: sendgrid)
const sendgrid = {
  async send({ to, subject, text }) {
    console.log('[sendgrid] Email envoyé à', to, 'Sujet:', subject);
    console.log(text);
  },
};

class MailProvider {
  async sendMail(mail) {
    throw new Error('sendMail() doit être implémenté');
  }
}

class SendGridMailProvider extends MailProvider {
  constructor(sendgridClient) {
    super();
    this.sendgridClient = sendgridClient;
  }

  async sendMail({ to, subject, text }) {
    await this.sendgridClient.send({ to, subject, text });
  }
}

class FakeMailProvider extends MailProvider {
  constructor() {
    super();
    this.sentMails = [];
  }

  async sendMail({ to, subject, text }) {
    this.sentMails.push({ to, subject, text, date: new Date() });
    console.log('[fake] Email enregistré (non envoyé) pour', to);
  }

  getSentMails() {
    return this.sentMails;
  }
}

class EmailService {
  constructor(mailProvider) {
    this.mailProvider = mailProvider;
  }

  async sendWelcomeEmail(user) {
    await this.mailProvider.sendMail({
      to: user.email,
      subject: 'Bienvenue sur notre plateforme',
      text: `Bonjour ${user.firstName},

Merci pour votre inscription.

À bientôt !`,
    });
  }
}

const user = { firstName: 'Kenan', email: 'kenan@example.com' };

const prodMailProvider = new SendGridMailProvider(sendgrid);
const emailServiceProd = new EmailService(prodMailProvider);
emailServiceProd.sendWelcomeEmail(user);

const fakeMailProvider = new FakeMailProvider();
const emailServiceTest = new EmailService(fakeMailProvider);

(async () => {
  await emailServiceTest.sendWelcomeEmail({
    firstName: 'Alice',
    email: 'alice@test.com',
  });

  console.log('Mails envoyés en test :', fakeMailProvider.getSentMails());
})();