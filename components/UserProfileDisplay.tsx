import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export interface UserProfile {
  nickname?: string;
  avatar?: string;
  avatarUrl?: string;
  gender?: string;
  age?: string;
  country?: string;
  region?: string;
  interest?: string;
  eventType?: string;
  improvement?: string;
  email?: string;
  bio?: string;
}

interface UserProfileDisplayProps {
  profile: UserProfile;
  variant?: 'compact' | 'detailed';
  showAvatar?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const GENDER_LABELS = {
  'zh-TW': { male: '男', female: '女', other: '其他' },
  'zh-CN': { male: '男', female: '女', other: '其他' },
  'en': { male: 'Male', female: 'Female', other: 'Other' },
  'ja': { male: '男性', female: '女性', other: 'その他' },
  'ko': { male: '남성', female: '여성', other: '기타' },
  'th': { male: 'ชาย', female: 'หญิง', other: 'อื่นๆ' },
  'vi': { male: 'Nam', female: 'Nữ', other: 'Khác' },
  'ms': { male: 'Lelaki', female: 'Perempuan', other: 'Lain-lain' },
  'la': { male: 'Mas', female: 'Femina', other: 'Aliud' },
};

const AGE_UNITS = {
  'zh-TW': '歲',
  'zh-CN': '岁',
  'en': 'y/o',
  'ja': '歳',
  'ko': '세',
  'th': 'ปี',
  'vi': 'tuổi',
  'ms': 'tahun',
  'la': 'annos',
};

// 新增多語欄位標籤
const PROFILE_LABELS = {
  'zh-TW': {
    nickname: '暱稱', gender: '性別', age: '年齡', country: '國家/地區', interest: '興趣', eventType: '事件類型', improvement: '想改善', email: 'Email', bio: '簡介'
  },
  'zh-CN': {
    nickname: '昵称', gender: '性别', age: '年龄', country: '国家/地区', interest: '兴趣', eventType: '事件类型', improvement: '想改善', email: '邮箱', bio: '简介'
  },
  'en': {
    nickname: 'Nickname', gender: 'Gender', age: 'Age', country: 'Country/Region', interest: 'Interest', eventType: 'Event Type', improvement: 'To Improve', email: 'Email', bio: 'Bio'
  },
  'ja': { nickname: 'ニックネーム', gender: '性別', age: '年齢', country: '国/地域', interest: '興味', eventType: 'イベントタイプ', improvement: '改善したいこと', email: 'メール', bio: '自己紹介' },
  'ko': { nickname: '닉네임', gender: '성별', age: '나이', country: '국가/지역', interest: '관심사', eventType: '이벤트 유형', improvement: '개선하고 싶은 점', email: '이메일', bio: '소개' },
  'th': { nickname: 'ชื่อเล่น', gender: 'เพศ', age: 'อายุ', country: 'ประเทศ/ภูมิภาค', interest: 'ความสนใจ', eventType: 'ประเภทเหตุการณ์', improvement: 'สิ่งที่อยากปรับปรุง', email: 'อีเมล', bio: 'แนะนำตัว' },
  'vi': { nickname: 'Biệt danh', gender: 'Giới tính', age: 'Tuổi', country: 'Quốc gia/Khu vực', interest: 'Sở thích', eventType: 'Loại sự kiện', improvement: 'Điều muốn cải thiện', email: 'Email', bio: 'Giới thiệu' },
  'ms': { nickname: 'Nama panggilan', gender: 'Jantina', age: 'Umur', country: 'Negara/Wilayah', interest: 'Minat', eventType: 'Jenis Acara', improvement: 'Perkara untuk Diperbaiki', email: 'Email', bio: 'Pengenalan' },
  'la': { nickname: 'Cognomen', gender: 'Sexus', age: 'Aetas', country: 'Patria/Regio', interest: 'Studium', eventType: 'Genus Eventus', improvement: 'Emendare', email: 'Email', bio: 'Introductio' }
};

export const UserProfileDisplay: React.FC<UserProfileDisplayProps> = ({
  profile,
  variant = 'compact',
  showAvatar = true,
  className = '',
  style = {}
}) => {
  const { lang } = useLanguage();

  const avatarUrl = profile.avatar || profile.avatarUrl || '/avatars/Derxl.png';
  const genderLabel = profile.gender ? GENDER_LABELS[lang]?.[profile.gender as keyof typeof GENDER_LABELS[typeof lang]] || profile.gender : '';
  const ageUnit = AGE_UNITS[lang];

  if (variant === 'compact') {
    return (
      <div 
        className={`user-profile-compact ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 2,
          ...style
        }}
      >
        {showAvatar && (
          <img 
            src={avatarUrl} 
            alt="avatar" 
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #ececff'
            }} 
          />
        )}
        <span style={{ fontWeight: 600 }}>{profile.nickname || '-'}</span>
        <span>{profile.age || '-'}{ageUnit}</span>
        <span>{genderLabel}</span>
        <span>{profile.country || '-'}{profile.region ? `/${profile.region}` : ''}</span>
      </div>
    );
  }

  // detailed variant
  return (
    <div 
      className={`user-profile-detailed ${className}`}
      style={{
        marginTop: 10,
        fontSize: 14,
        color: '#6B5BFF',
        fontWeight: 500,
        background: '#f7f8fc',
        borderRadius: 8,
        padding: '8px 12px',
        ...style
      }}
    >
      {showAvatar && (
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <img 
            src={avatarUrl} 
            alt="avatar" 
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #6B5BFF'
            }} 
          />
        </div>
      )}
      <div>{PROFILE_LABELS[lang].nickname}：{profile.nickname || '-'}</div>
      <div>{PROFILE_LABELS[lang].gender}：{genderLabel}</div>
      <div>{PROFILE_LABELS[lang].age}：{profile.age || '-'}{ageUnit}</div>
      <div>{PROFILE_LABELS[lang].country}：{profile.country || '-'} {profile.region || ''}</div>
      <div>{PROFILE_LABELS[lang].interest}：{profile.interest || '-'}</div>
      <div>{PROFILE_LABELS[lang].eventType}：{profile.eventType || '-'}</div>
      {profile.improvement && <div>{PROFILE_LABELS[lang].improvement}：{profile.improvement}</div>}
      {profile.email && <div>{PROFILE_LABELS[lang].email}：{profile.email}</div>}
      {profile.bio && <div>{PROFILE_LABELS[lang].bio}：{profile.bio}</div>}
    </div>
  );
}; 