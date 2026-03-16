"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function PlayerGame() {
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<"CORRECT" | "WRONG" | null>(null);

  const handleSelect = (index: number) => {
    setSelected(index);
    // Simulate answer validation after 2 seconds
    setTimeout(() => {
      setResult(index === 0 ? "CORRECT" : "WRONG");
    }, 2000);
  };

  if (result === "CORRECT") {
    return (
      <main className="min-h-screen bg-green-theme flex flex-col items-center justify-center p-8 text-white text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
           <CheckCircle2 size={120} className="mb-6 drop-shadow-lg" />
           <h1 className="text-6xl font-black italic mb-4">CORRECT!</h1>
           <p className="text-2xl font-bold bg-black/10 px-6 py-2 rounded-full">+ 942 pts</p>
        </motion.div>
      </main>
    );
  }

  if (result === "WRONG") {
    return (
      <main className="min-h-screen bg-red-theme flex flex-col items-center justify-center p-8 text-white text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
           <XCircle size={120} className="mb-6 drop-shadow-lg" />
           <h1 className="text-6xl font-black italic mb-4">NOT QUITE...</h1>
           <p className="text-2xl font-bold bg-black/10 px-6 py-2 rounded-full">Don't give up!</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen grid grid-cols-2 grid-rows-2 gap-2 p-2 bg-neutral-900">
      {[0, 1, 2, 3].map((i) => (
        <motion.button
          key={i}
          onClick={() => handleSelect(i)}
          disabled={selected !== null}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`flex items-center justify-center text-8xl font-black transition-all transform active:scale-95 ${
            selected !== null && selected !== i ? 'opacity-30 scale-90' : 'opacity-100'
          } ${
            i === 0 ? 'bg-red-theme' : 
            i === 1 ? 'bg-blue-theme' : 
            i === 2 ? 'bg-yellow-theme' : 'bg-green-theme'
          } ${selected === i ? 'ring-8 ring-white z-10' : ''}`}
        >
          <span className="text-white drop-shadow-2xl">
            {i === 0 && "▲"}
            {i === 1 && "◆"}
            {i === 2 && "●"}
            {i === 3 && "■"}
          </span>
        </motion.button>
      ))}

      {selected !== null && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/80 px-12 py-6 rounded-3xl border-4 border-white/20 backdrop-blur-lg">
             <h2 className="text-white text-4xl font-black italic animate-pulse">ANSWERED</h2>
          </div>
        </div>
      )}
    </main>
  );
}
