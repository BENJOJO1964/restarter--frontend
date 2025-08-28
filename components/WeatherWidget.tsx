import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getApiUrl } from '../src/config/api';

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  city: string;
  country: string;
  feelsLike: number;
  pressure: number;
  visibility: number;
  sunrise: string;
  sunset: string;
  weekday?: string;
}

interface WeatherWidgetProps {
  className?: string;
  showDetails?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ className = '', showDetails = false }) => {
  const { lang } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeather();
  }, [lang]);



  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 使用預設城市，不根據瀏覽器位置
      const defaultCity = 'Taipei';
      console.log('Fetching weather for:', defaultCity);
      const response = await fetch(getApiUrl(`/weather/current?city=${defaultCity}`));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Weather API response:', data);
      
      if (data.weather) {
        // 使用本地化顯示
        const localizedWeather = getLocalizedWeather(data.weather, lang);
        console.log('Localized weather:', localizedWeather);
        setWeather(localizedWeather);
      } else {
        setError(data.error || '無法獲取天氣資訊');
      }
    } catch (err) {
      setError('天氣服務暫時無法使用');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 獲取本地化天氣顯示
  const getLocalizedWeather = (weather: any, currentLang: string) => {
    // 天氣描述多語言映射 - 擴展支持WeatherAPI.com的描述
    const weatherDescMap: Record<string, Record<string, string>> = {
      'zh-TW': {
        'clear sky': '晴天',
        'few clouds': '少雲',
        'scattered clouds': '多雲',
        'broken clouds': '陰天',
        'shower rain': '陣雨',
        'rain': '下雨',
        'thunderstorm': '雷雨',
        'snow': '下雪',
        'haze': '霾',
        'smoke': '煙霧',
        'dust': '沙塵',
        'sand': '沙塵',
        'ash': '火山灰',
        'squall': '狂風',
        'tornado': '龍捲風',
        // WeatherAPI.com 描述
        'sunny': '晴天',
        'partly cloudy': '多雲時晴',
        'cloudy': '陰天',
        'overcast': '陰天',
        'mist': '霧',
        'fog': '霧',
        'patchy rain possible': '可能有陣雨',
        'patchy snow possible': '可能有雪',
        'patchy sleet possible': '可能有雨夾雪',
        'patchy freezing drizzle possible': '可能有凍雨',
        'thundery outbreaks possible': '可能有雷雨',
        'blowing snow': '吹雪',
        'blizzard': '暴風雪',
        'freezing fog': '凍霧',
        'patchy light drizzle': '零星小雨',
        'light drizzle': '小雨',
        'freezing drizzle': '凍雨',
        'heavy freezing drizzle': '強凍雨',
        'patchy light rain': '零星小雨',
        'light rain': '小雨',
        'moderate rain at times': '間歇性中雨',
        'moderate rain': '中雨',
        'heavy rain at times': '間歇性大雨',
        'heavy rain': '大雨',
        'light freezing rain': '輕凍雨',
        'moderate or heavy freezing rain': '中到強凍雨',
        'light sleet': '輕雨夾雪',
        'moderate or heavy sleet': '中到強雨夾雪',
        'patchy light snow': '零星小雪',
        'light snow': '小雪',
        'patchy moderate snow': '零星中雪',
        'moderate snow': '中雪',
        'patchy heavy snow': '零星大雪',
        'heavy snow': '大雪',
        'ice pellets': '冰雹',
        'light rain shower': '小雨陣',
        'moderate or heavy rain shower': '中到強雨陣',
        'torrential rain shower': '暴雨陣',
        'light sleet showers': '小雨夾雪陣',
        'moderate or heavy sleet showers': '中到強雨夾雪陣',
        'light snow showers': '小雪陣',
        'moderate or heavy snow showers': '中到強雪陣',
        'light showers of ice pellets': '輕冰雹陣',
        'moderate or heavy showers of ice pellets': '中到強冰雹陣',
        'patchy light rain with thunder': '零星小雨伴雷',
        'moderate or heavy rain with thunder': '中到強雨伴雷',
        'patchy light snow with thunder': '零星小雪伴雷',
        'moderate or heavy snow with thunder': '中到強雪伴雷',
        '局部多云': '局部多云'
      },
      'zh-CN': {
        'clear sky': '晴天',
        'few clouds': '少云',
        'scattered clouds': '多云',
        'broken clouds': '阴天',
        'shower rain': '阵雨',
        'rain': '下雨',
        'thunderstorm': '雷雨',
        'snow': '下雪',
        'haze': '霾',
        'smoke': '烟雾',
        'dust': '沙尘',
        'sand': '沙尘',
        'ash': '火山灰',
        'squall': '狂风',
        'tornado': '龙卷风',
        // WeatherAPI.com 描述
        'sunny': '晴天',
        'partly cloudy': '多云时晴',
        'cloudy': '阴天',
        'overcast': '阴天',
        'mist': '雾',
        'fog': '雾',
        'patchy rain possible': '可能有阵雨',
        'patchy snow possible': '可能有雪',
        'patchy sleet possible': '可能有雨夹雪',
        'patchy freezing drizzle possible': '可能有冻雨',
        'thundery outbreaks possible': '可能有雷雨',
        'blowing snow': '吹雪',
        'blizzard': '暴风雪',
        'freezing fog': '冻雾',
        'patchy light drizzle': '零星小雨',
        'light drizzle': '小雨',
        'freezing drizzle': '冻雨',
        'heavy freezing drizzle': '强冻雨',
        'patchy light rain': '零星小雨',
        'light rain': '小雨',
        'moderate rain at times': '间歇性中雨',
        'moderate rain': '中雨',
        'heavy rain at times': '间歇性大雨',
        'heavy rain': '大雨',
        'light freezing rain': '轻冻雨',
        'moderate or heavy freezing rain': '中到强冻雨',
        'light sleet': '轻雨夹雪',
        'moderate or heavy sleet': '中到强雨夹雪',
        'patchy light snow': '零星小雪',
        'light snow': '小雪',
        'patchy moderate snow': '零星中雪',
        'moderate snow': '中雪',
        'patchy heavy snow': '零星大雪',
        'heavy snow': '大雪',
        'ice pellets': '冰雹',
        'light rain shower': '小雨阵',
        'moderate or heavy rain shower': '中到强雨阵',
        'torrential rain shower': '暴雨阵',
        'light sleet showers': '小雨夹雪阵',
        'moderate or heavy sleet showers': '中到强雨夹雪阵',
        'light snow showers': '小雪阵',
        'moderate or heavy snow showers': '中到强雪阵',
        'light showers of ice pellets': '轻冰雹阵',
        'moderate or heavy showers of ice pellets': '中到强冰雹阵',
        'patchy light rain with thunder': '零星小雨伴雷',
        'moderate or heavy rain with thunder': '中到强雨伴雷',
        'patchy light snow with thunder': '零星小雪伴雷',
        'moderate or heavy snow with thunder': '中到强雪伴雷',
        '局部多云': 'Partly Cloudy'
      },
      'en': {
        'clear sky': 'Clear',
        'few clouds': 'Partly Cloudy',
        'scattered clouds': 'Cloudy',
        'broken clouds': 'Overcast',
        'shower rain': 'Showers',
        'rain': 'Rain',
        'thunderstorm': 'Thunderstorm',
        'snow': 'Snow',
        'haze': 'Haze',
        'smoke': 'Smoke',
        'dust': 'Dust',
        'sand': 'Sand',
        'ash': 'Ash',
        'squall': 'Squall',
        'tornado': 'Tornado',
        // WeatherAPI.com 描述
        'sunny': 'Sunny',
        'partly cloudy': 'Partly Cloudy',
        'cloudy': 'Cloudy',
        'overcast': 'Overcast',
        'mist': 'Mist',
        'fog': 'Fog',
        'patchy rain possible': 'Patchy Rain',
        'patchy snow possible': 'Patchy Snow',
        'patchy sleet possible': 'Patchy Sleet',
        'patchy freezing drizzle possible': 'Patchy Freezing Drizzle',
        'thundery outbreaks possible': 'Thundery Outbreaks',
        'blowing snow': 'Blowing Snow',
        'blizzard': 'Blizzard',
        'freezing fog': 'Freezing Fog',
        'patchy light drizzle': 'Patchy Light Drizzle',
        'light drizzle': 'Light Drizzle',
        'freezing drizzle': 'Freezing Drizzle',
        'heavy freezing drizzle': 'Heavy Freezing Drizzle',
        'patchy light rain': 'Patchy Light Rain',
        'light rain': 'Light Rain',
        'moderate rain at times': 'Moderate Rain',
        'moderate rain': 'Moderate Rain',
        'heavy rain at times': 'Heavy Rain',
        'heavy rain': 'Heavy Rain',
        'light freezing rain': 'Light Freezing Rain',
        'moderate or heavy freezing rain': 'Moderate or Heavy Freezing Rain',
        'light sleet': 'Light Sleet',
        'moderate or heavy sleet': 'Moderate or Heavy Sleet',
        'patchy light snow': 'Patchy Light Snow',
        'light snow': 'Light Snow',
        'patchy moderate snow': 'Patchy Moderate Snow',
        'moderate snow': 'Moderate Snow',
        'patchy heavy snow': 'Patchy Heavy Snow',
        'heavy snow': 'Heavy Snow',
        'ice pellets': 'Ice Pellets',
        'light rain shower': 'Light Rain Shower',
        'moderate or heavy rain shower': 'Moderate or Heavy Rain Shower',
        'torrential rain shower': 'Torrential Rain Shower',
        'light sleet showers': 'Light Sleet Showers',
        'moderate or heavy sleet showers': 'Moderate or Heavy Sleet Showers',
        'light snow showers': 'Light Snow Showers',
        'moderate or heavy snow showers': 'Moderate or Heavy Snow Showers',
        'light showers of ice pellets': 'Light Ice Pellet Showers',
        'moderate or heavy showers of ice pellets': 'Moderate or Heavy Ice Pellet Showers',
        'patchy light rain with thunder': 'Patchy Light Rain with Thunder',
        'moderate or heavy rain with thunder': 'Moderate or Heavy Rain with Thunder',
        'patchy light snow with thunder': 'Patchy Light Snow with Thunder',
        'moderate or heavy snow with thunder': 'Moderate or Heavy Snow with Thunder',
        '局部多云': 'Partly Cloudy'
      },
      'ja': {
        'clear sky': '晴天',
        'few clouds': '晴れ時々曇り',
        'scattered clouds': '曇り',
        'broken clouds': '曇り',
        'shower rain': 'にわか雨',
        'rain': '雨',
        'thunderstorm': '雷雨',
        'snow': '雪',
        'haze': 'もや',
        'smoke': '煙',
        'dust': '砂塵',
        'sand': '砂塵',
        'ash': '火山灰',
        'squall': '突風',
        'tornado': '竜巻',
        // WeatherAPI.com 描述
        'sunny': '晴天',
        'partly cloudy': '晴れ時々曇り',
        'cloudy': '曇り',
        'overcast': '曇り',
        'mist': '霧',
        'fog': '霧',
        'patchy rain possible': 'にわか雨の可能性',
        'patchy snow possible': 'にわか雪の可能性',
        'patchy sleet possible': 'にわかみぞれの可能性',
        'patchy freezing drizzle possible': 'にわか凍る霧雨の可能性',
        'thundery outbreaks possible': '雷雨の可能性',
        'blowing snow': '吹雪',
        'blizzard': '猛吹雪',
        'freezing fog': '凍る霧',
        'patchy light drizzle': 'にわか小雨',
        'light drizzle': '小雨',
        'freezing drizzle': '凍る霧雨',
        'heavy freezing drizzle': '強い凍る霧雨',
        'patchy light rain': 'にわか小雨',
        'light rain': '小雨',
        'moderate rain at times': '時々中雨',
        'moderate rain': '中雨',
        'heavy rain at times': '時々大雨',
        'heavy rain': '大雨',
        'light freezing rain': '軽い凍る雨',
        'moderate or heavy freezing rain': '中程度または強い凍る雨',
        'light sleet': '軽いみぞれ',
        'moderate or heavy sleet': '中程度または強いみぞれ',
        'patchy light snow': 'にわか小雪',
        'light snow': '小雪',
        'patchy moderate snow': 'にわか中雪',
        'moderate snow': '中雪',
        'patchy heavy snow': 'にわか大雪',
        'heavy snow': '大雪',
        'ice pellets': '氷の粒',
        'light rain shower': '小雨のシャワー',
        'moderate or heavy rain shower': '中程度または強い雨のシャワー',
        'torrential rain shower': '豪雨のシャワー',
        'light sleet showers': '軽いみぞれのシャワー',
        'moderate or heavy sleet showers': '中程度または強いみぞれのシャワー',
        'light snow showers': '小雪のシャワー',
        'moderate or heavy snow showers': '中程度または強い雪のシャワー',
        'light showers of ice pellets': '軽い氷の粒のシャワー',
        'moderate or heavy showers of ice pellets': '中程度または強い氷の粒のシャワー',
        'patchy light rain with thunder': 'にわか小雨と雷',
        'moderate or heavy rain with thunder': '中程度または強い雨と雷',
        'patchy light snow with thunder': 'にわか小雪と雷',
        'moderate or heavy snow with thunder': '中程度または強い雪と雷',
        '局部多云': '晴れ時々曇り'
      },
      'ko': {
        'clear sky': '맑음',
        'few clouds': '구름 조금',
        'scattered clouds': '구름 많음',
        'broken clouds': '흐림',
        'shower rain': '소나기',
        'rain': '비',
        'thunderstorm': '천둥번개',
        'snow': '눈',
        'haze': '연무',
        'smoke': '연기',
        'dust': '먼지',
        'sand': '모래',
        'ash': '화산재',
        'squall': '돌풍',
        'tornado': '토네이도',
        // WeatherAPI.com 描述
        'sunny': '맑음',
        'partly cloudy': '구름 조금',
        'cloudy': '흐림',
        'overcast': '흐림',
        'mist': '안개',
        'fog': '안개',
        'patchy rain possible': '소나기 가능',
        'patchy snow possible': '눈 가능',
        'patchy sleet possible': '진눈깨비 가능',
        'patchy freezing drizzle possible': '얼음비 가능',
        'thundery outbreaks possible': '천둥번개 가능',
        'blowing snow': '눈보라',
        'blizzard': '폭설',
        'freezing fog': '얼음안개',
        'patchy light drizzle': '가벼운 이슬비',
        'light drizzle': '이슬비',
        'freezing drizzle': '얼음비',
        'heavy freezing drizzle': '강한 얼음비',
        'patchy light rain': '가벼운 비',
        'light rain': '가벼운 비',
        'moderate rain at times': '중간 비',
        'moderate rain': '중간 비',
        'heavy rain at times': '강한 비',
        'heavy rain': '강한 비',
        'light freezing rain': '가벼운 얼음비',
        'moderate or heavy freezing rain': '중간 또는 강한 얼음비',
        'light sleet': '가벼운 진눈깨비',
        'moderate or heavy sleet': '중간 또는 강한 진눈깨비',
        'patchy light snow': '가벼운 눈',
        'light snow': '가벼운 눈',
        'patchy moderate snow': '중간 눈',
        'moderate snow': '중간 눈',
        'patchy heavy snow': '강한 눈',
        'heavy snow': '강한 눈',
        'ice pellets': '얼음알갱이',
        'light rain shower': '가벼운 소나기',
        'moderate or heavy rain shower': '중간 또는 강한 소나기',
        'torrential rain shower': '폭우',
        'light sleet showers': '가벼운 진눈깨비 소나기',
        'moderate or heavy sleet showers': '중간 또는 강한 진눈깨비 소나기',
        'light snow showers': '가벼운 눈 소나기',
        'moderate or heavy snow showers': '중간 또는 강한 눈 소나기',
        'light showers of ice pellets': '가벼운 얼음알갱이 소나기',
        'moderate or heavy showers of ice pellets': '중간 또는 강한 얼음알갱이 소나기',
        'patchy light rain with thunder': '가벼운 비와 천둥',
        'moderate or heavy rain with thunder': '중간 또는 강한 비와 천둥',
        'patchy light snow with thunder': '가벼운 눈과 천둥',
        'moderate or heavy snow with thunder': '중간 또는 강한 눈과 천둥',
        '局部多云': '구름 조금'
      },
      'th': {
        'clear sky': 'ท้องฟ้าแจ่มใส',
        'few clouds': 'มีเมฆบางส่วน',
        'scattered clouds': 'มีเมฆมาก',
        'broken clouds': 'เมฆมาก',
        'shower rain': 'ฝนตกเป็นช่วง',
        'rain': 'ฝนตก',
        'thunderstorm': 'พายุฝนฟ้าคะนอง',
        'snow': 'หิมะตก',
        'haze': 'หมอกควัน',
        'smoke': 'ควัน',
        'dust': 'ฝุ่น',
        'sand': 'ทราย',
        'ash': 'เถ้าถ่าน',
        'squall': 'ลมกระโชก',
        'tornado': 'พายุทอร์นาโด',
        // WeatherAPI.com 描述
        'sunny': 'ท้องฟ้าแจ่มใส',
        'partly cloudy': 'มีเมฆบางส่วน',
        'cloudy': 'เมฆมาก',
        'overcast': 'เมฆมาก',
        'mist': 'หมอก',
        'fog': 'หมอก',
        'patchy rain possible': 'อาจมีฝนตกเป็นช่วง',
        'patchy snow possible': 'อาจมีหิมะตกเป็นช่วง',
        'patchy sleet possible': 'อาจมีหิมะปนฝนเป็นช่วง',
        'patchy freezing drizzle possible': 'อาจมีน้ำค้างแข็งเป็นช่วง',
        'thundery outbreaks possible': 'อาจมีพายุฝนฟ้าคะนอง',
        'blowing snow': 'หิมะปลิว',
        'blizzard': 'พายุหิมะ',
        'freezing fog': 'หมอกแข็ง',
        'patchy light drizzle': 'น้ำค้างเบาเป็นช่วง',
        'light drizzle': 'น้ำค้างเบา',
        'freezing drizzle': 'น้ำค้างแข็ง',
        'heavy freezing drizzle': 'น้ำค้างแข็งแรง',
        'patchy light rain': 'ฝนเบาเป็นช่วง',
        'light rain': 'ฝนเบา',
        'moderate rain at times': 'ฝนปานกลางเป็นครั้งคราว',
        'moderate rain': 'ฝนปานกลาง',
        'heavy rain at times': 'ฝนแรงเป็นครั้งคราว',
        'heavy rain': 'ฝนแรง',
        'light freezing rain': 'ฝนแข็งเบา',
        'moderate or heavy freezing rain': 'ฝนแข็งปานกลางหรือแรง',
        'light sleet': 'หิมะปนฝนเบา',
        'moderate or heavy sleet': 'หิมะปนฝนปานกลางหรือแรง',
        'patchy light snow': 'หิมะเบาเป็นช่วง',
        'light snow': 'หิมะเบา',
        'patchy moderate snow': 'หิมะปานกลางเป็นช่วง',
        'moderate snow': 'หิมะปานกลาง',
        'patchy heavy snow': 'หิมะแรงเป็นช่วง',
        'heavy snow': 'หิมะแรง',
        'ice pellets': 'ลูกเห็บ',
        'light rain shower': 'ฝนเบาสั้นๆ',
        'moderate or heavy rain shower': 'ฝนปานกลางหรือแรงสั้นๆ',
        'torrential rain shower': 'ฝนแรงสั้นๆ',
        'light sleet showers': 'หิมะปนฝนเบาสั้นๆ',
        'moderate or heavy sleet showers': 'หิมะปนฝนปานกลางหรือแรงสั้นๆ',
        'light snow showers': 'หิมะเบาสั้นๆ',
        'moderate or heavy snow showers': 'หิมะปานกลางหรือแรงสั้นๆ',
        'light showers of ice pellets': 'ลูกเห็บเบาสั้นๆ',
        'moderate or heavy showers of ice pellets': 'ลูกเห็บปานกลางหรือแรงสั้นๆ',
        'patchy light rain with thunder': 'ฝนเบาเป็นช่วงพร้อมฟ้าผ่า',
        'moderate or heavy rain with thunder': 'ฝนปานกลางหรือแรงพร้อมฟ้าผ่า',
        'patchy light snow with thunder': 'หิมะเบาเป็นช่วงพร้อมฟ้าผ่า',
        'moderate or heavy snow with thunder': 'หิมะปานกลางหรือแรงพร้อมฟ้าผ่า',
        '局部多云': 'มีเมฆบางส่วน'
      },
      'vi': {
        'clear sky': 'Trời quang',
        'few clouds': 'Ít mây',
        'scattered clouds': 'Nhiều mây',
        'broken clouds': 'U ám',
        'shower rain': 'Mưa rào',
        'rain': 'Mưa',
        'thunderstorm': 'Giông bão',
        'snow': 'Tuyết',
        'haze': 'Sương mù nhẹ',
        'smoke': 'Khói',
        'dust': 'Bụi',
        'sand': 'Cát',
        'ash': 'Tro núi lửa',
        'squall': 'Gió mạnh',
        'tornado': 'Lốc xoáy',
        // WeatherAPI.com 描述
        'sunny': 'Trời nắng',
        'partly cloudy': 'Ít mây',
        'cloudy': 'Nhiều mây',
        'overcast': 'U ám',
        'mist': 'Sương mù',
        'fog': 'Sương mù',
        'patchy rain possible': 'Có thể mưa rào',
        'patchy snow possible': 'Có thể có tuyết',
        'patchy sleet possible': 'Có thể có mưa tuyết',
        'patchy freezing drizzle possible': 'Có thể có mưa đá',
        'thundery outbreaks possible': 'Có thể có giông bão',
        'blowing snow': 'Tuyết bay',
        'blizzard': 'Bão tuyết',
        'freezing fog': 'Sương mù đóng băng',
        'patchy light drizzle': 'Mưa phùn nhẹ',
        'light drizzle': 'Mưa phùn nhẹ',
        'freezing drizzle': 'Mưa đá',
        'heavy freezing drizzle': 'Mưa đá mạnh',
        'patchy light rain': 'Mưa nhẹ',
        'light rain': 'Mưa nhẹ',
        'moderate rain at times': 'Mưa vừa',
        'moderate rain': 'Mưa vừa',
        'heavy rain at times': 'Mưa to',
        'heavy rain': 'Mưa to',
        'light freezing rain': 'Mưa đá nhẹ',
        'moderate or heavy freezing rain': 'Mưa đá vừa hoặc mạnh',
        'light sleet': 'Mưa tuyết nhẹ',
        'moderate or heavy sleet': 'Mưa tuyết vừa hoặc mạnh',
        'patchy light snow': 'Tuyết nhẹ',
        'light snow': 'Tuyết nhẹ',
        'patchy moderate snow': 'Tuyết vừa',
        'moderate snow': 'Tuyết vừa',
        'patchy heavy snow': 'Tuyết to',
        'heavy snow': 'Tuyết to',
        'ice pellets': 'Mưa đá',
        'light rain shower': 'Mưa rào nhẹ',
        'moderate or heavy rain shower': 'Mưa rào vừa hoặc mạnh',
        'torrential rain shower': 'Mưa rào to',
        'light sleet showers': 'Mưa tuyết nhẹ',
        'moderate or heavy sleet showers': 'Mưa tuyết vừa hoặc mạnh',
        'light snow showers': 'Tuyết nhẹ',
        'moderate or heavy snow showers': 'Tuyết vừa hoặc mạnh',
        'light showers of ice pellets': 'Mưa đá nhẹ',
        'moderate or heavy showers of ice pellets': 'Mưa đá vừa hoặc mạnh',
        'patchy light rain with thunder': 'Mưa nhẹ có sấm',
        'moderate or heavy rain with thunder': 'Mưa vừa hoặc mạnh có sấm',
        'patchy light snow with thunder': 'Tuyết nhẹ có sấm',
        'moderate or heavy snow with thunder': 'Tuyết vừa hoặc mạnh có sấm',
        '局部多云': 'Ít mây'
      },
      'ms': {
        'clear sky': 'Cerah',
        'few clouds': 'Sedikit berawan',
        'scattered clouds': 'Berawan',
        'broken clouds': 'Mendung',
        'shower rain': 'Hujan renyai',
        'rain': 'Hujan',
        'thunderstorm': 'Ribut petir',
        'snow': 'Salji',
        'haze': 'Jerebu',
        'smoke': 'Asap',
        'dust': 'Debu',
        'sand': 'Pasir',
        'ash': 'Abu gunung berapi',
        'squall': 'Angin kencang',
        'tornado': 'Puting beliung',
        // WeatherAPI.com 描述
        'sunny': 'Cerah',
        'partly cloudy': 'Sedikit berawan',
        'cloudy': 'Berawan',
        'overcast': 'Mendung',
        'mist': 'Kabut',
        'fog': 'Kabut',
        'patchy rain possible': 'Hujan renyai mungkin',
        'patchy snow possible': 'Salji mungkin',
        'patchy sleet possible': 'Hujan salji mungkin',
        'patchy freezing drizzle possible': 'Hujan beku mungkin',
        'thundery outbreaks possible': 'Ribut petir mungkin',
        'blowing snow': 'Salji berterbangan',
        'blizzard': 'Ribut salji',
        'freezing fog': 'Kabut beku',
        'patchy light drizzle': 'Hujan renyai ringan',
        'light drizzle': 'Hujan renyai ringan',
        'freezing drizzle': 'Hujan beku',
        'heavy freezing drizzle': 'Hujan beku lebat',
        'patchy light rain': 'Hujan ringan',
        'light rain': 'Hujan ringan',
        'moderate rain at times': 'Hujan sederhana',
        'moderate rain': 'Hujan sederhana',
        'heavy rain at times': 'Hujan lebat',
        'heavy rain': 'Hujan lebat',
        'light freezing rain': 'Hujan beku ringan',
        'moderate or heavy freezing rain': 'Hujan beku sederhana atau lebat',
        'light sleet': 'Hujan salji ringan',
        'moderate or heavy sleet': 'Hujan salji sederhana atau lebat',
        'patchy light snow': 'Salji ringan',
        'light snow': 'Salji ringan',
        'patchy moderate snow': 'Salji sederhana',
        'moderate snow': 'Salji sederhana',
        'patchy heavy snow': 'Salji lebat',
        'heavy snow': 'Salji lebat',
        'ice pellets': 'Hujan batu',
        'light rain shower': 'Hujan ringan',
        'moderate or heavy rain shower': 'Hujan sederhana atau lebat',
        'torrential rain shower': 'Hujan lebat',
        'light sleet showers': 'Hujan salji ringan',
        'moderate or heavy sleet showers': 'Hujan salji sederhana atau lebat',
        'light snow showers': 'Salji ringan',
        'moderate or heavy snow showers': 'Salji sederhana atau lebat',
        'light showers of ice pellets': 'Hujan batu ringan',
        'moderate or heavy showers of ice pellets': 'Hujan batu sederhana atau lebat',
        'patchy light rain with thunder': 'Hujan ringan dengan petir',
        'moderate or heavy rain with thunder': 'Hujan sederhana atau lebat dengan petir',
        'patchy light snow with thunder': 'Salji ringan dengan petir',
        'moderate or heavy snow with thunder': 'Salji sederhana atau lebat dengan petir',
        '局部多云': 'Sedikit berawan'
      },
      'la': {
        'clear sky': 'Serenum',
        'few clouds': 'Nubibus paucis',
        'scattered clouds': 'Nubibus dispersis',
        'broken clouds': 'Nubibus fractis',
        'shower rain': 'Imbre',
        'rain': 'Pluvia',
        'thunderstorm': 'Tempestas',
        'snow': 'Nix',
        'haze': 'Caligo',
        'smoke': 'Fumus',
        'dust': 'Pulvis',
        'sand': 'Arena',
        'ash': 'Cinis',
        'squall': 'Procella',
        'tornado': 'Turbo',
        // WeatherAPI.com 描述
        'sunny': 'Serenum',
        'partly cloudy': 'Nubibus paucis',
        'cloudy': 'Nubibus',
        'overcast': 'Nubibus densis',
        'mist': 'Nebula',
        'fog': 'Nebula',
        'patchy rain possible': 'Imbre possibilis',
        'patchy snow possible': 'Nix possibilis',
        'patchy sleet possible': 'Nix pluvia possibilis',
        'patchy freezing drizzle possible': 'Gelida pluvia possibilis',
        'thundery outbreaks possible': 'Tempestas possibilis',
        'blowing snow': 'Nix ventosa',
        'blizzard': 'Procella nivis',
        'freezing fog': 'Gelida nebula',
        'patchy light drizzle': 'Levis pluvia',
        'light drizzle': 'Levis pluvia',
        'freezing drizzle': 'Gelida pluvia',
        'heavy freezing drizzle': 'Gravis gelida pluvia',
        'patchy light rain': 'Levis pluvia',
        'light rain': 'Levis pluvia',
        'moderate rain at times': 'Moderata pluvia',
        'moderate rain': 'Moderata pluvia',
        'heavy rain at times': 'Gravis pluvia',
        'heavy rain': 'Gravis pluvia',
        'light freezing rain': 'Levis gelida pluvia',
        'moderate or heavy freezing rain': 'Moderata vel gravis gelida pluvia',
        'light sleet': 'Levis nix pluvia',
        'moderate or heavy sleet': 'Moderata vel gravis nix pluvia',
        'patchy light snow': 'Levis nix',
        'light snow': 'Levis nix',
        'patchy moderate snow': 'Moderata nix',
        'moderate snow': 'Moderata nix',
        'patchy heavy snow': 'Gravis nix',
        'heavy snow': 'Gravis nix',
        'ice pellets': 'Glacies grana',
        'light rain shower': 'Levis pluvia',
        'moderate or heavy rain shower': 'Moderata vel gravis pluvia',
        'torrential rain shower': 'Torrens pluvia',
        'light sleet showers': 'Levis nix pluvia',
        'moderate or heavy sleet showers': 'Moderata vel gravis nix pluvia',
        'light snow showers': 'Levis nix',
        'moderate or heavy snow showers': 'Moderata vel gravis nix',
        'light showers of ice pellets': 'Levis glacies grana',
        'moderate or heavy showers of ice pellets': 'Moderata vel gravis glacies grana',
        'patchy light rain with thunder': 'Levis pluvia cum tonitru',
        'moderate or heavy rain with thunder': 'Moderata vel gravis pluvia cum tonitru',
        'patchy light snow with thunder': 'Levis nix cum tonitru',
        'moderate or heavy snow with thunder': 'Moderata vel gravis nix cum tonitru',
        '局部多云': 'Nubibus paucis'
      }
    };

    // 城市名稱多語言映射
    const cityNameMap: Record<string, Record<string, string>> = {
      'zh-TW': {
        'Taipei': '台北市',
        'Taichung': '台中市',
        'Tainan': '台南市',
        'Kaohsiung': '高雄市',
        'New Taipei': '新北市',
        'Taoyuan': '桃園市',
        'Hsinchu': '新竹市',
        'Chiayi': '嘉義市',
        'Keelung': '基隆市',
        'Hualien': '花蓮縣',
        'Taitung': '台東縣',
        'Pingtung': '屏東縣',
        'Yilan': '宜蘭縣',
        'Nantou': '南投縣',
        'Yunlin': '雲林縣',
        'Changhua': '彰化縣',
        'Miaoli': '苗栗縣'
      },
              'zh-CN': {
          'Taipei': '台北市',
          'Taichung': '台中市',
          'Tainan': '台南市',
          'Kaohsiung': '高雄市',
          'New Taipei': '新北市',
          'Taoyuan': '桃园市',
          'Hsinchu': '新竹市',
          'Chiayi': '嘉义市',
          'Keelung': '基隆市',
          'Hualien': '花莲县',
          'Taitung': '台东县',
          'Pingtung': '屏东县',
          'Yilan': '宜兰县',
          'Nantou': '南投县',
          'Yunlin': '云林县',
          'Changhua': '彰化县',
          'Miaoli': '苗栗县'
      },
      'en': {
        'Taipei': 'Taipei',
        'Taichung': 'Taichung',
        'Tainan': 'Tainan',
        'Kaohsiung': 'Kaohsiung',
        'New Taipei': 'New Taipei',
        'Taoyuan': 'Taoyuan',
        'Hsinchu': 'Hsinchu',
        'Chiayi': 'Chiayi',
        'Keelung': 'Keelung',
        'Hualien': 'Hualien',
        'Taitung': 'Taitung',
        'Pingtung': 'Pingtung',
        'Yilan': 'Yilan',
        'Nantou': 'Nantou',
        'Yunlin': 'Yunlin',
        'Changhua': 'Changhua',
        'Miaoli': 'Miaoli'
      },
      'ja': {
        'Taipei': '台北',
        'Taichung': '台中',
        'Tainan': '台南',
        'Kaohsiung': '高雄',
        'New Taipei': '新北',
        'Taoyuan': '桃園',
        'Hsinchu': '新竹',
        'Chiayi': '嘉義',
        'Keelung': '基隆',
        'Hualien': '花蓮',
        'Taitung': '台東',
        'Pingtung': '屏東',
        'Yilan': '宜蘭',
        'Nantou': '南投',
        'Yunlin': '雲林',
        'Changhua': '彰化',
        'Miaoli': '苗栗'
      },
      'ko': {
        'Taipei': '타이페이',
        'Taichung': '타이중',
        'Tainan': '타이난',
        'Kaohsiung': '가오슝',
        'New Taipei': '신베이',
        'Taoyuan': '타오위안',
        'Hsinchu': '신주',
        'Chiayi': '자이',
        'Keelung': '지룽',
        'Hualien': '화롄',
        'Taitung': '타이둥',
        'Pingtung': '핑둥',
        'Yilan': '이란',
        'Nantou': '난터우',
        'Yunlin': '윈린',
        'Changhua': '창화',
        'Miaoli': '먀오리'
      },
      'th': {
        'Taipei': 'ไทเป',
        'Taichung': 'ไทจง',
        'Tainan': 'ไทหนาน',
        'Kaohsiung': 'เกาสง',
        'New Taipei': 'ซินเป่ย์',
        'Taoyuan': 'เถาหยวน',
        'Hsinchu': 'ซินจู๋',
        'Chiayi': 'เจียอี้',
        'Keelung': 'จีหลง',
        'Hualien': 'ฮวาเหลียน',
        'Taitung': 'ไถตง',
        'Pingtung': 'ผิงตง',
        'Yilan': 'อี๋หลาน',
        'Nantou': 'หนานโถว',
        'Yunlin': 'ยฺหวินหลิน',
        'Changhua': 'จางฮัว',
        'Miaoli': 'เหมียวลี่'
      },
      'vi': {
        'Taipei': 'Đài Bắc',
        'Taichung': 'Đài Trung',
        'Tainan': 'Đài Nam',
        'Kaohsiung': 'Cao Hùng',
        'New Taipei': 'Tân Bắc',
        'Taoyuan': 'Đào Viên',
        'Hsinchu': 'Tân Trúc',
        'Chiayi': 'Gia Nghĩa',
        'Keelung': 'Cơ Long',
        'Hualien': 'Hoa Liên',
        'Taitung': 'Đài Đông',
        'Pingtung': 'Bình Đông',
        'Yilan': 'Nghi Lan',
        'Nantou': 'Nam Đầu',
        'Yunlin': 'Vân Lâm',
        'Changhua': 'Chương Hóa',
        'Miaoli': 'Miêu Lật'
      },
      'ms': {
        'Taipei': 'Taipei',
        'Taichung': 'Taichung',
        'Tainan': 'Tainan',
        'Kaohsiung': 'Kaohsiung',
        'New Taipei': 'New Taipei',
        'Taoyuan': 'Taoyuan',
        'Hsinchu': 'Hsinchu',
        'Chiayi': 'Chiayi',
        'Keelung': 'Keelung',
        'Hualien': 'Hualien',
        'Taitung': 'Taitung',
        'Pingtung': 'Pingtung',
        'Yilan': 'Yilan',
        'Nantou': 'Nantou',
        'Yunlin': 'Yunlin',
        'Changhua': 'Changhua',
        'Miaoli': 'Miaoli'
      },
      'la': {
        'Taipei': 'Taipeium',
        'Taichung': 'Taichungum',
        'Tainan': 'Tainanum',
        'Kaohsiung': 'Kaohsiungum',
        'New Taipei': 'Novum Taipeium',
        'Taoyuan': 'Taoyuanum',
        'Hsinchu': 'Hsinchuum',
        'Chiayi': 'Chiayium',
        'Keelung': 'Keelungum',
        'Hualien': 'Hualienum',
        'Taitung': 'Taitungum',
        'Pingtung': 'Pingtungum',
        'Yilan': 'Yilanum',
        'Nantou': 'Nantouum',
        'Yunlin': 'Yunlinum',
        'Changhua': 'Changhuaum',
        'Miaoli': 'Miaolium'
      }
    };

    // 星期多語言映射
    const weekdayMap: Record<string, string[]> = {
      'zh-TW': ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      'zh-CN': ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      'en': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      'ja': ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
      'ko': ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
      'th': ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'],
      'vi': ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
      'ms': ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],
      'la': ['Dies Solis', 'Dies Lunae', 'Dies Martis', 'Dies Mercurii', 'Dies Iovis', 'Dies Veneris', 'Dies Saturni']
    };

    // 獲取本地化內容
    const localizedDesc = weatherDescMap[currentLang]?.[weather.description.toLowerCase()] || weather.description;
    const localizedCity = cityNameMap[currentLang]?.[weather.city] || weather.city;
    const currentWeekday = weekdayMap[currentLang]?.[new Date().getDay()] || weekdayMap['en'][new Date().getDay()];

    return {
      ...weather,
      description: localizedDesc,
      city: localizedCity,
      weekday: currentWeekday
    };
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getWeekdayText = (date: Date) => {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return `星期${weekdays[date.getDay()]}`;
  };

  // 顯示loading狀態
  if (loading) {
    return (
      <div className={`weather-widget ${className}`} style={{
        background: '#ffffff',
        borderRadius: '8px',
        padding: '8px 12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        marginTop: '8px'
      }}>
        <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
          載入中...
        </div>
      </div>
    );
  }

  // 顯示錯誤狀態
  if (error) {
    return (
      <div className={`weather-widget ${className}`} style={{
        background: '#ffffff',
        borderRadius: '8px',
        padding: '8px 12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        marginTop: '8px'
      }}>
        <div style={{ fontSize: '12px', color: '#ff6b6b', textAlign: 'center' }}>
          {error}
        </div>
      </div>
    );
  }

  // 只在有真實天氣數據時顯示，否則不顯示組件
  if (!weather) {
    return null; // 不顯示預設數據
  }
  
  const localizedWeather = getLocalizedWeather(weather, lang);

  // 處理天氣組件點擊
  const handleWeatherClick = () => {
    // 跳轉到 Google 天氣頁面
    const city = weather?.city || 'Taipei';
    const weatherUrl = `https://www.google.com/search?q=weather+${encodeURIComponent(city)}`;
    window.open(weatherUrl, '_blank');
  };

  return (
    <div 
      className={`weather-widget ${className}`} 
      onClick={handleWeatherClick}
      style={{
        background: '#ffffff',
        borderRadius: '8px',
        padding: '8px 12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        marginTop: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '16px' }}>
            ☀️
          </span>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#6B5BFF' }}>
            {localizedWeather.temp}°C
          </div>
          <div style={{ fontSize: '10px', color: '#666' }}>
            {localizedWeather.description}
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          {localizedWeather.city}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          {localizedWeather.weekday}
        </div>
      </div>
    </div>
  );


};

export default WeatherWidget; 