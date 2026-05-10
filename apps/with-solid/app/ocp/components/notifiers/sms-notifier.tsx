"use client";

type SmsNotifierProps = {
  message: string;
  recipient: string;
};

export function SmsNotifier({ message, recipient }: SmsNotifierProps) {
  const send = () => {
    console.log(`Sending SMS to ${recipient}: ${message}`);
  };

  return (
    <div className="rounded border p-3">
      <p className="font-medium text-sm">SMS</p>
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
