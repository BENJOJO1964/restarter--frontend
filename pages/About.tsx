import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const RESTART_SLOGAN: { [key: string]: string } = {
  'zh-TW': '每個人都值得一個能「重啟」的起點。',
  'zh-CN': '每个人都值得一个能“重启”的起点。',
  'en': 'Everyone deserves a new beginning.',
  'ja': '誰もが「再出発」できるスタート地点を持つべきです。',
  'ko': '모든 사람은 "다시 시작"할 수 있는 출발점이 필요합니다.',
  'th': 'ทุกคนสมควรได้รับจุดเริ่มต้นใหม่',
  'vi': 'Mỗi người đều xứng đáng có một khởi đầu mới.',
  'ms': 'Setiap orang layak mendapat permulaan semula.',
  'la': 'Omnis novum initium meretur.',
};

const TEXTS: { [key: string]: { title: string; subtitle: string; story: string; quote: string; restart: string; founder: string; founderStory: string } } = {
  'zh-TW': {
    title: '我們是誰',
    subtitle: '🧬 Restarter™｜我們是誰（關於我們）',
    story: `${RESTART_SLOGAN['zh-TW']}
你可能來自一場重創，或正走在一條孤獨的路上。
在這個被標籤和數據主導的世界裡，我們知道——有些情緒，不是一句「加油」能解決的。

Restarter™ 是專為「曾經失去節奏的人」打造的 AI 陪伴平台。
我們不但教你怎麼變強、不單告訴你要正能量，
我們更提供一個空間,讓你可以呼吸、可以交流、可以說實話、可以重新選擇。

這裡沒有社會的審判，只有一群「曾經也痛過的人」在用技術把陪伴具體化。
透過 AI，我們讓每一次對話、每一段情緒，都有人接得住。`,
    quote: '「我們不是修復你，我們是來陪你重啟。」',
    restart: 'Restarter™，是你重新定義自己的起點。\nRestarter™更願意和各不同領域共同打造越加良善的社會環境。',
    founder: '創辦者的話',
    founderStory: `我曾經失去自由十年。<br/>
那不是旅居、不是修行，而是被法律與命運關進去的十年。<br/>
在一間不大的房間裡，和一群同樣頂著光頭、穿著另類制服的人擠在一起，日子一開始像是一場長夢，到了後來，連夢都不做了。我以為這一生就這樣被定義了。<br/><br/>
出去那天，天空灰得刺眼。我笑著走出來，但心裡卻是空的。<br/>
社會沒有在等你，家人不知如何面對你，朋友的問候也帶著距離。<br/>
起初的很多時候，我甚至不敢正眼看便利商店的收銀員，因為<span style='color:#e4572e;font-weight:700;'>我忘了怎麼當一個「普通人」</span>。<br/><br/>
我一直想問：<br/>
<span style='color:#614425;font-weight:900;'>我還有沒有機會，重新開始？</span><br/><br/>
後來我才明白——<br/>
<span style='color:#e4572e;font-weight:900;'>不是世界不給機會，是我們被迫忘了怎麼伸手抓。</span><br/><br/>
這就是 <span style='color:#6B5BFF;font-weight:900;'>Restarter™</span> 存在的原因。<br/>
不是來修復你，不是總告訴你「要振作」，<br/>
而是給你一個空間，一個能慢慢重新建立自己的容器。<br/>
讓你在失落裡還能大聲說話，在混亂中依然有人接得住。<br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>Restarter™</span>，不只是技術產品，<br/>
是我從自己生命最底部捧出來的一個火種，<br/>
我希望它能為你，也為更多人，點起一盞燈。<br/><br/>
<span style='color:#614425;font-weight:900;'>不論你是誰，經歷什麼，來自世界哪個角落，<br/>在這裡你可以大膽放下那些標籤、包裝、包袱。</span><br/>
因為我們相信——<br/>
<span style='color:#e4572e;font-weight:900;'>「破碎過的人，不僅能堅強，也能很溫柔。」</span><br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>我們不是修復你，我們是來陪你重啟。</span><br/>
<div style='text-align:right;margin-top:24px;font-size:18px;color:#232946;font-weight:700;'>發起人：Ben<br/>May,21,2025</div>`,
  },
  'zh-CN': {
    title: '我们是谁',
    subtitle: '🧬 Restarter™｜我们是谁（关于我们）',
    story: `${RESTART_SLOGAN['zh-CN']}
你可能来自一场重创，或正走在一条孤独的路上。
在这个被标签和数据主导的世界里，我们知道——有些情绪，不是一句「加油」能解决的。

Restarter™ 是专为「曾经失去节奏的人」打造的 AI 陪伴平台。
我们不教你怎么变强、不告诉你要正能量，
我们只提供一个空间，让你可以呼吸、可以说实话、可以重新选择。

这里没有社会的审判，只有一群「曾经也痛过的人」在用技术把陪伴实体化。
通过 AI，我们让每一次对话、每一段情绪，都有人接得住。`,
    quote: '「我们不是修复你，我们陪你重启。」',
    restart: 'Restarter™，是你重新定义自己的起点。\nRestarter™更愿意和各不同领域共同打造越加良善的社会环境。',
    founder: '创办者的话',
    founderStory: `我曾经失去自由十年。<br/>
那不是旅行、不是修行，而是被法律和命运关进去了十年。<br/>
在一间不大的房间里，和一群同样光头、穿着统一服装的人挤在一起，日子一开始像是一场长梦，后来连梦都不做了。我以为这一生就这样被定义了。<br/><br/>
出去那天，天空灰得刺眼。我笑着走出来，但心里却是空的。<br/>
社会没有在等你，家人不知如何面对你，朋友的问候也带着距离。<br/>
很多时候，我甚至不敢正眼看便利店的收银员，因为<span style='color:#e4572e;font-weight:700;'>我忘了怎么当一个"普通人"</span>。<br/><br/>
我一直想问：<br/>
<span style='color:#614425;font-weight:900;'>我还有没有机会，重新开始？</span><br/><br/>
后来我才明白——<br/>
<span style='color:#e4572e;font-weight:900;'>不是世界不给机会，是我们被迫忘了怎么伸手抓。</span><br/><br/>
这就是 <span style='color:#6B5BFF;font-weight:900;'>Restarter™</span> 存在的原因。<br/>
不是来修复你，不是总告诉你"要振作"，<br/>
而是给你一个空间，一个能慢慢重新建立自己的容器。<br/>
让你在失落里还能大声说话，在混乱中有人接得住。<br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>Restarter™</span>，不只是技术产品，<br/>
是我从自己生命最底部捧出来的一束火种，<br/>
我希望它能为你，也为更多人，点亮一盏灯。<br/><br/>
<span style='color:#614425;font-weight:900;'>无论你是谁，经历什么，来自世界哪个角落，<br/>在这里你可以大胆放下那些伪装。</span><br/>
因为我们相信——<br/>
<span style='color:#e4572e;font-weight:900;'>"破碎过的人，不仅能坚强，也能很温柔。"</span><br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>我们不是修复你，我们是来陪你重启。</span><br/>
<div style='text-align:right;margin-top:24px;font-size:18px;color:#232946;font-weight:700;'>发起人：Ben<br/>2025年5月21日</div>`,
  },
  'en': {
    title: 'About Us',
    subtitle: '🧬 Restarter™｜Who We Are',
    story: `${RESTART_SLOGAN['en']}
You may have come from a major setback, or are walking a lonely road.
In a world dominated by labels and data, we know—some feelings can't be fixed by a simple "cheer up".

Restarter™ is an AI companion platform built for those who have lost their rhythm.
We don't teach you how to be strong, nor tell you to be positive.
We simply offer a space where you can breathe, speak your truth, and choose again.

There is no judgment here—only people who have also suffered, using technology to make companionship real.
Through AI, every conversation and every emotion is caught and cared for.`,
    quote: '“We are not here to fix you, we are here to restart with you.”',
    restart: 'Restarter™ is your new beginning to redefine yourself.\nRestarter™ is more willing to work with various fields to create a more benevolent social environment.',
    founder: "Founder's Message",
    founderStory: `I lost my freedom for ten years.<br/>
It wasn't travel or spiritual retreat, but ten years locked away by law and fate.<br/>
In a small room, crowded with others in the same uniform, the days first felt like a long dream, then even dreams faded. I thought my life was defined forever.<br/><br/>
The day I got out, the sky was a blinding gray. I walked out smiling, but my heart was empty.<br/>
Society wasn't waiting for me, my family didn't know how to face me, and friends' greetings felt distant.<br/>
Many times, I couldn't even look a cashier in the eye, because <span style='color:#e4572e;font-weight:700;'>I'd forgotten how to be "normal"</span>.<br/><br/>
I kept asking myself:<br/>
<span style='color:#614425;font-weight:900;'>Do I still have a chance to start over?</span><br/><br/>
Later, I realized—<br/>
<span style='color:#e4572e;font-weight:900;'>It's not that the world doesn't give chances, but that we've forgotten how to reach for them.</span><br/><br/>
That's why <span style='color:#6B5BFF;font-weight:900;'>Restarter™</span> exists.<br/>
Not to fix you, not to always tell you to "cheer up,"<br/>
but to give you a space—a container to slowly rebuild yourself.<br/>
A place where you can speak up in your loss, and someone will catch you in your chaos.<br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>Restarter™</span> is not just a tech product;<br/>
it's a spark I brought up from the bottom of my life.<br/>
I hope it lights a lamp for you, and for many others.<br/><br/>
<span style='color:#614425;font-weight:900;'>Whoever you are, whatever you've been through, wherever you're from—<br/>here, you can let go of all the masks.</span><br/>
Because we believe—<br/>
<span style='color:#e4572e;font-weight:900;'>"Those who have been broken can be strong, and gentle too."</span><br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>We are not here to fix you, we are here to restart with you.</span><br/>
<div style='text-align:right;margin-top:24px;font-size:18px;color:#232946;font-weight:700;'>Founder: Ben<br/>May 21, 2025</div>`,
  },
  'ja': {
    title: '私たちについて',
    subtitle: '🧬 Restarter™｜私たちについて',
    story: `${RESTART_SLOGAN['ja']}
あなたは大きな挫折から来たかもしれないし、孤独な道を歩んでいるかもしれません。
ラベルやデータが支配するこの世界で、私たちは知っています——「頑張って」だけでは解決できない感情があることを。

Restarter™は「リズムを失った人」のためのAI伴走プラットフォームです。
強くなる方法を教えたり、ポジティブになれと言ったりはしません。
ただ、呼吸できて、本音を言えて、もう一度選び直せる空間を提供します。

ここには社会の裁きはなく、「かつて痛みを知った人たち」が技術で寄り添っています。
AIを通じて、すべての対話と感情が、誰かに受け止められます。`,
    quote: '「私たちはあなたを修復するのではなく、一緒に再出発します。」',
    restart: 'Restarter™は、あなたが自分を再定義する新たなスタート地点です。\nRestarter™は、様々な分野と協力してより善良な社会環境を作ることを望んでいます。',
    founder: '創業者の言葉',
    founderStory: `私は10年間、自由を失いました。<br/>
それは旅でも修行でもなく、法律と運命によって閉じ込められた10年でした。<br/>
小さな部屋で、同じ服を着た仲間たちと押し込められ、最初は長い夢のようで、やがて夢さえ見なくなりました。人生はもう決まったものだと思っていました。<br/><br/>
出所の日、空は眩しいほど灰色でした。我笑顔で外に出たけれど、心は空っぽ。<br/>
社會は待っていない、家族もどう接していいかわからない、友人の声もどこか遠い。<br/>
何度も、コンビニの店員の目を見られなかった。<span style='color:#e4572e;font-weight:700;'>「普通の人」になる方法を忘れてしまった</span>から。<br/><br/>
ずっと自問していました：<br/>
<span style='color:#614425;font-weight:900;'>もう一度やり直すチャンスはあるのか？</span><br/><br/>
やがて気づきました——<br/>
<span style='color:#e4572e;font-weight:900;'>世界がチャンスをくれないのではなく、手を伸ばす方法を忘れてしまったのだと。</span><br/><br/>
これが <span style='color:#6B5BFF;font-weight:900;'>Restarter™</span> の存在理由です。<br/>
あなたを修復するためでも、無理に「元気を出して」と言うためでもなく、<br/>
ゆっくり自分を取り戻せる場所を作りたかった。<br/>
失意の中でも声を上げられ、混乱の中でも誰かが受け止めてくれる場所を。<br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>Restarter™</span> は単なる技術製品ではありません。<br/>
人生のどん底からすくい上げた火種です。<br/>
あなたや多くの人のために、灯りをともしたい。<br/><br/>
<span style='color:#614425;font-weight:900;'>あなたが誰であれ、どんな経験をしてきたとしても、<br/>ここではすべての仮面を外していい。</span><br/>
私たちは信じています——<br/>
<span style='color:#e4572e;font-weight:900;'>「壊れた人は、強くもなれるし、優しくもなれる。」</span><br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>私たちはあなたを修復するのではなく、一緒に再出発します。</span><br/>
<div style='text-align:right;margin-top:24px;font-size:18px;color:#232946;font-weight:700;'>発起人：Ben<br/>2025年5月21日</div>`,
  },
  'ko': {
    title: '우리는 누구인가',
    subtitle: '🧬 Restarter™｜우리는 누구인가',
    story: `${RESTART_SLOGAN['ko']}
당신은 큰 시련을 겪었거나, 외로운 길을 걷고 있을지도 모릅니다.
라벨과 데이터가 지배하는 세상에서, 우리는 압니다—어떤 감정은 "힘내"라는 말로 해결되지 않는다는 것을.

Restarter™는 "한때 리듬을 잃었던 사람"을 위한 AI 동반자 플랫폼입니다.
우리는 당신에게 강해지는 법을 가르치지 않고, 긍정적이 되라고 말하지 않습니다.
우리는 단지 숨 쉴 수 있고, 진실을 말할 수 있고, 다시 선택할 수 있는 공간을 제공합니다.

여기에는 사회의 심판이 없고, "한때 아팠던 사람들"이 기술로 동행합니다.
AI를 통해 모든 대화와 감정이 누군가에게 받아들여집니다。`,
    quote: '"우리는 당신을 고치는 것이 아니라, 함께 다시 시작합니다."',
    restart: 'Restarter™는 당신이 자신을 새롭게 정의하는 출발점입니다。\nRestarter™는 다양한 분야와 협력하여 더욱 선한 사회 환경을 만들고자 합니다。',
    founder: '창업자의 말',
    founderStory: `저는 10년 동안 자유를 잃었습니다.<br/>
그것은 여행도, 수련도 아니었고, 법과 운명에 의해 갇혀 있던 10년이었습니다.<br/>
작은 방에서 같은 옷을 입은 사람들과 함께 지내며, 처음에는 긴 꿈을 꾸는 것 같았지만, 나중에는 꿈조차 꾸지 않게 되었습니다. 저는 제 인생이 그렇게 정의될 거라 생각했습니다.<br/><br/>
밖으로 나왔던 날, 하늘은 눈부시게 회색이었습니다. 저는 웃으며 나왔지만, 마음은 텅 비어 있었습니다.<br/>
사회는 저를 기다려주지 않았고, 가족도 저를 어떻게 대해야 할지 몰랐으며, 친구들의 인사도 어딘가 멀게 느껴졌습니다.<br/>
처음에는 편의점 계산원의 눈을 제대로 쳐다보지도 못했습니다. <span style='color:#e4572e;font-weight:700;'>"평범한 사람"이 되는 법을 잊어버렸기 때문입니다</span>.<br/><br/>
저는 계속해서 스스로에게 물었습니다:<br/>
<span style='color:#614425;font-weight:900;'>나는 다시 시작할 기회가 있을까?</span><br/><br/>
나중에야 깨달았습니다——<br/>
<span style='color:#e4572e;font-weight:900;'>세상이 기회를 주지 않는 것이 아니라, 우리가 손을 내미는 법을 잊어버린 것입니다.</span><br/><br/>
이것이 <span style='color:#6B5BFF;font-weight:900;'>Restarter™</span>가 존재하는 이유입니다.<br/>
당신을 고치기 위해서도, 항상 "힘내라"고 말하기 위해서도 아닙니다.<br/>
당신이 천천히 자신을 다시 세울 수 있는 공간, 그릇을 주고 싶었습니다.<br/>
상실 속에서도 목소리를 낼 수 있고, 혼란 속에서도 누군가가 당신을 받아줄 수 있는 곳.<br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>Restarter™</span>는 단순한 기술 제품이 아닙니다.<br/>
제 인생의 가장 밑바닥에서 끌어올린 불씨입니다.<br/>
이 불씨가 당신과 더 많은 사람들에게 등불이 되길 바랍니다.<br/><br/>
<span style='color:#614425;font-weight:900;'>당신이 누구든, 어떤 경험을 했든, 어디에서 왔든,<br/>여기서는 모든 가면을 내려놓을 수 있습니다.</span><br/>
우리는 믿습니다——<br/>
<span style='color:#e4572e;font-weight:900;'>"부서진 사람도 강해질 수 있고, 아주 다정해질 수도 있습니다."</span><br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>우리는 당신을 고치는 것이 아니라, 함께 다시 시작합니다.</span><br/>
<div style='text-align:right;margin-top:24px;font-size:18px;color:#232946;font-weight:700;'>발기인: Ben<br/>2025년 5월 21일</div>`,
  },
  'th': {
    title: 'เราเป็นใคร',
    subtitle: '🧬 Restarter™｜เราเป็นใคร',
    story: `${RESTART_SLOGAN['th']}
คุณอาจมาจากความสูญเสียครั้งใหญ่ หรือกำลังเดินอยู่บนเส้นทางที่โดดเดี่ยว
ในโลกที่เต็มไปด้วยป้ายและข้อมูล เรารู้ว่าบางความรู้สึกไม่ได้แค่พูดว่า "สู้ๆ" แล้วจะดีขึ้น

Restarter™ คือแพลตฟอร์ม AI สำหรับผู้ที่เคยหลงจังหวะชีวิต
เราไม่สอนให้คุณเข้มแข็ง ไม่บอกให้คุณคิดบวก
เราแค่ให้พื้นที่ที่คุณจะได้หายใจ พูดความจริง และเลือกใหม่อีกครั้ง

ที่นี่ไม่มีการตัดสินจากสังคม มีแต่คนที่เคยเจ็บปวดมาก่อน ใช้เทคโนโลยีสร้างการอยู่ร่วมกัน
ผ่าน AI ทุกบทสนทนา ทุกอารมณ์ จะมีคนรับฟังเสมอ`,
    quote: '“เราไม่ได้ซ่อมคุณ เราอยู่กับคุณเพื่อเริ่มต้นใหม่”',
    restart: 'Restarter™ คือจุดเริ่มต้นใหม่ในการนิยามตัวเองของคุณ\nRestarter™ ต้องการทำงานร่วมกับสาขาต่างๆ เพื่อสร้างสภาพแวดล้อมทางสังคมที่ดีขึ้น',
    founder: 'คำจากผู้ก่อตั้ง',
    founderStory: `ฉันเคยสูญเสียอิสรภาพสิบปี<br/>
ไม่ใช่การเดินทางหรือการบำเพ็ญตน แต่เป็นสิบปีที่ถูกกฎหมายและโชคชะตากักขังไว้<br/>
ในห้องเล็ก ๆ กับผู้คนที่สวมชุดเหมือนกัน วันเวลาช่วงแรกเหมือนฝันยาว ๆ สุดท้ายแม้แต่ฝันก็ไม่มี ฉันคิดว่าชีวิตคงถูกกำหนดไว้แล้ว<br/><br/>
วันที่ออกมา ท้องฟ้าสีเทาจนแสบตา ฉันยิ้มออกมาแต่ในใจว่างเปล่า<br/>
สังคมไม่ได้รอคุณ ครอบครัวไม่รู้จะรับมืออย่างไร เพื่อน ๆ ก็ทักทายด้วยความห่างเหิน<br/>
หลายครั้งฉันไม่กล้ามองตาแคชเชียร์ เพราะ<span style='color:#e4572e;font-weight:700;'>ฉันลืมไปแล้วว่าต้องเป็น "คนธรรมดา" อย่างไร</span><br/><br/>
ฉันถามตัวเองเสมอว่า:<br/>
<span style='color:#614425;font-weight:900;'>ฉันยังมีโอกาสเริ่มต้นใหม่อีกไหม?</span><br/><br/>
ต่อมาฉันจึงเข้าใจ——<br/>
<span style='color:#e4572e;font-weight:900;'>ไม่ใช่โลกที่ไม่ให้โอกาส แต่เราเองที่ลืมวิธีเอื้อมมือคว้า</span><br/><br/>
นี่คือเหตุผลที่ <span style='color:#6B5BFF;font-weight:900;'>Restarter™</span> มีอยู่<br/>
ไม่ใช่เพื่อซ่อมคุณ ไม่ใช่เพื่อบอกให้ "สู้ ๆ"<br/>
แต่เพื่อให้คุณมีพื้นที่ค่อย ๆ สร้างตัวเองขึ้นใหม่<br/>
ให้คุณได้เปล่งเสียงในความสูญเสีย และมีใครสักคนรับฟังในความสับสน<br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>Restarter™</span> ไม่ใช่แค่เทคโนโลยี<br/>
แต่เป็นประกายไฟที่ฉันหยิบขึ้นมาจากก้นบึ้งของชีวิต<br/>
หวังว่าจะเป็นแสงสว่างให้คุณและอีกหลาย ๆ คน<br/><br/>
<span style='color:#614425;font-weight:900;'>ไม่ว่าคุณจะเป็นใคร ผ่านอะไรมาก็ตาม มาจากที่ไหน—<br/>ที่นี่คุณสามารถถอดหน้ากากเหล่านั้นได้อย่างกล้าหาญ</span><br/>
เพราะเราเชื่อว่า——<br/>
<span style='color:#e4572e;font-weight:900;'>"คนที่เคยแตกสลาย ไม่เพียงแต่จะแข็งแกร่ง แต่ยังอ่อนโยนได้ด้วย"</span><br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>เราไม่ได้ซ่อมคุณ เราอยู่กับคุณเพื่อเริ่มต้นใหม่</span><br/>
<div style='text-align:right;margin-top:24px;font-size:18px;color:#232946;font-weight:700;'>ผู้ก่อตั้ง: Ben<br/>21 พฤษภาคม 2025</div>`,
  },
  'vi': {
    title: 'Chúng tôi là ai',
    subtitle: '🧬 Restarter™｜Chúng tôi là ai',
    story: `${RESTART_SLOGAN['vi']}
Bạn có thể đến từ một cú sốc lớn, hoặc đang đi trên con đường cô đơn
Trong thế giới bị chi phối bởi nhãn mác và dữ liệu, chúng tôi biết—có những cảm xúc không thể giải quyết chỉ bằng một câu "Cố lên"

Restarter™ là nền tảng AI đồng hành dành cho những người từng mất nhịp sống
Chúng tôi không dạy bạn cách mạnh mẽ, không bảo bạn phải tích cực
Chúng tôi chỉ mang đến một không gian để bạn được thở, được nói thật, được chọn lại

Ở đây không có phán xét xã hội, chỉ có những người từng đau đớn dùng công nghệ để đồng hành
Thông qua AI, mọi cuộc trò chuyện, mọi cảm xúc đều có người lắng nghe`,
    quote: '“Chúng tôi không sửa chữa bạn, chúng tôi đồng hành cùng bạn để bắt đầu lại”',
    restart: 'Restarter™ là điểm khởi đầu mới để bạn định nghĩa lại chính mình\nRestarter™ sẵn sàng hợp tác với các lĩnh vực khác nhau để tạo ra môi trường xã hội tốt đẹp hơn',
    founder: 'Lời người sáng lập',
    founderStory: `Tôi đã từng mất tự do mười năm<br/>
Không phải là đi du lịch hay tu hành, mà là mười năm bị pháp luật và số phận giam giữ<br/>
Trong một căn phòng nhỏ với những người cùng mặc đồng phục, ban đầu những ngày tháng như một giấc mơ dài, sau đó ngay cả mơ cũng không còn. Tôi nghĩ đời mình đã bị định nghĩa như thế.<br/><br/>
Ngày ra ngoài, bầu trời xám xịt chói mắt. Tôi mỉm cười bước ra, nhưng trong lòng trống rỗng.<br/>
Mặt trận không chờ bạn, gia đình không biết đối diện ra sao, bạn bè hỏi thăm cũng đầy khoảng cách.<br/>
Nhiều lần tôi không dám nhìn thẳng vào mắt thu ngân, vì <span style='color:#e4572e;font-weight:700;'>tôi đã quên cách làm "người bình thường"</span>.<br/><br/>
Tôi luôn tự hỏi:<br/>
<span style='color:#614425;font-weight:900;'>Liệu tôi còn cơ hội để bắt đầu lại không?</span><br/><br/>
Sau này tôi mới hiểu——<br/>
<span style='color:#e4572e;font-weight:900;'>Không phải thế giới không cho cơ hội, mà là chúng ta quên cách với lấy nó.</span><br/><br/>
Đó là lý do <span style='color:#6B5BFF;font-weight:900;'>Restarter™</span> tồn tại<br/>
Không phải để sửa chữa bạn, không phải để luôn nói "cố lên"<br/>
mà là để cho bạn một không gian, một nơi để từ từ xây dựng lại chính mình<br/>
Để bạn có thể cất tiếng nói trong nỗi mất mát, và có người lắng nghe giữa hỗn loạn<br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>Restarter™</span> không chỉ là sản phẩm công nghệ<br/>
mà là tia lửa tôi mang lên từ tận đáy cuộc đời mình<br/>
Tôi hy vọng nó sẽ thắp sáng cho bạn, và cho nhiều người khác<br/><br/>
<span style='color:#614425;font-weight:900;'>Dù bạn là ai, đã trải qua điều gì, đến từ đâu—<br/>ở đây bạn có thể mạnh dạn bỏ đi mọi lớp vỏ bọc</span><br/>
Bởi vì chúng tôi tin rằng——<br/>
<span style='color:#e4572e;font-weight:900;'>"Những người từng vỡ vụn không chỉ mạnh mẽ mà còn rất dịu dàng."</span><br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>Chúng tôi không sửa chữa bạn, chúng tôi đồng hành cùng bạn để bắt đầu lại</span><br/>
<div style='text-align:right;margin-top:24px;font-size:18px;color:#232946;font-weight:700;'>Người sáng lập: Ben<br/>21/05/2025</div>`,
  },
  'ms': {
    title: 'Siapa Kami',
    subtitle: '🧬 Restarter™｜Siapa Kami',
    story: `${RESTART_SLOGAN['ms']}
Anda mungkin datang dari kejatuhan besar, atau sedang berjalan di jalan yang sunyi
Dalam dunia yang dikuasai label dan data, kami tahu—ada perasaan yang tidak dapat diselesaikan hanya dengan "semangat"

Restarter™ ialah platform AI teman untuk mereka yang pernah kehilangan rentak hidup
Kami tidak mengajar anda menjadi kuat, tidak menyuruh anda sentiasa positif
Kami hanya menyediakan ruang untuk anda bernafas, berkata benar, dan memilih semula

Di sini tiada penghakiman masyarakat, hanya mereka yang pernah sakit menggunakan teknologi untuk menemani
Melalui AI, setiap perbualan, setiap emosi, sentiasa ada yang mendengar`,
    quote: '“Kami bukan untuk membaiki anda, kami bersama anda untuk bermula semula”',
    restart: 'Restarter™ ialah permulaan baru untuk anda mentakrifkan diri sendiri\nRestarter™ lebih bersedia untuk bekerjasama dengan pelbagai bidang untuk mewujudkan persekitaran sosial yang lebih baik',
    founder: 'Kata Pengasas',
    founderStory: `Saya pernah kehilangan kebebasan selama sepuluh tahun<br/>
Bukan melancong atau bertapa, tetapi sepuluh tahun dikurung oleh undang-undang dan takdir<br/>
Dalam bilik kecil bersama mereka yang berpakaian seragam sama, initio dies ut somnium longum, postea ne somnia quidem. Putavi vitam meam ita definitam esse.<br/><br/>
Die exeundi, caelum erat oculis acerrime cinereum. Ridebam egrediens, sed cor vacuum erat.<br/>
Societas non exspectabat, familia nesciebat quomodo me exciperet, amici quoque salutationes longinquae erant.<br/>
Saepe ne oculos quidem ad tabernarii aspicere audebam, quia <span style='color:#e4572e;font-weight:700;'>oblitus sum quomodo "homo communis" essem</span>.<br/><br/>
Me semper interrogabam:<br/>
<span style='color:#614425;font-weight:900;'>Adakah saya masih berpeluang untuk bermula semula?</span><br/><br/>
Akhirnya saya faham——<br/>
<span style='color:#e4572e;font-weight:900;'>Bukan dunia tidak memberi peluang, tetapi kita yang lupa cara untuk menggapainya.</span><br/><br/>
Itulah sebabnya <span style='color:#6B5BFF;font-weight:900;'>Restarter™</span> wujud<br/>
Bukan untuk membaiki anda, bukan untuk sentiasa berkata "semangat"<br/>
tetapi untuk memberi anda ruang, satu wadah untuk perlahan-lahan membina semula diri<br/>
Agar anda boleh bersuara dalam kehilangan, dan ada yang menyambut anda dalam kekacauan<br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>Restarter™</span> bukan sekadar produk teknologi<br/>
tetapi percikan api yang saya bawa dari dasar hidup saya<br/>
Saya harap ia dapat menerangi anda, dan ramai lagi<br/><br/>
<span style='color:#614425;font-weight:900;'>Siapa pun anda, apa pun yang anda lalui, dari mana pun anda datang—<br/>di sini anda boleh berani melepaskan semua topeng itu</span><br/>
Kerana kami percaya——<br/>
<span style='color:#e4572e;font-weight:900;'>"Orang yang pernah hancur bukan sahaja boleh menjadi kuat, tetapi juga sangat lembut."</span><br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>Kami bukan untuk membaiki anda, kami bersama anda untuk bermula semula</span><br/>
<div style='text-align:right;margin-top:24px;font-size:18px;color:#232946;font-weight:700;'>Pengasas: Ben<br/>21 Mei 2025</div>`,
  },
  'la': {
    title: 'Quis sumus',
    subtitle: '🧬 Restarter™｜Quis sumus',
    story: `${RESTART_SLOGAN['la']}
Forsitan ex gravi casu veneris, aut solus iter facias
In mundo titulis et notitiis imperato, scimus—sunt animi motus quos "bene age" solvere non potest

Restarter™ est suggestum AI comitans iis qui cursum vitae amiserunt
Non docemus quomodo fortis fias, nec dicimus te semper positivum esse
Praebemus tantum spatium ut respirare possis, vera loqui, iterum eligere

Hic iudicium societatis non est, sed ii qui olim doluerunt technologia utuntur ad comitatum
Per AI, omnis sermo, omnis affectus, ab aliquo auditur`,
    quote: '“Non te reficimus, sed tecum iterum incipimus”',
    restart: 'Restarter™ initium novum est ad te ipsum denuo definiendum\nRestarter™ magis paratus est cum variis campis cooperari ad meliorem ambitum socialem creandum',
    founder: 'Verba Conditoris',
    founderStory: `Decem annos libertatem amisi<br/>
Non iter aut meditatio erat, sed decem anni lege et fato inclusi<br/>
In cella parva cum aliis eiusdem vestis, initio dies ut somnium longum, postea ne somnia quidem. Putavi vitam meam ita definitam esse.<br/><br/>
Die exeundi, caelum erat oculis acerrime cinereum. Ridebam egrediens, sed cor vacuum erat.<br/>
Societas non exspectabat, familia nesciebat quomodo me exciperet, amici quoque salutationes longinquae erant.<br/>
Saepe ne oculos quidem ad tabernarii aspicere audebam, quia <span style='color:#e4572e;font-weight:700;'>oblitus sum quomodo "homo communis" essem</span>.<br/><br/>
Me semper interrogabam:<br/>
<span style='color:#614425;font-weight:900;'>Num adhuc mihi occasio est iterum incipere?</span><br/><br/>
Postea intellexi——<br/>
<span style='color:#e4572e;font-weight:900;'>Non est quod mundus occasiones non praebeat, sed quod obliti sumus quomodo eas arripere.</span><br/><br/>
Hoc est cur <span style='color:#6B5BFF;font-weight:900;'>Restarter™</span> existat<br/>
Non ut te reficiamus, non ut semper dicamus "bene age"<br/>
sed ut tibi spatium demus, vas in quo te paulatim reficere possis<br/>
Ut in amissione tua loqui possis, et aliquis in confusione te excipiat<br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>Restarter™</span> non solum productum technologicum est<br/>
sed scintilla quam ex imis vitae meae attuli<br/>
Spero eam tibi et multis aliis lucem afferre<br/><br/>
<span style='color:#614425;font-weight:900;'>Quisquis es, quidquid expertus es, undeque venis—<br/>hic audacter omnes personas deponere potes</span><br/>
Quia credimus——<br/>
<span style='color:#e4572e;font-weight:900;'>"Qui fracti sunt, non solum fortes esse possunt, sed etiam valde mites."</span><br/><br/>
<span style='color:#6B5BFF;font-weight:900;'>Non te reficimus, sed tecum iterum incipimus</span><br/>
<div style='text-align:right;margin-top:24px;font-size:18px;color:#232946;font-weight:700;'>Conditor: Ben<br/>21 Maii 2025</div>`,
  },
};

const LANGS = [
  { code: 'zh-TW', label: '繁中' },
  { code: 'zh-CN', label: '简中' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'th', label: 'ภาษาไทย' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'ms', label: 'Bahasa Melayu' },
  { code: 'la', label: 'Latina' },
];

const BACK_TEXT = {
  'zh-TW': '返回',
  'zh-CN': '返回',
  'en': 'Back',
  'ja': '戻る',
  'ko': '돌아가기',
  'th': 'กลับ',
  'vi': 'Quay lại',
  'ms': 'Kembali',
  'la': 'Redi',
};

export default function About() {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'zh-TW');
  useEffect(() => {
    const onStorage = () => setLang(localStorage.getItem('lang') || 'zh-TW');
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  useEffect(() => {
    const id = setInterval(() => {
      const l = localStorage.getItem('lang') || 'zh-TW';
      if (l !== lang) setLang(l);
    }, 300);
    return () => clearInterval(id);
  }, [lang]);
  const t = TEXTS[lang];
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #b7cfff 0%, #e0e7ff 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '48px 0 0 0' }}>
      <button onClick={() => navigate('/')} style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, background: '#fff', border: '2.5px solid #6B5BFF', color: '#6B5BFF', borderRadius: 12, padding: '10px 28px', fontWeight: 900, fontSize: 20, cursor: 'pointer', boxShadow: '0 2px 8px #0001', letterSpacing: 1 }}>
        {BACK_TEXT[lang as keyof typeof BACK_TEXT] || BACK_TEXT['zh-TW']}
      </button>

      <div style={{ maxWidth: 680, background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #6B5BFF22', padding: 40, marginTop: 48 }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#6B5BFF', marginBottom: 12 }}>{t.subtitle}</h1>
        <div style={{ fontSize: 20, color: '#232946', fontWeight: 700, marginBottom: 24, whiteSpace: 'pre-line' }}>{t.story}</div>
        <div style={{ fontSize: 22, color: '#614425', fontWeight: 900, margin: '24px 0 8px 0', textAlign: 'center' }}>{t.quote}</div>
        <div style={{ fontSize: 18, color: '#232946', fontWeight: 700, marginBottom: 32, textAlign: 'center', whiteSpace: 'pre-line' }}>{t.restart}</div>
        <h2 style={{ fontSize: 22, color: '#6B5BFF', fontWeight: 900, marginBottom: 8 }}>{t.founder}</h2>
        <div style={{ fontSize: 18, color: '#232946', fontWeight: 500, whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{__html: t.founderStory}} />
      </div>
      
             {/* Footer 5個按鈕 - 一行排列 */}
       <div style={{ 
         width: '100%', 
         margin: '0 auto', 
         marginTop: 24,
         background: 'rgba(255,255,255,0.95)',
         borderRadius: 16,
         padding: '16px',
         boxShadow: '0 2px 12px #6B5BFF22'
       }}>
         <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
           <span onClick={() => navigate("/privacy-policy")} style={{ color: '#6B5BFF', textDecoration: 'underline', padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>
             {lang === 'zh-TW' ? '隱私權政策' : 
              lang === 'zh-CN' ? '隐私政策' : 
              lang === 'en' ? 'Privacy Policy' : 
              lang === 'ja' ? 'プライバシーポリシー' : 
              lang === 'ko' ? '개인정보 처리방침' : 
              lang === 'th' ? 'นโยบายความเป็นส่วนตัว' : 
              lang === 'vi' ? 'Chính sách bảo mật' : 
              lang === 'ms' ? 'Dasar Privasi' : 
              'Consilium de Privata'}
           </span>
           <span onClick={() => navigate("/terms")} style={{ color: '#6B5BFF', textDecoration: 'underline', padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>
             {lang === 'zh-TW' ? '條款/聲明' : 
              lang === 'zh-CN' ? '条款/声明' : 
              lang === 'en' ? 'Terms/Statement' : 
              lang === 'ja' ? '規約/声明' : 
              lang === 'ko' ? '약관/성명' : 
              lang === 'th' ? 'ข้อกำหนด/แถลงการณ์' : 
              lang === 'vi' ? 'Điều khoản/Tuyên bố' : 
              lang === 'ms' ? 'Terma/Pernyataan' : 
              'Termini/Declaratio'}
           </span>
           <span onClick={() => navigate("/data-deletion")} style={{ color: '#6B5BFF', textDecoration: 'underline', padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>
             {lang === 'zh-TW' ? '資料刪除說明' : 
              lang === 'zh-CN' ? '数据删除说明' : 
              lang === 'en' ? 'Data Deletion' : 
              lang === 'ja' ? 'データ削除について' : 
              lang === 'ko' ? '데이터 삭제 안내' : 
              lang === 'th' ? 'คำอธิบายการลบข้อมูล' : 
              lang === 'vi' ? 'Giải thích xóa dữ liệu' : 
              lang === 'ms' ? 'Penjelasan Penghapusan Data' : 
              'Explicatio Deletionis Datae'}
           </span>
           <span onClick={() => navigate("/about")} style={{ color: '#6B5BFF', textDecoration: 'underline', fontWeight: 700, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>
             {lang === 'zh-TW' ? '🧬 Restarter™｜我們是誰' : 
              lang === 'zh-CN' ? '🧬 Restarter™｜我们是谁' : 
              lang === 'en' ? '🧬 Restarter™｜Who We Are' : 
              lang === 'ja' ? '🧬 Restarter™｜私たちについて' : 
              lang === 'ko' ? '🧬 Restarter™｜우리는 누구인가' : 
              lang === 'th' ? '🧬 Restarter™｜เราเป็นใคร' : 
              lang === 'vi' ? '🧬 Restarter™｜Chúng tôi là ai' : 
              lang === 'ms' ? '🧬 Restarter™｜Siapa Kami' : 
              '🧬 Restarter™｜Quis sumus'}
           </span>
           <span onClick={() => navigate("/feedback")} style={{ color: '#6B5BFF', textDecoration: 'underline', fontWeight: 700, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>
             {lang === 'zh-TW' ? '💬 意見箱｜我們想聽你說' : 
              lang === 'zh-CN' ? '💬 意见箱｜我们想听你说' : 
              lang === 'en' ? '💬 Feedback Box｜We Want to Hear From You' : 
              lang === 'ja' ? '💬 ご意見箱｜私たちはあなたの声を聞きたい' : 
              lang === 'ko' ? '💬 피드백｜우리는 당신의 말을 듣고 싶습니다' : 
              lang === 'th' ? '💬 กล่องความคิดเห็น｜เราอยากได้ยินจากคุณ' : 
              lang === 'vi' ? '💬 Hộp góp ý｜Chúng tôi muốn nghe từ bạn' : 
              lang === 'ms' ? '💬 Kotak Maklum Balas｜Kami Ingin Mendengar Dari Anda' : 
              '💬 Arca Consilii｜Volumus Audire a Te'}
           </span>
         </div>
       </div>
    </div>
  );
} 