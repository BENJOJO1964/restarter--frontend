import React from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

export const SubscriptionStatus: React.FC = () => {
  const { status, loading, error } = useSubscription();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{ padding: 16, textAlign: 'center' }}>
        <div>載入訂閱狀態中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 16, textAlign: 'center', color: '#ff4444' }}>
        <div>載入失敗: {error}</div>
      </div>
    );
  }

  if (!status) {
    return (
      <div style={{ padding: 16, textAlign: 'center' }}>
        <div>請先登入</div>
      </div>
    );
  }

  const { subscription, plan, usage, limits, isOverLimit } = status;

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit <= 0) return 0;
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return '#ff4444';
    if (percentage >= 70) return '#ffaa00';
    return '#00cc44';
  };

  return (
    <div style={{ 
      background: '#f8f9ff', 
      borderRadius: 12, 
      padding: 20, 
      margin: 16,
      border: '1px solid #e0e0e0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, color: '#6B5BFF', fontSize: 18, fontWeight: 700 }}>
          {plan.name}
        </h3>
        <button 
          onClick={() => navigate('/plans')}
          style={{
            background: '#6B5BFF',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          升級
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>本月使用量</div>
        
        {/* AI聊天使用量 */}
        {limits.aiChats > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span>AI聊天</span>
              <span>{usage.aiChats} / {limits.aiChats}</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: 6, 
              background: '#e0e0e0', 
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${getUsagePercentage(usage.aiChats, limits.aiChats)}%`,
                height: '100%',
                background: getUsageColor(getUsagePercentage(usage.aiChats, limits.aiChats)),
                transition: 'width 0.3s ease'
              }} />
            </div>
            {isOverLimit.aiChats && (
              <div style={{ fontSize: 10, color: '#ff4444', marginTop: 2 }}>
                已達上限
              </div>
            )}
          </div>
        )}

        {/* 用戶互動使用量 */}
        {limits.userInteractions > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span>用戶互動</span>
              <span>{usage.userInteractions} / {limits.userInteractions}</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: 6, 
              background: '#e0e0e0', 
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${getUsagePercentage(usage.userInteractions, limits.userInteractions)}%`,
                height: '100%',
                background: getUsageColor(getUsagePercentage(usage.userInteractions, limits.userInteractions)),
                transition: 'width 0.3s ease'
              }} />
            </div>
            {isOverLimit.userInteractions && (
              <div style={{ fontSize: 10, color: '#ff4444', marginTop: 2 }}>
                已達上限
              </div>
            )}
          </div>
        )}

        {/* 留言使用量 */}
        {limits.comments > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span>留言</span>
              <span>{usage.comments} / {limits.comments}</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: 6, 
              background: '#e0e0e0', 
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${getUsagePercentage(usage.comments, limits.comments)}%`,
                height: '100%',
                background: getUsageColor(getUsagePercentage(usage.comments, limits.comments)),
                transition: 'width 0.3s ease'
              }} />
            </div>
            {isOverLimit.comments && (
              <div style={{ fontSize: 10, color: '#ff4444', marginTop: 2 }}>
                已達上限
              </div>
            )}
          </div>
        )}

        {/* 里程碑使用量 */}
        {limits.milestones > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span>里程碑</span>
              <span>{usage.milestones} / {limits.milestones}</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: 6, 
              background: '#e0e0e0', 
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${getUsagePercentage(usage.milestones, limits.milestones)}%`,
                height: '100%',
                background: getUsageColor(getUsagePercentage(usage.milestones, limits.milestones)),
                transition: 'width 0.3s ease'
              }} />
            </div>
            {isOverLimit.milestones && (
              <div style={{ fontSize: 10, color: '#ff4444', marginTop: 2 }}>
                已達上限
              </div>
            )}
          </div>
        )}

        {/* 基礎功能使用量 */}
        {limits.freeFeatures > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span>基礎功能</span>
              <span>{usage.freeFeatures} / {limits.freeFeatures}</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: 6, 
              background: '#e0e0e0', 
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${getUsagePercentage(usage.freeFeatures, limits.freeFeatures)}%`,
                height: '100%',
                background: getUsageColor(getUsagePercentage(usage.freeFeatures, limits.freeFeatures)),
                transition: 'width 0.3s ease'
              }} />
            </div>
            {isOverLimit.freeFeatures && (
              <div style={{ fontSize: 10, color: '#ff4444', marginTop: 2 }}>
                已達上限
              </div>
            )}
          </div>
        )}

        {/* AI Token 使用量 */}
        {limits.aiCostLimit > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span>AI Token</span>
              <span>NT${usage.aiCost} / NT${limits.aiCostLimit}</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: 6, 
              background: '#e0e0e0', 
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${getUsagePercentage(usage.aiCost, limits.aiCostLimit)}%`,
                height: '100%',
                background: getUsageColor(getUsagePercentage(usage.aiCost, limits.aiCostLimit)),
                transition: 'width 0.3s ease'
              }} />
            </div>
            {isOverLimit.aiCost && (
              <div style={{ fontSize: 10, color: '#ff4444', marginTop: 2 }}>
                已達上限
              </div>
            )}
          </div>
        )}
      </div>

      {/* 無限制功能提示 */}
      {(limits.aiChats === -1 || limits.userInteractions === -1 || limits.comments === -1 || limits.milestones === -1 || limits.freeFeatures === -1) && (
        <div style={{ 
          background: '#e8f5e8', 
          borderRadius: 6, 
          padding: 8, 
          fontSize: 12, 
          color: '#2d5a2d',
          textAlign: 'center'
        }}>
          ♾️ 部分功能無限制使用
        </div>
      )}
    </div>
  );
}; 