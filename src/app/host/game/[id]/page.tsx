"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, Timer, ArrowRight, Trophy } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { pusherClient } from "@/lib/pusher-client";

interface QuizQuestion {
  text: string;
  timeLimit: number;
  options: { text: string; isCorrect: boolean }[];
}

const QUIZZES_CONTENT: Record<string, QuizQuestion[]> = {
  basico: [
    { text: "¿Cuál es el objetivo principal de la administración de entregas?", timeLimit: 20, options: [{ text: "Garantizar versiones confiables en producción", isCorrect: true }, { text: "Escribir código más rápido", isCorrect: false }, { text: "Eliminar gestores de proyectos", isCorrect: false }, { text: "Reducir el costo del hardware", isCorrect: false }] },
    { text: "¿Cuáles son los tres pilares de la gestión de liberaciones?", timeLimit: 20, options: [{ text: "Automatización, Gobernanza y Mejora continua", isCorrect: true }, { text: "Ahorro, Velocidad y Calidad", isCorrect: false }, { text: "Java, Python y C++", isCorrect: false }, { text: "GitHub, Vercel y AWS", isCorrect: false }] },
    { text: "¿Qué sincroniza el gestor de liberaciones como 'director de orquesta'?", timeLimit: 20, options: [{ text: "Equipos, herramientas y procesos", isCorrect: true }, { text: "Solo el código fuente", isCorrect: false }, { text: "Los salarios del equipo", isCorrect: false }, { text: "Las redes sociales de la empresa", isCorrect: false }] },
    { text: "¿Qué estándar internacional rige la gobernanza en esta disciplina?", timeLimit: 20, options: [{ text: "IEEE 828", isCorrect: true }, { text: "ISO 9001", isCorrect: false }, { text: "RFC 2616", isCorrect: false }, { text: "W3C HTML5", isCorrect: false }] },
    { text: "Diferencia entre SCM y Administración de Entregas:", timeLimit: 20, options: [{ text: "SCM controla cambios; Entregas los mueve a ops", isCorrect: true }, { text: "Son exactamente lo mismo", isCorrect: false }, { text: "SCM es para hardware; Entregas para software", isCorrect: false }, { text: "Entregas es solo para Amazon", isCorrect: false }] },
    { text: "¿Cuáles son las etapas iniciales del proceso de liberación?", timeLimit: 20, options: [{ text: "Solicitud y Planificación", isCorrect: true }, { text: "Pruebas y Despliegue", isCorrect: false }, { text: "Cierre y Retrospectiva", isCorrect: false }, { text: "Venta y Marketing", isCorrect: false }] },
    { text: "¿Qué ocurre en la fase de 'Diseño y Construcción'?", timeLimit: 20, options: [{ text: "Desarrollo e integración continua", isCorrect: true }, { text: "Solo la compra de dominios", isCorrect: false }, { text: "Entrenamiento de usuarios", isCorrect: false }, { text: "Instalación física de servidores", isCorrect: false }] },
    { text: "¿Qué busca el atributo operativo de 'Coordinación'?", timeLimit: 20, options: [{ text: "Sincronizar cambios y dependencias", isCorrect: true }, { text: "Organizar las fiestas del equipo", isCorrect: false }, { text: "Escribir la documentación", isCorrect: false }, { text: "Diseñar los logos del software", isCorrect: false }] },
    { text: "¿Cuál es la función del Control de Riesgos?", timeLimit: 20, options: [{ text: "Evaluación proactiva de impactos", isCorrect: true }, { text: "Ocultar errores al cliente", isCorrect: false }, { text: "Aumentar el presupuesto", isCorrect: false }, { text: "Despedir programadores", isCorrect: false }] },
    { text: "¿Qué diferencia la fase de 'Pruebas' de la de 'Preparación'?", timeLimit: 20, options: [{ text: "Pruebas valida calidad; Preparación asegura entorno", isCorrect: true }, { text: "No hay diferencia", isCorrect: false }, { text: "Preparación es solo para bases de datos", isCorrect: false }, { text: "Pruebas es opcional", isCorrect: false }] },
  ],
  intermedio: [
    { text: "¿Qué estrategia mantiene dos entornos idénticos (Blue/Green)?", timeLimit: 30, options: [{ text: "Blue-Green Deployment", isCorrect: true }, { text: "Canary Deployment", isCorrect: false }, { text: "Rolling Deployment", isCorrect: false }, { text: "A/B Testing", isCorrect: false }] },
    { text: "¿Cuál es la ventaja de un Canary Deployment?", timeLimit: 30, options: [{ text: "Reducir el 'radio de explosión' de fallos", isCorrect: true }, { text: "Usar menos servidores", isCorrect: false }, { text: "Es más barato que Blue-Green", isCorrect: false }, { text: "No requiere monitoreo", isCorrect: false }] },
    { text: "¿Para qué sirve 'npm ci' en un pipeline de CI?", timeLimit: 30, options: [{ text: "Instalación limpia y predecible (lock file)", isCorrect: true }, { text: "Para instalar solo CSS", isCorrect: false }, { text: "Para borrar el disco duro", isCorrect: false }, { text: "Para enviar correos", isCorrect: false }] },
    { text: "¿Qué fase detecta errores de sintaxis y tipos automáticamente?", timeLimit: 30, options: [{ text: "Lint y Type Check", isCorrect: true }, { text: "Build", isCorrect: false }, { text: "Deploy", isCorrect: false }, { text: "Checkout", isCorrect: false }] },
    { text: "¿Qué es el enfoque 'prebuilt' en Vercel?", timeLimit: 30, options: [{ text: "Subir artefactos ya construidos en el CI", isCorrect: true }, { text: "Instalar Next.js desde cero cada vez", isCorrect: false }, { text: "Usar plantillas prediseñadas", isCorrect: false }, { text: "No usar un pipeline", isCorrect: false }] },
    { text: "Requisito para un Rolling Deployment seguro:", timeLimit: 30, options: [{ text: "Compatibilidad entre versiones (DB)", isCorrect: true }, { text: "Tener tres entornos idénticos", isCorrect: false }, { text: "No tener usuarios activos", isCorrect: false }, { text: "Usar solo Python", isCorrect: false }] },
    { text: "¿Qué estrategia consume más recursos de infraestructura?", timeLimit: 30, options: [{ text: "Blue-Green Deployment", isCorrect: true }, { text: "Canary Deployment", isCorrect: false }, { text: "Rolling Deployment", isCorrect: false }, { text: "Manual Copy-Paste", isCorrect: false }] },
    { text: "Diferencia clave de Canary sobre Blue-Green:", timeLimit: 30, options: [{ text: "Valida comportamiento con usuarios reales", isCorrect: true }, { text: "Es más antiguo", isCorrect: false }, { text: "Solo funciona en AWS", isCorrect: false }, { text: "No permite rollback", isCorrect: false }] },
    { text: "¿Qué estrategia es más económica sin inactividad?", timeLimit: 30, options: [{ text: "Rolling Deployment", isCorrect: true }, { text: "Blue-Green", isCorrect: false }, { text: "Canary", isCorrect: false }, { text: "Shadowing", isCorrect: false }] },
    { text: "¿Cuál es la única fuente de verdad en GitOps?", timeLimit: 30, options: [{ text: "El Repositorio de Git", isCorrect: true }, { text: "La memoria del líder", isCorrect: false }, { text: "Los correos de gerencia", isCorrect: false }, { text: "El post-it en el monitor", isCorrect: false }] },
    { text: "¿Qué herramientas permiten un modelo 'pull-based' en GitOps?", timeLimit: 30, options: [{ text: "ArgoCD o Flux", isCorrect: true }, { text: "Notepad++", isCorrect: false }, { text: "Slack", isCorrect: false }, { text: "Excel", isCorrect: false }] },
    { text: "¿Cómo afecta la automatización al Time-to-Market?", timeLimit: 30, options: [{ text: "Lo acelera al eliminar cuellos de botella", isCorrect: true }, { text: "Lo retrasa al ser compleja", isCorrect: false }, { text: "No tiene impacto", isCorrect: false }, { text: "Solo sirve para reducir personal", isCorrect: false }] },
  ],
  avanzado: [
    { text: "¿Qué significan las siglas DORA en DevOps?", timeLimit: 40, options: [{ text: "DevOps Research and Assessment", isCorrect: true }, { text: "Deployment Ops Real Analysis", isCorrect: false }, { text: "Digital Org Risk Admin", isCorrect: false }, { text: "Release Agility", isCorrect: false }] },
    { text: "En SemVer 2.0.0, ¿cuándo se incrementa MAJOR?", timeLimit: 30, options: [{ text: "Cuando hay breaking changes", isCorrect: true }, { text: "Nueva función compatible", isCorrect: false }, { text: "Bug fixes", isCorrect: false }, { text: "Cada mes", isCorrect: false }] },
    { text: "¿Cuándo se incrementa la versión MINOR?", timeLimit: 30, options: [{ text: "Adición de funcionalidad compatible", isCorrect: true }, { text: "Borrado de código", isCorrect: false }, { text: "Solo corrección de texto", isCorrect: false }, { text: "Cuando falla producción", isCorrect: false }] },
    { text: "¿Qué justifica un incremento en PATCH?", timeLimit: 30, options: [{ text: "Solo corrección de errores (bug fixes)", isCorrect: true }, { text: "Cambio de logos", isCorrect: false }, { text: "Nueva API", isCorrect: false }, { text: "Mantenimiento preventivo", isCorrect: false }] },
    { text: "¿Para qué sirve Kayenta en Netflix?", timeLimit: 30, options: [{ text: "Análisis estadístico de canarios", isCorrect: true }, { text: "Para ver películas en el CI", isCorrect: false }, { text: "Para hackear la red", isCorrect: false }, { text: "Para comprar servidores", isCorrect: false }] },
    { text: "Lección del fallo de Facebook en 2021:", timeLimit: 30, options: [{ text: "Necesidad de accesos fuera de banda", isCorrect: true }, { text: "Usar solo un datacenter", isCorrect: false }, { text: "No usar routers", isCorrect: false }, { text: "Despedir a los ingenieros", isCorrect: false }] },
    { text: "¿Qué orquesta la herramienta Apollo de Amazon?", timeLimit: 30, options: [{ text: "Despliegue gradual de microservicios", isCorrect: true }, { text: "Las nubes de AWS", isCorrect: false }, { text: "Las entregas de paquetes físicos", isCorrect: false }, { text: "La música ambiental", isCorrect: false }] },
    { text: "Regla de oro de las Release Notes:", timeLimit: 30, options: [{ text: "Lenguaje sencillo centrado en el usuario", isCorrect: true }, { text: "Mucho código técnico", isCorrect: false }, { text: "Ocultar los fallos", isCorrect: false }, { text: "Que sean lo más largas posible", isCorrect: false }] },
    { text: "¿Qué significa 'Evitar' un riesgo en TARA?", timeLimit: 30, options: [{ text: "Eliminar la causa raíz del riesgo", isCorrect: true }, { text: "Mirar para otro lado", isCorrect: false }, { text: "Contratar un seguro", isCorrect: false }, { text: "Duplicar el equipo", isCorrect: false }] },
    { text: "¿Qué variables componen la matriz de riesgo?", timeLimit: 30, options: [{ text: "Probabilidad e Impacto", isCorrect: true }, { text: "Costo y Tiempo", isCorrect: false }, { text: "Gente y Máquinas", isCorrect: false }, { text: "Código e Infra", isCorrect: false }] },
    { text: "¿Qué mide 'Deployment Frequency' en DORA?", timeLimit: 30, options: [{ text: "Frecuencia de lanzamientos a producción", isCorrect: true }, { text: "Cuántas veces falla el build", isCorrect: false }, { text: "Cuántos commits hay al día", isCorrect: false }, { text: "La velocidad de la red", isCorrect: false }] },
    { text: "¿Qué mide 'Lead Time for Changes'?", timeLimit: 30, options: [{ text: "Tiempo del commit a producción", isCorrect: true }, { text: "Tiempo de espera en la fila", isCorrect: false }, { text: "Duración de los sprints", isCorrect: false }, { text: "Horas de sueño", isCorrect: false }] },
    { text: "Ventaja de la Infraestructura como Código (IaC):", timeLimit: 30, options: [{ text: "Evita la 'deriva de configuración'", isCorrect: true }, { text: "Es gratis", isCorrect: false }, { text: "No necesita servidores", isCorrect: false }, { text: "Reemplaza a los programadores", isCorrect: false }] },
    { text: "¿Qué rige los planes de gestión de configuración?", timeLimit: 30, options: [{ text: "IEEE 828-2012", isCorrect: true }, { text: "Constitución Política", isCorrect: false }, { text: "Manual de React", isCorrect: false }, { text: "Guía de estilo de Google", isCorrect: false }] },
    { text: "Filosofía de Amazon para el ciclo de vida:", timeLimit: 30, options: [{ text: "'You build it, you run it'", isCorrect: true }, { text: "'First win, then play'", isCorrect: false }, { text: "'Code fast, pray harder'", isCorrect: false }, { text: "'Only for prime users'", isCorrect: false }] },
  ]
};

const QUIZ_TITLES: Record<string, string> = {
  basico: "Nivel Básico: Fundamentos",
  intermedio: "Nivel Intermedio: Despliegue",
  avanzado: "Nivel Avanzado: Excelencia",
};

function HostGameContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = params?.id as string;
  const pin = searchParams.get("pin");
  const questions = QUIZZES_CONTENT[quizId] || QUIZZES_CONTENT.basico;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(questions[0].timeLimit);
  const [gameState, setGameState] = useState<"QUESTION" | "RESULTS" | "FINAL_RESULTS">("QUESTION");
  const [answersCount, setAnswersCount] = useState(0);

  interface PlayerScore {
     score: number;
     lastAnswerCorrect: boolean;
  }
  const [playerScores, setPlayerScores] = useState<Record<string, PlayerScore>>({});

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (gameState === "QUESTION" && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === "QUESTION") {
      setGameState("RESULTS");
    }
  }, [timeLeft, gameState]);

  useEffect(() => {
    if (!pin) return;
    const stateStr = gameState === 'QUESTION' ? 'question-changed' : gameState === 'RESULTS' ? 'show-results' : 'final-results';
    
    fetch('/api/game/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
         pin, 
         state: stateStr,
         questionIndex: currentQuestionIndex
      })
    }).catch(console.error);
  }, [pin, gameState, currentQuestionIndex]);

  useEffect(() => {
    if (!pin) return;
    const channel = pusherClient.subscribe(`game-${pin}`);
    
    channel.bind("player-answered", (data: { nickname: string, answerIndex: number, questionIndex: number }) => {
       if (data.questionIndex === currentQuestionIndex && gameState === "QUESTION") {
          const isCorrect = currentQuestion.options[data.answerIndex]?.isCorrect;
          setAnswersCount(prev => prev + 1);
          setPlayerScores(prev => {
             const currentScore = prev[data.nickname]?.score || 0;
             const speedBonus = isCorrect && currentQuestion.timeLimit > 0 ? Math.round((timeLeft / currentQuestion.timeLimit) * 500) : 0;
             const pointsEarned = isCorrect ? 500 + speedBonus : 0;
             
             return {
                ...prev,
                [data.nickname]: {
                   score: currentScore + pointsEarned,
                   lastAnswerCorrect: !!isCorrect
                }
             };
          });
       }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`game-${pin}`);
    };
  }, [pin, currentQuestionIndex, gameState, currentQuestion, timeLeft]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTimeLeft(questions[nextIndex].timeLimit);
      setGameState("QUESTION");
      setAnswersCount(0);
    } else {
      setGameState("FINAL_RESULTS");
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-purple-theme relative">
      <header className="p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-6">
           <div className="bg-white/10 px-4 py-2 rounded-lg text-white font-bold flex items-center gap-2">
              <Users size={20} /> 4 Players
           </div>
           <div className={`bg-white/10 px-4 py-2 rounded-lg text-white font-bold flex items-center gap-2 ${timeLeft < 5 ? 'animate-bounce text-red-theme' : ''}`}>
              <Timer size={20} /> {timeLeft}s
           </div>
        </div>
        <div className="text-white text-base md:text-2xl font-black italic underline decoration-yellow-theme underline-offset-4 truncate max-w-[200px] md:max-w-none">
          {QUIZ_TITLES[quizId] || "K-HOOT!"}
        </div>
        <button 
           onClick={() => setGameState("RESULTS")}
           disabled={gameState !== "QUESTION"}
           className={`py-2 px-4 md:px-8 flex items-center gap-2 rounded-xl font-bold transition-all ${
             gameState === "QUESTION" ? 'bg-blue-theme text-white hover:bg-blue-600' : 'bg-white/10 text-white/30 cursor-not-allowed'
           }`}
        >
          Skip <ArrowRight size={20} />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-10">
        <div className="text-white/60 mb-2 font-black tracking-widest uppercase text-xs md:text-sm">Pregunta {currentQuestionIndex + 1} de {questions.length}</div>
        <motion.div 
           key={currentQuestionIndex}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white w-full max-w-5xl p-6 md:p-12 rounded-2xl md:rounded-3xl shadow-2xl text-center mb-6 md:mb-12 border-b-8 border-neutral-200"
        >
           <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-neutral-800 leading-tight">
             {currentQuestion.text}
           </h1>
        </motion.div>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {currentQuestion.options.map((opt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 md:p-8 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-6 shadow-lg border-b-4 transition-all ${
                i === 0 ? 'bg-red-theme border-red-700' : 
                i === 1 ? 'bg-blue-theme border-blue-700' : 
                i === 2 ? 'bg-yellow-theme border-yellow-600' : 'bg-green-theme border-green-700'
              } ${gameState === "RESULTS" && !opt.isCorrect ? 'opacity-30 grayscale' : ''}`}
            >
              <div className="text-white text-2xl md:text-4xl font-black shrink-0">
                {i === 0 && "▲"}
                {i === 1 && "◆"}
                {i === 2 && "●"}
                {i === 3 && "■"}
              </div>
              <div className="text-white text-lg md:text-xl lg:text-2xl font-bold">{opt.text}</div>
              
              {gameState === "RESULTS" && (
                 <div className="ml-auto flex flex-col items-end shrink-0">
                    <div className="text-white font-black text-xl md:text-3xl">{i === 0 ? '3' : i === 1 ? '1' : '0'}</div>
                    {opt.isCorrect && (
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-white text-green-theme px-2 py-1 rounded-full text-[10px] md:text-xs font-black shadow-lg"
                        >
                            ✓ CORRECTO
                        </motion.div>
                    )}
                 </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {(gameState === "RESULTS" || gameState === "FINAL_RESULTS") && (
           <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-4 md:p-8"
           >
              <motion.div 
                 initial={{ scale: 0.8, y: 50 }}
                 animate={{ scale: 1, y: 0 }}
                 className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 w-full max-w-3xl text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden"
              >
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-theme via-blue-theme to-green-theme"></div>
                 <Trophy size={60} className="text-yellow-theme mx-auto mb-4 md:mb-6 drop-shadow-lg" />
                 <h2 className="text-3xl md:text-5xl font-black text-neutral-800 mb-2 italic tracking-tighter uppercase">
                   {gameState === "FINAL_RESULTS" ? "¡PODIO FINAL!" : "TABLA DE POSICIONES"}
                 </h2>
                 <p className="text-neutral-500 font-bold mb-6 md:mb-12 uppercase tracking-widest text-xs md:text-sm">
                   {gameState === "FINAL_RESULTS" ? "Resultados de la partida" : `Resultados Pregunta ${currentQuestionIndex + 1}`}
                 </p>

                 <div className="space-y-3 md:space-y-4 text-left">
                    {Object.entries(playerScores)
                      .sort((a, b) => b[1].score - a[1].score)
                      .slice(0, 5)
                      .map(([nickname, data], idx) => (
                       <div key={nickname} className={`flex justify-between items-center p-4 md:p-5 bg-purple-theme/5 rounded-xl md:rounded-2xl border-l-[8px] md:border-l-[12px] shadow-sm ${
                         idx === 0 ? 'border-yellow-theme' : idx === 1 ? 'border-neutral-300' : idx === 2 ? 'border-amber-600' : 'border-purple-theme'
                       }`}>
                          <div className="flex items-center gap-3 md:gap-5">
                             <span className="font-black text-xl md:text-3xl text-neutral-300 italic">#{idx + 1}</span>
                             <span className="font-black text-xl md:text-3xl text-neutral-800">{nickname}</span>
                          </div>
                          <span className="font-black text-xl md:text-3xl text-purple-theme">{data.score} pts</span>
                       </div>
                    ))}
                    {Object.keys(playerScores).length === 0 && (
                       <div className="text-center text-neutral-500 font-bold p-8">Nadie respondió aún...</div>
                    )}
                 </div>

                 <button 
                    onClick={gameState === "FINAL_RESULTS" ? () => router.push('/dashboard') : handleNextQuestion}
                    className="mt-8 md:mt-12 w-full py-4 md:py-5 rounded-xl md:rounded-2xl text-xl md:text-2xl font-black shadow-xl bg-purple-theme text-white hover:scale-[1.02] active:scale-[0.98] transition-all"
                 >
                   {gameState === "FINAL_RESULTS" ? "Volver al Dashboard" : "Siguiente Pregunta"}
                 </button>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      <footer className="p-4 md:p-6 flex justify-center z-10">
         <div className="bg-black/40 backdrop-blur-md px-6 md:px-10 py-2 md:py-4 rounded-full text-white font-black text-xl md:text-2xl italic tracking-widest border border-white/10">
            {answersCount} RESPUESTAS
         </div>
      </footer>
    </main>
  );
}

export default function HostGame() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-purple-theme flex items-center justify-center text-white font-bold">Cargando...</div>}>
      <HostGameContent />
    </Suspense>
  );
}
