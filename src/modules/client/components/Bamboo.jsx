import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// =======================
// CÁC COMPONENT TRANG TRÍ (Background & Effects)
// =======================

const Sun = () => (
  <div className="absolute top-10 right-10 pointer-events-none">
    <div className="w-32 h-32 bg-yellow-300/40 rounded-full blur-[80px] absolute top-0 right-0 z-0"></div>
    <motion.div 
      animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-400 rounded-full shadow-[0_0_40px_rgba(251,191,36,0.6)] relative z-10 border-4 border-white/30"
    />
  </div>
);

const Cloud = ({ top, left, scale = 1, duration = 60, delay = 0 }) => (
  <motion.div
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: [0, 100, 0], opacity: 1 }}
    transition={{ repeat: Infinity, duration: duration, ease: "linear", delay: delay }}
    className="absolute z-0 opacity-60 blur-[1px]"
    style={{ top, left, transform: `scale(${scale})` }}
  >
    <div className="relative">
      <div className="w-32 h-12 bg-white/70 rounded-full"></div>
      <div className="absolute -top-6 left-6 w-16 h-16 bg-white/80 rounded-full"></div>
      <div className="absolute -top-4 right-6 w-14 h-14 bg-white/70 rounded-full"></div>
    </div>
  </motion.div>
);

// Hàm random helper
const randomInRange = (min, max) => Math.random() * (max - min) + min;

const Firefly = ({ delay }) => {
  // Fix impure render: Sử dụng useState lazy init để chỉ random 1 lần khi mount
  const [randomValues] = useState(() => ({
    left: randomInRange(10, 90),
    duration: randomInRange(4, 7),
    xRange: randomInRange(-40, 40)
  }));

  const style = useMemo(() => ({
    left: `${randomValues.left}%`, 
    bottom: "15%" 
  }), [randomValues.left]);
  
  const transition = useMemo(() => ({
    duration: randomValues.duration, 
    repeat: Infinity, 
    delay: delay, 
    ease: "easeInOut" 
  }), [delay, randomValues.duration]);

  const animate = useMemo(() => ({
    opacity: [0, 1, 0], 
    y: [0, -150], 
    x: [0, randomValues.xRange] 
  }), [randomValues.xRange]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={animate}
      transition={transition}
      className="absolute w-2 h-2 bg-lime-300 rounded-full blur-[2px] shadow-[0_0_15px_rgba(163,230,53,1)]"
      style={style}
    />
  );
};

// =======================
// CÁC BỘ PHẬN TRE (3D & Animation)
// =======================

const BambooLeaf = ({ side = "left", delay = 0 }) => {
  const isLeft = side === "left";
  return (
    <motion.div
      initial={{ scale: 0, rotate: isLeft ? -60 : 60 }}
      animate={{ scale: 1, rotate: isLeft ? -30 : 30 }}
      transition={{ delay, duration: 0.8, type: "spring", bounce: 0.5 }}
      className="absolute z-0"
      style={{
        [isLeft ? "left" : "right"]: "-45px",
        top: "20px",
        width: "70px", height: "70px",
        background: `linear-gradient(${isLeft ? '145deg' : '-145deg'}, #86efac 0%, #22c55e 40%, #166534 100%)`,
        borderRadius: isLeft ? "0 100% 5% 100%" : "100% 0 100% 5%",
        transformOrigin: isLeft ? "100% 100%" : "0% 100%",
        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))"
      }}
    >
      <div className={`absolute bottom-0 w-[140%] h-[1px] bg-[#14532d]/40 ${isLeft ? 'origin-bottom-right rotate-[-40deg] right-0' : 'origin-bottom-left rotate-[40deg] left-0'}`}></div>
    </motion.div>
  );
};

const BambooNode = ({ index }) => {
  const hasLeaf = index % 2 !== 0; 
  const isLeft = hasLeaf ? ((index - 1) / 2) % 2 === 0 : false;

  return (
    <motion.div
      layout
      initial={{ scaleY: 0.5, opacity: 0, y: 100 }}
      animate={{ scaleY: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 15, mass: 1.2 }}
      className="relative flex justify-center items-center flex-shrink-0 group"
      style={{
        width: "85px", height: "90px", marginBottom: "-8px",
        background: `
          linear-gradient(90deg, 
            #052e16 0%, 
            #14532d 15%, 
            #22c55e 40%, 
            #4ade80 60%, 
            #15803d 85%, 
            #022c22 100%
          )
        `,
        borderRadius: "8px",
        boxShadow: "inset 0 -4px 8px rgba(0,0,0,0.3), 4px 0 15px rgba(0,0,0,0.2)",
        zIndex: 100 - index 
      }}
    >
      <div className="absolute bottom-0 w-full h-[10px] bg-[#064e3b]/50 rounded-full blur-[1px] translate-y-[3px] shadow-sm"></div>
      <div className="absolute top-0 w-full h-[5px] bg-[#dcfce7]/40 rounded-full blur-[1px] translate-y-[1px] mix-blend-overlay"></div>
      <div className="absolute left-5 top-2 w-3 h-[85%] bg-white/20 rounded-full blur-[3px] group-hover:bg-white/30 transition-colors" />

      {hasLeaf && <BambooLeaf side={isLeft ? "left" : "right"} delay={0.2} />}
    </motion.div>
  );
};

const BrokenBambooNode = ({ index, totalFalling }) => {
    // Fix impure render: Sử dụng useState lazy init
    const [randomConfig] = useState(() => ({
        rotate: Math.random() * 180 - 90,
        x: Math.random() * 100 - 50
    }));
    
    const delay = (totalFalling - 1 - index) * 0.1;

    return (
      <motion.div
        initial={{ y: 0, rotate: 0, opacity: 1 }}
        animate={{ 
            y: [0, 600, 580, 600], // Rơi xuống
            x: [0, randomConfig.x], // Bay sang hai bên
            rotate: [0, randomConfig.rotate + 360], // Xoay vòng
            opacity: [1, 1, 0.8, 0], // Mờ dần
            scale: [1, 1, 0.9, 0.8] // Thu nhỏ lại
        }}
        transition={{ 
            y: { duration: 1.5, ease: "easeIn", times: [0, 0.7, 0.85, 1] },
            x: { duration: 1.5, ease: "easeOut" },
            rotate: { duration: 1.5, ease: "easeIn" },
            opacity: { duration: 10, times: [0, 0.2, 0.8, 1], ease: "linear" }, 
            scale: { duration: 10 },
            delay: delay 
        }}
        className="relative flex justify-center items-center flex-shrink-0 pointer-events-none"
        style={{
          width: "85px", height: "90px", marginBottom: "-8px",
          background: `linear-gradient(90deg, #052e16 0%, #14532d 20%, #166534 50%, #15803d 80%, #022c22 100%)`,
          borderRadius: "8px",
          boxShadow: "inset 0 -4px 8px rgba(0,0,0,0.5)",
          zIndex: 200 - index,
          filter: "grayscale(30%) contrast(120%)"
        }}
      >
         <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black/40 rotate-12 blur-[1px]"></div>
      </motion.div>
    );
};

const BambooShoot = () => (
  <motion.div
    initial={{ scale: 0, y: 50 }} animate={{ scale: 1, y: 5 }}
    exit={{ scale: 0, y: 20, opacity: 0, transition: { duration: 0.3 } }}
    transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
    className="relative z-50 flex-shrink-0 mb-[-15px]" 
    style={{ width: '140px', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.5))" }}
  >
    <div className="absolute bottom-0 w-[110px] h-[70px] bg-gradient-to-t from-[#052e16] to-[#14532d] rounded-t-full clip-path-shoot z-10" style={{clipPath: 'ellipse(45% 100% at 50% 100%)'}}></div>
    <div className="absolute bottom-0 w-[90px] h-[95px] bg-gradient-to-t from-[#14532d] to-[#22c55e] rounded-t-full z-20" style={{clipPath: 'ellipse(45% 100% at 50% 100%)'}}></div>
    <div className="absolute bottom-0 w-[50px] h-[110px] bg-gradient-to-t from-[#22c55e] to-[#86efac] rounded-t-full z-30" style={{clipPath: 'ellipse(45% 100% at 50% 100%)'}}>
        <div className="absolute top-4 left-2 w-3 h-20 bg-white/30 rounded-full blur-[2px]" />
    </div>
  </motion.div>
);

// =======================
// MAIN BAMBOO COMPONENT
// =======================
const Bamboo = ({ knots = 0, prevKnots = 0, totalQuestions = 20 }) => {
  const containerRef = useRef(null);
  const bambooRef = useRef(null);
  const [yOffset, setYOffset] = useState(0);
  const [fallingNodes, setFallingNodes] = useState([]);

  useEffect(() => {
    // Logic phát hiện gãy và kích hoạt hiệu ứng rơi
    if (knots === 0 && prevKnots > 0) {
      const startFallTimer = setTimeout(() => {
          const nodesToFall = Array.from({ length: prevKnots }, (_, i) => i);
          setFallingNodes(nodesToFall);
      }, 0);

      const cleanupTimer = setTimeout(() => {
          setFallingNodes([]);
      }, 10000);

      return () => {
          clearTimeout(startFallTimer);
          clearTimeout(cleanupTimer);
      };
    } else if (knots > 0 && fallingNodes.length > 0) {
      // FIX 1: Sử dụng setTimeout để tránh cập nhật state đồng bộ trong effect
      // Điều này cho phép React hoàn thành chu kỳ render hiện tại trước
      const timer = setTimeout(() => {
         setFallingNodes([]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [knots, prevKnots, fallingNodes.length]);

  useEffect(() => {
    if (containerRef.current && bambooRef.current) {
      const containerHeight = containerRef.current.offsetHeight;
      const bambooHeight = bambooRef.current.scrollHeight;
      const threshold = containerHeight * 0.5; 
      
      let newOffset = 0;

      // FIX 2: Tính toán offset trước, sau đó so sánh để tránh update dư thừa
      if (knots < 3) {
         newOffset = 0;
      } else if (bambooHeight > threshold) {
         newOffset = bambooHeight - threshold;
      } else {
         newOffset = 0;
      }

      // Chỉ gọi setState khi giá trị thực sự thay đổi
      setYOffset(prev => {
          if (prev !== newOffset) return newOffset;
          return prev;
      });
    }
  }, [knots, fallingNodes.length]);

  // FIX 3: Điều kiện render chặt chẽ hơn. 
  const showFalling = fallingNodes.length > 0 && knots === 0;

  const progressPercent = Math.min((knots / totalQuestions) * 100, 100);

  return (
    <div className="relative w-full h-full overflow-hidden font-sans select-none bg-gradient-to-b from-cyan-200 via-blue-100 to-emerald-100">
      <Sun />
      <Cloud top="10%" left="5%" scale={1.5} duration={80} />
      <Cloud top="25%" left="60%" scale={0.9} duration={90} delay={20} />
      
      <div className="absolute bottom-[100px] w-full flex items-end justify-center z-0 opacity-40 blur-[2px]">
          <div className="w-[150%] h-64 bg-[#047857] rounded-[100%] translate-y-32 scale-x-125"></div>
      </div>

      {knots > 0 && Array.from({ length: Math.min(knots, 10) }).map((_, i) => <Firefly key={i} delay={i * 0.3} />)}

      <div className="absolute top-0 left-0 w-full p-6 z-50 flex flex-col gap-4 pointer-events-none">
        <div className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-5 shadow-lg text-[#064e3b] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 animate-gradient-xy"></div>
          <div className="flex justify-between items-end mb-3 relative z-10">
              <div>
                  <h3 className="font-black text-xl tracking-tight">LEVEL {Math.floor(knots / 5) + 1}</h3>
                  <p className="text-sm font-bold opacity-80">Hành trình tri thức</p>
              </div>
              <p className="text-2xl font-black"><span className="text-emerald-600">{knots}</span><span className="text-sm opacity-60 mx-1">/</span><span className="text-lg opacity-80">{totalQuestions}</span> Đốt</p>
          </div>
          <div className="w-full h-4 bg-black/10 rounded-full overflow-hidden relative z-10 p-[2px]">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${progressPercent}%` }} 
              transition={{ type: "spring", stiffness: 50 }}
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-[0_0_15px_#34d399] relative overflow-hidden"
            >
                <div className="absolute inset-0 w-full h-full bg-white/30 animate-shimmer-fast"></div>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
            {knots > 1 && (
            <motion.div 
                key={knots}
                initial={{ scale: 0, rotate: -30, y: 20 }}
                animate={{ scale: 1, rotate: -10, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                className="self-start bg-gradient-to-r from-amber-300 to-orange-500 rounded-2xl py-2 px-4 shadow-xl border-2 border-white/60 flex items-center gap-2 rotate-[-10deg]"
            >
                <span className="text-2xl">🔥</span>
                <span className="font-black text-2xl text-white drop-shadow-sm tracking-wider">COMBO x{knots}!</span>
            </motion.div>
            )}
        </AnimatePresence>
      </div>

      <div ref={containerRef} className="absolute inset-0 flex flex-col items-center justify-end z-20 pb-[110px]">
        <motion.div
          animate={{ y: yOffset }}
          transition={{ type: "spring", stiffness: 30, damping: 20 }}
          className="relative w-full flex flex-col items-center justify-end"
        >
          <div ref={bambooRef} className="flex flex-col-reverse items-center z-30 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] w-full">
            <AnimatePresence>
              {showFalling ? (
                  <motion.div 
                    key="falling-group" 
                    className="flex flex-col-reverse items-center w-full"
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  >
                    {fallingNodes.map((nodeIndex) => (
                        <BrokenBambooNode key={`broken-${nodeIndex}`} index={nodeIndex} totalFalling={fallingNodes.length} />
                    ))}
                  </motion.div>
              ) : knots === 0 ? (
                  <motion.div key="shoot-group" className="flex flex-col-reverse items-center w-full">
                    <BambooShoot />
                  </motion.div>
              ) : (
                  <motion.div key="growing-group" className="flex flex-col-reverse items-center w-full">
                    {Array.from({ length: knots }).map((_, index) => (
                      <BambooNode key={`node-${index}`} index={index} />
                    ))}
                  </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-[-135px] w-[150%] h-[160px] z-[40]">
              <div className="absolute bottom-0 w-full h-full bg-gradient-to-b from-[#166534] via-[#15803d] to-[#052e16] rounded-[50%_50%_0_0] shadow-[0_-10px_20px_rgba(0,0,0,0.3)] border-t-[4px] border-[#22c55e]/50"></div>
              <div className="absolute top-[-10px] left-[35%] w-10 h-16 bg-[#166534] rounded-full -rotate-12 opacity-80"></div>
              <div className="absolute top-[5px] right-[40%] w-14 h-8 bg-[#064e3b] rounded-full opacity-60"></div>
              <div className="absolute top-[-25px] left-[48%] w-4 h-10 bg-[#4ade80] rounded-full origin-bottom -rotate-[20deg] border border-[#14532d]"></div>
              <div className="absolute top-[-30px] left-[52%] w-5 h-12 bg-[#22c55e] rounded-full origin-bottom rotate-[15deg] border border-[#14532d]"></div>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.2)_0%,rgba(0,100,50,0.1)_50%,rgba(0,0,0,0.3)_100%)] z-50 mix-blend-overlay"></div>
    </div>
  );
};

export default Bamboo;