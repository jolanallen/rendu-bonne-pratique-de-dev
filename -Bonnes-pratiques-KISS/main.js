/**
 * @typedef {Object} EmailContent
 * @property {string} subject
 * @property {string} body
 */
/**
 * @typedef {Object} User
 * @property {string} firstName
 * @property {string} email
 */

// --- 1. Abstraction (Interface) ---
// En JS pure, on utilises une classe de base pour simuler une interface.
class MailSender {
  async send(to, subject, text) {
    throw new Error("La méthode 'send' doit être implémentée");
  }
}

// --- 2. Implémentations (Infrastructure) ---

// Simulation Librarie Externe
const sendgridLib = {
  async send({ to, subject, text }) {
    console.log(`[SendGrid] Envoi à ${to} | Sujet: ${subject}`);
    // Simulation de latance réseau
    return new Promise(resolve => setTimeout(resolve, 100)); 
  },
};

class SendgridMailSender extends MailSender {
  async send(to, subject, text) {
    try {
      await sendgridLib.send({ to, subject, text });
    } catch (error) {
      console.error("[SendGrid] Erreur:", error);
      throw new Error("Échec de l'envoi via Sendgrid");
    }
  }
}

class SmtpMailSender extends MailSender {
  async send(to, subject, text) {
    console.log(`[SMTP] Envoi à ${to} | Sujet: ${subject}`);
    console.log(`[Contenu] ${text}`);
  }
}

// --- 3. Génération de contenu  ---
// Le service d'emails ne doit pas connaître le text exacte.
class WelcomeEmailTemplate {
  /**
   * @param {User} user 
   * @returns {EmailContent}
   */
  static get(user) {
    return {
      subject: 'Bienvenue sur notre plateforme',
      body: `Bonjour ${user.firstName},\n\nMerci pour votre inscription.\n\nÀ bientôt !`
    };
  }
}

// --- 4. Service Métier  ---
class EmailService {
  /** @type {MailSender} */
  #mailSender;

  /**
   * Injection de dépendances via le constructeur.
   * On retires la valeur par défaut "MailSender()" qui était fausses.
   * * @param {MailSender} mailSender 
   */
  constructor(mailSender) {
    if (!mailSender) {
      throw new Error("Un MailSender est requis pour initialiser EmailService");
    }
    this.#mailSender = mailSender;
  }

  /**
   * @param {User} user 
   */
  async sendWelcomeEmail(user) {
    if (!user.email) {
      throw new Error("L'utilisateur n'a pas d'email valide");
    }

    // On délègue la création du contenu au template
    const { subject, body } = WelcomeEmailTemplate.get(user);

    try {
      await this.#mailSender.send(user.email, subject, body);
      console.log(`Email de bienvenue envoyé avec succès à ${user.email}`);
    } catch (error) {
      console.error(`Impossible d'envoyer l'email à ${user.email}`, error);
    }
  }
}

// --- 5. Composition main

async function main() {
  const user = { firstName: 'Kenan', email: 'kenan@example.com' };

  ///// Injection de dépendances : On choisis l'implémentation ici !!!!
  // Facile de le changer pour new SendgridMailSender() sans toucher au EmailService
  const mailerImplementation = new SmtpMailSender(); 
  
  const emailService = new EmailService(mailerImplementation);
  await emailService.sendWelcomeEmail(user);
}

main();












