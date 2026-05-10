"use client";

type PushNotifierProps = {
  message: string;
  recipient: string;
};

export function PushNotifier({ message, recipient }: PushNotifierProps) {
  const send = () => {
    console.log(`Sending push to ${recipient}: ${message}`);
  };

  return (
    <div className="rounded border p-3">
      <p className="font-medium text-sm">PUSH</p>
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
