#!/bin/bash

# 替換剩餘的語言選擇器
cd pages

# 需要手動替換的文件和模式
declare -A replacements=(
  ["MindGarden.tsx"]="<select value={lang} onChange={handleLangChange} style={{ padding: '6px 14px', borderRadius: 8, fontWeight: 600, border: '1.5px solid #6B5BFF', color: '#6B5BFF', background: '#fff', cursor: 'pointer' }>"
  ["Journal.tsx"]="<select className=\"topbar-select\" value={lang} onChange={e=>{localStorage.setItem('lang',e.target.value);window.location.reload();}} style={{padding:'6px 14px',borderRadius:8,fontWeight:600,border:'1.5px solid #6B5BFF',color:'#6B5BFF',background:'#fff',cursor:'pointer'}}>"
  ["MyLinks.tsx"]="<select value={lang} onChange={e => { setLang(e.target.value); localStorage.setItem('lang', e.target.value); }} style={{ position: 'absolute', top: 24, right: 24, zIndex: 10, padding: '6px 14px', border"
  ["RestartWall.tsx"]="<select className=\"topbar-select\" value={lang} onChange={e=>{const newLang = e.target.value as LanguageCode; setLang(newLang); localStorage.setItem('lang', newLang);}} style={{padding:'6px 14px',border"
  ["PairTalk.tsx"]="<select className=\"topbar-select\" value={lang} onChange={e=>{localStorage.setItem('lang',e.target.value as LanguageCode);window.location.reload();}} style={{padding:'6px 14px',borderRadius:8,fontWeight"
  ["ChatRoom.tsx"]="<select value={lang} onChange={e => { setLang(e.target.value); localStorage.setItem('lang', e.target.value); }} style={{ position: 'absolute', top: 24, right: 24, zIndex: 10, padding: '6px 14px', borde"
  ["PracticePage.tsx"]="<select className=\"topbar-select\" value={lang} onChange={e => { localStorage.setItem('lang', e.target.value as LanguageCode); window.location.reload(); }} style={{ padding: '6px 14px', borderRadius: 8,"
  ["RestartMissions.tsx"]="<select value={lang} onChange={handleLangChange} style={{ padding: '6px 14px', borderRadius: 8, fontWeight: 600, border: '1.5px solid #6B5BFF', color: '#6B5BFF', background: '#fff', cursor: 'pointer',"
  ["ChatCompanion.tsx"]="<select value={lang} onChange={e => setLang(e.target.value as LanguageCode)} style={{ marginRight: 10 }}>"
  ["AIStyleReply.tsx"]="<select value={lang} onChange={e => setLang(e.target.value as LanguageCode)} style={{ padding: '6px 14px', borderRadius: 8, fontWeight: 600 }}>"
  ["InvitesPage.tsx"]="<select value={lang} onChange={e => { setLang(e.target.value); localStorage.setItem('lang', e.target.value); }} style={{ position: 'absolute', top: 24, right: 24, zIndex: 10, padding: '6px 14px', borde"
  ["PairTalkMatch.tsx"]="<select className=\"topbar-select\" value={lang} onChange={e=>{localStorage.setItem('lang',e.target.value);window.location.reload();}}>"
  ["FriendMatch.tsx"]="<select value={lang} onChange={handleLangChange} style={{padding:'6px 14px',borderRadius:8,fontWeight:600,border:'1.5px solid #6B5BFF',color:'#6B5BFF',background:'#fff',cursor:'pointer'}}>"
  ["EmotionVisualLab.tsx"]="<select className=\"topbar-select\" value={lang} onChange={e => setLang(e.target.value as LanguageCode)} style={{padding:'6px 14px',borderRadius:8,fontWeight:600,border:'1.5px solid #6B5BFF',color:'#6B5BFF',background:'#fff',cursor:'pointer'}}>"
)

for file in "${!replacements[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # 替換語言選擇器
    pattern="${replacements[$file]}"
    sed -i '' "s|$pattern.*</select>|<LanguageSelector />|g" "$file"
    
    echo "Updated $file"
  fi
done

echo "All remaining language selectors updated!" 