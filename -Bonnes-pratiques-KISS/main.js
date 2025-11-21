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
// En JS pur, on utilise une classe de base pour simuler une interface.
class MailSender {
  async send(to, subject, text) {
    throw new Error("La méthode 'send' doit être implémentée");
  }
}

// --- 2. Implémentations (Infrastructure) ---

// Simulation Lib Externe
const sendgridLib = {
  async send({ to, subject, text }) {
    console.log(`[SendGrid] Envoi à ${to} | Sujet: ${subject}`);
    // Simulation de latence réseau
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

// --- 3. Génération de contenu (Separation of Concerns) ---
// Le service d'email ne doit pas connaître le texte exact ("Hardcoded strings").
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

// --- 4. Service Métier (Business Logic) ---
class EmailService {
  /** @type {MailSender} */
  #mailSender;

  /**
   * Injection de dépendance via le constructeur.
   * On retire la valeur par défaut "MailSender()" qui était erronée.
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

    // On délègue la création du contenu au Template
    const { subject, body } = WelcomeEmailTemplate.get(user);

    try {
      await this.#mailSender.send(user.email, subject, body);
      console.log(`✓ Email de bienvenue envoyé avec succès à ${user.email}`);
    } catch (error) {
      console.error(`✗ Impossible d'envoyer l'email à ${user.email}`, error);
      // Ici, on pourrait ajouter une logique de ré-essai (retry)
    }
  }
}

// --- 5. Composition Root (Utilisation) ---

async function main() {
  const user = { firstName: 'Kenan', email: 'kenan@example.com' };

  // Injection de dépendance : On choisit l'implémentation ici
  // Facile de changer pour new SendgridMailSender() sans toucher à EmailService
  const mailerImplementation = new SmtpMailSender(); 
  
  const emailService = new EmailService(mailerImplementation);

  await emailService.sendWelcomeEmail(user);
}

main();