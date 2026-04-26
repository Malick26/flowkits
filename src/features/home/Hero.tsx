"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track scroll inside the Hero section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax and fade for the trophy on scroll
  const trophyY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const trophyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const trophyScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  return (
    <section ref={ref} className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/2 p-7 shadow-[0_30px_120px_-60px_rgba(99,102,241,0.55)] sm:p-12 min-h-[500px]">
      {/* Radial glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_20%_0%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(700px_380px_at_80%_20%,rgba(236,72,153,0.14),transparent_60%)]" />

      {/* Subtle grid lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:48px_48px]" />

      <motion.div 
        className="relative z-10 lg:w-3/5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 },
          },
        }}
      >
        {/* Badge */}
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } } }}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(99,102,241,0.15)" }}
          className="mb-5 inline-flex cursor-default items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-4 py-1.5 transition-colors"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
          <span className="text-xs font-semibold tracking-widest text-indigo-300 uppercase">
            Édition Coupe du Monde 2026
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } } }}
          className="mt-1 text-4xl font-bold tracking-tight sm:text-6xl leading-[1.05]"
        >
          FlowKits,{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            le maillot qui
          </span>
          <br />
          fait la différence.
        </motion.h1>

        <motion.p 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } } }}
          className="mt-4 max-w-xl text-sm leading-7 text-white/55 sm:text-base"
        >
          Une expérience simple et moderne : tu choisis ton modèle, ta taille,
          tu valides — on s'occupe du reste. Frais de livraison transparents
          selon ton quartier. Paiement à la livraison.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } } }}
          className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <a
            href="#products"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-indigo-400/90 to-indigo-500 px-5 text-sm font-semibold text-white shadow-[0_12px_40px_-14px_rgba(99,102,241,0.75)] transition hover:from-indigo-300/90 hover:to-indigo-500 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <path d="M2.5 7h9M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Voir les maillots
          </a>
          <a
            href="#how"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/12 bg-white/5 px-5 text-sm font-medium text-white/80 transition hover:bg-white/8 hover:text-white active:scale-[0.98]"
          >
            Comment commander
          </a>
        </motion.div>

        <motion.p 
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1 } } }}
          className="mt-4 text-xs text-white/30"
        >
          Commande en quelques secondes &bull; Support réactif &bull; Paiement à la livraison
        </motion.p>
      </motion.div>

      {/* Trophy Animation (Desktop only) */}
      <motion.div
        className="absolute right-0 lg:right-10 top-0 bottom-0 hidden lg:flex items-center justify-center pointer-events-none"
        style={{ y: trophyY, opacity: trophyOpacity, scale: trophyScale }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -80 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // Smooth entry
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Glow effect behind the trophy */}
            <div className="absolute inset-0 bg-yellow-500/20 blur-[80px] rounded-full scale-150 mix-blend-screen" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/trophy.png" 
              alt="World Cup Trophy" 
              className="w-[380px] h-[380px] object-contain mix-blend-screen drop-shadow-[0_0_30px_rgba(250,204,21,0.4)] relative z-10" 
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Stats row inside hero */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        className="relative z-10 mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8"
      >
        {[
          { value: "03", label: "Équipes dispo" },
          { value: "48h", label: "Livraison rapide" },
          { value: "0 DA", label: "Frais cachés" },
        ].map((s) => (
          <div key={s.label} className="bg-black/20 px-4 py-4 text-center backdrop-blur-sm">
            <p className="text-xl font-bold text-white sm:text-2xl">{s.value}</p>
            <p className="mt-0.5 text-xs text-white/40">{s.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
