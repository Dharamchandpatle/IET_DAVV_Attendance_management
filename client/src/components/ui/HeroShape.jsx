import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function HeroShape() {
  const container = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the grid pattern
      gsap.to('.bg-grid-pattern', {
        backgroundPosition: '40px 40px',
        duration: 20,
        repeat: -1,
        ease: 'none'
      });

      // Create parallax effect for each blob
      const blobs = container.current.querySelectorAll('.blob');
      blobs.forEach((blob, index) => {
        // Random starting positions
        gsap.set(blob, {
          x: `random(-20, 20)`,
          y: `random(-20, 20)`,
          rotation: `random(-180, 180)`
        });

        // Create floating animation
        gsap.to(blob, {
          x: 'random(-50, 50)',
          y: 'random(-50, 50)',
          rotation: 'random(-360, 360)',
          duration: 'random(15, 25)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });

        // Add scroll-based parallax
        gsap.to(blob, {
          y: (index + 1) * -100,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
            invalidateOnRefresh: true
          }
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="absolute inset-0 overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
      
      {/* Animated gradient blobs */}
      <div className="absolute inset-0">
        {/* Primary blob */}
        <div className="blob absolute top-[10%] left-[20%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] animate-parallax">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-blob" />
        </div>
        
        {/* Secondary blob */}
        <div className="blob absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] animate-parallax animation-delay-2000">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>
        
        {/* Tertiary blob */}
        <div className="blob absolute top-[40%] right-[30%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] animate-parallax animation-delay-4000">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>
    </div>
  );
}
