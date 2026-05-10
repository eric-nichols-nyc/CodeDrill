import {
  Flashcards,
  type FlashcardsData,
} from "@repo/design-system/components/flashcards";
import flashcardsData from "./flashcards.json";

export default function FlashcardsPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl border border-amber-700">
        <Flashcards
          cards={flashcardsData as FlashcardsData}
          title="Next.js & React optimization"
        />
      </div>
    </main>
  );
}
