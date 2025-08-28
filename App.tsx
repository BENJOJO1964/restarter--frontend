// App.tsx - Restart Voice MVP 入口
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import Home from './pages/Home';
import RestartWall from './pages/RestartWall';
import EchoBox from './pages/EchoBox';
import MyStory from './pages/MyStory';
import ChatCompanion from './pages/ChatCompanion';
import RegisterPage from './pages/RegisterPage';
import FriendMatch from './pages/FriendMatch';
import InboxPage from './pages/InboxPage';
import AIStyleReply from './pages/AIStyleReply';
import RealisticTTS from './pages/RealisticTTS';
import EmotionVisualLab from './pages/EmotionVisualLab';
import Missions from './pages/Missions';
import PairTalk from './pages/PairTalk';
import SkillBox from './pages/SkillBox';
import PairTalkMatch from './pages/PairTalkMatch';
import WhackAMole from './pages/WhackAMole';
import TermsPage from './pages/TermsPage';
import PracticePage from './pages/PracticePage';
import StoryWall from './pages/StoryWall';
import './modern.css';
import app from './src/firebaseConfig';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { VideoReactionProvider } from './components/VideoReactionContext';
import { UserStatusProvider } from './hooks/useUserStatus';
import { MicStatusProvider, useMicStatus } from './components/MicStatusContext';
import WebSocketProvider from './components/WebSocketProvider';
import RestartMissions from './pages/RestartMissions';
import Journal from './pages/Journal';
import ChatRoom from './pages/ChatRoom';
import InvitesPage from './pages/InvitesPage';
import MyLinks from './pages/MyLinks';
import About from './pages/About';
import Feedback from './pages/Feedback';
import AdminFeedback from './pages/AdminFeedback';

import CompleteProfile from './pages/CompleteProfile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DataDeletion from './pages/DataDeletion';
import { LanguageProvider } from './contexts/LanguageContext';
import HelpLab from './pages/HelpLab';
import EmotionRelease from './pages/EmotionRelease';
import SocialIntegration from './pages/SocialIntegration';
import ConfirmRegistration from './pages/ConfirmRegistration';

// 新增法律文件页面导入
import AIStatement from './pages/AIStatement';
import MentalHealthDisclaimer from './pages/MentalHealthDisclaimer';
import CookiePolicy from './pages/CookiePolicy';
import ChildrenPrivacy from './pages/ChildrenPrivacy';
import InternationalUsers from './pages/InternationalUsers';
import SecurityStatement from './pages/SecurityStatement';
import UpdateNotification from './pages/UpdateNotification';

import Plans from './pages/Plans';
import Payment from './pages/Payment';
import Upgrade from './pages/Upgrade';
import Profile from './pages/Profile';
import PaymentInfo from './pages/PaymentInfo';
import Contact from './pages/Contact';
import TokenTest from './pages/TokenTest';
import VideoIntro from './pages/VideoIntro';
import LandingPage from './pages/LandingPage';
import AdLandingPage from './pages/AdLandingPage';
import ScrollTestPage from './pages/ScrollTestPage';

import TestModeButton from './components/TestModeButton';

// 創建測試模式 Context
const TestModeContext = React.createContext<{
  isTestMode: boolean;
  setIsTestMode: (enabled: boolean) => void;
}>({
  isTestMode: false,
  setIsTestMode: () => {}
});

export const useTestMode = () => React.useContext(TestModeContext);

function MicIndicator() {
  const { isMicOn } = useMicStatus();
  if (!isMicOn) return null;

  return (
    <div style={{
        position: 'fixed',
        top: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: '#ff6347', // Orange-Red color
        borderRadius: '50%',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        border: '2px solid white',
    }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/>
        </svg>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTestMode, setIsTestMode] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '2rem' }}>Loading...</div>;
  }

  return (
    <LanguageProvider>
      <MicStatusProvider>
        <WebSocketProvider>
          <VideoReactionProvider>
            <BrowserRouter>
              <TestModeContext.Provider value={{ isTestMode, setIsTestMode }}>
                <TestModeButton onTestModeChange={setIsTestMode} />
                <MicIndicator />
                <UserStatusProvider>
                <Routes>
                  <Route path="/splash" element={<SplashScreen />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/ad" element={<AdLandingPage />} />
                  <Route path="/scroll-test" element={<ScrollTestPage />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/confirm-registration" element={<ConfirmRegistration />} />
                  {user && <Route path="/wall" element={<RestartWall />} />}
                  {user && <Route path="/echo-box" element={<EchoBox />} />}
                  {user && <Route path="/my-story" element={<MyStory />} />}
                  {user && <Route path="/chat" element={<ChatCompanion />} />}
                  {user && <Route path="/friend" element={<FriendMatch />} />}
                  {user && <Route path="/inbox" element={<InboxPage />} />}
                  {user && <Route path="/ai" element={<AIStyleReply />} />}
                  {user && <Route path="/tts" element={<RealisticTTS />} />}
                  {user && <Route path="/journal" element={<Journal />} />}
                  {user && <Route path="/missions" element={<Missions />} />}
                  {user && <Route path="/restart-missions" element={<RestartMissions />} />}
                  {user && <Route path="/pairtalk" element={<PairTalk />} />}
                  {user && <Route path="/skillbox" element={<SkillBox />} />}
                  {user && <Route path="/skillbox/:scenarioId" element={<PracticePage />} />}
                  {user && <Route path="/practice" element={<PracticePage />} />}
                  {user && <Route path="/realistic-tts" element={<RealisticTTS />} />}
                  {user && <Route path="/storywall" element={<StoryWall />} />}
                  {user && <Route path="/chatroom" element={<ChatRoom />} />}
                  {user && <Route path="/invites" element={<InvitesPage />} />}
                  {user && <Route path="/mylinks" element={<MyLinks />} />}
                  <Route path="/about" element={<About />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/admin/feedback" element={<AdminFeedback />} />

                  <Route path="/CompleteProfile" element={<CompleteProfile />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/data-deletion" element={<DataDeletion />} />
                  <Route path="/HelpLab" element={<HelpLab />} />
                  <Route path="/emotion-release" element={<EmotionRelease />} />
                  {user && <Route path="/social-integration" element={<SocialIntegration />} />}
                  
                  {/* 新增法律文件React页面路由 */}
                  <Route path="/ai-statement" element={<AIStatement />} />
                  <Route path="/mental-health-disclaimer" element={<MentalHealthDisclaimer />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  <Route path="/children-privacy" element={<ChildrenPrivacy />} />
                  <Route path="/international-users" element={<InternationalUsers />} />
                  <Route path="/security-statement" element={<SecurityStatement />} />
                  <Route path="/update-notification" element={<UpdateNotification />} />


                  <Route path="/plans" element={<Plans />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/upgrade" element={<Upgrade />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/payment-info" element={<PaymentInfo />} />
                  <Route path="/contact" element={<Contact />} />
                  {/* Token 測試路由 - 僅在開發環境顯示 */}
                  {(import.meta as any).env?.DEV && (
                    <Route path="/token-test" element={<TokenTest />} />
                  )}
                </Routes>
              </UserStatusProvider>
              </TestModeContext.Provider>
            </BrowserRouter>
          </VideoReactionProvider>
        </WebSocketProvider>
      </MicStatusProvider>
    </LanguageProvider>
  );
}

export default App;
