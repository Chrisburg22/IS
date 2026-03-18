"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Loader2, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { pusherClient } from "@/lib/pusher-client";

function LobbyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pin = searchParams.get("pin");
  const nickname = searchParams.get("nickname");
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    if (!pin) return;
    if (nickname) setPlayers([nickname]);

    const channel = pusherClient.subscribe(`game-${pin}`);
    
    channel.bind("player-joined", (data: { nickname: string }) => {
       setPlayers(prev => {
          if (!prev.includes(data.nickname)) {
             return [...prev, data.nickname];
          }
          return prev;
       });
    });

    channel.bind("game-state-changed", (data: { state: string }) => {
      if (data.state === "game-started") {
        router.push(`/play/game?pin=${pin}&nickname=${nickname}`);
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`game-${pin}`);
    };
  }, [pin, nickname, router]);

  return (
    <main className="min-h-screen flex flex-col bg-purple-theme p-8 relative overflow-hidden">
      <div className="flex justify-between items-start z-10 gap-8">
        <div className="flex flex-col gap-4">
            <div className="glass px-6 py-2 rounded-full text-white font-bold flex items-center gap-2 w-fit">
               <Users size={18} /> {players.length} Players
            </div>
            <div className="glass p-4 rounded-2xl bg-white shadow-2xl flex flex-col items-center gap-2">
                <QRCodeSVG 
                    value={`${window.location.origin}/play?pin=${pin}`} 
                    size={160}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                        src: "/favicon.ico",
                        x: undefined,
                        y: undefined,
                        height: 24,
                        width: 24,
                        excavate: true,
                    }}
                />
                <span className="text-purple-theme font-black text-xs uppercase tracking-tighter">Scan to Join</span>
            </div>
        </div>
        <div className="text-right flex-1">
           <span className="text-white/60 text-sm font-bold uppercase tracking-wider block mb-1">Join at {typeof window !== 'undefined' ? window.location.host : 'k-hoot.vercel.app'}</span>
           <h2 className="text-6xl font-black text-white drop-shadow-lg tracking-tighter italic">PIN: {pin}</h2>
           <div className="mt-4 flex justify-end gap-2">
               <span className="bg-red-theme px-3 py-1 rounded text-white text-[10px] font-black uppercase">Live Session</span>
               <span className="bg-blue-theme px-3 py-1 rounded text-white text-[10px] font-black uppercase">Competitive Mode</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 text-center mt-12">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
           className="mb-8"
        >
          <Loader2 size={80} className="text-white/20" />
        </motion.div>
        
        <h1 className="text-5xl font-black text-white mb-2 italic">You're in!</h1>
        <p className="text-white/70 text-xl">See your name on screen?</p>

        <div className="mt-12 flex flex-wrap justify-center gap-4 max-w-4xl">
          <AnimatePresence>
            {players.map((p, i) => (
              <motion.div
                key={p}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 border border-white/20 px-6 py-3 rounded-lg text-white font-black text-2xl shadow-xl flex items-center gap-3"
              >
                <div className={`w-3 h-3 rounded-full ${i % 2 === 0 ? 'bg-green-theme' : 'bg-red-theme'}`} />
                {p}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-black text-white/5 select-none pointer-events-none italic">
         LOBBY
      </div>
    </main>
  );
}

export default function LobbyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-purple-theme flex items-center justify-center text-white font-bold">Loading...</div>}>
      <LobbyContent />
    </Suspense>
  );
}
