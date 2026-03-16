"use client";

import { motion } from "framer-motion";
import { Play, BarChart3, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PREDEFINED_QUIZZES = [
  { 
    id: "basico", 
    title: "Nivel Básico: Fundamentos", 
    description: "Pilares de la administración de entregas y marco operativo.",
    questions: 10, 
    level: "Easy",
    color: "bg-green-500"
  },
  { 
    id: "intermedio", 
    title: "Nivel Intermedio: Despliegue", 
    description: "Estrategias modernas (Blue-Green, Canary) y pipelines CI/CD.",
    questions: 12, 
    level: "Medium",
    color: "bg-blue-500"
  },
  { 
    id: "avanzado", 
    title: "Nivel Avanzado: Excelencia", 
    description: "Métricas DORA, gestión de riesgos y casos de éxito reales.",
    questions: 15, 
    level: "Hard",
    color: "bg-red-500"
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [quizzes] = useState(PREDEFINED_QUIZZES);

  return (
    <main className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 p-6 flex flex-col gap-8">
        <h2 className="text-2xl font-black text-purple-theme italic underline decoration-yellow-theme underline-offset-4">K-HOOT!</h2>
        <nav className="flex flex-col gap-2">
            <button className="flex items-center gap-3 font-bold text-purple-theme bg-purple-theme/10 px-4 py-2 rounded-lg">
                <BarChart3 size={20} /> My Quizzes
            </button>
            <button className="flex items-center gap-3 font-bold text-neutral-500 hover:bg-neutral-100 px-4 py-2 rounded-lg transition-colors">
                <Search size={20} /> Discover
            </button>
        </nav>
        <div className="mt-auto p-4 bg-purple-theme/5 rounded-xl border border-purple-theme/10">
            <p className="text-xs font-bold text-purple-theme/60 uppercase mb-1">Status</p>
            <p className="text-sm font-black text-purple-theme">Admin Mode Activated</p>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-8">
        <header className="flex justify-between items-center mb-12">
           <div>
              <h1 className="text-3xl font-black text-neutral-800">My Dashboard</h1>
              <p className="text-neutral-500 font-medium">Select a quiz to start a live session with your classmates</p>
           </div>
           <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Search..." 
                className="px-4 py-2 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-theme/20"
              />
           </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <motion.div 
               key={quiz.id}
               whileHover={{ y: -5 }}
               className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden flex flex-col"
            >
              <div className={`h-40 ${quiz.color} flex flex-col items-center justify-center p-6 text-white relative overflow-hidden`}>
                 <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                 <BarChart3 size={48} className="mb-4 opacity-50" />
                 <span className="bg-black/20 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-2">
                    {quiz.level} Level
                 </span>
                 <h3 className="text-xl font-black text-center leading-tight">{quiz.title}</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-neutral-600 text-sm font-medium mb-6 flex-1">
                   {quiz.description}
                </p>
                <div className="flex items-center justify-between text-xs font-bold text-neutral-400 mb-6 pb-6 border-b border-neutral-100">
                    <span>{quiz.questions} QUESTIONS</span>
                    <span className="flex items-center gap-1"><Play size={10} /> LIVE READY</span>
                </div>
                <button 
                  onClick={() => router.push(`/host/lobby/${quiz.id}`)}
                  className="w-full btn-purple py-3 rounded-xl flex items-center justify-center gap-2 text-lg font-black group transition-all"
                >
                  <Play size={20} className="fill-white group-hover:scale-110 transition-transform" />
                  START LIVE
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
