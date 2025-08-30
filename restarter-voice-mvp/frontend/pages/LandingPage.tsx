import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollToTopButton from '../components/ScrollToTopButton';
import '../landing-page.css';
import {
  InteractiveSurvey,
  LiveDataDisplay,
  UrgencyTimer,
  ParallaxSection,
  MouseFollower,
  EnhancedCTA,
  TestimonialCarousel,
  AnimatedStats
} from '../components/LandingPageOptimizations';


const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 生活化、貼近真實感情的文案
  const PSYCHOLOGICAL_TRIGGERS = {
    'zh-TW': {
      hero: {
        mainHeadline: '你以為的終點，其實是新的起點',
        subHeadline: 'Restarter™ - 沒有高冷深奧，只有最真實的陪伴',
        cta: '開始你的重啟之旅',
        fearTrigger: '地球無時的轉動，分秒漸漸地流失。',
        hopeTrigger: '在這裡，每個人都值得被溫柔對待',
        hopeSubTrigger: '3個月後，你將擁有全新的人生'
      },
      painPoints: [
        {
          title: '覺得自己很糟糕',
          description: '總覺得做什麼都不對，配不上美好生活',
          icon: '😔'
        },
        {
          title: '害怕再次受傷',
          description: '不想再經歷失敗，寧願一個人躲著',
          icon: '💔'
        },
        {
          title: '不知道該怎麼辦',
          description: '想改變但不知道從哪裡開始',
          icon: '🤷‍♂️'
        },
        {
          title: '覺得很孤單',
          description: '身邊有人但心裡還是很寂寞',
          icon: '😢'
        }
      ],
      socialProof: {
        title: '很多人都和你一樣',
        stats: [
          { number: '10,000+', label: '找到新方向的人' },
          { number: '95%', label: '說這裡很溫暖' },
          { number: '24/7', label: '隨時有人陪你聊天' }
        ]
      },
      features: [
        {
          title: '心情垃圾桶',
          description: '想罵就罵，想哭就哭，沒人會笑你',
          benefit: '說出來真的會好很多',
          icon: '🗑️'
        },
        {
          title: '虛擬朋友',
          description: '19個不同性格的朋友陪你聊天',
          benefit: '想聊什麼就聊什麼，不會尷尬',
          icon: '👥'
        },
        {
          title: '重新交朋友',
          description: '從簡單的問候開始，慢慢建立信任',
          benefit: '學會重新相信別人，也相信自己',
          icon: '🤝'
        },
        {
          title: '練習說話',
          description: '在安全環境練習各種對話情境',
          benefit: '下次遇到類似情況就不會緊張了',
          icon: '💬'
        }
      ],
      urgency: {
        title: '改變不需要等到明天',
        subtitle: '今天的一小步，就是明天的一大步',
        cta: '現在就開始改變'
      },
      testimonials: [
        {
          quote: '「我以為這輩子就這樣了，直到遇見Restarter™」',
          author: '張先生，使用2年',
          story: '從不敢看人眼睛到敢上台說話'
        },
        {
          quote: '「這裡沒有人會用異樣眼光看你」',
          author: '李女士，使用1年',
          story: '重新學會相信別人，也相信自己'
        }
      ]
    },
    'en': {
      hero: {
        mainHeadline: 'What you think is the end, is actually a new beginning',
        subHeadline: 'Restarter™ - Redefining life for those forgotten by the world',
        cta: 'Start Your Restart Journey',
        fearTrigger: 'Afraid of labels? Fear of starting over?',
        hopeTrigger: 'Here, every broken piece is the start of something new'
      },
      painPoints: [
        {
          title: 'The Shackles of Social Labels',
          description: 'Feeling defined, discriminated, forgotten',
          icon: '🏷️'
        },
        {
          title: 'Fear of Starting Over',
          description: 'Afraid of failure, rejection, loneliness',
          icon: '😰'
        },
        {
          title: 'Loss of Trust',
          description: 'Not knowing who to trust, including yourself',
          icon: '🤝'
        },
        {
          title: 'Direction Lost',
          description: 'Not knowing where to go next',
          icon: '🧭'
        }
      ],
      socialProof: {
        title: 'You Are Not Alone',
        stats: [
          { number: '10,000+', label: 'Successful Restarts' },
          { number: '95%', label: 'User Trust Rate' },
          { number: '24/7', label: 'AI Companion Support' }
        ]
      },
      features: [
        {
          title: 'Emotional Release Lab',
          description: 'Safely release inner anger and pain',
          benefit: 'No more suppression, learn healthy expression',
          icon: '💥'
        },
        {
          title: 'AI Soul Companion',
          description: '19 different virtual personalities to talk with',
          benefit: 'Always someone to listen, never alone',
          icon: '🤖'
        },
        {
          title: 'Social Rebuilding System',
          description: 'Build new social circles from scratch',
          benefit: 'Relearn trust and being trusted',
          icon: '👥'
        },
        {
          title: 'Skill Reshaping Workshop',
          description: 'Scenario simulation for real social skills',
          benefit: 'Confidently face interpersonal challenges',
          icon: '🎯'
        }
      ],
      urgency: {
        title: 'Time won\'t wait for you to be ready',
        subtitle: 'Every moment of hesitation is a lost opportunity',
        cta: 'Start Your Restart Now'
      },
      testimonials: [
        {
          quote: '"I thought my life was over, until I met Restarter™"',
          author: 'Mr. Zhang, Restarted 2 years ago',
          story: 'From avoiding eye contact to confident public speaking'
        },
        {
          quote: '"No one here will look at you with judgment"',
          author: 'Ms. Li, Restarted 1 year ago',
          story: 'Relearned trust and being loved'
        }
      ]
    }
  };

  const content = PSYCHOLOGICAL_TRIGGERS[language as keyof typeof PSYCHOLOGICAL_TRIGGERS] || PSYCHOLOGICAL_TRIGGERS['zh-TW'];

  // 滾動處理函數
  const handleScroll = useCallback(() => {
    console.log('scroll triggered'); // 日誌驗證
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    
    // 當滾動超過100px時顯示回到頂部按鈕
    const shouldShow = currentScrollY > 100;
    setShowScrollTop(shouldShow);
    console.log('滾動位置:', currentScrollY, '顯示箭頭:', shouldShow, '閾值: 100');
  }, []);

  // 回到頂部函數
  const scrollToTop = useCallback(() => {
    console.log('回到頂部按鈕被點擊');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    setIsVisible(true);
    
    // 綁定滾動事件監聽器
    window.addEventListener('scroll', handleScroll, { passive: true });
    console.log('綁定滾動事件到 window');
    
    // 立即檢查初始滾動位置
    handleScroll();
    
    // 清理函數
    return () => {
      window.removeEventListener('scroll', handleScroll);
      console.log('移除 window 滾動事件監聽器');
    };
  }, [handleScroll]);

  const handleStartJourney = () => {
    navigate('/');
  };

  const handleSurveyCTA = () => {
    navigate('/');
  };

  const handleImmediateStart = () => {
    navigate('/');
  };

  const handleLearnMore = () => {
    navigate('/about');
  };

  return (
    <div className="min-h-screen landing-bg text-white overflow-hidden">
      {/* 滑鼠跟隨效果 */}
      <MouseFollower />
      
      {/* 背景動畫效果 */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-ping"></div>
      </div>

      {/* Hero Section - 心理觸發點 */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center z-10">
          {/* 恐懼觸發 */}
          <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-red-400 text-lg font-medium mb-4 fear-trigger">
              {content.hero.fearTrigger}
            </p>
            <p className="text-red-300 text-base font-medium fear-sub-trigger">
              {content.hero.fearSubTrigger}
            </p>
          </div>

          {/* 主標題 - 希望觸發 */}
          <h1 className={`text-6xl md:text-8xl font-black mb-8 hero-title transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {content.hero.mainHeadline}
          </h1>

          {/* 副標題 */}
          <p className={`text-xl md:text-2xl text-gray-300 mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {content.hero.subHeadline}
          </p>

          {/* 希望觸發 */}
          <div className={`mb-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-green-400 text-lg font-medium hope-trigger">
              {content.hero.hopeTrigger}
            </p>
            <p className="text-green-300 text-base font-medium hope-sub-trigger">
              {content.hero.hopeSubTrigger}
            </p>
          </div>

          {/* CTA按鈕 - 緊急感 */}
          <button
            onClick={handleStartJourney}
            className={`cta-button text-white text-xl font-bold py-4 px-12 rounded-full shadow-2xl transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {content.hero.cta}
          </button>
        </div>

        {/* 滾動指示器 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 scroll-indicator">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* 痛點分析 Section - 共鳴觸發 */}
      <section className="py-20 px-4 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              我們理解你的痛苦
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.painPoints.map((point, index) => (
              <div
                key={index}
                className={`psychology-card p-8 rounded-2xl transition-all duration-1000`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl mb-4">{point.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-red-400">{point.title}</h3>
                <p className="text-gray-300">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 社會證明 Section - 從眾心理 */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              {content.socialProof.title}
            </span>
          </h2>
          
          {/* 動畫統計數據 */}
          <div className="mb-16">
            <AnimatedStats />
          </div>

          {/* 實時數據展示 */}
          <div className="mb-16">
            <LiveDataDisplay />
          </div>

          {/* 用戶見證輪播 */}
          <div className="mb-16">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      {/* 功能特色 Section - 解決方案 */}
      <section className="py-20 px-4 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              你的重啟工具包
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {content.features.map((feature, index) => (
              <div
                key={index}
                className="feature-card p-8 rounded-2xl"
              >
                <div className="text-4xl mb-4 feature-icon">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-purple-400">{feature.title}</h3>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                <div className="text-green-400 font-medium">{feature.benefit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 緊急感 Section - 稀缺性原理 */}
      <section className="py-20 px-4 urgency-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-red-400">
            {content.urgency.title}
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            {content.urgency.subtitle}
          </p>
          
          {/* 倒計時緊急感 */}
          <div className="mb-12">
            <UrgencyTimer />
          </div>
          
          <EnhancedCTA
            text={content.urgency.cta}
            onClick={handleStartJourney}
            variant="urgent"
            size="large"
          />
        </div>
      </section>

      {/* 創辦人故事 Section - 權威性 */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              創辦人的故事
            </span>
          </h2>
          <div className="founder-story p-8 rounded-2xl text-left">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              我曾經失去自由十年。那不是旅行、不是修行，而是被法律與命運關進去的十年。
              在一間不大的房間裡，和一群同樣頂著光頭、穿著另類制服的人擠在一起，日子一開始像是一場長夢，到了後來，連夢都不做了。
            </p>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              出去那天，天空灰得刺眼。我笑著走出來，但心裡卻是空的。社會沒有在等你，家人不知如何面對你，朋友的問候也帶著距離。
              起初的很多時候，我甚至不敢正眼看便利商店的收銀員，因為我忘了怎麼當一個「普通人」。
            </p>
            <p className="text-xl text-purple-400 font-bold">
              「我們不是修復你，我們是來陪你重啟。」
            </p>
            <div className="text-right mt-6 text-gray-400">
              — Ben，Restarter™ 創辦人
            </div>
          </div>
        </div>
      </section>

      {/* 互動式問卷調查 Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              快速評估你的需求
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            花2分鐘了解Restarter™是否適合你
          </p>
          
          <div className="max-w-2xl mx-auto">
            <InteractiveSurvey />
          </div>
        </div>
      </section>

      {/* 視差滾動效果 Section */}
      <ParallaxSection />

      {/* 最終CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              準備好重啟了嗎？
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            加入10,000+重啟成功者的行列
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnhancedCTA
              text="立即開始"
              onClick={handleImmediateStart}
              variant="primary"
              size="large"
            />
            <EnhancedCTA
              text="了解更多"
              onClick={handleLearnMore}
              variant="secondary"
              size="large"
            />
          </div>
        </div>
      </section>

      {/* 回到頂部按鈕 */}
      <ScrollToTopButton 
        show={showScrollTop}
        onClick={scrollToTop}
        size="large"
        position="bottom-right"
      />
    </div>
  );
};

export default LandingPage;
