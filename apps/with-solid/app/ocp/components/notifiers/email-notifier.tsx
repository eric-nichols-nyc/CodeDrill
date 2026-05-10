"use client";

type EmailNotifierProps = {
  message: string;
  recipient: string;
};

export function EmailNotifier({ message, recipient }: EmailNotifierProps) {
  const send = () => {
    console.log(`Sending email to ${recipient}: ${message}`);
  };

  return (
    <div className="rounded border p-3">
      <p className="font-medium text-sm">EMAIL</p>
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
