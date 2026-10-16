const ekran=document.querySelector('#ekran');
const sesBtn=document.querySelector('#sesBtn');
const tekrarSesBtn=document.querySelector('#tekrarSesBtn');
const geriBtn=document.querySelector('#geriBtn');
const tamEkranBtn=document.querySelector('#tamEkranBtn');
const akanYildizlar=document.querySelector('#akanYildizlar');
const baslangicSesi=document.querySelector('#baslangicSesi');
const harikaSesi=document.querySelector('#harikaSesi');
const adlar=['','Bir','İki','Üç','Dört','Beş','Altı','Yedi','Sekiz','Dokuz','On'];
const renkler=['#7762d9','#f3965c','#6dc2a1','#e97f91','#e3ad25','#69aee8','#925fc7','#ef8c72','#54a99e','#d86f9e'];
const sesDosyalari={
  'haydi birlikte sayalım':'sesler/acilis.mp3','harika birden ona kadar saydın':'sesler/harika.wav','bir':'sesler/1-bir.wav','iki':'sesler/2-iki.wav',
  'üç':'sesler/3-uc.wav','dört':'sesler/4-dort.wav','beş':'sesler/5-bes.wav','altı':'sesler/6-alti.wav',
  'yedi':'sesler/7-yedi.wav','sekiz':'sesler/8-sekiz.wav','dokuz':'sesler/9-dokuz.wav','on':'sesler/10-on.wav'
};
const kacTaneSorulari=[
  {sayi:1,ad:'top',simge:'⚽',secenek:[1,2,3]},{sayi:2,ad:'yıldız',simge:'★',secenek:[2,4,5]},
  {sayi:3,ad:'küp',simge:'🧊',secenek:[3,1,6]},{sayi:4,ad:'mor daire',simge:'●',secenek:[2,4,7],renk:'#925fc7'},
  {sayi:5,ad:'elma',simge:'🍎',secenek:[5,3,8]},{sayi:6,ad:'yaprak',simge:'🍂',secenek:[6,4,9]},
  {sayi:7,ad:'çiçek',simge:'🌼',secenek:[7,5,10]},{sayi:8,ad:'kalp',simge:'♥',secenek:[8,6,9],renk:'#e97f91'},
  {sayi:9,ad:'kelebek',simge:'🦋',secenek:[9,7,10]},{sayi:10,ad:'güneş',simge:'☀',secenek:[10,8,6],renk:'#f3b72c'}
];
let sesAcik=true,aktifSes=null,sonSesDosyasi=null,aktifZamanlayicilar=[],siralaTamam=0,seciliKart=null,soruNo=0,sorular=[],oyunEkrani='acilis',saymaSayisi=1,kacSorular=[],kacSoruNo=0,kacKilit=false;

function durumAyarla(durum){
  oyunEkrani=durum;sonSesDosyasi=null;tekrarSesBtn.classList.add('gizli');const giriste=durum==='acilis';geriBtn.classList.toggle('gizli',giriste);sesBtn.classList.toggle('gizli',giriste||durum==='sarki'||durum==='kutlama');tamEkranBtn.classList.toggle('gizli',giriste)
}
function tekrarSesiniHazirla(dosya){sonSesDosyasi=dosya;if(oyunEkrani!=='acilis'&&oyunEkrani!=='sarki'&&oyunEkrani!=='kutlama')tekrarSesBtn.classList.remove('gizli')}

function arkaPlanYildizlariniKur(){
  const isaretler=['★','✦','✧'];
  for(let i=0;i<24;i++){
    const y=document.createElement('span');
    const nokta=i%5===0;
    y.className='akan-yildiz'+(nokta?' nokta':'');
    y.textContent=nokta?'':isaretler[i%isaretler.length];
    y.style.setProperty('--sol',`${2+Math.random()*96}%`);
    y.style.setProperty('--boyut',`${13+Math.random()*20}px`);
    y.style.setProperty('--sure',`${15+Math.random()*13}s`);
    y.style.setProperty('--gecikme',`${-Math.random()*25}s`);
    y.style.setProperty('--salinim',`${-42+Math.random()*84}px`);
    y.style.setProperty('--renk',renkler[i%renkler.length]);
    akanYildizlar.appendChild(y);
  }
}

function zamanlayici(fn,ms){const id=setTimeout(fn,ms);aktifZamanlayicilar.push(id);return id}
function temizle(){aktifZamanlayicilar.forEach(clearTimeout);aktifZamanlayicilar=[];if(aktifSes){aktifSes.pause();aktifSes.currentTime=0;aktifSes=null}}
function konus(metin,bitince){
  const anahtar=metin.toLocaleLowerCase('tr-TR').replace(/[.!?,]/g,'').trim();
  const dosya=sesDosyalari[anahtar];
  if(dosya)tekrarSesiniHazirla(dosya);
  if(!sesAcik||!dosya){if(bitince)zamanlayici(bitince,650);return}
  if(aktifSes){aktifSes.pause();aktifSes.currentTime=0}
  const ses=new Audio(dosya);aktifSes=ses;
  let bitti=false;const tamamla=()=>{if(bitti)return;bitti=true;if(aktifSes===ses)aktifSes=null;if(bitince)bitince()};
  ses.addEventListener('ended',tamamla,{once:true});ses.addEventListener('error',tamamla,{once:true});
  ses.play().catch(tamamla)
}
function baslangicSesiniCal(){
  if(!sesAcik){zamanlayici(()=>sayma(1),350);return}
  if(aktifSes&&aktifSes!==baslangicSesi){aktifSes.pause();aktifSes.currentTime=0}
  aktifSes=baslangicSesi;baslangicSesi.pause();baslangicSesi.currentTime=0;baslangicSesi.volume=1;
  let bitti=false;const devam=()=>{if(bitti)return;bitti=true;baslangicSesi.removeEventListener('ended',devam);baslangicSesi.removeEventListener('error',devam);if(aktifSes===baslangicSesi)aktifSes=null;sayma(1)};
  baslangicSesi.addEventListener('ended',devam,{once:true});baslangicSesi.addEventListener('error',devam,{once:true});
  baslangicSesi.play().catch(devam)
}
function harikaSesiniCal(){
  tekrarSesiniHazirla('sesler/harika.wav');
  if(!sesAcik)return;
  if(aktifSes&&aktifSes!==harikaSesi){aktifSes.pause();aktifSes.currentTime=0}
  aktifSes=harikaSesi;harikaSesi.pause();harikaSesi.currentTime=0;harikaSesi.volume=1;
  const tamamla=()=>{if(aktifSes===harikaSesi)aktifSes=null};
  harikaSesi.addEventListener('ended',tamamla,{once:true});harikaSesi.addEventListener('error',tamamla,{once:true});harikaSesi.play().catch(tamamla)
}
function minikSes(){if(!sesAcik)return;const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=new A(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type='sine';o.frequency.setValueAtTime(520,c.currentTime);o.frequency.exponentialRampToValueAtTime(760,c.currentTime+.15);g.gain.setValueAtTime(.08,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.25);o.start();o.stop(c.currentTime+.25)}
function basariMelodisi(){
  if(!sesAcik)return;const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=new A(),baslangic=c.currentTime+.03;
  [523,659,784,1047].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain(),t=baslangic+i*.15;o.type='sine';o.frequency.value=f;o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.09,t+.025);g.gain.exponentialRampToValueAtTime(.001,t+.22);o.start(t);o.stop(t+.24)});
  zamanlayici(()=>c.close(),1100)
}
function karistir(d){const a=[...d];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function ilerleme(n){return `<div class="ilerleme" aria-label="Bölüm ${n} / 3"><i class="${n===1?'aktif':''}"></i><i class="${n===2?'aktif':''}"></i><i class="${n===3?'aktif':''}"></i></div>`}

function acilis(){
  temizle();durumAyarla('acilis');ekran.className='ekran acilis';ekran.innerHTML=`<img class="giris-gorseli" src="gorseller/giris-ekrani-v2.png" alt="Ülkem Yanımda Türkçe ve Türk Kültürü derslerine hoş geldiniz"><button class="giris-baslat" id="baslaBtn" aria-label="Oyunu başlat">Başlat</button>`;
  document.querySelector('#baslaBtn').onclick=baslangicSesiniCal
}
function sayma(sayi){
  temizle();durumAyarla('sayma');saymaSayisi=sayi;ekran.className='ekran sayma-ekran';ekran.innerHTML=`${ilerleme(1)}<p class="bolum-adi">BİRLİKTE SAYALIM</p><h2 class="yonerge">Benimle tekrar et!</h2><div class="buyuk-sayi" style="color:${renkler[sayi-1]}">${sayi}</div><div class="sayac-noktalar">${Array.from({length:10},(_,i)=>`<i class="${i<sayi?'dolu':''}"></i>`).join('')}</div><button class="ana-btn sayma-ileri" id="saymaIleriBtn">${sayi<10?'İleri':'Tamamla'} <b aria-hidden="true">→</b></button>`;
  konus(adlar[sayi]+'.');
  document.querySelector('#saymaIleriBtn').onclick=()=>sayi<10?sayma(sayi+1):saymaBitti()
}
function saymaBitti(){
  temizle();durumAyarla('sayma-bitti');ekran.className='ekran';ekran.innerHTML=`${ilerleme(1)}<div class="rozet" style="color:var(--sari)">★</div><h2 class="yonerge">Harika!</h2><p class="alt-metin">Birden ona kadar saydın!</p><button class="ana-btn" id="devamBtn">Devam Et <b>→</b></button>`;harikaSesiniCal();document.querySelector('#devamBtn').onclick=siralama
}
function siralama(){
  temizle();durumAyarla('siralama');siralaTamam=0;seciliKart=null;ekran.className='ekran sirala-ekran';const sayilar=karistir([1,2,3,4,5,6,7,8,9,10]);
  ekran.innerHTML=`${ilerleme(2)}<p class="bolum-adi">SIRAYA KOY</p><h2 class="yonerge">Sayıları sıraya koyalım!</h2><div class="yuvalar">${Array.from({length:10},(_,i)=>`<div class="yuva" data-hedef="${i+1}" aria-label="${i+1}. sıra">${i+1}</div>`).join('')}</div><div class="kartlar" id="kartlar">${sayilar.map(n=>`<button class="kart" draggable="false" data-sayi="${n}" style="--renk:${renkler[n-1]}" aria-label="${adlar[n]} rakamı">${n}</button>`).join('')}</div><div class="sirala-alt"><p class="yardim">Sayıyı tut ve doğru yere sürükle</p><button class="ana-btn ikincil-btn sirala-ileri" id="siralaIleriBtn">İleri →</button></div>`;
  document.querySelector('#siralaIleriBtn').onclick=soruBaslat;konus('Sayıları birden ona kadar sıraya koyalım.');etkilesimKur()
}
function etkilesimKur(){
  document.querySelectorAll('.kart').forEach(k=>{
    k.addEventListener('pointerdown',e=>suruklemeyiBaslat(e,k));
  });
}
function suruklemeyiBaslat(e,kart){
  e.preventDefault();const basX=e.clientX,basY=e.clientY;let hedef=null;kart.setPointerCapture(e.pointerId);kart.classList.add('surukleniyor');
  const hareket=olay=>{olay.preventDefault();kart.style.transform=`translate(${olay.clientX-basX}px,${olay.clientY-basY}px) scale(1.07)`;kart.style.pointerEvents='none';hedef=document.elementFromPoint(olay.clientX,olay.clientY)?.closest('.yuva:not(.dolu)')||null;kart.style.pointerEvents='';document.querySelectorAll('.yuva').forEach(y=>y.classList.toggle('hedefte',y===hedef))};
  const birak=olay=>{kart.removeEventListener('pointermove',hareket);kart.removeEventListener('pointerup',birak);kart.removeEventListener('pointercancel',iptal);kart.classList.remove('surukleniyor');kart.style.transform='';document.querySelectorAll('.yuva').forEach(y=>y.classList.remove('hedefte'));if(hedef)yerlestir(kart,hedef)};
  const iptal=()=>{kart.removeEventListener('pointermove',hareket);kart.removeEventListener('pointerup',birak);kart.removeEventListener('pointercancel',iptal);kart.classList.remove('surukleniyor');kart.style.transform='';document.querySelectorAll('.yuva').forEach(y=>y.classList.remove('hedefte'))};
  kart.addEventListener('pointermove',hareket);kart.addEventListener('pointerup',birak);kart.addEventListener('pointercancel',iptal)
}
function yerlestir(kart,yuva){
  if(!kart||yuva.classList.contains('dolu'))return;
  if(kart.dataset.sayi===yuva.dataset.hedef){kart.classList.remove('secili');kart.draggable=false;yuva.textContent='';yuva.appendChild(kart);yuva.classList.add('dolu');seciliKart=null;siralaTamam++;minikSes();konus(adlar[Number(kart.dataset.sayi)]+'.');if(siralaTamam===10)zamanlayici(siralamaBitti,900)}
  else{kart.classList.remove('sallan');void kart.offsetWidth;kart.classList.add('sallan');konus('Bir daha deneyelim.')}
}
function siralamaBitti(){
  document.querySelectorAll('.yuva').forEach((y,i)=>zamanlayici(()=>y.style.filter='brightness(1.07) drop-shadow(0 0 8px #f7c95e)',i*80));basariMelodisi();const b=document.querySelector('#siralaIleriBtn');b.textContent='Devam Et →';b.className='ana-btn sirala-ileri'
}
function soruBaslat(){sorular=karistir([1,2,3,4,5,6,7,8,9]).slice(0,6);soruNo=0;soruGoster()}
function soruGoster(){
  temizle();durumAyarla('soru');const hedef=sorular[soruNo],diger=karistir([1,2,3,4,5,6,7,8,9].filter(n=>n!==hedef)).slice(0,2),secenekler=karistir([hedef,...diger]);ekran.className='ekran bul-ekran';
  ekran.innerHTML=`${ilerleme(3)}<p class="bolum-adi">RAKAMI BUL</p><h2 class="yonerge">“${adlar[hedef]}” rakamını bul.</h2><div class="secenekler">${secenekler.map(n=>`<button class="secenek" data-sayi="${n}" style="--renk:${renkler[n-1]}" aria-label="${adlar[n]}">${n}</button>`).join('')}</div><div class="soru-sayaci">${Array.from({length:6},(_,i)=>`<i class="${i<soruNo?'tamam':''}"></i>`).join('')}</div><div class="yildizlar"></div>`;
  konus(adlar[hedef]+' rakamını bul.');document.querySelectorAll('.secenek').forEach(b=>b.onclick=()=>cevapla(b,hedef))
}
function cevapla(b,hedef){
  if(b.dataset.sayi==hedef){document.querySelectorAll('.secenek').forEach(x=>x.disabled=true);b.classList.add('dogru');yildizYap();minikSes();konus('Evet! Bu '+adlar[hedef].toLocaleLowerCase('tr-TR')+'.');soruNo++;zamanlayici(()=>soruNo<6?soruGoster():bitis(),1700)}
  else{b.classList.remove('yanlis');void b.offsetWidth;b.classList.add('yanlis');konus('Bir kez daha bakalım.')}
}
function yildizYap(){const alan=document.querySelector('.yildizlar');for(let i=0;i<9;i++){const s=document.createElement('span');s.className='yildiz';s.textContent='★';s.style.left=(20+Math.random()*60)+'%';s.style.top=(35+Math.random()*35)+'%';s.style.animationDelay=(Math.random()*.25)+'s';alan.appendChild(s)}}
function bitis(){
  temizle();durumAyarla('bitis');ekran.className='ekran bitis';ekran.innerHTML=`<div class="rozet">🏅</div><h1 class="baslik"><em>Tebrikler!</em></h1><div class="bitis-sayilar">${Array.from({length:10},(_,i)=>`<span style="--i:${i};--renk:${renkler[i]}">${i+1}</span>`).join('')}</div><div class="bitis-butonlar"><button class="ana-btn turuncu" id="sarkiBtn">İleri <b aria-hidden="true">→</b></button><button class="ana-btn ikincil-btn" id="tekrarBtn">Tekrar Oyna ↻</button></div>`;
  konus('Bir, iki, üç, dört, beş, altı, yedi, sekiz, dokuz, on. Harikasın! Sayılarla çok güzel oynadın.');document.querySelector('#sarkiBtn').onclick=kacTaneAcilis;document.querySelector('#tekrarBtn').onclick=acilis
}
function kacTaneAcilis(){
  temizle();durumAyarla('kac-acilis');ekran.className='ekran kac-acilis';ekran.innerHTML=`<div class="kac-rozet" aria-hidden="true">🍎</div><p class="ust-etiket">SAY VE BUL</p><h1 class="baslik">Kaç <em>Tane?</em></h1><p class="alt-metin">Nesneleri say, doğru sayıyı bul!</p><button class="ana-btn" id="kacBaslaBtn">Başla <b aria-hidden="true">→</b></button>`;
  document.querySelector('#kacBaslaBtn').onclick=kacTaneBaslat
}
function kacTaneBaslat(){
  kacSorular=[...karistir(kacTaneSorulari.slice(0,3)),...karistir(kacTaneSorulari.slice(3,7)),...karistir(kacTaneSorulari.slice(7,10))];kacSoruNo=0;kacTaneSoruGoster()
}
function kacTaneSoruGoster(){
  temizle();durumAyarla('kac-soru');kacKilit=false;const soru=kacSorular[kacSoruNo],secenekler=karistir(soru.secenek);
  ekran.className='ekran kac-soru-ekran';ekran.innerHTML=`<div class="kac-ilerleme">${kacSoruNo+1} / 10</div><h2 class="kac-soru">Kaç tane ${soru.ad} var?</h2><div class="nesne-alani" aria-label="Sayılacak ${soru.ad} nesneleri">${Array.from({length:soru.sayi},(_,i)=>`<button class="sayma-nesnesi" data-sira="${i+1}" aria-label="${i+1}. ${soru.ad}" style="${soru.renk?`color:${soru.renk}`:''}">${soru.ad==='yaprak'?'<svg class="tek-yaprak-svg" viewBox="0 0 64 78" aria-hidden="true"><path class="yaprak-govde" d="M52 8C29 8 12 25 12 47c0 14 10 23 22 23 20 0 29-22 18-62Z"/><path class="yaprak-damar" d="M49 15C40 31 31 43 18 59M33 41l-10-2M39 31l-8-3"/></svg>':soru.simge}</button>`).join('')}</div><div class="kac-secenekler">${secenekler.map(n=>`<button class="kac-secenek" data-sayi="${n}" style="--renk:${renkler[(n-1)%renkler.length]}">${n}</button>`).join('')}</div><p class="kac-mesaj" aria-live="polite"></p><div class="yildizlar"></div>`;
  tekrarSesiniHazirla(sesDosyalari[adlar[soru.sayi].toLocaleLowerCase('tr-TR')]);
  document.querySelectorAll('.sayma-nesnesi').forEach(n=>n.onclick=()=>{n.classList.remove('sayildi');void n.offsetWidth;n.classList.add('sayildi');konus(adlar[Number(n.dataset.sira)]+'.')});
  document.querySelectorAll('.kac-secenek').forEach(b=>b.onclick=()=>kacTaneCevapla(b,soru))
}
function kacTaneCevapla(b,soru){
  if(kacKilit)return;
  const mesaj=document.querySelector('.kac-mesaj');
  if(Number(b.dataset.sayi)===soru.sayi){
    kacKilit=true;document.querySelectorAll('.kac-secenek').forEach(x=>x.disabled=true);b.classList.add('dogru');mesaj.textContent=`Doğru! ${soru.sayi} tane.`;yildizYap();minikSes();konus(adlar[soru.sayi]+'.');kacSoruNo++;
    zamanlayici(()=>{if(kacSoruNo>=10)kacTaneBitti();else kacTaneSoruGoster()},1900)
  }else{b.classList.remove('yanlis');void b.offsetWidth;b.classList.add('yanlis');mesaj.textContent='Bir daha deneyelim.'}
}
function kacTaneBitti(){
  temizle();durumAyarla('kac-bitti');ekran.className='ekran bitis kac-bitti';ekran.innerHTML=`<div class="rozet">🎉</div><h1 class="baslik"><em>Tebrikler!</em></h1><p class="alt-metin">Nesneleri saydın ve sayıları buldun!</p><div class="bitis-sayilar">${Array.from({length:10},(_,i)=>`<span style="--i:${i};--renk:${renkler[i]}">${i+1}</span>`).join('')}</div><div class="kac-butonlar"><button class="ana-btn turuncu" id="kacIleriBtn">İleri <b>→</b></button><button class="ana-btn ikincil-btn" id="kacTekrarBtn">Tekrar Oyna ↻</button><button class="ana-btn ikincil-btn" id="kacAnaBtn">Ana Sayfa</button></div>`;
  minikSes();document.querySelector('#kacIleriBtn').onclick=sarkiSayfasi;document.querySelector('#kacTekrarBtn').onclick=kacTaneBaslat;document.querySelector('#kacAnaBtn').onclick=acilis
}
function sarkiSayfasi(){
  temizle();durumAyarla('sarki');ekran.className='ekran sarki-ekran';ekran.innerHTML=`<h1 class="sarki-baslik">Şarkı Zamanı! ♪</h1><div class="video-kutu"><video id="sarkiVideosu" class="sarki-video" playsinline preload="metadata"><source src="videolar/sayilar-sarkisi.mp4?v=2" type="video/mp4">Video bu cihazda açılamadı.</video><div class="video-kontroller"><button id="videoOynatBtn" class="video-kontrol-btn" aria-label="Videoyu duraklat">❚❚</button><span id="videoSure" class="video-sure">00:00 / 00:46</span><input id="videoIlerleme" class="video-ilerleme" type="range" min="0" max="46" step="0.1" value="0" aria-label="Video ilerlemesi"><button id="videoSesBtn" class="video-kontrol-btn" aria-label="Videonun sesini kapat">♪</button><button id="videoTamEkranBtn" class="video-kontrol-btn" aria-label="Videoyu tam ekran yap">⛶</button></div></div><button id="videoTamamBtn" class="ana-btn video-tamam gizli">Tamamlandı ✓</button>`;
  const video=document.querySelector('#sarkiVideosu'),oynatBtn=document.querySelector('#videoOynatBtn'),sure=document.querySelector('#videoSure'),cubuk=document.querySelector('#videoIlerleme'),videoSesBtn=document.querySelector('#videoSesBtn'),videoTamEkranBtn=document.querySelector('#videoTamEkranBtn');video.volume=.9;
  const tamamBtn=document.querySelector('#videoTamamBtn');tamamBtn.onclick=kutlamaSayfasi;
  const zamanYaz=s=>`00:${String(Math.floor(s)).padStart(2,'0')}`;
  const oynatDuraklat=()=>video.paused?video.play().catch(()=>{}):video.pause();video.onclick=oynatDuraklat;oynatBtn.onclick=oynatDuraklat;
  video.addEventListener('timeupdate',()=>{const an=Math.min(video.currentTime,46);cubuk.value=an;sure.textContent=`${zamanYaz(an)} / 00:46`;if(video.currentTime>=46){video.pause();video.currentTime=46;tamamBtn.classList.remove('gizli')}});
  video.addEventListener('play',()=>{if(video.currentTime>=45.9){video.currentTime=0;tamamBtn.classList.add('gizli')}oynatBtn.textContent='❚❚';oynatBtn.setAttribute('aria-label','Videoyu duraklat')});
  video.addEventListener('pause',()=>{oynatBtn.textContent='▶';oynatBtn.setAttribute('aria-label','Videoyu oynat')});
  cubuk.oninput=()=>{video.currentTime=Math.min(Number(cubuk.value),46)};
  videoSesBtn.onclick=()=>{video.muted=!video.muted;videoSesBtn.textContent=video.muted?'×':'♪';videoSesBtn.setAttribute('aria-label',video.muted?'Videonun sesini aç':'Videonun sesini kapat')};
  videoTamEkranBtn.onclick=()=>{if(!document.fullscreenElement)video.requestFullscreen?.();else document.exitFullscreen?.()};
  video.play().catch(()=>{})
}
function kutlamaSayfasi(){
  temizle();durumAyarla('kutlama');ekran.className='ekran kutlama-ekran';
  const parcalar=Array.from({length:70},(_,i)=>`<i class="konfeti-parca" style="--x:${Math.random()*100}%;--w:${7+Math.random()*10}px;--c:${renkler[i%renkler.length]};--d:${3.8+Math.random()*3}s;--gecikme:${-Math.random()*6}s;--s:${-45+Math.random()*90}px"></i>`).join('');
  ekran.innerHTML=`<div class="konfeti-alani" aria-hidden="true">${parcalar}</div><div class="kutlama-ikon">🎉</div><h1 class="kutlama-baslik">Tebrikler!</h1><p class="kutlama-metin">Etkinliği tamamladın!</p><button class="ana-btn turuncu" id="bastanBtn">Tekrar Oyna ↻</button>`;
  document.querySelector('#bastanBtn').onclick=acilis
}
sesBtn.onclick=()=>{sesAcik=!sesAcik;sesBtn.classList.toggle('kapali',!sesAcik);sesBtn.textContent=sesAcik?'♪':'×';sesBtn.setAttribute('aria-label',sesAcik?'Sesleri kapat':'Sesleri aç');sesBtn.title=sesAcik?'Sesleri kapat':'Sesleri aç';if(!sesAcik&&aktifSes){aktifSes.pause();aktifSes.currentTime=0;aktifSes=null}};
tekrarSesBtn.onclick=()=>{if(!sesAcik||!sonSesDosyasi)return;if(aktifSes){aktifSes.pause();aktifSes.currentTime=0}const ses=new Audio(sonSesDosyasi);aktifSes=ses;ses.addEventListener('ended',()=>{if(aktifSes===ses)aktifSes=null},{once:true});ses.play().catch(()=>{if(aktifSes===ses)aktifSes=null})};
geriBtn.onclick=()=>{if(oyunEkrani==='sayma')saymaSayisi>1?sayma(saymaSayisi-1):acilis();else if(oyunEkrani==='sayma-bitti')sayma(10);else if(oyunEkrani==='siralama')saymaBitti();else if(oyunEkrani==='soru')siralama();else if(oyunEkrani==='bitis')soruBaslat();else if(oyunEkrani==='kac-acilis')bitis();else if(oyunEkrani==='kac-soru'||oyunEkrani==='kac-bitti')kacTaneAcilis();else if(oyunEkrani==='sarki')kacTaneBitti();else if(oyunEkrani==='kutlama')sarkiSayfasi();else acilis()};
tamEkranBtn.onclick=()=>{if(!document.fullscreenElement){document.documentElement.requestFullscreen?.()}else document.exitFullscreen?.()};
arkaPlanYildizlariniKur();
acilis();
