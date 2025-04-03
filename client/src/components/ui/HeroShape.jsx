import gsap from "gsap";
import { useEffect, useRef } from "react";

export function HeroShape() {
  const container = useRef(null);

  useEffect(() => {
    const shapes = container.current.children;
    
    gsap.to(shapes, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
      transformOrigin: "center",
      stagger: {
        each: 2,
        from: "random"
      }
    });
  }, []);

  return (
    <div ref={container} className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute -top-1/2 -left-1/2 w-full h-full">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-full blur-3xl animate-blob" />
      </div>
      <div className="absolute -bottom-1/2 -right-1/2 w-full h-full">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>
      <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(99, 102, 241, 0.1)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(99, 102, 241, 0)' }} />
          </linearGradient>
        </defs>
        <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid-gradient)" />
      </svg>
    </div>
  );
}
