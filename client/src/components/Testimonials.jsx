import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    text: "The attendance system has made tracking so much easier. It's a game-changer!",
    author: "Dr. Sharma",
    role: "Professor, CSE Department"
  },
  {
    id: 2,
    text: "Quick, efficient, and user-friendly. Exactly what we needed.",
    author: "Rahul Singh",
    role: "Student, B.Tech CSE"
  },
  // Add more testimonials...
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((current + 1) % testimonials.length);
  };

  const previous = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center"
          >
            <blockquote className="max-w-2xl mx-auto mb-8 text-xl text-gray-600 dark:text-gray-300">
              "{testimonials[current].text}"
            </blockquote>
            <cite className="text-lg font-semibold">{testimonials[current].author}</cite>
            <p className="text-sm text-gray-500">{testimonials[current].role}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <button
        onClick={previous}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
