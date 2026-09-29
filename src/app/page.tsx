import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Hero */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero_background.jpg"
          alt="Celestial Starry Night"
          fill
          className="object-cover opacity-60"
          priority
        />
        {/* Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a]/30 via-[#0a0a1a]/70 to-[#0a0a1a]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center max-w-3xl mt-16">
        <div className="w-32 h-32 md:w-48 md:h-48 relative mb-8 rounded-full overflow-hidden border-2 border-[#d4af37]/50 shadow-2xl shadow-[#d4af37]/20">
          <Image
            src="/logo_source.jpg"
            alt="Sortes Logo"
            fill
            className="object-cover"
            priority
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-cormorant)] text-[#d4af37] mb-6 drop-shadow-lg">
          Sortes
        </h1>
        
        <p className="text-xl md:text-2xl text-[#e8e4d9] mb-12 font-light max-w-xl leading-relaxed">
          Cast the lots. Read your story. <br/>
          <span className="text-[#8a8a9d] text-lg">A personalized, ritualistic tarot experience.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <Link 
            href="/reading"
            className="px-8 py-4 bg-[#d4af37] hover:bg-[#e8c353] text-[#0a0a1a] font-semibold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#d4af37]/20 text-lg"
          >
            Cast the Lots
          </Link>
          
          <Link 
            href="/deck"
            className="px-8 py-4 bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 font-semibold rounded-full transition-all text-lg"
          >
            Explore Deck
          </Link>
        </div>
      </div>
      
      {/* Footer / Decorative bottom */}
      <div className="absolute bottom-8 z-10 text-[#8a8a9d] text-sm">
        By Resonant Atlas
      </div>
    </main>
  );
}
