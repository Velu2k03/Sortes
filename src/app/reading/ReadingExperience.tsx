"use client";

import { useState } from "react";
import { Card as CardType } from "@/lib/cards/schema";
import { Card } from "@/components/Card";
import { SpreadLayout, SpreadType } from "@/components/SpreadLayout";
import { motion, AnimatePresence } from "framer-motion";

interface ReadingExperienceProps {
  cards: CardType[];
}

type Step = "select_spread" | "shuffling" | "drawing" | "revealed";

export function ReadingExperience({ cards }: ReadingExperienceProps) {
  const [step, setStep] = useState<Step>("select_spread");
  const [spreadType, setSpreadType] = useState<SpreadType>("single");
  const [deck, setDeck] = useState<CardType[]>([]);
  const [drawnCards, setDrawnCards] = useState<CardType[]>([]);

  // Shuffle array using Fisher-Yates
  const shuffleDeck = () => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDeck(shuffled);
  };

  const startReading = (type: SpreadType) => {
    setSpreadType(type);
    shuffleDeck();
    setStep("shuffling");
    
    // Auto transition from shuffling to drawing
    setTimeout(() => {
      setStep("drawing");
    }, 2000);
  };

  const drawCard = (card: CardType) => {
    if (drawnCards.find(c => c.id === card.id)) return; // already drawn
    
    const requiredCards = spreadType === "single" ? 1 : 3;
    const newDrawn = [...drawnCards, card];
    
    setDrawnCards(newDrawn);

    if (newDrawn.length === requiredCards) {
      setTimeout(() => {
        setStep("revealed");
      }, 500);
    }
  };

  const reset = () => {
    setDrawnCards([]);
    setStep("select_spread");
  };

  return (
    <div className="w-full max-w-5xl flex flex-col items-center">
      
      <AnimatePresence mode="wait">
        
        {/* STEP 1: Select Spread */}
        {step === "select_spread" && (
          <motion.div 
            key="select_spread"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center space-y-12 w-full max-w-2xl"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-cormorant)] text-[#d4af37]">
                Choose Your Reading
              </h1>
              <p className="text-[#8a8a9d] text-lg">
                Focus on your question or intention, then select a spread.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <button 
                onClick={() => startReading("single")}
                className="p-8 rounded-2xl border border-[#d4af37]/30 bg-[#15152a]/50 hover:bg-[#d4af37]/10 transition-all text-center flex flex-col items-center group"
              >
                <div className="w-16 h-24 bg-[#0a0a1a] border border-[#d4af37]/50 rounded mb-6 group-hover:scale-105 transition-transform" />
                <h3 className="text-xl text-[#e8e4d9] font-medium mb-2">Single Card</h3>
                <p className="text-[#8a8a9d] text-sm">A quick answer, daily draw, or singular focus.</p>
              </button>

              <button 
                onClick={() => startReading("three-card")}
                className="p-8 rounded-2xl border border-[#d4af37]/30 bg-[#15152a]/50 hover:bg-[#d4af37]/10 transition-all text-center flex flex-col items-center group"
              >
                <div className="flex gap-2 mb-6 group-hover:scale-105 transition-transform">
                  <div className="w-12 h-16 bg-[#0a0a1a] border border-[#d4af37]/50 rounded" />
                  <div className="w-12 h-16 bg-[#0a0a1a] border border-[#d4af37]/50 rounded" />
                  <div className="w-12 h-16 bg-[#0a0a1a] border border-[#d4af37]/50 rounded" />
                </div>
                <h3 className="text-xl text-[#e8e4d9] font-medium mb-2">Past, Present, Future</h3>
                <p className="text-[#8a8a9d] text-sm">A deeper narrative addressing the flow of time.</p>
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Shuffling */}
        {step === "shuffling" && (
          <motion.div
            key="shuffling"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-64"
          >
            <h2 className="text-3xl font-[family-name:var(--font-cormorant)] text-[#d4af37] animate-pulse">
              Shuffling the deck...
            </h2>
          </motion.div>
        )}

        {/* STEP 3: Drawing */}
        {step === "drawing" && (
          <motion.div
            key="drawing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full space-y-12"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-[family-name:var(--font-cormorant)] text-[#d4af37]">
                Draw {spreadType === "single" ? "1 card" : "3 cards"}
              </h2>
              <p className="text-[#8a8a9d]">
                Selected: {drawnCards.length} / {spreadType === "single" ? 1 : 3}
              </p>
            </div>

            {/* Fanned out deck representation */}
            <div className="relative w-full max-w-4xl h-64 flex justify-center items-center overflow-x-auto overflow-y-hidden py-10 px-4">
              <div className="flex gap-[-60px] relative w-max px-20">
                {deck.slice(0, 30).map((card, idx) => {
                  const isDrawn = drawnCards.some(c => c.id === card.id);
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ 
                        opacity: isDrawn ? 0 : 1, 
                        x: 0, 
                        y: isDrawn ? -50 : 0 
                      }}
                      transition={{ delay: idx * 0.02 }}
                      className="shrink-0 -ml-16 sm:-ml-12 hover:-translate-y-8 transition-transform z-10 hover:z-50 cursor-pointer"
                      onClick={() => drawCard(card)}
                    >
                      <div className="w-24 sm:w-32 aspect-[7/12] relative rounded-lg overflow-hidden border-2 border-[#d4af37]/30 shadow-lg">
                        <img src="/card_back.jpg" alt="Back" className="w-full h-full object-cover" />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Revealed */}
        {step === "revealed" && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center w-full space-y-16"
          >
            <div className="text-center">
              <h2 className="text-3xl font-[family-name:var(--font-cormorant)] text-[#d4af37] mb-2">
                Your Reading
              </h2>
            </div>

            <SpreadLayout spreadType={spreadType}>
              {drawnCards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  initial={{ rotateY: 0, opacity: 0, y: 50 }}
                  animate={{ rotateY: 180, opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.3, duration: 0.8 }}
                  className="flex flex-col items-center space-y-6 w-full preserve-3d"
                >
                  <Card 
                    card={card} 
                    isFlipped={true} 
                    className="w-full max-w-[280px]" 
                  />
                  <div 
                    className="text-center space-y-2 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                    style={{ animationDelay: `${(idx * 0.3) + 0.8}s` }}
                  >
                    {spreadType === "three-card" && (
                      <p className="text-[#8a8a9d] text-sm uppercase tracking-widest">
                        {idx === 0 ? "Past" : idx === 1 ? "Present" : "Future"}
                      </p>
                    )}
                    <h3 className="text-xl font-[family-name:var(--font-cormorant)] text-[#e8e4d9]">
                      {card.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </SpreadLayout>

            <div className="flex gap-4 pt-8 border-t border-[#d4af37]/20 w-full max-w-2xl justify-center">
              <button 
                onClick={reset}
                className="px-6 py-3 border border-[#8a8a9d] text-[#8a8a9d] hover:bg-[#8a8a9d]/10 rounded-full transition-colors"
              >
                Start Over
              </button>
              
              {/* To be implemented in Phase 7 */}
              <button 
                className="px-6 py-3 bg-[#d4af37] text-[#0a0a1a] font-semibold rounded-full hover:bg-[#e8c353] transition-colors shadow-lg shadow-[#d4af37]/20"
                onClick={() => alert("AI Reading Generation will be implemented in Phase 7!")}
              >
                Interpret Reading
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
