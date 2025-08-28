import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// 互動式問卷調查組件
export const InteractiveSurvey: React.FC = () => {
  const { language } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const questions = {
    'zh-TW': [
      '你最近是否感到被社會標籤所困擾？',
      '你是否害怕重新開始？',
      '你對未來的方向感到迷茫嗎？',
      '你是否需要一個安全的空間來表達自己？',
      '你是否覺得自己配不上美好生活？',
      '你是否感到孤單，即使身邊有人？'
    ],
    'en': [
      'Do you feel troubled by social labels recently?',
      'Are you afraid of starting over?',
      'Do you feel lost about your future direction?',
      'Do you need a safe space to express yourself?',
      'Do you feel like you don\'t deserve a good life?',
      'Do you feel lonely even when surrounded by people?'
    ]
  };

  const questionText = questions[language as keyof typeof questions] || questions['zh-TW'];

  const handleAnswer = (answer: number) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < questionText.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResult = () => {
    const avgAnswer = answers.reduce((a, b) => a + b, 0) / answers.length;
    const totalScore = answers.reduce((a, b) => a + b, 0);
    
    if (avgAnswer >= 4) {
      return {
        title: '你正在尋找改變',
        message: `你的評分：${totalScore}/30 (${Math.round((totalScore/30)*100)}%) - Restarter™ 正是為你而設計的平台`,
        cta: '立即開始你的重啟之旅'
      };
    } else if (avgAnswer >= 3) {
      return {
        title: '你有一些疑慮',
        message: `你的評分：${totalScore}/30 (${Math.round((totalScore/30)*100)}%) - 讓我們一起探索更好的可能性`,
        cta: '了解更多'
      };
    } else {
      return {
        title: '你已經很堅強',
        message: `你的評分：${totalScore}/30 (${Math.round((totalScore/30)*100)}%) - 但每個人都有需要支持的時候`,
        cta: '探索平台'
      };
    }
  };

  if (showResult) {
    const result = getResult();
    return (
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center">
        <h3 className="text-2xl font-bold text-purple-400 mb-4">{result.title}</h3>
        <p className="text-gray-300 mb-6">{result.message}</p>
        <button 
          className="cta-button text-white font-bold py-3 px-8 rounded-full cursor-pointer"
          onClick={() => window.location.href = '/'}
        >
          {result.cta}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-purple-500/50 shadow-2xl animate-pulse">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-purple-400 mb-2">
          🔥 快速評估你的需求
        </h3>
        <p className="text-yellow-300 text-sm mb-4">
          花2分鐘了解Restarter™是否適合你
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / questionText.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-gray-300 text-sm">
          問題 {currentQuestion + 1} / {questionText.length}
        </p>
      </div>
      <p className="text-white text-lg font-medium mb-8 text-center">{questionText[currentQuestion]}</p>
              <div className="flex gap-4 justify-center mb-6">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleAnswer(value)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-xl transition-all duration-300 hover:scale-110 cursor-pointer z-10 relative shadow-lg hover:shadow-xl border-2 border-white/20"
              style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="text-center text-sm text-yellow-300 font-medium">
          1=完全不同意 5=完全同意
        </div>
    </div>
  );
};

// 實時數據展示組件
export const LiveDataDisplay: React.FC = () => {
  const [userCount, setUserCount] = useState(10427);
  const [onlineUsers, setOnlineUsers] = useState(156);

  useEffect(() => {
    // 模擬實時數據更新
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3));
      setOnlineUsers(prev => Math.max(100, Math.min(200, prev + Math.floor(Math.random() * 10) - 5)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 p-6 rounded-2xl border border-green-500/30">
      <h3 className="text-xl font-bold text-green-400 mb-4 text-center">
        實時數據
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400 animate-pulse">
            {userCount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-300">總用戶數</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400 animate-pulse">
            {onlineUsers}
          </div>
          <div className="text-sm text-gray-300">在線用戶</div>
        </div>
      </div>
    </div>
  );
};

// 倒計時緊急感組件
export const UrgencyTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // 1小時

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 p-6 rounded-2xl border border-red-500/30 text-center">
      <h3 className="text-xl font-bold text-red-400 mb-4">
        限時優惠
      </h3>
      <div className="text-4xl font-bold text-red-400 mb-4 font-mono">
        {formatTime(timeLeft)}
      </div>
      <p className="text-gray-300 mb-4">
        前100名註冊用戶享受免費體驗
      </p>
      <div className="text-sm text-red-300">
        剩餘名額: {Math.max(0, 88 - Math.floor((3600 - timeLeft) / 36))} 個
      </div>
    </div>
  );
};

// 視差滾動組件
export const ParallaxSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-96 overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`
        }}
      />
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`
        }}
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            視差滾動效果
          </h2>
          <p className="text-xl text-gray-300">
            增強用戶體驗的互動元素
          </p>
        </div>
      </div>
    </div>
  );
};

// 滑鼠跟隨效果組件
export const MouseFollower: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-50 w-8 h-8 rounded-full bg-purple-500/50 backdrop-blur-sm"
      style={{
        left: mousePosition.x - 16,
        top: mousePosition.y - 16,
        transition: 'all 0.1s ease-out'
      }}
    />
  );
};

// 增強型CTA按鈕組件
export const EnhancedCTA: React.FC<{ 
  text: string; 
  onClick: () => void; 
  variant?: 'primary' | 'secondary' | 'urgent';
  size?: 'small' | 'medium' | 'large';
}> = ({ text, onClick, variant = 'primary', size = 'medium' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const baseClasses = "font-bold rounded-full transition-all duration-300 transform";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white",
    secondary: "bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white",
    urgent: "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white animate-pulse"
  };

  const sizeClasses = {
    small: "py-2 px-6 text-sm",
    medium: "py-3 px-8 text-lg",
    large: "py-4 px-12 text-xl"
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    onClick();
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        isHovered ? 'scale-105 shadow-2xl' : 'scale-100'
      } ${isClicked ? 'scale-95' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

// 用戶見證輪播組件
export const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "「我以為這輩子就這樣了，直到遇見Restarter™」",
      author: "張先生",
      story: "從不敢看人眼睛到自信演講",
      avatar: "👨‍💼"
    },
    {
      quote: "「這裡沒有人會用異樣眼光看你」",
      author: "李女士", 
      story: "重新學會信任與被愛",
      avatar: "👩‍💼"
    },
    {
      quote: "「Restarter™ 給了我重新開始的勇氣」",
      author: "王先生",
      story: "從失業到創業成功",
      avatar: "👨‍💻"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {testimonials.map((testimonial, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <div className="testimonial-card p-8 rounded-2xl text-center">
              <div className="text-4xl mb-4">{testimonial.avatar}</div>
              <blockquote className="text-xl italic mb-4 text-green-300">
                "{testimonial.quote}"
              </blockquote>
              <div className="text-sm text-gray-400">
                <div className="font-bold">{testimonial.author}</div>
                <div>{testimonial.story}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-purple-500' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// 進度條組件
export const ProgressBar: React.FC<{ progress: number; label: string }> = ({ progress, label }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-300 mb-2">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// 統計數據動畫組件
export const AnimatedStats: React.FC = () => {
  const [counts, setCounts] = useState({ users: 0, success: 0, support: 0 });

  useEffect(() => {
    const targets = { users: 10000, success: 95, support: 24 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounts({
        users: Math.floor(targets.users * progress),
        success: Math.floor(targets.success * progress),
        support: Math.floor(targets.support * progress)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="text-center">
        <div className="text-5xl font-bold text-green-400 mb-2">
          {counts.users.toLocaleString()}+
        </div>
        <div className="text-gray-300">重啟成功案例</div>
      </div>
      <div className="text-center">
        <div className="text-5xl font-bold text-blue-400 mb-2">
          {counts.success}%
        </div>
        <div className="text-gray-300">用戶信任度</div>
      </div>
      <div className="text-center">
        <div className="text-5xl font-bold text-purple-400 mb-2">
          {counts.support}/7
        </div>
        <div className="text-gray-300">AI陪伴支持</div>
      </div>
    </div>
  );
};
