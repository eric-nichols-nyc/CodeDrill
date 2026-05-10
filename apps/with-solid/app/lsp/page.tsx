"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { ComponentCodeLayout } from "@/components/component-code-layout";
import { SplitLayout } from "@/components/split-layout";
import { AdvancedBadPayment } from "./components/advanced-bad-payment";
import { AdvancedGoodPayment } from "./components/advanced-good-payment";
import { Card as BadCard } from "./components/bad-card";
import { BaseCard, ClickableCard, HoverableCard } from "./components/good-card";

const badCode = `"use client";

import { Card as UICard, CardContent, CardHeader, CardTitle } from "@repo/design-system/components/ui/card";

/**
 * ❌ BAD: ClickableCard violates LSP
 * Cannot be used wherever Card is expected
 */
type CardProps = {
  title: string;
  children: React.ReactNode;
};

export const Card = ({ title, children }: CardProps) => (
  <UICard>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </UICard>
);

export const ClickableCard = ({ title, children, onClick }: CardProps & { onClick: () => void }) => {
  // Violates LSP: Adds required prop that base Card doesn't have
  return (
    <div onClick={onClick} className="cursor-pointer">
      <Card title={title}>{children}</Card>
    </div>
  );
};`;

const goodCode = `"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/design-system/components/ui/card";
import type { ComponentProps } from "react";

/**
 * ✅ GOOD: All variants can be used interchangeably
 */
type BaseCardProps = {
  title: string;
  children: React.ReactNode;
};

export const BaseCard = ({ title, children }: BaseCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

// Can be used wherever BaseCard is expected
export const ClickableCard = ({
  title,
  children,
  onClick,
  ...props
}: BaseCardProps & { onClick?: () => void } & ComponentProps<"div">) => {
  return (
    <div onClick={onClick} className={onClick ? "cursor-pointer" : ""} {...props}>
      <BaseCard title={title}>{children}</BaseCard>
    </div>
  );
};

// Also substitutable
export const HoverableCard = ({ title, children, ...props }: BaseCardProps & ComponentProps<"div">) => {
  return (
    <div className="hover:shadow-lg transition-shadow" {...props}>
      <BaseCard title={title}>{children}</BaseCard>
    </div>
  );
};`;

const advancedBadCode = `"use client";

type Payment = {
  amount: number;
  process: () => void;
};

/**
 * ❌ BAD: CreditCardPayment violates LSP
 * Cannot substitute Payment - throws error
 */
export const AdvancedBadPayment = () => {
  const processPayment = (payment: Payment) => {
    payment.process(); // Should work for all types
  };

  const creditCardPayment: Payment = {
    amount: 100,
    process: () => {
      // Violates LSP: Throws instead of processing
      throw new Error("Credit card processing not implemented");
    },
  };

  // This breaks when used in place of Payment
  return <div>...</div>;
};`;

const advancedGoodCode = `// Payment Interface (abstraction)
type Payment = {
  amount: number;
  process: () => void;
};

// CashPayment - ✅ Substitutable
export class CashPayment implements Payment {
  constructor(public amount: number) {}
  process() {
    console.log(\`Processing cash payment of $\${this.amount}\`);
  }
}

// CreditCardPayment - ✅ Substitutable
export class CreditCardPayment implements Payment {
  constructor(
    public amount: number,
    private cardNumber: string
  ) {}
  process() {
    console.log(\`Processing credit card payment of $\${this.amount}\`);
  }
}

// PayPalPayment - ✅ Substitutable
export class PayPalPayment implements Payment {
  constructor(
    public amount: number,
    private email: string
  ) {}
  process() {
    console.log(\`Processing PayPal payment of $\${this.amount}\`);
  }
}

// Usage - all types are substitutable
const processPayment = (payment: Payment) => {
  payment.process(); // Works for all payment types
};

const payments: Payment[] = [
  new CashPayment(100),
  new CreditCardPayment(100, "1234-5678"),
  new PayPalPayment(100, "user@example.com"),
];

payments.forEach(processPayment); // ✅ All work correctly`;

const LSPPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col">
    <div className="shrink-0 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Liskov Substitution Principle</CardTitle>
          <CardDescription>
            Subtypes must be substitutable for their base types
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold">Definition</h3>
            <p className="text-muted-foreground text-sm">
              The Liskov Substitution Principle states that objects of a
              superclass should be replaceable with objects of its subclasses
              without breaking the application. Derived classes must be
              substitutable for their base classes.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Benefits</h3>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
              <li>Ensures proper inheritance hierarchies</li>
              <li>Prevents unexpected behavior</li>
              <li>Maintains contract compliance</li>
              <li>Improves code reliability</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="flex-1 p-6 pt-0">
      <Tabs className="flex h-full flex-col" defaultValue="basic">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic Examples</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Examples</TabsTrigger>
        </TabsList>
        <TabsContent className="min-h-0 flex-1" value="basic">
          <SplitLayout
            left={
              <ComponentCodeLayout
                code={badCode}
                component={
                  <div className="space-y-2">
                    <BadCard title="Base Card">Can be used here</BadCard>
                  </div>
                }
                description="ClickableCard requires onClick prop, cannot substitute base Card"
                title="❌ Bad Component"
              />
            }
            right={
              <ComponentCodeLayout
                code={goodCode}
                component={
                  <div className="space-y-2">
                    <BaseCard title="Base Card">Base implementation</BaseCard>
                    <ClickableCard
                      onClick={() => {
                        console.log("Clicked!");
                      }}
                      title="Clickable Card"
                    >
                      Can substitute BaseCard
                    </ClickableCard>
                    <HoverableCard title="Hoverable Card">
                      Also substitutable
                    </HoverableCard>
                  </div>
                }
                description="All variants can be used interchangeably"
                title="✅ Good Component"
              />
            }
          />
        </TabsContent>
        <TabsContent className="min-h-0 flex-1" value="advanced">
          <SplitLayout
            left={
              <ComponentCodeLayout
                code={advancedBadCode}
                component={<AdvancedBadPayment />}
                description="CreditCardPayment throws error, cannot substitute Payment"
                title="❌ Bad Component"
              />
            }
            right={
              <ComponentCodeLayout
                code={advancedGoodCode}
                component={<AdvancedGoodPayment />}
                description="All payment types are substitutable and work correctly"
                title="✅ Good Component"
              />
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  </div>
);

export default LSPPage;
