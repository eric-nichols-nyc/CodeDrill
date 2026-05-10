/**
 * ✅ GOOD: Also substitutable - can be used wherever Payment is expected
 */
export class PayPalPayment {
  constructor(
    public amount: number,
    private email: string
  ) {}

  process() {
    console.log(
      `Processing PayPal payment of $${this.amount} for ${this.email}`
    );
  }
}
