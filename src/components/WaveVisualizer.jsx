import React from 'react';
import { motion } from 'framer-motion';

const WaveVisualizer = ({ isPlaying = false }) => {
  const wave1Paths = [
    "M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,176C672,181,768,139,864,133.3C960,128,1056,160,1152,154.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
    "M0,192L48,197.3C96,203,192,213,288,213.3C384,213,480,203,576,186.7C672,171,768,149,864,154.7C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
    "M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,176C672,181,768,139,864,133.3C960,128,1056,160,1152,154.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Multiple wave layers */}
      <svg className="absolute bottom-0 left-0 w-full h-64" viewBox="0 0 1440 320" preserveAspectRatio="none">
        {/* Wave 1 */}
        <motion.path
          initial={{ d: wave1Paths[0] }}
          fill="url(#wave-gradient-1)"
          opacity="0.3"
          animate={{
            d: wave1Paths
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Wave 2 */}
        <motion.path
          initial={{ d: "M0,224L48,213.3C96,203,192,181,288,165.3C384,149,480,139,576,154.7C672,171,768,213,864,213.3C960,213,1056,171,1152,144C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" }}
          fill="url(#wave-gradient-2)"
          opacity="0.2"
          animate={{
            d: [
              "M0,224L48,213.3C96,203,192,181,288,165.3C384,149,480,139,576,154.7C672,171,768,213,864,213.3C960,213,1056,171,1152,144C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,256L48,240C96,224,192,192,288,176C384,160,480,160,576,170.7C672,181,768,203,864,213.3C960,224,1056,224,1152,208C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,224L48,213.3C96,203,192,181,288,165.3C384,149,480,139,576,154.7C672,171,768,213,864,213.3C960,213,1056,171,1152,144C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <defs>
          <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </svg>

      {/* Audio bars that react to music */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-0.5 h-40 opacity-20">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-gradient-to-t from-purple-500 via-pink-500 to-orange-500 rounded-t-sm"
              animate={{
                height: [`${Math.random() * 30 + 10}%`, `${Math.random() * 80 + 20}%`, `${Math.random() * 30 + 10}%`],
              }}
              transition={{
                duration: 0.3 + Math.random() * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.01
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WaveVisualizer;
