"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/reading");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link!");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#15152a]/80 border border-[#d4af37]/30 shadow-2xl backdrop-blur-sm relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full overflow-hidden border-2 border-[#d4af37]/50 shadow-lg">
          <Image src="/logo_source.jpg" alt="Sortes Logo" fill className="object-cover" />
        </div>
        
        <div className="mt-12 text-center mb-8">
          <h1 className="text-3xl font-[family-name:var(--font-cormorant)] text-[#d4af37] mb-2">
            {isLogin ? "Welcome Back" : "Begin Your Journey"}
          </h1>
          <p className="text-[#8a8a9d] text-sm">
            {isLogin ? "Sign in to access your saved readings." : "Create an account to save your tarot readings."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-[#e8e4d9] text-sm mb-2" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0a0a1a] border border-[#d4af37]/30 rounded-lg px-4 py-3 text-[#e8e4d9] focus:outline-none focus:border-[#d4af37] transition-colors"
              placeholder="seeker@example.com"
            />
          </div>
          <div>
            <label className="block text-[#e8e4d9] text-sm mb-2" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0a0a1a] border border-[#d4af37]/30 rounded-lg px-4 py-3 text-[#e8e4d9] focus:outline-none focus:border-[#d4af37] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="text-red-400 text-sm text-center p-2 bg-red-400/10 rounded">{error}</div>}
          {message && <div className="text-green-400 text-sm text-center p-2 bg-green-400/10 rounded">{message}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#d4af37] text-[#0a0a1a] font-semibold py-3 rounded-lg hover:bg-[#e8c353] transition-colors disabled:opacity-50 mt-4 shadow-lg shadow-[#d4af37]/20"
          >
            {loading ? "Casting..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#8a8a9d]">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#d4af37] hover:underline"
            type="button"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </main>
  );
}
