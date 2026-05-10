"use client";

import {
  CardContent,
  CardHeader,
  CardTitle,
  Card as UICard,
} from "@repo/design-system/components/ui/card";

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

export const ClickableCard = ({
  title,
  children,
  onClick,
}: CardProps & { onClick: () => void }) => {
  // Violates LSP: Adds required prop that base Card doesn't have
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <Card title={title}>{children}</Card>
    </div>
  );
};
