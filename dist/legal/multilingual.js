// 多語言處理腳本 - 用於法律文件的自動語言切換
(function() {
    'use strict';

    // 支援的語言代碼
    const SUPPORTED_LANGS = ['zh-TW', 'zh-CN', 'en', 'ja', 'ko', 'th', 'vi', 'ms', 'la'];
    
    // 語言標籤映射
    const LANG_LABELS = {
        'zh-TW': '繁體中文',
        'zh-CN': '简体中文', 
        'en': 'English',
        'ja': '日本語',
        'ko': '한국어',
        'th': 'ภาษาไทย',
        'vi': 'Tiếng Việt',
        'ms': 'Bahasa Melayu',
        'la': 'Latīna'
    };

    // 獲取當前語言設定
    function getCurrentLanguage() {
        try {
            const savedLang = localStorage.getItem('lang');
            if (savedLang && SUPPORTED_LANGS.includes(savedLang)) {
                return savedLang;
            }
            
            // 如果沒有保存的語言，嘗試從瀏覽器語言檢測
            const browserLang = navigator.language || navigator.userLanguage || 'en';
            const langMap = {
                'en': 'en',
                'en-US': 'en',
                'en-GB': 'en',
                'zh-TW': 'zh-TW',
                'zh-HK': 'zh-TW',
                'zh-Hant': 'zh-TW',
                'zh-CN': 'zh-CN',
                'zh-Hans': 'zh-CN',
                'ja': 'ja',
                'ko': 'ko',
                'vi': 'vi',
                'th': 'th',
                'ms': 'ms',
                'la': 'la'
            };
            
            if (langMap[browserLang]) {
                return langMap[browserLang];
            } else if (langMap[browserLang.split('-')[0]]) {
                return langMap[browserLang.split('-')[0]];
            }
        } catch (error) {
            console.warn('Failed to get language setting:', error);
        }
        
        return 'zh-TW'; // 預設語言
    }

    // 緊急聯絡資訊的多語言資料
    const EMERGENCY_CONTACTS = {
        'zh-TW': {
            title: '緊急聯絡資訊',
            subtitle: '如果您正在經歷心理健康緊急情況，請立即尋求專業幫助：',
            contacts: [
                { country: '台灣', numbers: ['1925（安心專線）', '1995（生命線）'] },
                { country: '中國', numbers: ['400-161-9995（全國心理援助熱線）', '010-82951332（北京心理危機研究與干預中心）'] },
                { country: '美國', numbers: ['988（自殺防治熱線）', '911（緊急服務）'] },
                { country: '日本', numbers: ['0570-064-556（生命線）', '03-3264-4343（東京自殺防治中心）'] },
                { country: '韓國', numbers: ['1393（自殺防治熱線）', '1588-9191（生命線）'] },
                { country: '泰國', numbers: ['1323（心理健康熱線）', '02-713-6793（曼谷心理健康服務）'] },
                { country: '越南', numbers: ['1900-636-636（心理健康熱線）', '024-3773-0666（河內心理健康中心）'] },
                { country: '馬來西亞', numbers: ['03-7956-8145（生命線）', '03-2780-6803（心理健康協會）'] }
            ],
            note: '或立即前往最近的急診室'
        },
        'zh-CN': {
            title: '紧急联络信息',
            subtitle: '如果您正在经历心理健康紧急情况，请立即寻求专业帮助：',
            contacts: [
                { country: '台湾', numbers: ['1925（安心专线）', '1995（生命线）'] },
                { country: '中国', numbers: ['400-161-9995（全国心理援助热线）', '010-82951332（北京心理危机研究与干预中心）'] },
                { country: '美国', numbers: ['988（自杀防治热线）', '911（紧急服务）'] },
                { country: '日本', numbers: ['0570-064-556（生命线）', '03-3264-4343（东京自杀防治中心）'] },
                { country: '韩国', numbers: ['1393（自杀防治热线）', '1588-9191（生命线）'] },
                { country: '泰国', numbers: ['1323（心理健康热线）', '02-713-6793（曼谷心理健康服务）'] },
                { country: '越南', numbers: ['1900-636-636（心理健康热线）', '024-3773-0666（河内心理健康中心）'] },
                { country: '马来西亚', numbers: ['03-7956-8145（生命线）', '03-2780-6803（心理健康协会）'] }
            ],
            note: '或立即前往最近的急诊室'
        },
        'en': {
            title: 'Emergency Contact Information',
            subtitle: 'If you are experiencing a mental health emergency, please seek professional help immediately:',
            contacts: [
                { country: 'Taiwan', numbers: ['1925 (Peace of Mind Hotline)', '1995 (Lifeline)'] },
                { country: 'China', numbers: ['400-161-9995 (National Psychological Aid Hotline)', '010-82951332 (Beijing Crisis Research Center)'] },
                { country: 'USA', numbers: ['988 (Suicide Prevention Lifeline)', '911 (Emergency Services)'] },
                { country: 'Japan', numbers: ['0570-064-556 (Lifeline)', '03-3264-4343 (Tokyo Suicide Prevention Center)'] },
                { country: 'Korea', numbers: ['1393 (Suicide Prevention Hotline)', '1588-9191 (Lifeline)'] },
                { country: 'Thailand', numbers: ['1323 (Mental Health Hotline)', '02-713-6793 (Bangkok Mental Health Services)'] },
                { country: 'Vietnam', numbers: ['1900-636-636 (Mental Health Hotline)', '024-3773-0666 (Hanoi Mental Health Center)'] },
                { country: 'Malaysia', numbers: ['03-7956-8145 (Lifeline)', '03-2780-6803 (Mental Health Association)'] }
            ],
            note: 'Or go to the nearest emergency room immediately'
        },
        'ja': {
            title: '緊急連絡先情報',
            subtitle: 'メンタルヘルスの緊急事態を経験している場合は、すぐに専門家の助けを求めてください：',
            contacts: [
                { country: '台湾', numbers: ['1925（安心ホットライン）', '1995（ライフライン）'] },
                { country: '中国', numbers: ['400-161-9995（全国心理援助ホットライン）', '010-82951332（北京危機研究センター）'] },
                { country: 'アメリカ', numbers: ['988（自殺防止ライフライン）', '911（緊急サービス）'] },
                { country: '日本', numbers: ['0570-064-556（ライフライン）', '03-3264-4343（東京自殺防止センター）'] },
                { country: '韓国', numbers: ['1393（自殺防止ホットライン）', '1588-9191（ライフライン）'] },
                { country: 'タイ', numbers: ['1323（メンタルヘルスホットライン）', '02-713-6793（バンコクメンタルヘルスサービス）'] },
                { country: 'ベトナム', numbers: ['1900-636-636（メンタルヘルスホットライン）', '024-3773-0666（ハノイメンタルヘルスセンター）'] },
                { country: 'マレーシア', numbers: ['03-7956-8145（ライフライン）', '03-2780-6803（メンタルヘルス協会）'] }
            ],
            note: 'または最寄りの救急室にすぐに行ってください'
        },
        'ko': {
            title: '긴급 연락처 정보',
            subtitle: '정신 건강 비상 상황을 겪고 있다면 즉시 전문가의 도움을 받으세요:',
            contacts: [
                { country: '대만', numbers: ['1925（마음의 평화 핫라인）', '1995（생명선）'] },
                { country: '중국', numbers: ['400-161-9995（전국 심리 지원 핫라인）', '010-82951332（베이징 위기 연구 센터）'] },
                { country: '미국', numbers: ['988（자살 예방 생명선）', '911（긴급 서비스）'] },
                { country: '일본', numbers: ['0570-064-556（생명선）', '03-3264-4343（도쿄 자살 예방 센터）'] },
                { country: '한국', numbers: ['1393（자살 예방 핫라인）', '1588-9191（생명선）'] },
                { country: '태국', numbers: ['1323（정신 건강 핫라인）', '02-713-6793（방콕 정신 건강 서비스）'] },
                { country: '베트남', numbers: ['1900-636-636（정신 건강 핫라인）', '024-3773-0666（하노이 정신 건강 센터）'] },
                { country: '말레이시아', numbers: ['03-7956-8145（생명선）', '03-2780-6803（정신 건강 협회）'] }
            ],
            note: '또는 가장 가까운 응급실로 즉시 이동하세요'
        },
        'th': {
            title: 'ข้อมูลการติดต่อฉุกเฉิน',
            subtitle: 'หากคุณกำลังประสบปัญหาสุขภาพจิตฉุกเฉิน กรุณาแสวงหาความช่วยเหลือจากผู้เชี่ยวชาญทันที:',
            contacts: [
                { country: 'ไต้หวัน', numbers: ['1925（สายด่วนใจสงบ）', '1995（สายด่วนชีวิต）'] },
                { country: 'จีน', numbers: ['400-161-9995（สายด่วนช่วยเหลือจิตวิทยาแห่งชาติ）', '010-82951332（ศูนย์วิจัยวิกฤตปักกิ่ง）'] },
                { country: 'สหรัฐอเมริกา', numbers: ['988（สายด่วนป้องกันการฆ่าตัวตาย）', '911（บริการฉุกเฉิน）'] },
                { country: 'ญี่ปุ่น', numbers: ['0570-064-556（สายด่วนชีวิต）', '03-3264-4343（ศูนย์ป้องกันการฆ่าตัวตายโตเกียว）'] },
                { country: 'เกาหลี', numbers: ['1393（สายด่วนป้องกันการฆ่าตัวตาย）', '1588-9191（สายด่วนชีวิต）'] },
                { country: 'ไทย', numbers: ['1323（สายด่วนสุขภาพจิต）', '02-713-6793（บริการสุขภาพจิตกรุงเทพฯ）'] },
                { country: 'เวียดนาม', numbers: ['1900-636-636（สายด่วนสุขภาพจิต）', '024-3773-0666（ศูนย์สุขภาพจิตฮานอย）'] },
                { country: 'มาเลเซีย', numbers: ['03-7956-8145（สายด่วนชีวิต）', '03-2780-6803（สมาคมสุขภาพจิต）'] }
            ],
            note: 'หรือไปที่ห้องฉุกเฉินที่ใกล้ที่สุดทันที'
        },
        'vi': {
            title: 'Thông tin liên lạc khẩn cấp',
            subtitle: 'Nếu bạn đang trải qua tình trạng khẩn cấp về sức khỏe tâm thần, vui lòng tìm kiếm sự giúp đỡ chuyên môn ngay lập tức:',
            contacts: [
                { country: 'Đài Loan', numbers: ['1925（Đường dây nóng Bình yên）', '1995（Đường dây cứu hộ）'] },
                { country: 'Trung Quốc', numbers: ['400-161-9995（Đường dây nóng hỗ trợ tâm lý quốc gia）', '010-82951332（Trung tâm nghiên cứu khủng hoảng Bắc Kinh）'] },
                { country: 'Hoa Kỳ', numbers: ['988（Đường dây cứu hộ phòng chống tự tử）', '911（Dịch vụ khẩn cấp）'] },
                { country: 'Nhật Bản', numbers: ['0570-064-556（Đường dây cứu hộ）', '03-3264-4343（Trung tâm phòng chống tự tử Tokyo）'] },
                { country: 'Hàn Quốc', numbers: ['1393（Đường dây nóng phòng chống tự tử）', '1588-9191（Đường dây cứu hộ）'] },
                { country: 'Thái Lan', numbers: ['1323（Đường dây nóng sức khỏe tâm thần）', '02-713-6793（Dịch vụ sức khỏe tâm thần Bangkok）'] },
                { country: 'Việt Nam', numbers: ['1900-636-636（Đường dây nóng sức khỏe tâm thần）', '024-3773-0666（Trung tâm sức khỏe tâm thần Hà Nội）'] },
                { country: 'Malaysia', numbers: ['03-7956-8145（Đường dây cứu hộ）', '03-2780-6803（Hiệp hội sức khỏe tâm thần）'] }
            ],
            note: 'Hoặc đến phòng cấp cứu gần nhất ngay lập tức'
        },
        'ms': {
            title: 'Maklumat Hubungan Kecemasan',
            subtitle: 'Jika anda mengalami kecemasan kesihatan mental, sila dapatkan bantuan profesional dengan segera:',
            contacts: [
                { country: 'Taiwan', numbers: ['1925（Talian Panas Kedamaian）', '1995（Talian Hayat）'] },
                { country: 'China', numbers: ['400-161-9995（Talian Panas Bantuan Psikologi Kebangsaan）', '010-82951332（Pusat Penyelidikan Krisis Beijing）'] },
                { country: 'USA', numbers: ['988（Talian Hayat Pencegahan Bunuh Diri）', '911（Perkhidmatan Kecemasan）'] },
                { country: 'Jepun', numbers: ['0570-064-556（Talian Hayat）', '03-3264-4343（Pusat Pencegahan Bunuh Diri Tokyo）'] },
                { country: 'Korea', numbers: ['1393（Talian Panas Pencegahan Bunuh Diri）', '1588-9191（Talian Hayat）'] },
                { country: 'Thailand', numbers: ['1323（Talian Panas Kesihatan Mental）', '02-713-6793（Perkhidmatan Kesihatan Mental Bangkok）'] },
                { country: 'Vietnam', numbers: ['1900-636-636（Talian Panas Kesihatan Mental）', '024-3773-0666（Pusat Kesihatan Mental Hanoi）'] },
                { country: 'Malaysia', numbers: ['03-7956-8145（Talian Hayat）', '03-2780-6803（Persatuan Kesihatan Mental）'] }
            ],
            note: 'Atau pergi ke bilik kecemasan terdekat dengan segera'
        },
        'la': {
            title: 'Informationes Contactus Urgentis',
            subtitle: 'Si experiris urgentiam sanitatis mentalis, quaere auxilium professionalem statim:',
            contacts: [
                { country: 'Taiwania', numbers: ['1925（Linea Caloris Pacis）', '1995（Linea Vitae）'] },
                { country: 'Sina', numbers: ['400-161-9995（Linea Caloris Auxilii Psychologici Nationalis）', '010-82951332（Centrum Investigationis Crisis Pekinensis）'] },
                { country: 'Civitates Foederatae', numbers: ['988（Linea Vitae Praeventionis Suicidii）', '911（Servitia Urgentia）'] },
                { country: 'Iaponia', numbers: ['0570-064-556（Linea Vitae）', '03-3264-4343（Centrum Praeventionis Suicidii Tokiense）'] },
                { country: 'Corea', numbers: ['1393（Linea Caloris Praeventionis Suicidii）', '1588-9191（Linea Vitae）'] },
                { country: 'Thailandia', numbers: ['1323（Linea Caloris Sanitatis Mentalis）', '02-713-6793（Servitia Sanitatis Mentalis Bangkokensis）'] },
                { country: 'Vietnamia', numbers: ['1900-636-636（Linea Caloris Sanitatis Mentalis）', '024-3773-0666（Centrum Sanitatis Mentalis Hanoiensis）'] },
                { country: 'Malaesia', numbers: ['03-7956-8145（Linea Vitae）', '03-2780-6803（Societas Sanitatis Mentalis）'] }
            ],
            note: 'Vel ad cubiculum urgentis proximum statim'
        }
    };

    // 更新緊急聯絡資訊顯示
    function updateEmergencyContacts() {
        const currentLang = getCurrentLanguage();
        const data = EMERGENCY_CONTACTS[currentLang] || EMERGENCY_CONTACTS['zh-TW'];
        
        // 更新標題
        const titleElements = document.querySelectorAll('.emergency-title');
        titleElements.forEach(el => {
            if (el) el.textContent = data.title;
        });
        
        // 更新副標題
        const subtitleElements = document.querySelectorAll('.emergency-subtitle');
        subtitleElements.forEach(el => {
            if (el) el.textContent = data.subtitle;
        });
        
        // 更新聯絡資訊
        const contactsContainer = document.getElementById('emergency-contacts-list');
        if (contactsContainer) {
            contactsContainer.innerHTML = '';
            data.contacts.forEach(contact => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${contact.country}：</strong>${contact.numbers.join('、')}`;
                contactsContainer.appendChild(li);
            });
        }
        
        // 更新備註
        const noteElements = document.querySelectorAll('.emergency-note');
        noteElements.forEach(el => {
            if (el) el.textContent = data.note;
        });
    }

    // 監聽語言變更
    function setupLanguageListener() {
        // 監聽 localStorage 變更
        window.addEventListener('storage', function(e) {
            if (e.key === 'lang') {
                updateEmergencyContacts();
            }
        });
        
        // 定期檢查語言設定（用於同頁面內的語言切換）
        setInterval(() => {
            const currentLang = getCurrentLanguage();
            if (window.lastDetectedLang !== currentLang) {
                window.lastDetectedLang = currentLang;
                updateEmergencyContacts();
            }
        }, 1000);
    }

    // 初始化
    function init() {
        updateEmergencyContacts();
        setupLanguageListener();
        
        // 添加語言切換按鈕（可選）
        addLanguageToggle();
    }

    // 添加語言切換按鈕
    function addLanguageToggle() {
        const container = document.querySelector('.emergency-section');
        if (!container) return;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = '🌐 ' + LANG_LABELS[getCurrentLanguage()];
        toggleBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 8px 12px;
            background: #6B5BFF;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            z-index: 1000;
        `;
        
        toggleBtn.addEventListener('click', function() {
            const currentLang = getCurrentLanguage();
            const currentIndex = SUPPORTED_LANGS.indexOf(currentLang);
            const nextIndex = (currentIndex + 1) % SUPPORTED_LANGS.length;
            const nextLang = SUPPORTED_LANGS[nextIndex];
            
            localStorage.setItem('lang', nextLang);
            toggleBtn.innerHTML = '🌐 ' + LANG_LABELS[nextLang];
            updateEmergencyContacts();
        });
        
        document.body.appendChild(toggleBtn);
    }

    // 當 DOM 加載完成後初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
