"use client";

import React from 'react';

export const AuroraBackground = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative min-h-screen overflow-hidden bg-[#0B0B0C] w-full ${className}`}>
      {/* Aurora Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Base aurora layer */}
        <div className="absolute inset-0 opacity-70">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#141416] via-[#6441A5]/30 to-[#0B0B0C]"></div>
        </div>
        
        {/* Animated aurora waves */}
        <div className="absolute inset-0">
          {/* Wave 1: Morado Twitch / Neón */}
          <div 
            className="absolute inset-0 opacity-70"
            style={{
              background: 'radial-gradient(ellipse 800px 600px at 50% 20%, rgba(138, 43, 226, 0.45) 0%, transparent 50%)',
              animation: 'aurora1 8s ease-in-out infinite alternate'
            }}
          ></div>
          
          {/* Wave 2: Morado Obscuro Brand */}
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              background: 'radial-gradient(ellipse 600px 400px at 80% 30%, rgba(100, 65, 165, 0.5) 0%, transparent 50%)',
              animation: 'aurora2 6s ease-in-out infinite alternate-reverse'
            }}
          ></div>
          
          {/* Wave 3: Magenta / Rosa Neón */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              background: 'radial-gradient(ellipse 700px 500px at 20% 60%, rgba(186, 85, 211, 0.35) 0%, transparent 50%)',
              animation: 'aurora3 10s ease-in-out infinite alternate'
            }}
          ></div>
          
          {/* Wave 4: Verde Razer Neón */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse 900px 300px at 60% 80%, rgba(0, 255, 0, 0.25) 0%, transparent 50%)',
              animation: 'aurora4 7s ease-in-out infinite alternate-reverse'
            }}
          ></div>
        </div>
        
        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-[#0B0B0C]/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* CSS Keyframe Animations */}
      <style jsx>{`
        @keyframes aurora1 {
          0% { transform: translateX(-100px) translateY(-50px) rotate(0deg) scale(1); }
          50% { transform: translateX(50px) translateY(30px) rotate(180deg) scale(1.1); }
          100% { transform: translateX(100px) translateY(-30px) rotate(360deg) scale(0.9); }
        }
        
        @keyframes aurora2 {
          0% { transform: translateX(80px) translateY(40px) rotate(45deg) scale(0.8); }
          50% { transform: translateX(-30px) translateY(-20px) rotate(225deg) scale(1.2); }
          100% { transform: translateX(-80px) translateY(60px) rotate(405deg) scale(0.9); }
        }
        
        @keyframes aurora3 {
          0% { transform: translateX(-50px) translateY(20px) rotate(90deg) scale(1.1); }
          50% { transform: translateX(70px) translateY(-40px) rotate(270deg) scale(0.8); }
          100% { transform: translateX(-20px) translateY(50px) rotate(450deg) scale(1.0); }
        }
        
        @keyframes aurora4 {
          0% { transform: translateX(30px) translateY(-20px) rotate(135deg) scale(0.9); }
          50% { transform: translateX(-60px) translateY(10px) rotate(315deg) scale(1.1); }
          100% { transform: translateX(40px) translateY(-60px) rotate(495deg) scale(0.8); }
        }
      `}</style>
    </div>
  );
};

export default AuroraBackground;
