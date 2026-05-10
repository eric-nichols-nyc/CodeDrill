"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { CashPayment } from "./payments/cash-payment";
import { CreditCardPayment } from "./payments/credit-card-payment";
import { PayPalPayment } from "./payments/paypal-payment";

/**
 * ✅ GOOD: Advanced example following LSP
 * All payment types are substitutable
 */
type Payment = {
  amount: number;
  process: () => void;
};

export const AdvancedGoodPayment = () => {
  const processPayment = (payment: Payment) => {
    // Works for all payment types
    payment.process();
  };

  const payments: Payment[] = [
    new CashPayment(100),
    new CreditCardPayment(100, "1234-5678-9012-3456"),
    new PayPalPayment(100, "user@example.com"),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Processing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          {payments.map((payment, idx) => (
            <button
              className="w-full rounded border p-2 text-left hover:bg-accent"
              key={idx}
              onClick={() => processPayment(payment)}
            >
              Process ${payment.amount} Payment
            </button>
          ))}
        </div>
        <p className="text-muted-foreground text-xs">
          All payment types are substitutable - follows LSP
        </p>
      </CardContent>
    </Card>
  );
};
