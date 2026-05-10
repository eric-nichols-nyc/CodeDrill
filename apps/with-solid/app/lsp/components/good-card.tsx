"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
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
}: BaseCardProps & { onClick?: () => void } & ComponentProps<"div">) => (
  <div className={onClick ? "cursor-pointer" : ""} onClick={onClick} {...props}>
    <BaseCard title={title}>{children}</BaseCard>
  </div>
);

// Also substitutable
export const HoverableCard = ({
  title,
  children,
  ...props
}: BaseCardProps & ComponentProps<"div">) => (
  <div className="transition-shadow hover:shadow-lg" {...props}>
    <BaseCard title={title}>{children}</BaseCard>
  </div>
);
