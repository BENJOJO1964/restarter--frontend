import React, { useRef, useState, useEffect } from 'react';
import { usePermission } from '../hooks/usePermission';
import { TokenRenewalModal } from '../components/TokenRenewalModal';
import { useTestMode } from '../App';
import { getWsUrl } from '../src/config/api';

const SIGNAL_SERVER_URL = getWsUrl(); // 後端 WebSocket 信令伺服器

// 新增 props 型別
interface VideoChatProps {
  roomId?: string;
}

const VideoChat: React.FC<VideoChatProps> = ({ roomId: propRoomId }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket|null>(null);
  const [pc, setPc] = useState<RTCPeerConnection|null>(null);
  const [roomId, setRoomId] = useState(propRoomId || '');
  const [inputRoom, setInputRoom] = useState(propRoomId || '');
  const [error, setError] = useState('');

  // 新增：權限檢查
  const { checkPermission, recordUsage } = usePermission();
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [permissionResult, setPermissionResult] = useState<any>(null);
  const { isTestMode } = useTestMode();

  // 若有傳入 roomId，進入房間
  useEffect(() => {
    if (propRoomId && !connected) {
      setInputRoom(propRoomId);
      joinRoomAuto(propRoomId);
    }
    // eslint-disable-next-line
  }, [propRoomId]);

  // 檢查權限的通用函數
  const checkVideoChatPermission = async () => {
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
      return false;
    }
    return true;
  };

  // 自動進入房間
  const joinRoomAuto = async (room: string) => {
    // 檢查權限
    const hasPermission = await checkVideoChatPermission();
    if (!hasPermission) return;

    setRoomId(room);
    connectSignal();
    const peer = createPeerConnection();
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    stream.getTracks().forEach(track => peer.addTrack(track, stream));
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    peer.onnegotiationneeded = async () => {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      ws?.send(JSON.stringify({ type: 'offer', offer, room }));
    };
    setConnected(true);
    
    // 記錄使用量
    await recordUsage('aiChat', 1);
  };

  // 建立 WebSocket 連線
  const connectSignal = () => {
    if (ws) return;
    const socket = new WebSocket(SIGNAL_SERVER_URL);
    socket.onopen = () => console.log('WebSocket connected');
    socket.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'offer') {
        await handleOffer(msg.offer);
      } else if (msg.type === 'answer') {
        await handleAnswer(msg.answer);
      } else if (msg.type === 'candidate') {
        await handleCandidate(msg.candidate);
      }
    };
    socket.onerror = (e) => setError('WebSocket 連線失敗');
    setWs(socket);
  };

  // 建立 PeerConnection
  const createPeerConnection = () => {
    const peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    peer.onicecandidate = (e) => {
      if (e.candidate && ws && roomId) {
        ws.send(JSON.stringify({ type: 'candidate', candidate: e.candidate, room: roomId }));
      }
    };
    peer.ontrack = (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };
    setPc(peer);
    return peer;
  };

  // 加入房間
  const joinRoom = async () => {
    if (!inputRoom) return setError('請輸入房間代碼');
    
    // 檢查權限
    const hasPermission = await checkVideoChatPermission();
    if (!hasPermission) return;

    setRoomId(inputRoom);
    connectSignal();
    const peer = createPeerConnection();
    // 取得本地視訊
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    stream.getTracks().forEach(track => peer.addTrack(track, stream));
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    // 建立 offer
    peer.onnegotiationneeded = async () => {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      ws?.send(JSON.stringify({ type: 'offer', offer, room: inputRoom }));
    };
    setConnected(true);
    
    // 記錄使用量
    await recordUsage('aiChat', 1);
  };

  // 處理 offer
  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    const peer = pc || createPeerConnection();
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    stream.getTracks().forEach(track => peer.addTrack(track, stream));
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    ws?.send(JSON.stringify({ type: 'answer', answer, room: roomId }));
    setConnected(true);
  };

  // 處理 answer
  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!pc) return;
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
  };

  // 處理 candidate
  const handleCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!pc) return;
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const handleRenewalModalClose = () => {
    setShowRenewalModal(false);
    setPermissionResult(null);
  };

  return (
    <>
      <div style={{ minHeight: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f7f7fa' }}>
        <h2 style={{ color: '#6B5BFF', fontWeight: 900, fontSize: 24, marginBottom: 18 }}>免費一對一視訊聊天</h2>
        {!connected && !propRoomId && (
          <div style={{ marginBottom: 24 }}>
            <input value={inputRoom} onChange={e => setInputRoom(e.target.value)} placeholder="請輸入房間代碼" style={{ padding: 8, borderRadius: 8, border: '1.5px solid #6B5BFF', marginRight: 8 }} />
            <button onClick={joinRoom} style={{ background: '#6B5BFF', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>加入房間</button>
          </div>
        )}
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 24 }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>本地視訊</div>
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: 240, height: 180, background: '#000', borderRadius: 12 }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>對方視訊</div>
            <video ref={remoteVideoRef} autoPlay playsInline style={{ width: 240, height: 180, background: '#000', borderRadius: 12 }} />
          </div>
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
};

export default VideoChat; 