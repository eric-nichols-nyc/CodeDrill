/**
 * ✅ GOOD: Segregated interface - only email functionality
 */
type Emailable = {
  sendEmail: () => void;
};

export class EmailService implements Emailable {
  sendEmail() {
    console.log("Sending email");
  }
}
