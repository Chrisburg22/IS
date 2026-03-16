"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { UserCheck } from "lucide-react";

function PlayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pin = searchParams.get("pin");
  const [nickname, setNickname] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      // In a real app, we would call an API to join the session
      // For now, we simulate success and redirect to lobby
      router.push(`/lobby?pin=${pin}&nickname=${nickname}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-blue-theme p-4 overflow-hidden relative">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <span className="text-white/60 font-bold uppercase tracking-widest text-sm">PIN: {pin}</span>
        <h1 className="text-4xl font-black text-white italic">SET YOUR NICKNAME</h1>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm glass p-8 rounded-2xl shadow-2xl z-10"
      >
        <form onSubmit={handleJoin} className="space-y-6">
          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full text-center text-2xl font-bold py-4 rounded-xl border-2 border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-all"
            required
            autoFocus
          />
          <button type="submit" className="w-full btn-yellow text-xl py-4 flex items-center justify-center gap-2">
            <UserCheck /> OK, go!
          </button>
        </form>
      </motion.div>
    </main>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-blue-theme flex items-center justify-center text-white font-bold">Loading...</div>}>
      <PlayContent />
    </Suspense>
  );
}
