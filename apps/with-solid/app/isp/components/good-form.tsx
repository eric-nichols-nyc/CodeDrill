"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Card, CardContent } from "@repo/design-system/components/ui/card";

/**
 * ✅ GOOD: Segregated interfaces - components only use what they need
 */
type BaseFormProps = {
  onSubmit: () => void;
  onCancel: () => void;
};

type DeletableFormProps = {
  onDelete: () => void;
};

type ExportableFormProps = {
  onExport: () => void;
};

type PrintableFormProps = {
  onPrint: () => void;
};

export const BaseForm = ({ onSubmit, onCancel }: BaseFormProps) => (
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
        </div>
      </form>
    </CardContent>
  </Card>
);

export const DeletableForm = (props: BaseFormProps & DeletableFormProps) => (
  <div>
    <BaseForm onCancel={props.onCancel} onSubmit={props.onSubmit} />
    <div className="mt-2">
      <Button onClick={props.onDelete} variant="destructive">
        Delete
      </Button>
    </div>
  </div>
);

export const ExportableForm = (props: BaseFormProps & ExportableFormProps) => (
  <div>
    <BaseForm onCancel={props.onCancel} onSubmit={props.onSubmit} />
    <div className="mt-2">
      <Button onClick={props.onExport} variant="outline">
        Export
      </Button>
    </div>
  </div>
);
