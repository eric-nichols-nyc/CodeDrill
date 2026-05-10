"use client";

type SlackNotifierProps = {
  message: string;
  recipient: string;
};

/**
 * ✅ NEW: Added without modifying existing notifiers
 */
export function SlackNotifier({ message, recipient }: SlackNotifierProps) {
  const send = () => {
    console.log(`Sending Slack message to ${recipient}: ${message}`);
  };

  return (
    <div className="rounded border p-3">
      <p className="font-medium text-sm">SLACK</p>
      <p className="text-muted-foreground text-sm">{message}</p>
      <button
        className="mt-2 text-primary text-xs hover:underline"
        onClick={send}
      >
        Send
      </button>
    </div>
  );
}
