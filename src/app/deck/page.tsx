import cardsData from "../../../public/cards.json";
import { Card as CardType } from "@/lib/cards/schema";
import { DeckBrowser } from "./DeckBrowser";

export const metadata = {
  title: "Explore the Deck",
  description: "Browse and learn about all 78 cards of the Rider-Waite-Smith tarot deck.",
};

export default function DeckPage() {
  const cards = cardsData as CardType[];

  return (
    <main className="min-h-screen py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-cormorant)] text-[#d4af37] mb-4">
          The Deck
        </h1>
        <p className="text-[#8a8a9d] max-w-2xl mx-auto text-lg">
          Explore the 78 cards of the classic Rider-Waite-Smith tarot. Tap any card to reveal its meanings and symbolism.
        </p>
      </div>

      <DeckBrowser cards={cards} />
    </main>
  );
}
