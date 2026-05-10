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
import { AdvancedBadService } from "./components/advanced-bad-service";
import { AdvancedGoodService } from "./components/advanced-good-service";
import { BadForm } from "./components/bad-form";
import {
  BaseForm,
  DeletableForm,
  ExportableForm,
} from "./components/good-form";

const badCode = `"use client";

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
}: BadFormProps) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Name"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit">Submit</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            {showDelete && (
              <Button type="button" variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            )}
            {showExport && (
              <Button type="button" variant="outline" onClick={onExport}>
                Export
              </Button>
            )}
            {showPrint && (
              <Button type="button" variant="outline" onClick={onPrint}>
                Print
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};`;

const goodCode = `"use client";

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

export const BaseForm = ({ onSubmit, onCancel }: BaseFormProps) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Name"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit">Submit</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export const DeletableForm = (props: BaseFormProps & DeletableFormProps) => (
  <div>
    <BaseForm onSubmit={props.onSubmit} onCancel={props.onCancel} />
    <div className="mt-2">
      <Button variant="destructive" onClick={props.onDelete}>
        Delete
      </Button>
    </div>
  </div>
);

export const ExportableForm = (props: BaseFormProps & ExportableFormProps) => (
  <div>
    <BaseForm onSubmit={props.onSubmit} onCancel={props.onCancel} />
    <div className="mt-2">
      <Button variant="outline" onClick={props.onExport}>
        Export
      </Button>
    </div>
  </div>
);`;

const advancedBadCode = `"use client";

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

// ReadOnlyService forced to implement all methods
const readOnlyService: Service = {
  create: () => { throw new Error("Not supported"); },
  read: () => { console.log("Reading data"); },
  update: () => { throw new Error("Not supported"); },
  delete: () => { throw new Error("Not supported"); },
  sendEmail: () => { throw new Error("Not supported"); },
  generateReport: () => { throw new Error("Not supported"); },
  backup: () => { throw new Error("Not supported"); },
};`;

const advancedGoodCode = `// Segregated Interfaces
type Readable = {
  read: () => void;
};

type Writable = {
  create: () => void;
  update: () => void;
  delete: () => void;
};

type Emailable = {
  sendEmail: () => void;
};

// ✅ ReadOnlyService - only implements what it needs
export class ReadOnlyService implements Readable {
  read() {
    console.log("Reading data");
  }
}

// ✅ FullService - implements multiple interfaces
export class FullService implements Readable, Writable {
  read() { console.log("Reading data"); }
  create() { console.log("Creating data"); }
  update() { console.log("Updating data"); }
  delete() { console.log("Deleting data"); }
}

// ✅ EmailService - only email functionality
export class EmailService implements Emailable {
  sendEmail() {
    console.log("Sending email");
  }
}`;

const ISPPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col">
    <div className="shrink-0 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Interface Segregation Principle</CardTitle>
          <CardDescription>
            Clients should not be forced to depend on interfaces they do not use
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold">Definition</h3>
            <p className="text-muted-foreground text-sm">
              The Interface Segregation Principle states that clients should not
              be forced to implement interfaces they don't use. Instead of one
              fat interface, many small, specific interfaces are preferred.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Benefits</h3>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
              <li>Reduces coupling</li>
              <li>Prevents unnecessary dependencies</li>
              <li>More flexible and maintainable code</li>
              <li>Easier to understand interfaces</li>
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
                  <BadForm
                    onCancel={() => {}}
                    onDelete={() => {}}
                    onExport={() => {}}
                    onPrint={() => {}}
                    onSubmit={() => {}}
                  />
                }
                description="Forces all components to implement unused props"
                title="❌ Bad Component"
              />
            }
            right={
              <ComponentCodeLayout
                code={goodCode}
                component={
                  <div className="space-y-4">
                    <BaseForm onCancel={() => {}} onSubmit={() => {}} />
                    <DeletableForm
                      onCancel={() => {}}
                      onDelete={() => {}}
                      onSubmit={() => {}}
                    />
                    <ExportableForm
                      onCancel={() => {}}
                      onExport={() => {}}
                      onSubmit={() => {}}
                    />
                  </div>
                }
                description="Segregated - components only use what they need"
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
                component={<AdvancedBadService />}
                description="ReadOnlyService forced to implement all methods, even unused ones"
                title="❌ Bad Component"
              />
            }
            right={
              <ComponentCodeLayout
                code={advancedGoodCode}
                component={<AdvancedGoodService />}
                description="Segregated interfaces - each service only implements what it needs"
                title="✅ Good Component"
              />
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  </div>
);

export default ISPPage;
