"use client";

import { useState } from "react";
import { Card as CardType } from "@/lib/cards/schema";
import { Card } from "@/components/Card";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface DeckBrowserProps {
  cards: CardType[];
}

type Filter = "All" | "Major" | "Wands" | "Cups" | "Swords" | "Pentacles";

export function DeckBrowser({ cards }: DeckBrowserProps) {
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
    
    let matchesFilter = true;
    if (filter === "Major") matchesFilter = card.arcana === "Major";
    else if (filter !== "All") matchesFilter = card.suit === filter;

    return matchesSearch && matchesFilter;
  });

  const filters: Filter[] = ["All", "Major", "Wands", "Cups", "Swords", "Pentacles"];

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex flex-wrap justify-center gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm transition-colors border border-[#d4af37]/30 ${
                filter === f 
                  ? "bg-[#d4af37]/20 text-[#d4af37]" 
                  : "bg-transparent text-[#8a8a9d] hover:text-[#e8e4d9] hover:bg-[#d4af37]/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a9d]" />
          <input
            type="text"
            placeholder="Search cards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#15152a] border border-[#d4af37]/30 rounded-full py-2 pl-10 pr-4 text-[#e8e4d9] placeholder-[#8a8a9d] focus:outline-none focus:border-[#d4af37] transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
      >
        <AnimatePresence>
          {filteredCards.map((card, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key={card.id}
              className="flex flex-col gap-3"
            >
              <Card 
                card={card} 
                isFlipped={flippedCards[card.id] || false}
                onClick={() => toggleFlip(card.id)}
                delay={i < 12 ? i * 0.05 : 0} 
              />
              <div className="text-center">
                <h3 className="font-[family-name:var(--font-cormorant)] text-lg text-[#e8e4d9] font-medium leading-tight">
                  {card.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredCards.length === 0 && (
        <div className="text-center py-20 text-[#8a8a9d]">
          No cards found matching your search.
        </div>
      )}
    </div>
  );
}
