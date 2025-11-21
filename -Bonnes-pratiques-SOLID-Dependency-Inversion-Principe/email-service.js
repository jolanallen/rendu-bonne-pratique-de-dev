// Simule la lib externe (ex: sendgrid)
const sendgrid = {
  async send({ to, subject, text }) {
    console.log('[sendgrid] Email envoyé à', to, 'Sujet:', subject);
    console.log(text);
  },
};

// Service MÉTIER (version mauvaise : couplage fort)
class EmailService {
  async sendWelcomeEmail(user) {
    const subject = 'Bienvenue sur notre plateforme';
    const text = `Bonjour ${user.firstName},

Merci pour votre inscription.

À bientôt !`;

    // Couplage direct au "détail" sendgrid
    await sendgrid.send({
      to: user.email,
      subject,
      text,
    });
  }
}

// Petit exemple d’utilisation
const user = { firstName: 'Kenan', email: 'kenan@example.com' };
const emailService = new EmailService();
emailService.sendWelcomeEmail(user);
