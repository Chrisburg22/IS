"use client";

import { motion } from "framer-motion";
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateQuiz() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { id: "1", text: "", options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]}
  ]);

  const addQuestion = () => {
    setQuestions([...questions, {
      id: Math.random().toString(),
      text: "",
      options: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]
    }]);
  };

  return (
    <main className="min-h-screen bg-neutral-100 p-8">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <button onClick={() => router.back()} className="flex items-center gap-2 font-bold text-neutral-600 hover:text-neutral-900 transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <button className="btn-green flex items-center gap-2">
          <Save size={20} /> Save Quiz
        </button>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
           <input 
             type="text" 
             placeholder="Enter quiz title..." 
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             className="w-full text-4xl font-black text-neutral-800 placeholder:text-neutral-300 focus:outline-none"
           />
        </section>

        {questions.map((q, qIndex) => (
          <motion.section 
            key={q.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 relative group"
          >
            <button className="absolute -right-4 -top-4 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              <Trash2 size={20} />
            </button>

            <div className="mb-8">
              <label className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-2 block">Question {qIndex + 1}</label>
              <input 
                type="text" 
                placeholder="Start typing your question" 
                className="w-full text-2xl font-bold text-neutral-800 border-b-2 border-neutral-100 py-2 focus:border-purple-theme focus:outline-none transition-colors"
                defaultValue={q.text}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, optIndex) => (
                 <div key={optIndex} className="relative flex items-center">
                    <div className={`w-12 h-12 flex items-center justify-center text-white font-black rounded-l-xl ${
                      optIndex === 0 ? 'bg-red-theme' : 
                      optIndex === 1 ? 'bg-blue-theme' : 
                      optIndex === 2 ? 'bg-yellow-theme' : 'bg-green-theme'
                    }`}>
                      {optIndex === 0 && "▲"}
                      {optIndex === 1 && "◆"}
                      {optIndex === 2 && "●"}
                      {optIndex === 3 && "■"}
                    </div>
                    <input 
                      type="text" 
                      placeholder={`Answer ${optIndex + 1}`} 
                      className="flex-1 bg-neutral-50 px-4 py-3 rounded-r-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-purple-theme/20 font-bold"
                      defaultValue={opt.text}
                    />
                    <input 
                      type="radio" 
                      name={`correct-${q.id}`} 
                      defaultChecked={opt.isCorrect}
                      className="absolute right-4 w-6 h-6 accent-green-theme cursor-pointer"
                    />
                 </div>
              ))}
            </div>
          </motion.section>
        ))}

        <button 
           onClick={addQuestion}
           className="w-full py-8 border-4 border-dashed border-neutral-200 rounded-2xl text-neutral-400 font-bold text-xl hover:border-neutral-300 hover:text-neutral-500 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={24} /> Add Question
        </button>
      </div>
    </main>
  );
}
