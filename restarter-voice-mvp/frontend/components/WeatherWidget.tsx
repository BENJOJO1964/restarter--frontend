import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

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
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 嘗試獲取用戶位置
      let location = { city: '台北', country: 'TW' };
      
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          
          // 使用經緯度獲取天氣和位置信息
          const response = await fetch(`https://restarter-backend-6e9s.onrender.com/api/weather/current?lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
          const data = await response.json();
          
          if (data.weather) {
            // 根據國家代碼自動切換語言顯示
            const cityName = getLocalizedCityName(data.weather.city, data.weather.country);
            setWeather({
              ...data.weather,
              city: cityName
            });
            return;
          }
        } catch (geoError) {
          console.log('無法獲取GPS位置，嘗試IP定位');
          // 嘗試使用IP定位
          try {
            const response = await fetch(`https://restarter-backend-6e9s.onrender.com/api/weather/location`);
            const locationData = await response.json();
            if (locationData.city) {
              location = locationData;
            }
          } catch (ipError) {
            console.log('無法獲取IP位置，使用預設城市');
          }
        }
      }
      
      // 使用預設或IP定位的城市
      const response = await fetch(`https://restarter-backend-6e9s.onrender.com/api/weather/current?city=${location.city}`);
      const data = await response.json();
      
      if (data.weather) {
        const cityName = getLocalizedCityName(data.weather.city, data.weather.country);
        setWeather({
          ...data.weather,
          city: cityName
        });
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

  // 根據國家代碼和語言獲取本地化城市名稱
  const getLocalizedCityName = (city: string, country: string) => {
    const cityMap: Record<string, Record<string, Record<string, string>>> = {
      'TW': {
        'zh-TW': {
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
        }
      },
      'JP': {
        'ja': {
          'Tokyo': '東京',
          'Osaka': '大阪',
          'Kyoto': '京都',
          'Yokohama': '横浜',
          'Nagoya': '名古屋',
          'Sapporo': '札幌',
          'Kobe': '神戸',
          'Fukuoka': '福岡',
          'Kawasaki': '川崎',
          'Saitama': 'さいたま'
        }
      },
      'KR': {
        'ko': {
          'Seoul': '서울',
          'Busan': '부산',
          'Incheon': '인천',
          'Daegu': '대구',
          'Daejeon': '대전',
          'Gwangju': '광주',
          'Suwon': '수원',
          'Ulsan': '울산',
          'Seongnam': '성남',
          'Bucheon': '부천'
        }
      }
    };

    // 根據當前語言和國家代碼獲取本地化名稱
    const countryMap = cityMap[country];
    if (countryMap && countryMap[lang]) {
      return countryMap[lang][city] || city;
    }
    
    return city;
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getWeekdayText = (date: Date) => {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return `星期${weekdays[date.getDay()]}`;
  };

  if (loading) {
    return (
      <div className={`weather-widget loading ${className}`}>
        <div className="weather-skeleton">
          <div className="temp-skeleton"></div>
          <div className="desc-skeleton"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className={`weather-widget error ${className}`}>
        <div className="weather-error">
          <span>🌤️</span>
          <span>天氣資訊暫時無法顯示</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`weather-widget ${className}`}>
      <div className="weather-main">
        <div className="weather-left">
          <div className="weather-icon">
            <img src={getWeatherIcon(weather.icon)} alt={weather.description} />
          </div>
          <div className="weather-info">
            <div className="weather-temp">{weather.temp}°C</div>
            <div className="weather-desc">{weather.description}</div>
          </div>
        </div>
        <div className="weather-center">
          <div className="weather-city">{weather.city}</div>
        </div>
        <div className="weather-right">
          <div className="weather-weekday">{getWeekdayText(new Date())}</div>
        </div>
      </div>
      
      {showDetails && (
        <div className="weather-details">
          <div className="weather-detail-item">
            <span>體感溫度</span>
            <span>{weather.feelsLike}°C</span>
          </div>
          <div className="weather-detail-item">
            <span>濕度</span>
            <span>{weather.humidity}%</span>
          </div>
          <div className="weather-detail-item">
            <span>風速</span>
            <span>{weather.windSpeed} m/s</span>
          </div>
          <div className="weather-detail-item">
            <span>能見度</span>
            <span>{weather.visibility} km</span>
          </div>
        </div>
      )}
      
      <style>{`
        .weather-widget {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 10px;
          padding: 8px 12px;
          box-shadow: 0 2px 8px rgba(107, 91, 255, 0.1);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin-top: 8px;
        }
        
        .weather-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }
        
        .weather-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .weather-icon img {
          width: 28px;
          height: 28px;
        }
        
        .weather-info {
          flex: 1;
        }
        
        .weather-temp {
          font-size: 16px;
          font-weight: 700;
          color: #6B5BFF;
          line-height: 1;
        }
        
        .weather-desc {
          font-size: 11px;
          color: #666;
          margin-top: 1px;
        }
        
        .weather-center {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
        }
        
        .weather-city {
          font-size: 10px;
          color: #666;
          text-align: center;
        }
        
        .weather-right {
          display: flex;
          align-items: center;
        }
        
        .weather-weekday {
          font-size: 11px;
          color: #6B5BFF;
          font-weight: 600;
          padding: 3px 6px;
          background: rgba(107, 91, 255, 0.1);
          border-radius: 4px;
        }
        
        .weather-details {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #eee;
        }
        
        .weather-detail-item {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }
        
        .weather-error {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #999;
          font-size: 14px;
        }
        
        .weather-skeleton {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .temp-skeleton {
          width: 60px;
          height: 24px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        
        .desc-skeleton {
          width: 80px;
          height: 14px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default WeatherWidget; 