"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, useSpring } from "framer-motion";

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const totalFrames = 240;
  
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const frameIndex = useTransform(smoothScrollProgress, [0, 1], [1, totalFrames]);

  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const preloadImages = () => {
      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        const frameNumber = String(i).padStart(3, '0');
        img.src = `/images/sequance/ezgif-frame-${frameNumber}.jpg`;
        img.onload = () => {
          loadedCount++;
          setLoadingProgress(Math.floor((loadedCount / totalFrames) * 100));
          if (loadedCount === totalFrames) {
            setImages(loadedImages);
          }
        };
        loadedImages[i] = img;
      }
    };
    preloadImages();
  }, []);

  useEffect(() => {
    const render = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      const idx = Math.max(1, Math.min(totalFrames, Math.floor(frameIndex.get())));
      const img = images[idx];

      if (img && img.complete) {
        const dpr = window.devicePixelRatio || 1;
        
        // Logical dimensions
        const logicalWidth = window.innerWidth;
        const logicalHeight = window.innerHeight;

        // Calculate scale to cover (object-fit: cover)
        const scale = Math.max(logicalWidth / img.width, logicalHeight / img.height);
        
        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;
        
        const offsetX = (logicalWidth - drawWidth) / 2;
        const offsetY = (logicalHeight - drawHeight) / 2;

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(
          img, 
          offsetX * dpr, 
          offsetY * dpr, 
          drawWidth * dpr, 
          drawHeight * dpr
        );
      }
    };

    const unsubscribe = frameIndex.on("change", render);
    
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      
      render();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Special trigger for the first frame once images are loaded
    if (images.length > 0) render();

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    };
  }, [images, frameIndex]);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const slogan1Opacity = useTransform(scrollYProgress, [0.25, 0.3, 0.4, 0.45], [0, 1, 1, 0]);
  const slogan1X = useTransform(scrollYProgress, [0.25, 0.3], [-50, 0]);
  const slogan2Opacity = useTransform(scrollYProgress, [0.55, 0.6, 0.7, 0.75], [0, 1, 1, 0]);
  const slogan2X = useTransform(scrollYProgress, [0.55, 0.6], [50, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.9, 1], [0, 1, 1]);
  const ctaScale = useTransform(scrollYProgress, [0.85, 0.9], [0.8, 1]);

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-[#3d1f10]">
      {loadingProgress < 100 && (
         <div className="fixed inset-0 z-[100] bg-oreo-black flex flex-col items-center justify-center">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${loadingProgress}%` }}
               className="h-1 bg-lumer absolute top-0 left-0"
            />
            <div className="text-oreo-white font-display text-4xl font-black mb-4">{loadingProgress}%</div>
            <div className="text-oreo-white/40 text-[10px] font-black uppercase tracking-widest animate-pulse">Sharpening the vision...</div>
         </div>
      )}

      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />
        
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center px-4 md:px-8">
           <motion.div style={{ opacity: heroOpacity }} className="text-center w-full max-w-[320px] md:max-w-none">
              <h1 className="text-4xl sm:text-5xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter uppercase italic break-words mb-2">Sweet<span className="text-lumer">Melt</span></h1>
              <p className="text-white/60 font-bold uppercase tracking-[0.1em] md:tracking-[0.4em] text-[8px] sm:text-[10px] md:text-sm">Authentic Handmade Dessert</p>
           </motion.div>

           <motion.div style={{ opacity: slogan1Opacity, x: slogan1X }} className="absolute left-4 sm:left-6 md:left-24 max-w-[240px] sm:max-w-[280px] md:max-w-md text-left">
              <h2 className="text-2xl sm:text-3xl md:text-6xl font-black text-white leading-tight uppercase italic tracking-tighter">The <span className="text-lumer">Melting</span><br />Point of Bliss.</h2>
           </motion.div>

           <motion.div style={{ opacity: slogan2Opacity, x: slogan2X }} className="absolute right-4 sm:right-6 md:right-24 max-w-[240px] sm:max-w-[280px] md:max-w-md text-right">
              <h2 className="text-2xl sm:text-3xl md:text-6xl font-black text-white leading-tight uppercase italic tracking-tighter">Crafted for <br />The <span className="text-lumer">Extraordinary</span></h2>
           </motion.div>

           <motion.div style={{ opacity: ctaOpacity, scale: ctaScale }} className="text-center pointer-events-auto px-4">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-6 md:mb-8 uppercase italic leading-none tracking-tighter">Ready to melt?</h2>
              <button className="px-8 py-4 md:px-12 md:py-6 bg-white text-slate-950 rounded-full font-black uppercase text-[10px] md:text-sm tracking-widest hover:bg-lumer hover:text-white transition-all shadow-2xl active:scale-95">Order Your Delight</button>
           </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
           <div className="text-white/30 text-[10px] font-black uppercase tracking-widest">Scroll to Explore</div>
           <div className="w-px h-12 bg-white/20 relative overflow-hidden">
              <motion.div animate={{ y: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-full h-1/2 bg-lumer absolute top-0 left-0" />
           </div>
        </div>
      </div>
    </div>
  );
}
