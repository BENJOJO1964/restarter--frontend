import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(0);
  const [haloSpin, setHaloSpin] = useState(false);
  const [logoAnim, setLogoAnim] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 動畫序列
    const animationSequence = async () => {
      setOpacity(1);
      setHaloSpin(true);
      setLogoAnim(true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // LOGO動畫+光環旋轉 2秒
      await new Promise(resolve => setTimeout(resolve, 500)); // LOGO完整顯示後0.5秒淡出
      setOpacity(0);
      await new Promise(resolve => setTimeout(resolve, 400)); // 淡出動畫
      navigate('/home');
    };
    animationSequence();
  }, [navigate]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, #fff 0%, #e3eafc 70%, #b3c6f7 100%)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: opacity,
          transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
        }}
      >
        {/* LOGO 背後的動態橢圓光環 */}
        <div
          style={{
            position: 'absolute',
            width: 320,
            height: 220,
            borderRadius: '50% / 40%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            pointerEvents: 'none',
            animation: haloSpin ? 'halo-rotate 2.5s linear forwards' : 'none',
            opacity: 0.85,
            background: 'conic-gradient(from 0deg, #fff 0deg, #ffd700 60deg, #b3c6f7 180deg, #fff 300deg, #fff 360deg)',
            filter: 'blur(2px)',
          }}
        />
        {/* LOGO 背後的白色光暈 */}
        <div
          style={{
            position: 'absolute',
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fff 0%, rgba(255,255,255,0.7) 50%, transparent 80%)',
            zIndex: 2,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
        <img
          src="/ctx-logo.png"
          alt="CTX Logo"
          style={{
            width: '200px',
            height: '200px',
            filter: 'drop-shadow(0 8px 32px rgba(40, 40, 40, 0.35)) drop-shadow(0 2px 8px #fff)',
            zIndex: 3,
            animation: logoAnim ? 'logo-scale-rotate 2.5s cubic-bezier(0.4,0,0.2,1) forwards' : 'none',
            transformOrigin: '50% 50%',
            // 靜止狀態與動畫終點一致
            transform: logoAnim ? undefined : 'scale(1) rotate(0deg)',
            opacity: logoAnim ? undefined : 1,
          }}
        />
        <div
          style={{
            marginTop: '20px',
            color: '#232946',
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '0 2px 8px rgba(255,255,255,0.5)',
            zIndex: 3,
          }}
        >
          Restarter™
        </div>
        <div
          style={{
            marginTop: '8px',
            color: '#ffd700',
            fontSize: '16px',
            textAlign: 'center',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 3,
          }}
        >
          重啟人生的平台
        </div>
      </div>
      {/* 動態光環動畫CSS & LOGO自轉動畫 */}
      <style>{`
        @keyframes halo-rotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes logo-scale-rotate {
          0% { transform: scale(0.1) rotate(-180deg); opacity: 0.2; }
          20% { opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen; 