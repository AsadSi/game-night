"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Status = "pending" | "innocent" | "sus" | "guilty";

const DATA = {
  SUSPECT: [
    "Fenrir Greyback",
    "Lucius Malfoy",
    "Peter Pettigrew",
    "Draco Malfoy™",
    "Snatcher",
    "Bellatrix Lestrange",
  ],
  ITEM: [
    "Jinxed Broomstick",
    "Cursed Necklace",
    "Love Potion",
    "Poisoned Mead",
    "Incendio",
    "Stupefy",
  ],
  LOCATION: [
    "Malfoy Manor",
    "The Hog's Head",
    "The Shrieking Shack",
    "Hogwarts™ Castle",
    "Forbidden Forest",
    "Gringotts™",
    "Weasleys' Wizard Wheezes",
    "Ministry of Magic",
    "12 Grimmauld Place",
  ],
};

export default function MaraudersMap() {
  const [list, setList] = useState<Record<string, Status>>({});

  // Cycle starts at Pending. Clicking moves it to Innocent.
  const toggle = (id: string) => {
    setList((prev) => {
      const current = prev[id] || "pending";
      const order: Status[] = ["pending", "innocent", "sus", "guilty"];
      const nextIndex = (order.indexOf(current) + 1) % order.length;
      return {
        ...prev,
        [id]: order[nextIndex],
      };
    });
  };

  const mischiefManaged = () => {
    setList({});
    localStorage.removeItem("marauders-notes");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#b9a686] font-serif text-[#2a1d15]">
      {/* Background Footsteps Layer */}
      <GhostFootsteps />

      <main className="relative z-10 mx-auto my-12 grid w-full max-w-5xl grid-cols-1 gap-10 px-4 md:grid-cols-3">
        {/* CHECKLIST */}
        <section className="md:col-span-2 border border-black/10 bg-[#e6ddd0] p-6 shadow-2xl md:p-12">
          <h1 className="mb-8 text-center text-3xl uppercase tracking-widest text-[#4a3b2f]">
            Marauder’s Map Checklist
          </h1>

          {Object.entries(DATA).map(([category, items]) => (
            <section key={category} className="mb-10">
              <div className="flex items-center bg-[#7a6d5a] px-4 py-1.5 text-[#fdfaf3]">
                <h2 className="text-lg font-bold tracking-[0.25em] uppercase">
                  {category}
                </h2>
                <div className="ml-4 flex flex-grow gap-1 overflow-hidden opacity-30">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <span key={i}>◆</span>
                  ))}
                </div>
              </div>

              <div className="mt-0.5 space-y-[1px] bg-[#cfc4ae]">
                {items.map((item) => (
                  <div
                    key={item}
                    onClick={() => toggle(item)}
                    className="flex h-11 cursor-pointer items-center justify-between bg-[#dfd6c3] px-4 transition-colors hover:bg-[#d5ccb8]"
                  >
                    <span className="text-lg">{item}</span>

                    <div className="flex min-w-[100px] justify-end text-xs font-bold tracking-tighter">
                      <AnimatePresence mode="wait">
                        {(!list[item] || list[item] === "pending") && (
                          <motion.span
                            key="p"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                          >
                            PENDING
                          </motion.span>
                        )}
                        {list[item] === "innocent" && (
                          <motion.span 
                            key="i"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-emerald-800"
                          >
                            INNOCENT
                          </motion.span>
                        )}
                        {list[item] === "sus" && (
                          <motion.span 
                            key="s"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-orange-800"
                          >
                            SUS
                          </motion.span>
                        )}
                        {list[item] === "guilty" && (
                          <motion.span 
                            key="g"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-700"
                          >
                            GUILTY
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <div className="mt-10 flex justify-center">
            <button
              onClick={mischiefManaged}
              className="group relative border border-black/30 bg-[#7a6d5a] px-6 py-2 text-xs uppercase tracking-[0.3em] text-[#fdfaf3] shadow-md transition hover:bg-[#6a5d4a]"
            >
              Mischief Managed
            </button>
          </div>

          <footer className="mt-8 flex justify-between border-t border-black/10 pt-4 text-[9px] uppercase tracking-tighter opacity-50">
            <span>© 2016 Hasbro. HARRY POTTER TM & © WBEI.</span>
            <span>C31051020</span>
          </footer>
        </section>

        <Notepad />
      </main>

      <div className="pointer-events-none fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/papyros.png')] opacity-25 mix-blend-multiply" />
    </div>
  );
}

/* ---------------- NOTEPAD ---------------- */

function Notepad() {
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("marauders-notes");
    if (saved) setText(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("marauders-notes", text);
  }, [text]);

  return (
    <aside className="relative border border-black/10 bg-[#ede5d6] p-6 shadow-xl">
      <h2 className="mb-4 text-center text-lg uppercase tracking-widest text-[#4a3b2f]">
        Notes
      </h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your observations here…"
        className="h-[420px] w-full resize-none bg-transparent p-3 text-sm leading-relaxed outline-none placeholder:opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,0.08) 28px)",
          lineHeight: "28px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 border border-black/10" />
    </aside>
  );
}

/* ---------------- FOOTSTEPS ---------------- */

function GhostFootsteps() {
  // Increased to 12 walkers for more activity
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <FootstepWalker key={i} delay={i * 2.5} />
      ))}
    </div>
  );
}

function FootstepWalker({ delay }: { delay: number }) {
  const [steps, setSteps] = useState<
    { id: number; x: number; y: number; rot: number; left: boolean; scale: number }[]
  >([]);

  useEffect(() => {
    let id = 0;
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    let angle = Math.random() * 360;
    let left = true;
    // Vary the walker size slightly
    const scale = 0.8 + Math.random() * 0.4;
    // Vary step frequency (speed)
    const pace = 600 + Math.random() * 400;

    const start = setTimeout(() => {
      const interval = setInterval(() => {
        const distance = 35;
        // Wander slightly
        angle += (Math.random() - 0.5) * 40;

        // Wrap around screen
        if (x < -100) x = window.innerWidth + 50;
        if (x > window.innerWidth + 100) x = -50;
        if (y < -100) y = window.innerHeight + 50;
        if (y > window.innerHeight + 100) y = -50;

        x += Math.cos((angle * Math.PI) / 180) * distance;
        y += Math.sin((angle * Math.PI) / 180) * distance;

        setSteps((prev) => [
          ...prev,
          { id: id++, x, y, rot: angle + 90, left, scale },
        ].slice(-25)); // Keep trails moderate length

        left = !left;
      }, pace);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(start);
  }, [delay]);

  return (
    <>
      {steps.map((s) => (
        <Footstep key={s.id} {...s} />
      ))}
    </>
  );
}

function Footstep({ x, y, rot, left, scale }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ duration: 0.8 }}
      style={{
        position: "absolute",
        left: x + (left ? -12 : 12),
        top: y,
        rotate: rot,
        scale: scale
      }}
    >
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 7, ease: "linear" }}
      >
        <FootprintSVG />
      </motion.div>
    </motion.div>
  );
}

function FootprintSVG() {
  return (
    <svg
      width="16"
      height="24"
      viewBox="0 0 40 60"
      fill="#2a1d15" // Matches the font color for a "drawn" look
      className="opacity-60"
    >
      <path d="M20,5 C28,5 35,10 35,20 C35,30 28,38 20,40 C12,38 5,30 5,20 C5,10 12,5 20,5 Z" />
      <path d="M20,45 C25,45 28,48 28,53 C28,58 23,60 20,60 C17,60 12,58 12,53 C12,48 15,45 20,45 Z" />
    </svg>
  );
}