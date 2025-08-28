import React, { useState } from 'react';
import { useVAD } from '../hooks/useVAD';
import { usePermission } from '../hooks/usePermission';
import { useLanguage } from '../contexts/LanguageContext';
import { TokenRenewalModal } from './TokenRenewalModal';
import { useTestMode } from '../App';

const AUDIO_TEXT = {
  'zh-TW': { start: '開始說話', stop: '停止', noPermission: '需要訂閱才能使用語音功能' },
  'zh-CN': { start: '开始说话', stop: '停止', noPermission: '需要订阅才能使用语音功能' },
  'en': { start: 'Start talking', stop: 'Stop', noPermission: 'Subscription required for voice features' },
  'ja': { start: '話し始める', stop: '停止', noPermission: '音声機能にはサブスクリプションが必要です' },
  'ko': { start: '말하기 시작', stop: '정지', noPermission: '음성 기능을 사용하려면 구독이 필요합니다' },
  'th': { start: 'เริ่มพูด', stop: 'หยุด', noPermission: 'ต้องสมัครสมาชิกเพื่อใช้ฟีเจอร์เสียง' },
  'vi': { start: 'Bắt đầu nói', stop: 'Dừng lại', noPermission: 'Cần đăng ký để sử dụng tính năng giọng nói' },
  'ms': { start: 'Mula bercakap', stop: 'Berhenti', noPermission: 'Langganan diperlukan untuk ciri suara' },
  'la': { start: 'Incipe loqui', stop: 'Desine', noPermission: 'Subscriptio requiritur pro vocis functionibus' },
};

export default function AudioRecorder({ onAudio, lang: propLang }: { onAudio: (audio: Blob) => void, lang?: string }) {
  const { isListening, startListening, stopListening } = useVAD({
    onSpeechEnd: (audio) => {
      onAudio(audio);
    },
  });
  const { lang: contextLang } = useLanguage ? useLanguage() : { lang: undefined };
  const lang = (propLang as keyof typeof AUDIO_TEXT) || (contextLang as keyof typeof AUDIO_TEXT) || (localStorage.getItem('lang') as keyof typeof AUDIO_TEXT) || 'zh-TW';
  const t = AUDIO_TEXT[lang] || AUDIO_TEXT['zh-TW'];
  
  const { checkPermission, recordUsage } = usePermission();
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [permissionResult, setPermissionResult] = useState<any>(null);
  const { isTestMode } = useTestMode();

  const handleButtonClick = async () => {
    if (isListening) {
      stopListening();
      return;
    }

    // 檢查語音權限
    const permission = await checkPermission('aiChat');
    if (!permission.allowed) {
      if (isTestMode) return;
      if (permission.canRenew) {
        setPermissionResult(permission);
        setShowRenewalModal(true);
      } else {
        setPermissionResult(permission);
        setShowRenewalModal(true);
      }
      return;
    }

    // 有權限，開始錄音
    startListening();
    
    // 記錄使用量（語音功能消耗 Token）
    await recordUsage('aiChat', 1); // 假設每次語音輸入消耗 1 token
  };

  const handleRenewalModalClose = () => {
    setShowRenewalModal(false);
    setPermissionResult(null);
  };

  return (
    <>
      <div>
        <button 
          onClick={handleButtonClick}
          style={{
            width: 56, height: 56, borderRadius: '50%', 
            background: isListening ? '#ff9800' : '#ff9800', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: isListening ? '0 0 0 4px #ffe0b2' : '0 2px 8px #0002', 
            cursor: 'pointer', 
            outline: 'none', 
            position: 'relative', 
            zIndex: 20
          }}
          aria-label={isListening ? t.stop : t.start}
        >
          <span style={{ fontSize: 36, color: '#fff', filter: isListening ? 'drop-shadow(0 0 6px #ff9800)' : '' }}>🎤</span>
        </button>
        <div style={{ textAlign: 'center', fontSize: 14, color: '#ff9800', marginTop: 4, fontWeight: 700 }}>
          {isListening ? t.stop : t.start}
        </div>
      </div>

      {/* Token 續購彈窗 */}
      {showRenewalModal && permissionResult && (
        <TokenRenewalModal
          isOpen={showRenewalModal}
          onClose={handleRenewalModalClose}
          currentPlan={permissionResult.currentPlan}
          remainingDays={permissionResult.remainingDays}
          usedTokens={permissionResult.usedTokens}
          totalTokens={permissionResult.totalTokens}
        />
      )}
    </>
  );
}
