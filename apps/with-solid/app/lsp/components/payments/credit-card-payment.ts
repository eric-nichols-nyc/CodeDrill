/**
 * ✅ GOOD: Substitutable for Payment - follows LSP
 */
export class CreditCardPayment {
  constructor(
    public amount: number,
    private cardNumber: string
  ) {}

  process() {
    console.log(
      `Processing credit card payment of $${this.amount} with card ending in ${this.cardNumber.slice(-4)}`
    );
  }
}
