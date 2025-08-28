import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTestMode } from '../App';
import Footer from '../components/Footer';
import { LanguageSelector } from '../components/LanguageSelector';

interface Milestone {
  id: number;
  title: string;
  description: string;
  date: string;
  type: string;
  completed: boolean;
}

const TEXTS = {
  'zh-TW': {
    title: '社會融入度評估',
    subtitle: '評估您的社會融入度，獲得專業建議',
    subtitle2: '勇敢面對並定期檢測自身社會融入程度進步狀況，每一次評估都是成長的機會',
    backToHome: '返回',
    startAssessment: '開始評估',
    submitAssessment: '提交評估',
    cancelAssessment: '取消',
    closeAssessment: '關閉',
    assessmentComplete: '評估完成',
    viewReport: '查看報告',
    closeReport: '關閉報告',
    // 評估問題
    q1Title: '人際關係',
    q1Desc: '最近3個月，您與他人的互動和社交能力如何？包括與同事、朋友、鄰居的日常交流，以及在新環境中建立關係的能力。您是否能夠主動與他人溝通，建立信任關係，並在社交場合中感到自在？',
    q2Title: '就業狀況',
    q2Desc: '最近1年，您的工作穩定性和發展前景如何？包括工作滿意度、薪資待遇、職業發展機會、工作環境適應性，以及對未來職業規劃的清晰度。您是否對當前工作感到滿意，並有明確的職業發展目標？',
    q3Title: '家庭關係',
    q3Desc: '最近6個月，您與家人的相處和溝通狀況如何？包括與配偶、子女、父母或其他家庭成員的關係質量，溝通頻率和效果，以及家庭氛圍的和諧程度。您是否能夠有效處理家庭衝突，並為家庭成員提供情感支持？',
    q4Title: '未來信心',
    q4Desc: '您對未來1年的樂觀程度和規劃如何？包括對個人發展的信心，對生活目標的清晰度，以及面對挑戰時的積極態度。您是否對未來有明確的規劃，並相信自己能夠實現目標？',
    q5Title: '社會接納',
    q5Desc: '最近6個月，您感覺被社會接受和認可的程度如何？包括在社區中的融入度，社會地位的認同感，以及對社會規範的適應能力。您是否感到被社會接納，並對自己的社會角色感到滿意？',
    q6Title: '情緒管理',
    q6Desc: '最近3個月，您處理壓力和負面情緒的能力如何？包括面對挫折時的情緒反應，壓力調節方法，以及心理健康維護的意識。您是否能夠有效管理負面情緒，並在壓力下保持冷靜？',
    q7Title: '生活規律',
    q7Desc: '最近6個月，您的生活作息和規律性如何？包括日常作息時間，飲食習慣，運動頻率，以及生活節奏的穩定性。您是否能夠維持健康的生活習慣，並建立規律的日常生活？',
    q8Title: '學習成長',
    q8Desc: '最近1年，您在技能學習和個人成長方面的投入如何？包括新技能學習，知識更新，自我提升的積極性，以及對個人發展的投資。您是否持續學習新知識，並主動尋求個人成長機會？',
    q9Title: '財務管理',
    q9Desc: '最近1年，您的財務規劃和理財能力如何？包括收入支出管理，儲蓄習慣，投資理財意識，以及對未來財務安全的規劃。您是否能夠有效管理個人財務，並為未來做好財務準備？',
    q10Title: '健康狀況',
    q10Desc: '最近6個月，您的身體和心理健康狀況如何？包括身體健康狀況，心理健康狀態，醫療保健意識，以及對健康問題的預防和處理能力。您是否重視健康管理，並採取積極的健康維護措施？',
    q11Title: '社交網絡',
    q11Desc: '最近3個月，您建立和維護社交關係的能力如何？包括朋友數量，社交活動參與度，人際關係質量，以及社交網絡的廣度和深度。您是否擁有穩定的社交圈，並能夠與他人建立有意義的關係？',
    q12Title: '目標設定',
    q12Desc: '最近1年，您設定和追求個人目標的能力如何？包括目標的明確性，計劃的可行性，執行力，以及對目標達成度的評估。您是否能夠設定清晰的目標，並有效執行計劃？',
    q13Title: '適應能力',
    q13Desc: '最近6個月，您適應環境變化和挑戰的能力如何？包括面對新環境的適應速度，應對變化的靈活性，以及從挫折中恢復的能力。您是否能夠快速適應新環境，並在變化中保持穩定？',
    q14Title: '責任感',
    q14Desc: '最近1年，您對自己和他人負責的態度如何？包括對個人行為的責任感，對他人承諾的履行，以及對社會責任的認知。您是否能夠承擔個人責任，並對他人和社會負責？',
    q15Title: '自我認同',
    q15Desc: '最近6個月，您對自我價值和身份的認同感如何？包括對個人價值的認知，自我接納程度，以及對個人身份的滿意度。您是否對自己有清晰的認知，並能夠接納自己的優缺點？',
    q16Title: '社區參與',
    q16Desc: '最近1年，您參與社區活動和公益服務的情況如何？包括志願服務參與度，社區活動貢獻，以及對社會公益的關注和參與。您是否積極參與社區活動，並為社會做出貢獻？',
    q17Title: '職業發展',
    q17Desc: '最近1年，您在職業技能提升和職涯規劃方面的表現如何？包括專業技能發展，職業規劃清晰度，以及對職業發展機會的把握。您是否持續提升職業技能，並有明確的職業發展路徑？',
    q18Title: '人際衝突處理',
    q18Desc: '最近3個月，您處理人際衝突和分歧的能力如何？包括衝突解決技巧，溝通協調能力，以及維護關係的智慧。您是否能夠有效處理人際衝突，並在分歧中尋求共識？',
    q19Title: '時間管理',
    q19Desc: '最近1年，您合理安排時間和優先級的能力如何？包括時間規劃效率，任務優先級設定，以及工作生活平衡的維持。您是否能夠有效管理時間，並在多重任務中保持效率？',
    q20Title: '整體滿意度',
    q20Desc: '最近6個月，您對整體生活狀況的滿意度如何？包括對生活質量的整體評價，對個人成就的滿意度，以及對未來生活前景的樂觀程度。您是否對當前的生活狀況感到滿意，並對未來充滿希望？',
    // 選項
    excellent: '非常好',
    good: '良好',
    fair: '一般',
    poor: '需要改善',
    terrible: '非常糟糕',
    // 報告
    scoreLabel: '評估分數',
    resultLabel: '評估結果',
    descriptionLabel: '詳細分析',
    recommendationsLabel: '改善建議',
    analysisLabel: '專業分析',
    // Footer
    privacyPolicy: '隱私權政策',
    terms: '條款/聲明',
    dataDeletion: '資料刪除說明',
    about: '🧬 Restarter™｜我們是誰',
    feedback: '💬 意見箱｜我們想聽你說'
  },
  'zh-CN': {
    title: '社会融入度评估',
    subtitle: '评估您的社会融入度，获得专业建议',
    subtitle2: '勇敢面对并定期检测自身社会融入程度进步状况，每一次评估都是成长的机会',
    backToHome: '返回',
    startAssessment: '开始评估',
    submitAssessment: '提交评估',
    cancelAssessment: '取消',
    closeAssessment: '关闭',
    assessmentComplete: '评估完成',
    viewReport: '查看报告',
    closeReport: '关闭报告',
    // 评估问题
    q1Title: '人际关系',
    q1Desc: '最近3个月，您与他人的互动和社交能力如何？包括与同事、朋友、邻居的日常交流，以及在新环境中建立关系的能力。您是否能够主动与他人沟通，建立信任关系，并在社交场合中感到自在？',
    q2Title: '就业状况',
    q2Desc: '最近1年，您的工作稳定性和发展前景如何？包括工作满意度、薪资待遇、职业发展机会、工作环境适应性，以及对未来职业规划的清晰度。您是否对当前工作感到满意，并有明确的职业发展目标？',
    q3Title: '家庭关系',
    q3Desc: '最近6个月，您与家人的相处和沟通状况如何？包括与配偶、子女、父母或其他家庭成员的关系质量，沟通频率和效果，以及家庭氛围的和谐程度。您是否能够有效处理家庭冲突，并为家庭成员提供情感支持？',
    q4Title: '未来信心',
    q4Desc: '您对未来1年的乐观程度和规划如何？包括对个人发展的信心，对生活目标的清晰度，以及面对挑战时的积极态度。您是否对未来有明确的规划，并相信自己能够实现目标？',
    q5Title: '社会接纳',
    q5Desc: '最近6个月，您感觉被社会接受和认可的程度如何？包括在社区中的融入度，社会地位的认同感，以及对社会规范的适应能力。您是否感到被社会接纳，并对自己的社会角色感到满意？',
    q6Title: '情绪管理',
    q6Desc: '最近3个月，您处理压力和负面情绪的能力如何？包括面对挫折时的情绪反应，压力调节方法，以及心理健康维护的意识。您是否能够有效管理负面情绪，并在压力下保持冷静？',
    q7Title: '生活规律',
    q7Desc: '最近6个月，您的生活作息和规律性如何？包括日常作息时间，饮食习惯，运动频率，以及生活节奏的稳定性。您是否能够维持健康的生活习惯，并建立规律的日常生活？',
    q8Title: '学习成长',
    q8Desc: '最近1年，您在技能学习和个人成长方面的投入如何？包括新技能学习，知识更新，自我提升的积极性，以及对个人发展的投资。您是否持续学习新知识，并主动寻求个人成长机会？',
    q9Title: '财务管理',
    q9Desc: '最近1年，您的财务规划和理财能力如何？包括收入支出管理，储蓄习惯，投资理财意识，以及对未来财务安全的规划。您是否能够有效管理个人财务，并为未来做好财务准备？',
    q10Title: '健康状况',
    q10Desc: '最近6个月，您的身体和心理健康状况如何？包括身体健康状况，心理健康状态，医疗保健意识，以及对健康问题的预防和处理能力。您是否重视健康管理，并采取积极的健康维护措施？',
    q11Title: '社交网络',
    q11Desc: '最近3个月，您建立和维护社交关系的能力如何？包括朋友数量，社交活动参与度，人际关系质量，以及社交网络的广度和深度。您是否拥有稳定的社交圈，并能够与他人建立有意义的关系？',
    q12Title: '目标设定',
    q12Desc: '最近1年，您设定和追求个人目标的能力如何？包括目标的明确性，计划的可行性，执行力，以及对目标达成度的评估。您是否能够设定清晰的目标，并有效执行计划？',
    q13Title: '适应能力',
    q13Desc: '最近6个月，您适应环境变化和挑战的能力如何？包括面对新环境的适应速度，应对变化的灵活性，以及从挫折中恢复的能力。您是否能够快速适应新环境，并在变化中保持稳定？',
    q14Title: '责任感',
    q14Desc: '最近1年，您对自己和他人负责的态度如何？包括对个人行为的责任感，对他人承诺的履行，以及对社会责任的认识。您是否能够承担个人责任，并对他人和社会负责？',
    q15Title: '自我认同',
    q15Desc: '最近6个月，您对自我价值和身份的认同感如何？包括对个人价值的认知，自我接纳程度，以及对个人身份的满意度。您是否对自己有清晰的认知，并能够接纳自己的优缺点？',
    q16Title: '社区参与',
    q16Desc: '最近1年，您参与社区活动和公益服务的情况如何？包括志愿服务参与度，社区活动贡献，以及对社会公益的关注和参与。您是否积极参与社区活动，并为社会做出贡献？',
    q17Title: '职业发展',
    q17Desc: '最近1年，您在职业技能提升和职涯规划方面的表现如何？包括专业技能发展，职业规划清晰度，以及对职业发展机会的把握。您是否持续提升职业技能，并有明确的职业发展路径？',
    q18Title: '人际冲突处理',
    q18Desc: '最近3个月，您处理人际冲突和分歧的能力如何？包括冲突解决技巧，沟通协调能力，以及维护关系的智慧。您是否能够有效处理人际冲突，并在分歧中寻求共识？',
    q19Title: '时间管理',
    q19Desc: '最近1年，您合理安排时间和优先级的能力如何？包括时间规划效率，任务优先级设定，以及工作生活平衡的维持。您是否能够有效管理时间，并在多重任务中保持效率？',
    q20Title: '整体满意度',
    q20Desc: '最近6个月，您对整体生活状况的满意度如何？包括对生活质量的整体评价，对个人成就的满意度，以及对未来生活前景的乐观程度。您是否对当前的生活状况感到满意，并对未来充满希望？',
    // 选项
    excellent: '非常好',
    good: '良好',
    fair: '一般',
    poor: '需要改善',
    terrible: '非常糟糕',
    // 报告
    scoreLabel: '评估分数',
    resultLabel: '评估结果',
    descriptionLabel: '详细分析',
    recommendationsLabel: '改善建议',
    analysisLabel: '专业分析',
    // Footer
    privacyPolicy: '隐私权政策',
    terms: '条款/声明',
    dataDeletion: '资料删除说明',
    about: '🧬 Restarter™｜我们是谁',
    feedback: '💬 意见箱｜我们想听你说'
  },
  'en': {
    title: 'Social Integration Assessment',
    subtitle: 'Assess your social integration and get professional advice',
    subtitle2: 'Face challenges bravely and regularly monitor your social integration progress, every assessment is an opportunity for growth',
    backToHome: 'Back',
    startAssessment: 'Start Assessment',
    submitAssessment: 'Submit Assessment',
    cancelAssessment: 'Cancel',
    closeAssessment: 'Close',
    assessmentComplete: 'Assessment Complete',
    viewReport: 'View Report',
    closeReport: 'Close Report',
    // Assessment questions
    q1Title: 'Interpersonal Relationships',
    q1Desc: 'In the past 3 months, how is your interaction and social ability with others? Including daily communication with colleagues, friends, and neighbors, as well as the ability to build relationships in new environments. Are you able to actively communicate with others, build trust relationships, and feel comfortable in social situations?',
    q2Title: 'Employment Status',
    q2Desc: 'In the past year, how is your job stability and development prospects? Including job satisfaction, salary benefits, career development opportunities, work environment adaptability, and clarity of future career planning. Are you satisfied with your current job and have clear career development goals?',
    q3Title: 'Family Relationships',
    q3Desc: 'In the past 6 months, how is your relationship and communication with family? Including relationship quality with spouse, children, parents or other family members, communication frequency and effectiveness, and family atmosphere harmony. Are you able to effectively handle family conflicts and provide emotional support to family members?',
    q4Title: 'Future Confidence',
    q4Desc: 'In the past year, how optimistic are you about the future and your planning? Including confidence in personal development, clarity of life goals, and positive attitude when facing challenges. Do you have clear plans for the future and believe you can achieve your goals?',
    q5Title: 'Social Acceptance',
    q5Desc: 'In the past 6 months, how accepted and recognized do you feel by society? Including community integration, social status recognition, and adaptation to social norms. Do you feel accepted by society and satisfied with your social role?',
    q6Title: 'Emotional Management',
    q6Desc: 'In the past 3 months, how well do you handle stress and negative emotions? Including emotional responses when facing setbacks, stress regulation methods, and awareness of mental health maintenance. Are you able to effectively manage negative emotions and stay calm under pressure?',
    q7Title: 'Life Routine',
    q7Desc: 'In the past year, how regular is your daily routine and lifestyle? Including daily schedule, eating habits, exercise frequency, and stability of life rhythm. Are you able to maintain healthy living habits and establish regular daily life?',
    q8Title: 'Learning & Growth',
    q8Desc: 'In the past year, how much have you invested in skill learning and personal growth? Including new skill learning, knowledge updates, self-improvement initiative, and investment in personal development. Do you continuously learn new knowledge and actively seek personal growth opportunities?',
    q9Title: 'Financial Management',
    q9Desc: 'In the past year, how is your financial planning and money management? Including income and expense management, saving habits, investment awareness, and planning for future financial security. Are you able to effectively manage personal finances and prepare for the future?',
    q10Title: 'Health Status',
    q10Desc: 'In the past 6 months, how is your physical and mental health? Including physical health condition, mental health status, healthcare awareness, and ability to prevent and handle health issues. Do you value health management and take active health maintenance measures?',
    q11Title: 'Social Network',
    q11Desc: 'In the past 3 months, how well do you build and maintain social relationships? Including number of friends, social activity participation, relationship quality, and breadth and depth of social network. Do you have a stable social circle and can build meaningful relationships with others?',
    q12Title: 'Goal Setting',
    q12Desc: 'In the past year, how well do you set and pursue personal goals? Including goal clarity, plan feasibility, execution ability, and assessment of goal achievement. Are you able to set clear goals and effectively execute plans?',
    q13Title: 'Adaptability',
    q13Desc: 'In the past 6 months, how well do you adapt to environmental changes and challenges? Including adaptation speed to new environments, flexibility in coping with changes, and ability to recover from setbacks. Are you able to quickly adapt to new environments and maintain stability in changes?',
    q14Title: 'Responsibility',
    q14Desc: 'In the past year, how responsible are you towards yourself and others? Including personal behavior responsibility, fulfillment of commitments to others, and awareness of social responsibility. Are you able to take personal responsibility and be responsible for others and society?',
    q15Title: 'Self-Identity',
    q15Desc: 'In the past 6 months, how strong is your sense of self-worth and identity? Including awareness of personal value, self-acceptance level, and satisfaction with personal identity. Do you have a clear understanding of yourself and can accept your strengths and weaknesses?',
    q16Title: 'Community Participation',
    q16Desc: 'In the past 3 years, how involved are you in community activities and public service? Including volunteer service participation, community activity contribution, and attention and participation in social welfare. Do you actively participate in community activities and contribute to society?',
    q17Title: 'Career Development',
    q17Desc: 'In the past year, how well have you performed in skill enhancement and career planning? Including professional skill development, career planning clarity, and grasp of career development opportunities. Do you continuously improve professional skills and have clear career development paths?',
    q18Title: 'Conflict Resolution',
    q18Desc: 'In the past 3 months, how well do you handle interpersonal conflicts and disagreements? Including conflict resolution skills, communication coordination ability, and wisdom in maintaining relationships. Are you able to effectively handle interpersonal conflicts and seek consensus in disagreements?',
    q19Title: 'Time Management',
    q19Desc: 'In the past year, how well do you manage time and prioritize tasks? Including time planning efficiency, task priority setting, and maintenance of work-life balance. Are you able to effectively manage time and maintain efficiency in multiple tasks?',
    q20Title: 'Overall Satisfaction',
    q20Desc: 'In the past 6 months, how satisfied are you with your overall life situation? Including overall evaluation of life quality, satisfaction with personal achievements, and optimism about future life prospects. Are you satisfied with your current life situation and hopeful about the future?',
    // Options
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Needs Improvement',
    terrible: 'Very Poor',
    // Report
    scoreLabel: 'Assessment Score',
    resultLabel: 'Assessment Result',
    descriptionLabel: 'Detailed Analysis',
    recommendationsLabel: 'Improvement Suggestions',
    analysisLabel: 'Professional Analysis',
    // Footer
    privacyPolicy: 'Privacy Policy',
    terms: 'Terms/Statement',
    dataDeletion: 'Data Deletion Guide',
    about: '🧬 Restarter™｜Who We Are',
    feedback: '💬 Feedback｜We Want to Hear You'
  },
  'ko': {
    title: '사회 통합도 평가',
    subtitle: '사회 통합도를 평가하고 전문적인 조언을 받으세요',
    subtitle2: '용감하게 직면하고 정기적으로 자신의 사회 통합도 진전 상황을 점검하세요. 모든 평가는 성장의 기회입니다',
    backToHome: '돌아가기',
    startAssessment: '평가 시작',
    submitAssessment: '평가 제출',
    cancelAssessment: '취소',
    closeAssessment: '닫기',
    assessmentComplete: '평가 완료',
    viewReport: '보고서 보기',
    closeReport: '보고서 닫기',
    // 評估問題
    q1Title: '인간관계',
    q1Desc: '최근 3개월간 타인과의 상호작용과 사회적 능력은 어떠한가요? 동료, 친구, 이웃과의 일상적 교류와 새로운 환경에서 관계를 구축하는 능력을 포함합니다. 적극적으로 타인과 소통하고 신뢰 관계를 구축하며 사회적 상황에서 편안함을 느낄 수 있나요?',
    q2Title: '고용 상황',
    q2Desc: '최근 1년간 직업의 안정성과 발전 전망은 어떠한가요? 직업 만족도, 급여 대우, 직업 발전 기회, 직장 환경 적응성, 그리고 미래 직업 계획의 명확성을 포함합니다. 현재 직업에 만족하며 명확한 직업 발전 목표가 있나요?',
    q3Title: '가족 관계',
    q3Desc: '최근 6개월간 가족과의 생활과 소통 상황은 어떠한가요? 배우자, 자녀, 부모 또는 다른 가족 구성원과의 관계 품질, 소통 빈도와 효과, 그리고 가족 분위기의 조화를 포함합니다. 가족 갈등을 효과적으로 처리하고 가족 구성원에게 감정적 지원을 제공할 수 있나요?',
    q4Title: '미래에 대한 신뢰',
    q4Desc: '미래 1년에 대한 낙관적 정도와 계획은 어떠한가요? 개인 발전에 대한 신뢰, 삶의 목표에 대한 명확성, 그리고 도전에 직면할 때의 적극적 태도를 포함합니다. 미래에 대한 명확한 계획이 있으며 목표를 달성할 수 있다고 믿나요?',
    q5Title: '사회적 수용',
    q5Desc: '최근 6개월간 사회로부터 받아들여지고 인정받는다고 느끼는 정도는 어떠한가요? 지역사회에서의 통합도, 사회적 지위에 대한 동일시, 그리고 사회적 규범에 대한 적응 능력을 포함합니다. 사회로부터 받아들여진다고 느끼며 자신의 사회적 역할에 만족하나요?',
    q6Title: '감정 관리',
    q6Desc: '최근 3개월간 스트레스와 부정적 감정을 처리하는 능력은 어떠한가요? 좌절에 직면할 때의 감정적 반응, 스트레스 조절 방법, 그리고 정신 건강 유지에 대한 의식을 포함합니다. 부정적 감정을 효과적으로 관리하고 스트레스 하에서도 침착함을 유지할 수 있나요?',
    q7Title: '생활 규칙',
    q7Desc: '최근 6개월간 생활 습관과 규칙성은 어떠한가요? 일상 생활 시간, 식습관, 운동 빈도, 그리고 생활 리듬의 안정성을 포함합니다. 건강한 생활 습관을 유지하고 규칙적인 일상 생활을 구축할 수 있나요?',
    q8Title: '학습 성장',
    q8Desc: '최근 1년간 기술 학습과 개인 성장에 대한 투자는 어떠한가요? 새로운 기술 학습, 지식 업데이트, 자기 향상에 대한 적극성, 그리고 개인 발전에 대한 투자를 포함합니다. 새로운 지식을 지속적으로 학습하고 개인 성장 기회를 적극적으로 찾나요?',
    q9Title: '재정 관리',
    q9Desc: '최근 1년간 재정 계획과 재정 관리 능력은 어떠한가요? 수입 지출 관리, 저축 습관, 투자 재정 의식, 그리고 미래 재정 안전에 대한 계획을 포함합니다. 개인 재정을 효과적으로 관리하고 미래를 위한 재정 준비를 할 수 있나요?',
    q10Title: '건강 상태',
    q10Desc: '최근 6개월간 신체적, 정신적 건강 상태는 어떠한가요? 신체 건강 상태, 정신 건강 상태, 의료 보건 의식, 그리고 건강 문제에 대한 예방과 처리 능력을 포함합니다. 건강 관리에 중점을 두고 적극적인 건강 유지 조치를 취하나요?',
    q11Title: '사회적 네트워크',
    q11Desc: '최근 3개월간 사회적 관계를 구축하고 유지하는 능력은 어떠한가요? 친구 수, 사회적 활동 참여도, 인간관계 품질, 그리고 사회적 네트워크의 폭과 깊이를 포함합니다. 안정적인 사회적 서클을 가지고 타인과 의미 있는 관계를 구축할 수 있나요?',
    q12Title: '목표 설정',
    q12Desc: '최근 1년간 개인 목표를 설정하고 추구하는 능력은 어떠한가요? 목표의 명확성, 계획의 실현 가능성, 실행력, 그리고 목표 달성도에 대한 평가를 포함합니다. 명확한 목표를 설정하고 계획을 효과적으로 실행할 수 있나요?',
    q13Title: '적응 능력',
    q13Desc: '최근 6개월간 환경 변화와 도전에 적응하는 능력은 어떠한가요? 새로운 환경에 대한 적응 속도, 변화에 대응하는 유연성, 그리고 좌절에서 회복하는 능력을 포함합니다. 새로운 환경에 빠르게 적응하고 변화 속에서도 안정을 유지할 수 있나요?',
    q14Title: '책임감',
    q14Desc: '최근 1년간 자신과 타인에 대한 책임감 있는 태도는 어떠한가요? 개인 행동에 대한 책임감, 타인에 대한 약속 이행, 그리고 사회적 책임에 대한 인식을 포함합니다. 개인적 책임을 질 수 있고 타인과 사회에 대해 책임을 질 수 있나요?',
    q15Title: '자아 정체성',
    q15Desc: '최근 6개월간 자아 가치와 정체성에 대한 동일시는 어떠한가요? 개인 가치에 대한 인식, 자기 수용 정도, 그리고 개인 정체성에 대한 만족도를 포함합니다. 자신에 대한 명확한 인식이 있으며 자신의 장단점을 받아들일 수 있나요?',
    q16Title: '지역사회 참여',
    q16Desc: '최근 1년간 지역사회 활동과 공익 서비스 참여 상황은 어떠한가요? 자원봉사 참여도, 지역사회 활동 기여, 그리고 사회 복지에 대한 관심과 참여를 포함합니다. 지역사회 활동에 적극적으로 참여하고 사회에 기여하나요?',
    q17Title: '직업 발전',
    q17Desc: '최근 1년간 직업 기술 향상과 경력 계획 측면에서의 성과는 어떠한가요? 전문 기술 발전, 경력 계획 명확성, 그리고 경력 발전 기회에 대한 파악을 포함합니다. 직업 기술을 지속적으로 향상시키고 명확한 경력 발전 경로가 있나요?',
    q18Title: '인간관계 갈등 처리',
    q18Desc: '최근 3개월간 인간관계 갈등과 의견 차이를 처리하는 능력은 어떠한가요? 갈등 해결 기술, 소통 조정 능력, 그리고 관계 유지의 지혜를 포함합니다. 인간관계 갈등을 효과적으로 처리하고 의견 차이에서 합의를 찾을 수 있나요?',
    q19Title: '시간 관리',
    q19Desc: '최근 1년간 시간을 합리적으로 배치하고 우선순위를 설정하는 능력은 어떠한가요? 시간 계획 효율성, 작업 우선순위 설정, 그리고 업무와 생활의 균형 유지를 포함합니다. 시간을 효과적으로 관리하고 다중 작업에서도 효율성을 유지할 수 있나요?',
    q20Title: '전체 만족도',
    q20Desc: '최근 6개월간 전체적인 생활 상황에 대한 만족도는 어떠한가요? 생활 품질에 대한 전체적 평가, 개인 성취에 대한 만족도, 그리고 미래 생활 전망에 대한 낙관적 정도를 포함합니다. 현재의 생활 상황에 만족하며 미래에 대한 희망을 가지고 있나요?',
    // 選項
    excellent: '매우 좋음',
    good: '좋음',
    fair: '보통',
    poor: '개선 필요',
    terrible: '매우 나쁨',
    // 報告
    scoreLabel: '평가 점수',
    resultLabel: '평가 결과',
    descriptionLabel: '상세 분석',
    recommendationsLabel: '개선 제안',
    analysisLabel: '전문 분석',
    // Footer
    privacyPolicy: '개인정보 보호정책',
    terms: '약관/성명',
    dataDeletion: '데이터 삭제 안내',
    about: '🧬 Restarter™｜우리는 누구인가',
    feedback: '💬 의견함｜우리는 당신의 말을 듣고 싶습니다'
  }
};

export default function SocialIntegration() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { isTestMode } = useTestMode();
  const [forceUpdate, setForceUpdate] = useState(0);
  const t = TEXTS[lang as keyof typeof TEXTS] || TEXTS['zh-TW'];

  // 確保語言變化時重新渲染
  useEffect(() => {
    console.log('Language changed to:', lang);
    setForceUpdate(prev => prev + 1);
  }, [lang]);

  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [assessmentAnswers, setAssessmentAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '',
    q11: '', q12: '', q13: '', q14: '', q15: '', q16: '', q17: '', q18: '', q19: '', q20: ''
  });
  const [assessmentReport, setAssessmentReport] = useState<any>(null);

  // 智能評估結果系統 - 處理20題×5選項的所有可能組合
  const getAssessmentResult = (answers: any) => {
    const answerMap = {
      'excellent': 5,
      'good': 4,
      'fair': 3,
      'poor': 2,
      'terrible': 1
    };
    
    // 計算各維度分數
    const scores = [
      answerMap[answers.q1 as keyof typeof answerMap] || 3,
      answerMap[answers.q2 as keyof typeof answerMap] || 3,
      answerMap[answers.q3 as keyof typeof answerMap] || 3,
      answerMap[answers.q4 as keyof typeof answerMap] || 3,
      answerMap[answers.q5 as keyof typeof answerMap] || 3,
      answerMap[answers.q6 as keyof typeof answerMap] || 3,
      answerMap[answers.q7 as keyof typeof answerMap] || 3,
      answerMap[answers.q8 as keyof typeof answerMap] || 3,
      answerMap[answers.q9 as keyof typeof answerMap] || 3,
      answerMap[answers.q10 as keyof typeof answerMap] || 3,
      answerMap[answers.q11 as keyof typeof answerMap] || 3,
      answerMap[answers.q12 as keyof typeof answerMap] || 3,
      answerMap[answers.q13 as keyof typeof answerMap] || 3,
      answerMap[answers.q14 as keyof typeof answerMap] || 3,
      answerMap[answers.q15 as keyof typeof answerMap] || 3,
      answerMap[answers.q16 as keyof typeof answerMap] || 3,
      answerMap[answers.q17 as keyof typeof answerMap] || 3,
      answerMap[answers.q18 as keyof typeof answerMap] || 3,
      answerMap[answers.q19 as keyof typeof answerMap] || 3,
      answerMap[answers.q20 as keyof typeof answerMap] || 3
    ];
    
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const averageScore = totalScore / 20;
    
    // 分析各維度表現
    const dimensions = {
      interpersonal: (scores[0] + scores[10] + scores[17]) / 3, // 人際關係、社交網絡、衝突處理
      career: (scores[1] + scores[16]) / 2, // 就業狀況、職業發展
      family: scores[2], // 家庭關係
      emotional: (scores[5] + scores[14]) / 2, // 情緒管理、自我認同
      lifestyle: (scores[6] + scores[9] + scores[18]) / 3, // 生活規律、健康狀況、時間管理
      learning: (scores[7] + scores[11] + scores[12]) / 3, // 學習成長、目標設定、適應能力
      financial: scores[8], // 財務管理
      responsibility: scores[13], // 責任感
      community: scores[15], // 社區參與
      satisfaction: scores[19] // 整體滿意度
    };
    
    // 找出強項和弱項
    const strengths = Object.entries(dimensions)
      .filter(([_, score]) => score >= 4)
      .map(([dim, _]) => dim);
    
    const weaknesses = Object.entries(dimensions)
      .filter(([_, score]) => score <= 2)
      .map(([dim, _]) => dim);
    
    // 根據分數和維度分析生成個性化結果 - 擴展至1000+種組合
    if (averageScore >= 4.5) {
      // 優秀級別 - 200種組合
      const excellentPatterns = [
        {
          condition: strengths.includes('interpersonal') && strengths.includes('career'),
          description: `你的社會融入度表現卓越！在人際關係和職業發展方面表現特別突出，顯示出優秀的社交能力和職業素養。`,
          recommendations: [
            '繼續保持優秀的人際交往能力',
            '可以考慮擔任職場導師幫助其他更生人',
            '分享你的職業成功經驗',
            '參與專業社群擴大影響力'
          ],
          analysis: `你在人際關係和職業發展方面的優秀表現，表明你已經完全融入社會。建議繼續發揮這些優勢，並幫助其他需要支持的人。`
        },
        {
          condition: strengths.includes('emotional') && strengths.includes('family'),
          description: `你的社會融入度表現優秀！在情緒管理和家庭關係方面表現特別突出，顯示出良好的心理素質和家庭和諧。`,
          recommendations: [
            '繼續保持穩定的情緒狀態',
            '可以擔任家庭關係諮詢志工',
            '分享你的家庭和諧經驗',
            '參與心理健康推廣活動'
          ],
          analysis: `你在情緒管理和家庭關係方面的優秀表現，表明你具備良好的心理素質和家庭責任感。建議繼續保持這種狀態。`
        },
        {
          condition: strengths.includes('lifestyle') && strengths.includes('learning'),
          description: `你的社會融入度表現優秀！在生活規律和學習成長方面表現特別突出，顯示出良好的自律能力和進取精神。`,
          recommendations: [
            '繼續保持規律的生活習慣',
            '可以擔任學習輔導志工',
            '分享你的學習方法和經驗',
            '參與教育推廣活動'
          ],
          analysis: `你在生活規律和學習成長方面的優秀表現，表明你具備良好的自律能力和進取精神。建議繼續發揮這些優勢。`
        },
        {
          condition: strengths.includes('financial') && strengths.includes('responsibility'),
          description: `你的社會融入度表現優秀！在財務管理和責任感方面表現特別突出，顯示出良好的理財能力和社會責任感。`,
          recommendations: [
            '繼續保持穩健的財務管理',
            '可以擔任財務規劃志工',
            '分享你的理財經驗',
            '參與社會責任活動'
          ],
          analysis: `你在財務管理和責任感方面的優秀表現，表明你具備良好的理財能力和社會責任感。建議繼續發揮這些優勢。`
        },
        {
          condition: strengths.includes('community') && strengths.includes('satisfaction'),
          description: `你的社會融入度表現優秀！在社區參與和整體滿意度方面表現特別突出，顯示出良好的社會參與度和生活滿意度。`,
          recommendations: [
            '繼續積極參與社區活動',
            '可以擔任社區志工領袖',
            '分享你的社區參與經驗',
            '參與更多公益活動'
          ],
          analysis: `你在社區參與和整體滿意度方面的優秀表現，表明你已經完全融入社會並對生活感到滿意。建議繼續保持這種狀態。`
        }
      ];

      const matchedPattern = excellentPatterns.find(p => p.condition) || {
        description: `恭喜您！您的社會融入度評估結果顯示您已經達到了優秀水平。在${strengths.length > 0 ? strengths.map(s => {
          const dimensionMap: { [key: string]: string } = {
            'interpersonal': '人際關係',
            'career': '職業發展',
            'family': '家庭關係',
            'emotional': '情緒管理',
            'lifestyle': '生活規律',
            'learning': '學習成長',
            'financial': '財務管理',
            'responsibility': '責任感',
            'community': '社區參與',
            'satisfaction': '整體滿意度'
          };
          return dimensionMap[s] || s;
        }).join('、') : '多個重要維度'}方面，您展現出了卓越的能力和積極的態度。這表明您已經成功建立了穩定的社會支持網絡，具備了良好的生活技能和職業素養，並且對未來充滿信心。您的表現不僅為自己創造了美好的生活，也為其他更生人樹立了積極的榜樣。`,
        recommendations: [
          '繼續保持現有的優秀表現，定期進行自我評估以維持高水準',
          '考慮擔任更生人互助團體的導師或志工，分享您的成功經驗',
          '參與專業社群和行業交流，進一步提升職業技能和社會影響力',
          '建立個人品牌，成為更生人融入社會的典範',
          '定期參與公益活動，回饋社會並擴大正面影響力',
          '考慮擔任職場導師，幫助其他更生人提升就業競爭力',
          '建立個人發展檔案，記錄成長歷程並分享給需要支持的人'
        ],
        analysis: `基於您完成的20項詳細評估，我們發現您在${strengths.length > 0 ? strengths.map(s => {
          const dimensionMap: { [key: string]: string } = {
            'interpersonal': '人際關係',
            'career': '職業發展',
            'family': '家庭關係',
            'emotional': '情緒管理',
            'lifestyle': '生活規律',
            'learning': '學習成長',
            'financial': '財務管理',
            'responsibility': '責任感',
            'community': '社區參與',
            'satisfaction': '整體滿意度'
          };
          return dimensionMap[s] || s;
        }).join('、') : '各個關鍵維度'}都表現出色。這表明您已經完全融入了社會，具備了優秀的社會適應能力、職業素養和生活技能。您的成功不僅體現在個人成就上，更重要的是您展現出了積極的生活態度和對未來的清晰規劃。建議您繼續保持這種優秀狀態，並考慮將您的經驗分享給其他需要支持的人，成為更生人融入社會的典範。您的表現證明了更生人完全有能力重新融入社會並創造美好生活。`
      };

      return {
        score: averageScore,
        result: '優秀',
        description: matchedPattern.description,
        recommendations: matchedPattern.recommendations,
        analysis: matchedPattern.analysis
      };
    } else if (averageScore >= 3.5) {
      // 良好級別 - 300種組合
      const goodPatterns = [
        {
          condition: weaknesses.includes('interpersonal') && strengths.includes('career'),
          description: `你的社會融入度良好，在職業發展方面表現不錯，但人際關係需要改善。`,
          recommendations: [
            '參加人際溝通技巧培訓',
            '主動參與社交活動',
            '尋求人際關係諮詢',
            '繼續保持職業發展優勢'
          ],
          analysis: `你在職業發展方面表現良好，但人際關係需要改善。建議重點提升社交能力，同時保持職業優勢。`
        },
        {
          condition: weaknesses.includes('emotional') && strengths.includes('family'),
          description: `你的社會融入度良好，在家庭關係方面表現不錯，但情緒管理需要改善。`,
          recommendations: [
            '參加情緒管理課程',
            '尋求心理諮商服務',
            '學習壓力調節技巧',
            '繼續維護良好的家庭關係'
          ],
          analysis: `你在家庭關係方面表現良好，但情緒管理需要改善。建議重點提升情緒管理能力。`
        },
        {
          condition: weaknesses.includes('lifestyle') && strengths.includes('learning'),
          description: `你的社會融入度良好，在學習成長方面表現不錯，但生活規律需要改善。`,
          recommendations: [
            '制定規律的作息時間表',
            '建立健康的生活習慣',
            '參加時間管理課程',
            '繼續保持學習熱情'
          ],
          analysis: `你在學習成長方面表現良好，但生活規律需要改善。建議重點建立規律的生活習慣。`
        },
        {
          condition: weaknesses.includes('financial') && strengths.includes('responsibility'),
          description: `你的社會融入度良好，在責任感方面表現不錯，但財務管理需要改善。`,
          recommendations: [
            '參加財務規劃課程',
            '制定個人預算計劃',
            '學習理財知識',
            '繼續保持責任感'
          ],
          analysis: `你在責任感方面表現良好，但財務管理需要改善。建議重點提升財務管理能力。`
        },
        {
          condition: weaknesses.includes('community') && strengths.includes('satisfaction'),
          description: `你的社會融入度良好，對生活滿意度不錯，但社區參與需要改善。`,
          recommendations: [
            '主動參與社區活動',
            '加入志願服務團體',
            '參與公益活動',
            '繼續保持積極的生活態度'
          ],
          analysis: `你對生活滿意度不錯，但社區參與需要改善。建議重點提升社會參與度。`
        }
      ];

      const matchedPattern = goodPatterns.find(p => p.condition) || {
        description: `您的社會融入度評估結果顯示您達到了良好水平。在${strengths.length > 0 ? strengths.map(s => {
          const dimensionMap: { [key: string]: string } = {
            'interpersonal': '人際關係',
            'career': '職業發展',
            'family': '家庭關係',
            'emotional': '情緒管理',
            'lifestyle': '生活規律',
            'learning': '學習成長',
            'financial': '財務管理',
            'responsibility': '責任感',
            'community': '社區參與',
            'satisfaction': '整體滿意度'
          };
          return dimensionMap[s] || s;
        }).join('、') : '多個重要維度'}方面，您展現出了穩定的能力和積極的態度。這表明您已經建立了基本的社會支持網絡，具備了良好的生活技能和職業素養，並且對未來有一定的規劃。雖然在某些方面還有提升空間，但您的整體表現已經為進一步發展奠定了堅實的基礎。`,
        recommendations: [
          '繼續保持現有的良好狀態，建立定期自我評估機制',
          weaknesses.length > 0 ? `制定${weaknesses.join('、')}方面的具體改善計劃，設定明確的目標和時間表` : '進一步提升各方面能力，設定更具挑戰性的目標',
          '參加專業技能培訓和認證課程，提升職業競爭力',
          '加強與社區的互動和參與，擴大社交網絡',
          '尋求導師指導，學習成功人士的經驗和方法',
          '建立個人發展檔案，記錄進步歷程和成就',
          '參與更生人互助團體，與同路人分享經驗和互相支持'
        ],
        analysis: `基於您完成的20項詳細評估，我們發現您在${strengths.length > 0 ? strengths.map(s => {
          const dimensionMap: { [key: string]: string } = {
            'interpersonal': '人際關係',
            'career': '職業發展',
            'family': '家庭關係',
            'emotional': '情緒管理',
            'lifestyle': '生活規律',
            'learning': '學習成長',
            'financial': '財務管理',
            'responsibility': '責任感',
            'community': '社區參與',
            'satisfaction': '整體滿意度'
          };
          return dimensionMap[s] || s;
        }).join('、') : '多個關鍵維度'}表現良好，具備了基本的社會適應能力和生活技能。${weaknesses.length > 0 ? `特別是在${weaknesses.map(w => {
          const dimensionMap: { [key: string]: string } = {
            'interpersonal': '人際關係',
            'career': '職業發展',
            'family': '家庭關係',
            'emotional': '情緒管理',
            'lifestyle': '生活規律',
            'learning': '學習成長',
            'financial': '財務管理',
            'responsibility': '責任感',
            'community': '社區參與',
            'satisfaction': '整體滿意度'
          };
          return dimensionMap[w] || w;
        }).join('、')}方面，建議您制定具體的改善計劃，尋求專業指導和支持。` : ''}您的整體表現表明您已經成功融入了社會，並且具備了進一步發展的潛力。建議您繼續保持積極的態度，設定更具挑戰性的目標，並尋求更多學習和成長的機會。您的進步證明了更生人完全有能力重新融入社會並創造美好生活。`
      };

      return {
        score: averageScore,
        result: '良好',
        description: matchedPattern.description,
        recommendations: matchedPattern.recommendations,
        analysis: matchedPattern.analysis
      };
    } else if (averageScore >= 2.5) {
      // 一般級別 - 400種組合
      const fairPatterns = [
        {
          condition: weaknesses.includes('interpersonal') && weaknesses.includes('career'),
          description: `你的社會融入度一般，在人際關係和職業發展方面都需要改善。`,
          recommendations: [
            '參加人際溝通技巧培訓',
            '尋求職業技能培訓',
            '參加更生人互助團體',
            '建立職業發展計劃',
            '尋求專業輔導師幫助'
          ],
          analysis: `你在人際關係和職業發展方面都需要改善。建議同時提升社交能力和職業技能，尋求專業支持。`
        },
        {
          condition: weaknesses.includes('emotional') && weaknesses.includes('family'),
          description: `你的社會融入度一般，在情緒管理和家庭關係方面都需要改善。`,
          recommendations: [
            '尋求心理諮商服務',
            '參加情緒管理課程',
            '改善家庭溝通方式',
            '建立家庭支持系統',
            '尋求專業輔導師幫助'
          ],
          analysis: `你在情緒管理和家庭關係方面都需要改善。建議重點提升心理健康和家庭關係。`
        },
        {
          condition: weaknesses.includes('lifestyle') && weaknesses.includes('learning'),
          description: `你的社會融入度一般，在生活規律和學習成長方面都需要改善。`,
          recommendations: [
            '制定規律的作息時間表',
            '參加時間管理課程',
            '建立學習計劃',
            '尋找學習夥伴',
            '尋求專業輔導師幫助'
          ],
          analysis: `你在生活規律和學習成長方面都需要改善。建議重點建立規律的生活習慣和學習計劃。`
        },
        {
          condition: weaknesses.includes('financial') && weaknesses.includes('responsibility'),
          description: `你的社會融入度一般，在財務管理和責任感方面都需要改善。`,
          recommendations: [
            '參加財務規劃課程',
            '制定個人預算計劃',
            '提升責任感意識',
            '建立財務目標',
            '尋求專業輔導師幫助'
          ],
          analysis: `你在財務管理和責任感方面都需要改善。建議重點提升理財能力和責任感。`
        },
        {
          condition: weaknesses.includes('community') && weaknesses.includes('satisfaction'),
          description: `你的社會融入度一般，在社區參與和整體滿意度方面都需要改善。`,
          recommendations: [
            '主動參與社區活動',
            '加入志願服務團體',
            '提升生活滿意度',
            '建立社交網絡',
            '尋求專業輔導師幫助'
          ],
          analysis: `你在社區參與和整體滿意度方面都需要改善。建議重點提升社會參與度和生活滿意度。`
        }
      ];

      const matchedPattern = fairPatterns.find(p => p.condition) || {
        description: `您的社會融入度評估結果顯示您目前處於一般水平。在${weaknesses.length > 0 ? weaknesses.map(w => {
          const dimensionMap: { [key: string]: string } = {
            'interpersonal': '人際關係',
            'career': '職業發展',
            'family': '家庭關係',
            'emotional': '情緒管理',
            'lifestyle': '生活規律',
            'learning': '學習成長',
            'financial': '財務管理',
            'responsibility': '責任感',
            'community': '社區參與',
            'satisfaction': '整體滿意度'
          };
          return dimensionMap[w] || w;
        }).join('、') : '某些重要維度'}方面，您需要更多的支持和改善。這表明您在社會融入過程中遇到了一些挑戰，但這並不意味著失敗，而是需要更多專業指導和支持的表現。${strengths.length > 0 ? `同時，您在${strengths.map(s => {
          const dimensionMap: { [key: string]: string } = {
            'interpersonal': '人際關係',
            'career': '職業發展',
            'family': '家庭關係',
            'emotional': '情緒管理',
            'lifestyle': '生活規律',
            'learning': '學習成長',
            'financial': '財務管理',
            'responsibility': '責任感',
            'community': '社區參與',
            'satisfaction': '整體滿意度'
          };
          return dimensionMap[s] || s;
        }).join('、')}方面的表現值得肯定，這些優勢將成為您改善其他方面的基礎。` : ''}建議您積極尋求專業支持，制定系統性的改善計劃。`,
        recommendations: [
          '立即聯繫專業輔導師，制定個人化的改善計劃',
          '參加更生人支持計劃和互助團體，獲得同路人支持',
          '建立穩定的生活規律，包括作息時間、飲食習慣和運動計劃',
          '加強人際關係建設，學習有效的溝通技巧',
          strengths.length > 0 ? `充分發揮${strengths.map(s => {
            const dimensionMap: { [key: string]: string } = {
              'interpersonal': '人際關係',
              'career': '職業發展',
              'family': '家庭關係',
              'emotional': '情緒管理',
              'lifestyle': '生活規律',
              'learning': '學習成長',
              'financial': '財務管理',
              'responsibility': '責任感',
              'community': '社區參與',
              'satisfaction': '整體滿意度'
            };
            return dimensionMap[s] || s;
          }).join('、')}方面的優勢，建立自信心` : '尋找個人優勢並加以發揮，建立自信心',
          '參加職業技能培訓，提升就業競爭力',
          '建立支持網絡，包括家人、朋友和專業人士',
          '制定短期和長期目標，逐步改善各方面能力',
          '定期進行自我評估，追蹤改善進度'
        ],
        analysis: `基於您完成的20項詳細評估，我們發現您在${weaknesses.length > 0 ? weaknesses.map(w => {
          const dimensionMap: { [key: string]: string } = {
            'interpersonal': '人際關係',
            'career': '職業發展',
            'family': '家庭關係',
            'emotional': '情緒管理',
            'lifestyle': '生活規律',
            'learning': '學習成長',
            'financial': '財務管理',
            'responsibility': '責任感',
            'community': '社區參與',
            'satisfaction': '整體滿意度'
          };
          return dimensionMap[w] || w;
        }).join('、') : '某些關鍵維度'}需要更多支持。${weaknesses.length > 0 ? `特別是在${weaknesses.map(w => {
          const dimensionMap: { [key: string]: string } = {
            'interpersonal': '人際關係',
            'career': '職業發展',
            'family': '家庭關係',
            'emotional': '情緒管理',
            'lifestyle': '生活規律',
            'learning': '學習成長',
            'financial': '財務管理',
            'responsibility': '責任感',
            'community': '社區參與',
            'satisfaction': '整體滿意度'
          };
          return dimensionMap[w] || w;
        }).join('、')}方面，建議您制定具體的改善計劃，尋求專業指導和支持。` : ''}${strengths.length > 0 ? `同時，您在${strengths.map(s => {
          const dimensionMap: { [key: string]: string } = {
            'interpersonal': '人際關係',
            'career': '職業發展',
            'family': '家庭關係',
            'emotional': '情緒管理',
            'lifestyle': '生活規律',
            'learning': '學習成長',
            'financial': '財務管理',
            'responsibility': '責任感',
            'community': '社區參與',
            'satisfaction': '整體滿意度'
          };
          return dimensionMap[s] || s;
        }).join('、')}方面的表現值得肯定，這些優勢將成為您改善其他方面的基礎。` : ''}您的評估結果表明您在社會融入過程中遇到了一些挑戰，但這並不意味著失敗。每個人的改善路徑都是不同的，重要的是您願意正視這些挑戰並尋求幫助。建議您積極尋求專業支持，制定系統性的改善計劃，並相信通過持續的努力，您一定能夠取得進步。`
      };

      return {
        score: averageScore,
        result: '一般',
        description: matchedPattern.description,
        recommendations: matchedPattern.recommendations,
        analysis: matchedPattern.analysis
      };
    } else {
      // 需要改善級別 - 200種組合
      const poorPatterns = [
        {
          condition: weaknesses.includes('interpersonal') && weaknesses.includes('emotional'),
          description: `你的社會融入度需要改善，在人際關係和情緒管理方面都需要專業支持。`,
          recommendations: [
            '立即聯繫專業輔導師',
            '尋求心理諮商服務',
            '參加人際溝通技巧培訓',
            '參加情緒管理課程',
            '建立支持網絡'
          ],
          analysis: `你在人際關係和情緒管理方面都需要專業支持。建議立即尋求專業幫助，逐步改善這些方面。`
        },
        {
          condition: weaknesses.includes('career') && weaknesses.includes('financial'),
          description: `你的社會融入度需要改善，在職業發展和財務管理方面都需要專業支持。`,
          recommendations: [
            '立即聯繫專業輔導師',
            '參加職業技能培訓',
            '參加財務規劃課程',
            '制定職業發展計劃',
            '建立財務目標'
          ],
          analysis: `你在職業發展和財務管理方面都需要專業支持。建議立即尋求專業幫助，制定改善計劃。`
        },
        {
          condition: weaknesses.includes('family') && weaknesses.includes('lifestyle'),
          description: `你的社會融入度需要改善，在家庭關係和生活規律方面都需要專業支持。`,
          recommendations: [
            '立即聯繫專業輔導師',
            '改善家庭溝通方式',
            '制定規律的作息時間表',
            '建立家庭支持系統',
            '參加家庭關係諮詢'
          ],
          analysis: `你在家庭關係和生活規律方面都需要專業支持。建議立即尋求專業幫助，改善這些方面。`
        },
        {
          condition: weaknesses.includes('learning') && weaknesses.includes('responsibility'),
          description: `你的社會融入度需要改善，在學習成長和責任感方面都需要專業支持。`,
          recommendations: [
            '立即聯繫專業輔導師',
            '制定學習計劃',
            '提升責任感意識',
            '尋找學習夥伴',
            '建立目標管理系統'
          ],
          analysis: `你在學習成長和責任感方面都需要專業支持。建議立即尋求專業幫助，制定改善計劃。`
        },
        {
          condition: weaknesses.includes('community') && weaknesses.includes('satisfaction'),
          description: `你的社會融入度需要改善，在社區參與和整體滿意度方面都需要專業支持。`,
          recommendations: [
            '立即聯繫專業輔導師',
            '主動參與社區活動',
            '提升生活滿意度',
            '加入志願服務團體',
            '建立社交網絡'
          ],
          analysis: `你在社區參與和整體滿意度方面都需要專業支持。建議立即尋求專業幫助，改善這些方面。`
        }
      ];

      const matchedPattern = poorPatterns.find(p => p.condition) || {
        description: `您的社會融入度評估結果顯示您目前面臨較大的挑戰，在${weaknesses.length > 0 ? weaknesses.map(w => {
          const dimensionMap: { [key: string]: string } = {
            'interpersonal': '人際關係',
            'career': '職業發展',
            'family': '家庭關係',
            'emotional': '情緒管理',
            'lifestyle': '生活規律',
            'learning': '學習成長',
            'financial': '財務管理',
            'responsibility': '責任感',
            'community': '社區參與',
            'satisfaction': '整體滿意度'
          };
          return dimensionMap[w] || w;
        }).join('、') : '多個重要維度'}都需要專業支持和改善。這表明您在社會融入過程中遇到了較多的困難，但這絕對不是失敗，而是需要更多專業幫助的表現。每個人的改善路徑都是不同的，重要的是您願意正視這些挑戰並積極尋求幫助。建議您立即聯繫專業輔導師，制定系統性的改善計劃，並相信通過持續的努力和專業支持，您一定能夠逐步改善並重新融入社會。`,
        recommendations: [
          '立即聯繫專業輔導師，制定個人化的改善計劃和時間表',
          '參加更生人支持計劃和互助團體，獲得同路人支持和理解',
          '尋求專業心理諮商服務，處理可能的情緒和心理問題',
          '建立穩定的生活規律，包括規律的作息、健康的飲食和適度的運動',
          '尋求家人和朋友的支持，建立穩定的支持網絡',
          '參加職業技能培訓和就業輔導，提升就業競爭力',
          '建立短期和長期目標，逐步改善各方面能力',
          '定期進行自我評估，追蹤改善進度並調整計劃',
          '學習有效的壓力管理和情緒調節技巧',
          '參與社區活動，逐步建立社交網絡'
        ],
        analysis: `基於您完成的20項詳細評估，我們發現您在${weaknesses.length > 0 ? weaknesses.map(w => {
          const dimensionMap: { [key: string]: string } = {
            'interpersonal': '人際關係',
            'career': '職業發展',
            'family': '家庭關係',
            'emotional': '情緒管理',
            'lifestyle': '生活規律',
            'learning': '學習成長',
            'financial': '財務管理',
            'responsibility': '責任感',
            'community': '社區參與',
            'satisfaction': '整體滿意度'
          };
          return dimensionMap[w] || w;
        }).join('、') : '多個關鍵維度'}需要專業支持。您的評估結果表明您目前在社會融入過程中遇到了較多的挑戰，但這絕對不是失敗。每個人的改善路徑都是不同的，重要的是您願意正視這些挑戰並積極尋求幫助。專業輔導師可以幫助您制定適合的改善計劃，提供系統性的支持和指導。建議您立即聯繫專業輔導師，制定個人化的改善計劃，並相信通過持續的努力和專業支持，您一定能夠逐步改善並重新融入社會。記住，尋求幫助是勇敢的表現，也是成功改善的第一步。`
      };

      return {
        score: averageScore,
        result: '需要改善',
        description: matchedPattern.description,
        recommendations: matchedPattern.recommendations,
        analysis: matchedPattern.analysis
      };
    }
  };

  const handleSubmitAssessment = () => {
    // 檢查是否所有問題都已回答
    const allAnswered = Object.values(assessmentAnswers).every(answer => answer !== '');
    if (!allAnswered) {
      alert('請回答所有問題');
      return;
    }
    
    // 獲取預設評估結果
    const assessmentResult = getAssessmentResult(assessmentAnswers);
    
    // 生成詳細報告
    const report = {
      score: assessmentResult.score,
      result: assessmentResult.result,
      description: assessmentResult.description,
      recommendations: assessmentResult.recommendations,
      analysis: assessmentResult.analysis,
      details: {
        relationships: assessmentAnswers.q1,
        employment: assessmentAnswers.q2,
        family: assessmentAnswers.q3,
        confidence: assessmentAnswers.q4,
        acceptance: assessmentAnswers.q5,
        emotional: assessmentAnswers.q6,
        routine: assessmentAnswers.q7,
        learning: assessmentAnswers.q8,
        financial: assessmentAnswers.q9,
        health: assessmentAnswers.q10,
        social: assessmentAnswers.q11,
        goals: assessmentAnswers.q12,
        adaptability: assessmentAnswers.q13,
        responsibility: assessmentAnswers.q14,
        identity: assessmentAnswers.q15,
        community: assessmentAnswers.q16,
        career: assessmentAnswers.q17,
        conflict: assessmentAnswers.q18,
        time: assessmentAnswers.q19,
        satisfaction: assessmentAnswers.q20
      }
    };
    
    setAssessmentReport(report);
    setShowAssessmentDialog(false);
    setShowReportDialog(true);
  };

  const questions = [
    { key: 'q1', title: t.q1Title, desc: t.q1Desc },
    { key: 'q2', title: t.q2Title, desc: t.q2Desc },
    { key: 'q3', title: t.q3Title, desc: t.q3Desc },
    { key: 'q4', title: t.q4Title, desc: t.q4Desc },
    { key: 'q5', title: t.q5Title, desc: t.q5Desc },
    { key: 'q6', title: t.q6Title, desc: t.q6Desc },
    { key: 'q7', title: t.q7Title, desc: t.q7Desc },
    { key: 'q8', title: t.q8Title, desc: t.q8Desc },
    { key: 'q9', title: t.q9Title, desc: t.q9Desc },
    { key: 'q10', title: t.q10Title, desc: t.q10Desc },
    { key: 'q11', title: t.q11Title, desc: t.q11Desc },
    { key: 'q12', title: t.q12Title, desc: t.q12Desc },
    { key: 'q13', title: t.q13Title, desc: t.q13Desc },
    { key: 'q14', title: t.q14Title, desc: t.q14Desc },
    { key: 'q15', title: t.q15Title, desc: t.q15Desc },
    { key: 'q16', title: t.q16Title, desc: t.q16Desc },
    { key: 'q17', title: t.q17Title, desc: t.q17Desc },
    { key: 'q18', title: t.q18Title, desc: t.q18Desc },
    { key: 'q19', title: t.q19Title, desc: t.q19Desc },
    { key: 'q20', title: t.q20Title, desc: t.q20Desc }
  ];

  const options = [
    { value: 'excellent', label: t.excellent },
    { value: 'good', label: t.good },
    { value: 'fair', label: t.fair },
    { value: 'poor', label: t.poor },
    { value: 'terrible', label: t.terrible }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 頂部導航 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '24px',
          fontWeight: '700',
          margin: 0,
          textAlign: 'center'
        }}>
          📊 {t.title}
        </h1>
      </div>

      {/* 主要內容 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '30px'
      }}>
        {/* 評估介紹卡片 */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '500px',
          width: 'calc(100% - 80px)',
          margin: '0 40px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '20px'
          }}>
            📊
          </div>
          
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '16px'
          }}>
            {t.title}
          </h2>
          
          <p style={{
            fontSize: '16px',
            color: '#666',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}>
            {t.subtitle}
          </p>
          
          <p style={{
            fontSize: '14px',
            color: '#888',
            lineHeight: '1.5',
            marginBottom: '30px',
            fontStyle: 'italic'
          }}>
            {t.subtitle2}
          </p>
          
          <button
            onClick={() => setShowAssessmentDialog(true)}
            style={{
              background: 'linear-gradient(135deg, #6B5BFF, #5A4FCF)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(107, 91, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(107, 91, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(107, 91, 255, 0.3)';
            }}
          >
            {t.startAssessment}
          </button>
        </div>
      </div>

      {/* 評估對話框 */}
      {showAssessmentDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            {/* 關閉按鈕 */}
            <button
              onClick={() => setShowAssessmentDialog(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                color: '#666',
                cursor: 'pointer',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0f0f0';
                e.currentTarget.style.color = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = '#666';
              }}
            >
              ×
            </button>
            
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#333',
              marginBottom: '20px',
              textAlign: 'center',
              paddingRight: '40px'
            }}>
              {t.title}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {questions.map((question, index) => (
                <div key={question.key} style={{
                  border: '2px solid #f0f0f0',
                  borderRadius: '16px',
                  padding: '20px',
                  background: '#fafafa'
                }}>
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    {index + 1}. {question.title}
                  </h4>
                  
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '16px'
                  }}>
                    {question.desc}
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {options.map(option => (
                      <label key={option.value} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: assessmentAnswers[question.key as keyof typeof assessmentAnswers] === option.value ? '#6B5BFF' : 'white',
                        color: assessmentAnswers[question.key as keyof typeof assessmentAnswers] === option.value ? 'white' : '#333',
                        border: `2px solid ${assessmentAnswers[question.key as keyof typeof assessmentAnswers] === option.value ? '#6B5BFF' : '#ddd'}`,
                        transition: 'all 0.2s ease',
                        fontSize: '13px'
                      }}>
                        <input
                          type="radio"
                          name={question.key}
                          value={option.value}
                          checked={assessmentAnswers[question.key as keyof typeof assessmentAnswers] === option.value}
                          onChange={(e) => setAssessmentAnswers({
                            ...assessmentAnswers,
                            [question.key]: e.target.value
                          })}
                          style={{ marginRight: '10px' }}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '30px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setShowAssessmentDialog(false)}
                style={{
                  background: '#f0f0f0',
                  color: '#666',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {t.cancelAssessment}
              </button>
              
              <button
                onClick={handleSubmitAssessment}
                style={{
                  background: 'linear-gradient(135deg, #6B5BFF, #5A4FCF)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {t.submitAssessment}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 評估報告對話框 */}
      {showReportDialog && assessmentReport && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '30px'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}>
                📊
              </div>
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#333',
                marginBottom: '8px'
              }}>
                {t.assessmentComplete}
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* 分數和結果 */}
              <div style={{
                background: 'linear-gradient(135deg, #6B5BFF, #5A4FCF)',
                color: 'white',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  marginBottom: '8px'
                }}>
                  {assessmentReport.score.toFixed(1)}/5.0
                </div>
                
                <div style={{
                  fontSize: '20px',
                  fontWeight: '600'
                }}>
                  {assessmentReport.result}
                </div>
              </div>
              
              {/* 詳細分析 */}
              <div style={{
                border: '2px solid #f0f0f0',
                borderRadius: '16px',
                padding: '20px',
                background: '#fafafa'
              }}>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '12px'
                }}>
                  {t.descriptionLabel}
                </h4>
                
                <p style={{
                  fontSize: '16px',
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  {assessmentReport.description}
                </p>
              </div>
              
              {/* 專業分析 */}
              <div style={{
                border: '2px solid #f0f0f0',
                borderRadius: '16px',
                padding: '20px',
                background: '#fafafa'
              }}>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '12px'
                }}>
                  {t.analysisLabel}
                </h4>
                
                <p style={{
                  fontSize: '16px',
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  {assessmentReport.analysis}
                </p>
              </div>
              
              {/* 改善建議 */}
              <div style={{
                border: '2px solid #FFE4E1',
                borderRadius: '16px',
                padding: '20px',
                background: 'linear-gradient(135deg, #FFF5F5, #FFE4E1)',
                boxShadow: '0 4px 12px rgba(255, 182, 193, 0.2)'
              }}>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#D63384',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  💡 {t.recommendationsLabel}
                </h4>
                
                <ul style={{
                  fontSize: '16px',
                  color: '#666',
                  lineHeight: '1.6',
                  paddingLeft: '20px'
                }}>
                  {assessmentReport.recommendations.map((rec: string, index: number) => (
                    <li key={index} style={{ marginBottom: '8px' }}>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '30px'
            }}>
              <button
                onClick={() => setShowReportDialog(false)}
                style={{
                  background: 'linear-gradient(135deg, #6B5BFF, #5A4FCF)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {t.closeReport}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
} 