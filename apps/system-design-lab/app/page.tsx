import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Layout } from "lucide-react";

const HomePage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-bold text-4xl">System Design Lab</h1>
        <p className="mt-2 text-muted-foreground">
          Explore system design concepts and patterns. Use the sidebar to
          navigate.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layout className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Welcome</CardTitle>
              <CardDescription>
                This app uses the design-system layout with sidebar and theme
                support.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Add new routes and sidebar items to build out your system design
            lab content.
          </p>
        </CardContent>
      </Card>
    </div>
  </main>
);

export default HomePage;
