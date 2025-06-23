import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  const cometRef = useRef(null);

  // Animation trigger effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Comet animation effect
  useEffect(() => {
    const comet = cometRef.current;
    if (!comet) return;

    let animationFrame;
    let startTime = null;
    const duration = 8000; // 8 seconds for one full cycle
    const path = {
      start: { x: -100, y: 20 },
      end: { x: window.innerWidth + 100, y: window.innerHeight - 50 }
    };

    const animateComet = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) % duration;
      const t = progress / duration;

      // Calculate current position along the path
      const currentX = path.start.x + (path.end.x - path.start.x) * t;
      const currentY = path.start.y + (path.end.y - path.start.y) * t;

      // Update comet position
      comet.style.transform = `translate(${currentX}px, ${currentY}px)`;
      
      // Adjust opacity for entrance/exit effect
      if (t < 0.1) {
        comet.style.opacity = t * 10;
      } else if (t > 0.9) {
        comet.style.opacity = (1 - t) * 10;
      } else {
        comet.style.opacity = 1;
      }

      animationFrame = requestAnimationFrame(animateComet);
    };

    animationFrame = requestAnimationFrame(animateComet);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 overflow-hidden relative">
      {/* Comet element */}
      {/* <div 
        ref={cometRef}
        className="absolute w-24 h-1 rotate-45 bg-gradient-to-r from-transparent via-white to-transparent rounded-full shadow-[0_0_8px_2px_#a855f7] opacity-0 pointer-events-none"
        style={{
          filter: 'blur(1px)',
         
        }}
      >
        <div className="absolute right-0 top-1/2 w-2 h-2 bg-white rounded-full transform -translate-y-1/2 shadow-[0_0_8px_4px_#a855f7]"></div>
         <div className="absolute right-0 top-1/3 w-2 h-2 bg-white rounded-full transform -translate-y-1/2 shadow-[0_0_8px_4px_#a855f7]"></div>
        
      </div> */}
      

      {/* Floating stars */}
      {[...Array(30)].map((_, i) => (
        <div 
          key={i}
          className="absolute bg-white rounded-full pointer-events-none"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.8 + 0.2,
            animation: `twinkle ${Math.random() * 5 + 3}s infinite`
          }}
        />
      ))}

      <nav className="bg-black bg-opacity-30 backdrop-blur-md shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-white transform transition-transform duration-500 hover:scale-105">
                  Mr. Signify
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                >
                  Go to Dashboard
                </button>
              ) : (
                <div className="space-x-4">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/50"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className={`text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl transition-all duration-1000 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="block">Sign Your PDF Documents</span>
            <span className="block text-purple-400 animate-pulse">Securely and Easily</span>
          </h1>
          <p className={`mt-3 max-w-md mx-auto text-base text-purple-200 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl transition-all duration-1000 delay-200 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Upload your PDF, add your signature, and download the signed document - all in one place.
          </p>
          <div className={`mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 transition-all duration-1000 delay-500 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="rounded-md shadow-lg shadow-purple-500/30">
              <button
                onClick={() => navigate(user ? '/dashboard' : '/register')}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

       
      </main>

      {/* Add custom animations to styles */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes cometGlow {
          0%, 100% { box-shadow: 0 0 8px 2px #a855f7; }
          50% { box-shadow: 0 0 16px 4px #a855f7; }
        }
      `}</style>
    </div>
  );
}