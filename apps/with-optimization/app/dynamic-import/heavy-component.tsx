"use client";

const HeavyComponent = () => (
  <div className="space-y-4">
    <h3 className="font-semibold text-lg">Heavy Component Loaded!</h3>
    <p className="text-muted-foreground text-sm">
      This component was loaded dynamically using Next.js dynamic imports. It
      wasn't included in the initial bundle, improving your page's initial load
      time.
    </p>
    <div className="rounded-lg bg-primary/10 p-4">
      <p className="text-sm">
        In a real application, this could be a large chart library, a complex
        form builder, or any other heavy component that's not needed
        immediately.
      </p>
    </div>
  </div>
);

export default HeavyComponent;
