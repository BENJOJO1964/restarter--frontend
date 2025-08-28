import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../landing-page.css';

const AdLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStartJourney = () => {
    navigate('/landing');
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden ad-landing-page"
      style={{
        backgroundImage: 'url(/facebook.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/90"></div>
      
      {/* 內容層 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          
          {/* 主標題 */}
          <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-6xl mb-4 leading-tight text-white" style={{textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8)', fontWeight: 'normal'}}>
              "我努力了這麼久,
              <br />
              卻沒人看見."
            </h1>
          </div>

          {/* 安慰語 */}
          <div className={`mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-xl md:text-2xl text-white" style={{textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 15px rgba(0,0,0,0.8)', fontWeight: 'normal'}}>
              你不是沒價值，只是沒被放在對的位置。
            </p>
          </div>

          {/* 解決方案 */}
          <div className={`mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-black/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/50 shadow-2xl">
              <h2 className="text-2xl md:text-3xl mb-4 text-white" style={{textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 15px rgba(0,0,0,0.8)', fontWeight: 'normal'}}>
                Restarter™ 讓你的重啟被看見
              </h2>
              <p className="text-lg md:text-xl text-white" style={{textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 15px rgba(0,0,0,0.8)', fontWeight: 'normal'}}>
                讓你重新被肯定
              </p>
            </div>
          </div>

          {/* CTA按鈕 */}
          <div className={`mb-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button
              onClick={handleStartJourney}
              className="cta-button text-white text-xl font-bold py-4 px-12 rounded-full shadow-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105"
            >
              開始重啟之旅
            </button>
          </div>

          {/* 承諾 */}
          <div className={`transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-lg md:text-xl text-white" style={{textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 15px rgba(0,0,0,0.8)', fontWeight: 'normal'}}>
              3個月後，你會發現，世界對你也不一樣了。
            </p>
          </div>

          {/* 滾動指示器 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default AdLandingPage;
