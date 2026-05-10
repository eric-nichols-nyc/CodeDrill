"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Card, CardContent } from "@repo/design-system/components/ui/card";

/**
 * ❌ BAD: Forces components to implement unused props
 */
type BadFormProps = {
  onSubmit: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onExport: () => void;
  onPrint: () => void;
  showDelete?: boolean;
  showExport?: boolean;
  showPrint?: boolean;
};

export const BadForm = ({
  onSubmit,
  onCancel,
  onDelete,
  onExport,
  onPrint,
  showDelete,
  showExport,
  showPrint,
}: BadFormProps) => (
  <Card>
    <CardContent className="space-y-4 pt-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="space-y-2">
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Name"
            type="text"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <Button type="submit">Submit</Button>
          <Button onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
          {showDelete && (
            <Button onClick={onDelete} type="button" variant="destructive">
              Delete
            </Button>
          )}
          {showExport && (
            <Button onClick={onExport} type="button" variant="outline">
              Export
            </Button>
          )}
          {showPrint && (
            <Button onClick={onPrint} type="button" variant="outline">
              Print
            </Button>
          )}
        </div>
      </form>
    </CardContent>
  </Card>
);
