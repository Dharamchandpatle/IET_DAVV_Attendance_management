import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import davvlogo from '../assets/images/davvlogo.png';
import { HeroShape } from '../components/ui/HeroShape';

gsap.registerPlugin(ScrollTrigger);

const features = [
  // {
  //   title: 'Smart Attendance Tracking',
  //   description: 'Automated attendance tracking with real-time updates and analytics dashboards for better insights.'
  // },
  // {
  //   title: 'Seamless Integration',
  //   description: 'Works perfectly with existing academic systems and provides easy export options for reports.'
  // },
  // {
  //   title: 'Mobile Friendly',
  //   description: 'Mark and track attendance from any device with our responsive mobile-first design.'
  // }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const featuresRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header content
      gsap.fromTo(
        headerRef.current,
        { 
          opacity: 0, 
          y: 100 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: "power3.out"
        }
      );

      // Parallax effect for background blobs
      gsap.to('.blob', {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      // Feature cards animation
      gsap.from(featuresRef.current.children, {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top center+=100",
          toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 60,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
      });
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    gsap.to('.hero-content', {
      opacity: 0,
      y: -20,
      duration: 0.5,
      onComplete: () => navigate('/login')
    });
  };

  return (
    <div className="relative min-h-screen font-['Inter']">
      {/* Background wrapper */}
      <div className="absolute inset-0 overflow-hidden">
        <HeroShape />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img 
                src={davvlogo}
                alt="IET DAVV Logo" 
                className="w-12 h-12 object-contain"
              />
              <h1 className="text-2xl font-extrabold heading-gradient">
                IET DAVV AMS
              </h1>
            </div>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="px-6 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors shadow-sm"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/register')}
                className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md"
              >
                Register
              </motion.button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <header ref={headerRef} className="relative pt-32 pb-16">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-content"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold heading-gradient mb-6 leading-tight">
                Smart Attendance
                <br />
                Management System
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12 font-light">
                Streamline your attendance tracking with our modern digital solution. Built specifically for IET DAVV.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <motion.button
                  onClick={handleGetStarted}
                  className="custom-button-primary"
                >
                  Get Started
                </motion.button>
                {/* <button className="custom-button-secondary">
                  Learn More
                </button> */}
              </div>
            </motion.div>
          </div>
          
          <motion.button
            onClick={scrollToFeatures}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ArrowDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </motion.button>
        </header>

        {/* Features Section */}
        <section className="py-20 relative">
          <div ref={featuresRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold mb-4 heading-gradient">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {/* <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 heading-gradient">
              Common Questions
            </h2>
            <FAQ />
          </div>
        </section> */}

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 py-12 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="heading-gradient text-xl font-bold mb-4">IET DAVV</div>
            <p className="text-gray-600 dark:text-gray-400">
              Modern Attendance Management System
            </p>
            <p className="text-sm text-gray-500 mt-4">
              © {new Date().getFullYear()} IET DAVV. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
