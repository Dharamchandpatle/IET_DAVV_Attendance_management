import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: "How does the attendance system work?",
    answer: "Our system uses digital tracking to mark attendance in real-time. Faculty can mark attendance using their device, and students can view their attendance records instantly."
  },
  {
    question: "Is the system accessible on mobile devices?",
    answer: "Yes, the system is fully responsive and works on all devices including smartphones and tablets."
  },
  // Add more FAQs...
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border rounded-lg overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full p-4 flex justify-between items-center bg-white dark:bg-gray-800"
          >
            <span className="font-medium">{faq.question}</span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-gray-50 dark:bg-gray-900">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
