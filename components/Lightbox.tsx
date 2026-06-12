"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUI } from "@/lib/store";
import { full } from "@/lib/cloudinary";

export default function Lightbox() {
  const item = useUI((s) => s.lightbox);
  const close = useUI((s) => s.close);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (item) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, close]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[100] grid place-items-center bg-abyss/92 p-6 backdrop-blur-md sm:p-10"
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-6 top-6 z-10 grid h-11 w-11 place-items-center rounded-full border border-foam/20 text-foam transition-colors hover:border-tide hover:text-tide"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[88vh] max-w-[92vw] flex-col items-center gap-4"
          >
            {item.kind === "image" ? (
              <img
                src={full(item.url)}
                alt={item.title}
                className="max-h-[80vh] w-auto rounded-lg object-contain shadow-2xl shadow-black/50"
              />
            ) : (
              <video
                src={item.url}
                controls
                autoPlay
                loop
                playsInline
                className="max-h-[80vh] w-auto rounded-lg shadow-2xl shadow-black/50"
              />
            )}
            <span className="font-mono text-[11px] uppercase tracking-widest text-mist/70">
              {item.title}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
