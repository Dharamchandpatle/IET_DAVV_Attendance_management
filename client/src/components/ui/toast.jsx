import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

const ToastContext = React.createContext({});

export function Toast({ className, children, onClose, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn(
        "fixed bottom-4 right-4 z-50 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">{children}</div>
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const show = React.useCallback(({ title, description, type = 'default', duration = 3000 }) => {
    const id = Date.now();
    setToasts(current => [...current, { id, title, description, type }]);
    
    // Enhanced toast animations
    gsap.fromTo(
      `.toast-${id}`,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.3 }
    );

    setTimeout(() => {
      gsap.to(`.toast-${id}`, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => {
          setToasts(current => current.filter(toast => toast.id !== id));
        }
      });
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            onClose={() =>
              setToasts((current) =>
                current.filter((t) => t.id !== toast.id)
              )
            }
          >
            <div>
              {toast.title && (
                <div className="font-semibold">{toast.title}</div>
              )}
              {toast.description && (
                <div className="text-sm text-gray-500">{toast.description}</div>
              )}
            </div>
          </Toast>
        ))}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
