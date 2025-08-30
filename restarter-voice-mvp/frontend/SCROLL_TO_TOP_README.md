# 滾動檢測與回到頂部功能說明

## 功能概述

這個功能實現了一個智能的滾動檢測系統，能夠自動檢測頁面中的滾動容器（無論是 window 還是內部容器），並在滾動超過指定距離時顯示回到頂部按鈕。

## 核心組件

### 1. useScrollToTop Hook (`hooks/useScrollToTop.ts`)

這是一個自定義 Hook，提供以下功能：

- **智能滾動容器檢測**：自動檢測頁面中的滾動容器
- **滾動事件監聽**：綁定到正確的滾動容器
- **狀態管理**：管理回到頂部按鈕的顯示狀態
- **回到頂部功能**：提供滾動到頂部的功能

#### 使用方法：

```tsx
import { useScrollToTop } from '../hooks/useScrollToTop';

const MyComponent = () => {
  const { showScrollTop, scrollToTop } = useScrollToTop({ 
    threshold: 100, // 顯示按鈕的滾動距離閾值
    selector: '.my-scroll-container' // 可選：指定滾動容器
  });

  return (
    <div>
      {/* 你的內容 */}
      <ScrollToTopButton 
        show={showScrollTop}
        onClick={scrollToTop}
      />
    </div>
  );
};
```

### 2. ScrollToTopButton 組件 (`components/ScrollToTopButton.tsx`)

一個可重複使用的回到頂部按鈕組件，支持：

- **多種大小**：small、medium、large
- **多種位置**：bottom-right、bottom-left、top-right、top-left
- **自定義樣式**：支持額外的 CSS 類

#### 使用方法：

```tsx
import ScrollToTopButton from '../components/ScrollToTopButton';

<ScrollToTopButton 
  show={showScrollTop}
  onClick={scrollToTop}
  size="large"
  position="bottom-right"
  className="custom-class"
/>
```

## 智能檢測邏輯

### 滾動容器檢測順序：

1. **自定義選擇器**：如果提供了 `selector` 參數，優先使用
2. **特定類名**：查找 `.scroll-container`、`[data-scroll-container]`、`.overflow-auto`、`.overflow-scroll`
3. **可滾動元素**：遍歷所有元素，查找有 `overflow: auto/scroll` 且內容超出容器的元素
4. **回退到 window**：如果沒有找到特定容器，使用 window

### 滾動事件處理：

- 自動綁定到檢測到的滾動容器
- 使用 `passive: true` 提高性能
- 正確清理事件監聽器避免內存洩漏
- 支持 React Strict Mode

## CSS 樣式

### 主要樣式類：

- `.scroll-to-top-button`：基礎樣式
- 支持 Tailwind CSS 類名進行大小和位置調整
- 包含動畫效果和懸停狀態

### 動畫效果：

- 淡入動畫：按鈕出現時的平滑過渡
- 懸停效果：縮放和顏色變化
- 點擊效果：按下時的縮放反饋

## 測試頁面

訪問 `/scroll-test` 路由可以測試完整功能：

- 長頁面內容產生滾動
- 多個回到頂部按鈕測試不同位置
- 實時滾動位置顯示
- 控制台日誌驗證

## 使用示例

### 基本使用：

```tsx
import React from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import ScrollToTopButton from '../components/ScrollToTopButton';

const MyPage = () => {
  const { showScrollTop, scrollToTop } = useScrollToTop();

  return (
    <div>
      {/* 你的頁面內容 */}
      <ScrollToTopButton 
        show={showScrollTop}
        onClick={scrollToTop}
      />
    </div>
  );
};
```

### 自定義配置：

```tsx
const { showScrollTop, scrollToTop } = useScrollToTop({
  threshold: 200, // 200px 後顯示
  selector: '#my-scrollable-container' // 指定容器
});
```

### 多個按鈕：

```tsx
<ScrollToTopButton 
  show={showScrollTop}
  onClick={scrollToTop}
  size="large"
  position="bottom-right"
/>

<ScrollToTopButton 
  show={showScrollTop}
  onClick={scrollToTop}
  size="medium"
  position="bottom-left"
  className="bg-red-500"
/>
```

## 注意事項

1. **性能優化**：使用 `passive: true` 和 `useCallback` 優化性能
2. **內存管理**：正確清理事件監聽器
3. **兼容性**：支持各種滾動容器類型
4. **可訪問性**：包含適當的 title 屬性和鍵盤支持
5. **響應式設計**：在不同屏幕尺寸下正常工作

## 故障排除

### 常見問題：

1. **按鈕不顯示**：
   - 檢查控制台是否有 "scroll triggered" 日誌
   - 確認滾動距離超過閾值
   - 檢查 CSS 樣式是否正確

2. **滾動事件不觸發**：
   - 確認滾動容器檢測是否正確
   - 檢查是否有其他元素阻止滾動
   - 驗證事件監聽器綁定

3. **回到頂部不工作**：
   - 確認滾動容器類型
   - 檢查 scrollTo 方法是否可用
   - 驗證滾動行為設置

### 調試技巧：

- 查看控制台日誌了解滾動容器檢測結果
- 使用瀏覽器開發者工具檢查元素樣式
- 測試不同滾動容器類型
- 驗證事件監聽器綁定狀態
