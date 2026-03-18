"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Loader2, Play, QrCode } from "lucide-react";
import { pusherClient } from "@/lib/pusher-client";
import { QRCodeSVG } from "qrcode.react";

const QUIZ_TITLES: Record<string, string> = {
  basico: "Nivel Básico: Fundamentos",
  intermedio: "Nivel Intermedio: Despliegue",
  avanzado: "Nivel Avanzado: Excelencia",
};

function HostLobbyContent() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.id as string;
  const [pin] = useState(Math.floor(100000 + Math.random() * 900000).toString());
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    const channel = pusherClient.subscribe(`game-${pin}`);
    
    channel.bind("player-joined", (data: { nickname: string }) => {
       setPlayers(prev => {
          if (!prev.includes(data.nickname)) {
             return [...prev, data.nickname];
          }
          return prev;
       });
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`game-${pin}`);
    };
  }, [pin]);

  const handleStartGame = async () => {
    await fetch('/api/game/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, state: 'game-started' })
    });
    router.push(`/host/game/${quizId}?pin=${pin}`);
  };

  return (
    <main className="min-h-screen flex flex-col bg-purple-theme p-8 relative overflow-hidden">
      <div className="flex justify-between items-start z-10 gap-8">
        <div className="flex flex-col gap-6">
            <div className="glass px-6 py-3 rounded-full text-white font-bold flex items-center gap-2 w-fit">
               <Users size={20} /> {players.length} Compañeros Unidos
            </div>
            
            <div className="glass p-6 rounded-3xl bg-white shadow-2xl flex flex-col items-center gap-4">
                <QRCodeSVG 
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/play?pin=${pin}`} 
                    size={200}
                    level="H"
                    includeMargin={true}
                />
                <div className="text-center">
                    <p className="text-purple-theme font-black text-sm uppercase tracking-widest mb-1">Escanea para Unirte</p>
                    <p className="text-neutral-400 text-[10px] font-bold">Sesión en Vivo: {QUIZ_TITLES[quizId] || "Ingeniería"}</p>
                </div>
            </div>
        </div>

        <div className="text-right flex-1 flex flex-col items-end">
           <span className="text-white/60 text-lg font-bold uppercase tracking-wider block mb-2">Únete en: {typeof window !== 'undefined' ? window.location.host : '...'}</span>
           <h2 className="text-8xl font-black text-white drop-shadow-2xl tracking-tighter italic mb-8">PIN: {pin}</h2>
           
           <button 
                onClick={handleStartGame}
                disabled={players.length === 0}
                className={`flex items-center gap-3 px-12 py-5 rounded-2xl text-2xl font-black transition-all shadow-2xl ${
                    players.length > 0 
                    ? 'bg-green-theme text-white hover:scale-105 active:scale-95' 
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
           >
                <Play size={28} className="fill-current" />
                COMENZAR JUEGO
           </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 text-center mt-12">
        <h1 className="text-4xl font-black text-white mb-8 italic opacity-80 underline decoration-yellow-theme underline-offset-8">ESPERANDO A LOS JUGADORES...</h1>
        
        <div className="flex flex-wrap justify-center gap-6 max-w-5xl">
          <AnimatePresence>
            {players.map((p, i) => (
              <motion.div
                key={p}
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-md border-2 border-white/20 px-8 py-4 rounded-2xl text-white font-black text-3xl shadow-2xl flex items-center gap-4"
              >
                <div className={`w-4 h-4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] ${i % 2 === 0 ? 'bg-green-theme' : 'bg-red-theme'}`} />
                {p}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25rem] font-black text-white/5 select-none pointer-events-none italic tracking-tighter">
         LOBBY
      </div>
    </main>
  );
}

export default function HostLobbyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-purple-theme flex items-center justify-center text-white font-bold">Preparando Lobby...</div>}>
      <HostLobbyContent />
    </Suspense>
  );
}
