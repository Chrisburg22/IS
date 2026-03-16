"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Play, PlusCircle, Gamepad2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [pin, setPin] = useState("");

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 6) {
      router.push(`/play?pin=${pin}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-purple-theme p-4 overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-red-theme rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-theme rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 text-center mb-12"
      >
        <h1 className="text-6xl font-black text-white drop-shadow-2xl tracking-tighter italic">
          K-HOOT!
        </h1>
        <p className="text-white/80 font-medium mt-2">Ready to play?</p>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md glass p-8 rounded-2xl shadow-2xl z-10"
      >
        <form onSubmit={handleJoinGame} className="space-y-6">
          <input
            type="text"
            placeholder="Game PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full text-center text-3xl font-bold py-4 rounded-xl border-2 border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-all"
            maxLength={6}
          />
          <button type="submit" className="w-full btn-green text-xl py-4 flex items-center justify-center gap-2">
            <Play className="fill-current" /> Enter
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/20 flex flex-col gap-4">
          <button 
             onClick={() => router.push('/dashboard')}
            className="w-full btn-purple flex items-center justify-center gap-2"
          >
            <Gamepad2 size={20} /> My Dashboard
          </button>
        </div>
      </motion.div>

      <footer className="absolute bottom-4 text-white/50 text-sm">
        Built with Antigravity
      </footer>
    </main>
  );
}
