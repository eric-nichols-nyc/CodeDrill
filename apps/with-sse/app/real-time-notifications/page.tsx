import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { NotificationsDisplay } from "@/components/notifications-display";

const RealTimeNotificationsPage = () => (
  <main className="flex min-h-screen items-center justify-center bg-background p-8">
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Real-Time Notifications</CardTitle>
        <CardDescription>
          Live notifications stream via Server-Sent Events
        </CardDescription>
      </CardHeader>
      <CardContent className="py-12">
        <NotificationsDisplay />
      </CardContent>
    </Card>
  </main>
);

export default RealTimeNotificationsPage;
