"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";
import { pusherClient } from "@/lib/pusher-client";

function PlayGameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pin = searchParams.get("pin");
  const nickname = searchParams.get("nickname");
  
  const [gameState, setGameState] = useState<"WAITING" | "QUESTION" | "ANSWERED" | "RESULTS" | "FINAL">("WAITING");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (!pin || !nickname) {
      router.push("/play");
      return;
    }

    const channel = pusherClient.subscribe(`game-${pin}`);
    
    channel.bind("game-state-changed", (data: { state: string, questionIndex?: number }) => {
      switch (data.state) {
        case "game-started":
        case "question-changed":
          if (data.questionIndex !== undefined) {
             setCurrentQuestionIndex(data.questionIndex);
          }
          setGameState("QUESTION");
          break;
        case "show-results":
          setGameState("RESULTS");
          break;
        case "final-results":
          setGameState("FINAL");
          break;
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`game-${pin}`);
    };
  }, [pin, nickname, router]);

  const handleAnswer = async (index: number) => {
    if (gameState !== "QUESTION") return;
    setGameState("ANSWERED");
    try {
      await fetch('/api/game/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, nickname, answerIndex: index, questionIndex: currentQuestionIndex })
      });
    } catch (e) {
      console.error(e);
      setGameState("QUESTION"); // revert if it fails
    }
  };

  if (gameState === "FINAL") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-purple-theme p-4 text-center">
        <h1 className="text-5xl font-black text-white italic mb-4">¡JUEGO TERMINADO!</h1>
        <p className="text-white/80 text-xl font-bold">Mira la pantalla principal para ver los ganadores</p>
      </main>
    );
  }

  if (gameState === "WAITING" || gameState === "RESULTS") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-blue-theme p-4 text-center">
        <Loader2 size={80} className="text-white/20 animate-spin mb-8" />
        <h1 className="text-3xl md:text-5xl font-black text-white italic mb-4">
          {gameState === "WAITING" ? "PREPÁRATE..." : "MIRA LA PANTALLA"}
        </h1>
      </main>
    );
  }

  if (gameState === "ANSWERED") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-green-theme p-4 text-center">
        <CheckCircle2 size={80} className="text-white mb-8" />
        <h1 className="text-3xl md:text-5xl font-black text-white italic mb-4">¡RESPUESTA ENVIADA!</h1>
        <p className="text-white/80 text-xl font-bold">Esperando a los demás...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col p-2 md:p-4 bg-gray-100">
      <div className="flex-1 grid grid-cols-2 gap-2 md:gap-4 mt-4">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAnswer(0)}
          className="bg-red-theme rounded-2xl flex items-center justify-center shadow-lg border-b-8 border-red-700 active:border-b-0 active:translate-y-2 transition-all"
        >
          <span className="text-white text-6xl md:text-8xl font-black drop-shadow-md">▲</span>
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAnswer(1)}
          className="bg-blue-theme rounded-2xl flex items-center justify-center shadow-lg border-b-8 border-blue-700 active:border-b-0 active:translate-y-2 transition-all"
        >
          <span className="text-white text-6xl md:text-8xl font-black drop-shadow-md">◆</span>
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAnswer(2)}
          className="bg-yellow-theme rounded-2xl flex items-center justify-center shadow-lg border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all"
        >
          <span className="text-white text-6xl md:text-8xl font-black drop-shadow-md">●</span>
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAnswer(3)}
          className="bg-green-theme rounded-2xl flex items-center justify-center shadow-lg border-b-8 border-green-700 active:border-b-0 active:translate-y-2 transition-all"
        >
          <span className="text-white text-6xl md:text-8xl font-black drop-shadow-md">■</span>
        </motion.button>
      </div>
    </main>
  );
}

export default function PlayGamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center font-bold">Cargando...</div>}>
      <PlayGameContent />
    </Suspense>
  );
}
