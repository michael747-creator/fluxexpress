import React from 'react';

const Logo = ({ size = 40, color = "#6366f1", showText = false, textColor = "#ffffff", className = "" }) => {
  return (
    <div className={`logo-wrapper ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))' }}
      >
        {/* Abstract Background Element */}
        <path d="M20 10L80 20L70 90L10 80Z" fill={color} fillOpacity="0.1" />
        
        {/* Main "F" Motion Mark */}
        <path 
          d="M30 25H75V40H45V55H70V70H45V90H30V25Z" 
          fill={color} 
        />
        
        {/* Speed Lines */}
        <path d="M10 35H25" stroke={color} strokeWidth="6" strokeLinecap="round" />
        <path d="M5 50H20" stroke={color} strokeWidth="6" strokeLinecap="round" />
        <path d="M10 65H25" stroke={color} strokeWidth="6" strokeLinecap="round" />
        
        {/* Accents */}
        <circle cx="85" cy="15" r="8" fill={color} />
      </svg>
      
      {showText && (
        <span style={{ 
          fontSize: size * 0.7, 
          fontWeight: 900, 
          color: textColor,
          fontFamily: 'Outfit, sans-serif',
          letterSpacing: '-1px'
        }}>
          Flux<span style={{ color: color }}>Express</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
