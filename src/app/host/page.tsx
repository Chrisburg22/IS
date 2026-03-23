"use client";

import { motion } from "framer-motion";
import { Plus, Play, MoreVertical, Search, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MOCK_QUIZZES = [
  { id: "fania", title: "Administración de Entregas (Fania Edition)", questions: 10, plays: 0 },
  { id: "basico", title: "Nivel Básico: Fundamentos", questions: 10, plays: 156 },
  { id: "intermedio", title: "Nivel Intermedio: Despliegue", questions: 12, plays: 89 },
  { id: "avanzado", title: "Nivel Avanzado: Excelencia", questions: 15, plays: 42 },
];

export default function HostDashboard() {
  const router = useRouter();
  const [quizzes] = useState(MOCK_QUIZZES);

  return (
    <main className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 p-6 flex flex-col gap-8">
        <h2 className="text-2xl font-black text-purple-theme italic">K-HOOT!</h2>
        <nav className="flex flex-col gap-2">
            <button className="flex items-center gap-3 font-bold text-purple-theme bg-purple-theme/10 px-4 py-2 rounded-lg">
                <BarChart3 size={20} /> My Quizzes
            </button>
            <button className="flex items-center gap-3 font-bold text-neutral-500 hover:bg-neutral-100 px-4 py-2 rounded-lg transition-colors">
                <Search size={20} /> Discover
            </button>
        </nav>
        <button 
           onClick={() => router.push('/host/create')}
           className="mt-auto btn-purple flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Create New
        </button>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-8">
        <header className="flex justify-between items-center mb-12">
           <h1 className="text-3xl font-black text-neutral-800">My Quizzes</h1>
           <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Search your quizzes..." 
                className="px-4 py-2 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-theme/20"
              />
           </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <motion.div 
               key={quiz.id}
               whileHover={{ y: -5 }}
               className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
            >
              <div className="h-32 bg-purple-theme/5 flex items-center justify-center">
                 <div className="text-purple-theme/20 text-6xl font-black italic select-none">QUIZ</div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-neutral-800">{quiz.title}</h3>
                  <button className="text-neutral-400 hover:text-neutral-600"><MoreVertical size={20} /></button>
                </div>
                <div className="flex gap-4 text-sm text-neutral-500 font-medium mb-6">
                   <span>{quiz.questions} Questions</span>
                   <span>{quiz.plays} Plays</span>
                </div>
                <div className="flex gap-3">
                   <button 
                      onClick={() => router.push(`/host/game/${quiz.id}`)}
                      className="flex-1 btn-green py-2 text-sm flex items-center justify-center gap-2"
                   >
                      <Play size={16} fill="white" /> Start
                   </button>
                   <button className="flex-1 border-2 border-neutral-200 py-2 rounded-lg text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors">
                      Edit
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
