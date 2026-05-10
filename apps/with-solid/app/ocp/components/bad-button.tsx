"use client";

import { Button } from "@repo/design-system/components/ui/button";

/**
 * ❌ BAD: Must modify this component to add new button types
 */
type BadButtonProps = {
  type: "primary" | "secondary" | "danger";
  label: string;
  onClick: () => void;
};

export const BadButton = ({ type, label, onClick }: BadButtonProps) => {
  // Must modify this component to add new types
  const getStyles = () => {
    switch (type) {
      case "primary":
        return "bg-blue-500 hover:bg-blue-600";
      case "secondary":
        return "bg-gray-500 hover:bg-gray-600";
      case "danger":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "";
    }
  };

  return (
    <Button className={getStyles()} onClick={onClick}>
      {label}
    </Button>
  );
};
