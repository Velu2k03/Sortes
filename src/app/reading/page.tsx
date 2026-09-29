import { ReadingExperience } from "./ReadingExperience";
import cardsData from "../../../public/cards.json";
import { Card as CardType } from "@/lib/cards/schema";

export const metadata = {
  title: "Cast the Lots",
  description: "Draw your tarot cards for a personalized reading.",
};

export default function ReadingPage() {
  const cards = cardsData as CardType[];

  return (
    <main className="min-h-screen py-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
      <ReadingExperience cards={cards} />
    </main>
  );
}
