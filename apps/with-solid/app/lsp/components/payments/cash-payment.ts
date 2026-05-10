/**
 * ✅ GOOD: Can be used wherever Payment is expected
 */
export class CashPayment {
  constructor(public amount: number) {}

  process() {
    console.log(`Processing cash payment of $${this.amount}`);
  }
}
