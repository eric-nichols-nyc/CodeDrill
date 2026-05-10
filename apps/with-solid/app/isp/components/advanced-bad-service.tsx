"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

/**
 * ❌ BAD: Fat interface - forces clients to implement unused methods
 */
type Service = {
  create: () => void;
  read: () => void;
  update: () => void;
  delete: () => void;
  sendEmail: () => void;
  generateReport: () => void;
  backup: () => void;
};

export const AdvancedBadService = () => {
  // ReadOnlyService forced to implement all methods
  const readOnlyService: Service = {
    create: () => {
      throw new Error("Not supported");
    },
    read: () => {
      console.log("Reading data");
    },
    update: () => {
      throw new Error("Not supported");
    },
    delete: () => {
      throw new Error("Not supported");
    },
    sendEmail: () => {
      throw new Error("Not supported");
    },
    generateReport: () => {
      throw new Error("Not supported");
    },
    backup: () => {
      throw new Error("Not supported");
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Interface</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <button
            className="w-full rounded border p-2 text-left"
            onClick={() => readOnlyService.read()}
          >
            Read (Works)
          </button>
          <button
            className="w-full rounded border p-2 text-left text-red-600"
            onClick={() => {
              try {
                readOnlyService.create();
              } catch (e) {
                console.error("Error:", e);
              }
            }}
          >
            Create (Throws Error - Not Needed)
          </button>
        </div>
        <p className="text-muted-foreground text-xs">
          ReadOnlyService forced to implement unused methods
        </p>
      </CardContent>
    </Card>
  );
};
