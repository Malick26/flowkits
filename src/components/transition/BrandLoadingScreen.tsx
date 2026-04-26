"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function BrandLoadingScreen() {
  const pathname = usePathname();
  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    // initial load
    const t = window.setTimeout(() => setShow(false), 850);
    return () => window.clearTimeout(t);
  }, []);

  React.useEffect(() => {
    // on navigation
    setShow(true);
    const t = window.setTimeout(() => setShow(false), 650);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#070A10]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_0%,rgba(99,102,241,0.22),transparent_60%),radial-gradient(900px_520px_at_80%_10%,rgba(236,72,153,0.16),transparent_60%)]" />

          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 6 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto inline-flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-6 py-4 shadow-[0_30px_110px_-70px_rgba(99,102,241,0.7)]"
            >
              <div className="relative h-10 w-10 rounded-2xl bg-white/8 ring-1 ring-white/10 overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-indigo-300 to-fuchsia-300"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.1, ease: "linear", repeat: Infinity }}
                  style={{ transformOrigin: "50% 50%" }}
                />
                <div className="absolute inset-[6px] rounded-xl bg-[#070A10]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold tracking-tight text-white">
                  FlowKits
                </p>
                <p className="text-xs text-white/55">…</p>
              </div>
            </motion.div>

            <motion.div
              className="mx-auto mt-5 h-1 w-56 overflow-hidden rounded-full bg-white/8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
            >
              <motion.div
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400"
                initial={{ x: "-120%" }}
                animate={{ x: "220%" }}
                transition={{ duration: 0.95, ease: "easeInOut", repeat: Infinity }}
              />
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

