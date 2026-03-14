"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion, useSpring } from "framer-motion";

export function TextReveal({ text }: { text: string }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.9", "end 0.25"],
  });

  const words = text.split(" ");

  return (
    <div ref={targetRef} className="relative z-10 py-10">
      <div className="flex flex-wrap text-4xl md:text-7xl font-black text-white leading-tight uppercase tracking-tighter">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>;
        })}
      </div>
    </div>
  );
}

function Word({ children, progress, range }: { children: string, progress: any, range: [number, number] }) {
  const characters = children.split("");
  const amount = range[1] - range[0];
  const step = amount / characters.length;

  return (
    <span className="relative mr-4 mb-2">
      {characters.map((char, i) => {
        const start = range[0] + (step * i);
        const end = range[0] + (step * (i + 1));
        return (
          <Character key={i} progress={progress} range={[start, end]}>
            {char}
          </Character>
        );
      })}
    </span>
  );
}

function Character({ children, progress, range }: { children: string, progress: any, range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.1, 1]);
  return (
    <span className="relative">
      <span className="absolute opacity-10">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

export function MagneticButton({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
}
