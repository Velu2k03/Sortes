"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { Card as CardType } from "@/lib/cards/schema";

interface CardProps {
  card?: CardType;
  isFlipped?: boolean;
  onClick?: () => void;
  className?: string;
  delay?: number;
}

export function Card({ card, isFlipped = false, onClick, className = "", delay = 0 }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative w-full aspect-[7/12] cursor-pointer preserve-3d ${className}`}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ rotateY: 0, y: 20, opacity: 0 }}
      animate={{ 
        rotateY: isFlipped ? 180 : 0,
        y: 0, 
        opacity: 1,
        scale: isHovered && !isFlipped ? 1.02 : 1
      }}
      transition={{ 
        duration: 0.6, 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: delay
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Card Back (Visible when not flipped, at rotateY: 0) */}
      <div 
        className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden border-2 border-[#d4af37]/20 shadow-lg shadow-black/50 bg-[#15152a]"
        style={{ backfaceVisibility: "hidden" }}
      >
        <Image
          src="/card_back.jpg"
          alt="Tarot Card Back"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
          priority
        />
      </div>

      {/* Card Front (Visible when flipped, at rotateY: 180) */}
      <div 
        className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden border-2 border-[#d4af37]/40 shadow-xl shadow-[#d4af37]/10 bg-[#15152a]"
        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
      >
        {card ? (
          <Image
            src={card.image}
            alt={card.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#d4af37]">
            <span>Empty</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
