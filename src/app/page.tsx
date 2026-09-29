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
            className="px-8 py-4 bg-[#d4af37] hover:bg-[#e8c353] text-[#0a0a1a] font-semibold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#d4af37]/20 text-lg animate-shimmer"
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
      {/* Sample Reading Teaser */}
      <div className="relative z-10 w-full max-w-4xl mt-24 px-4 mb-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-[family-name:var(--font-cormorant)] text-[#d4af37] mb-4">
            Glimpse the Oracle
          </h2>
          <p className="text-[#8a8a9d]">
            A recent reading drawn by a seeker.
          </p>
        </div>
        
        <div className="relative p-8 rounded-2xl bg-[#15152a]/60 border border-[#d4af37]/20 shadow-2xl backdrop-blur-md overflow-hidden">
          {/* Shimmer effect for teaser */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent opacity-50" />
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex-shrink-0 w-32 aspect-[7/12] relative rounded-xl overflow-hidden border border-[#d4af37]/40 shadow-lg shadow-[#d4af37]/10">
              <Image src="/images/cards/major-17-the-star.jpg" alt="The Star" fill className="object-cover" />
            </div>
            
            <div className="flex-grow space-y-4 text-center md:text-left">
              <div className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-medium tracking-wider uppercase mb-2">
                The Star • Upright
              </div>
              <h3 className="text-xl text-[#e8e4d9] font-medium italic">"Is there hope for my creative project?"</h3>
              <p className="text-[#8a8a9d] leading-relaxed font-light text-sm md:text-base">
                <strong className="text-[#d4af37] font-normal">The Star</strong> appears as a profound omen of renewal and inspiration. After a period of creative drought or uncertainty, the universe is pouring fresh, cosmic energy into your endeavors. You are being called to trust your vision implicitly...
              </p>
              <div className="pt-4">
                <Link 
                  href="/reading"
                  className="text-[#d4af37] text-sm hover:text-[#e8c353] transition-colors border-b border-[#d4af37]/30 pb-1"
                >
                  Unlock your own personalized reading &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer / Decorative bottom */}
      <div className="relative z-10 text-[#8a8a9d] text-sm mb-8">
        By Resonant Atlas
      </div>
    </main>
  );
}
