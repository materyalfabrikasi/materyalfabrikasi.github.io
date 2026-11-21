'use strict';
const items = [
 {image:'bayrak-pro.png',name:'Türk bayrağı',audio:'turkbayragi.wav',question:'Bu nedir?',clue:'Kırmızı zemin üzerinde beyaz ay ve yıldız vardır.'},
 {image:'okul-resmi-meb.svg',name:'Okul',audio:'okul.wav',question:'Burası neresi?',clue:'Ders yaptığımız ve yeni bilgiler öğrendiğimiz yerdir.'},
 {image:'ogretmen-pro.png',name:'Öğretmen',audio:'ogretmen.wav',question:'Bu kim?',clue:'Öğrencilere yeni bilgiler öğreten ve öğrenmelerine yardımcı olan kişidir.'},
 {image:'sira-pro.png',name:'Sıra',audio:'sira.wav',question:'Bu nedir?',clue:'Sınıfta ders çalışırken kullandığımız masa ve oturaktır.'},
 {image:'toren-pro.png',name:'Bayrak töreni',audio:'bayraktoreni.wav',question:'Bu nedir?',clue:'Okulda İstiklal Marşı eşliğinde bayrağın göndere çekildiği törendir.'}
];
const $ = id => document.getElementById(id);
let index = -1, phase = 'intro', redirectTimer;
function announce(message) { $('status').textContent=message; }
const answerAudio=$('answer-audio');
let audioRequest=0;
function audioButton(playing=false){
 $('listen').classList.toggle('playing',playing);
 $('listen').textContent=playing?'↻ Yeniden dinle':'🔊 Dinle';
}
function stopAnswerAudio(){
 ++audioRequest;answerAudio.pause();answerAudio.currentTime=0;
 audioButton(false);$('answer-audio-message').hidden=true;
}
function audioFailure(){
 if(phase!=='answer')return;
 audioButton(false);$('answer-audio-message').hidden=false;
 $('answer-audio-message').textContent='Ses çalınamadı. Tekrar denemek için Dinle düğmesine dokun.';
}
async function playAnswerAudio(){
 if(phase!=='answer')return;
 const request=++audioRequest;
 $('answer-audio-message').hidden=true;
 answerAudio.currentTime=0;
 try{
  await answerAudio.play();
  if(request===audioRequest&&phase==='answer')audioButton(!answerAudio.paused);
 }catch(error){
  if(request===audioRequest&&error.name!=='AbortError')audioFailure();
 }
}
answerAudio.addEventListener('ended',()=>audioButton(false));
answerAudio.addEventListener('error',audioFailure);
$('listen').addEventListener('click',playAnswerAudio);

function progress() {
 $('count').textContent=index+1;
 document.querySelectorAll('.dots span').forEach((dot,i)=>{dot.classList.toggle('done',i<index || (i===index && phase==='answer'));dot.classList.toggle('current',i===index && phase!=='answer');});
}
function start() {
 stopAnswerAudio();
 clearInterval(redirectTimer);index=-1;phase='ready';
 $('intro').hidden=true;$('finish').hidden=true;$('game').hidden=false;
 $('empty').hidden=false;$('item').hidden=true;$('asset-error').hidden=true;
 $('bag').disabled=false;$('bag-hint').textContent='Çantaya dokun! ↗';
 $('instruction').textContent='İlk fotoğrafı görmek için çantaya dokun.';
 progress();announce('Çantaya dokunarak ilk fotoğrafı aç.');$('bag').focus();
}
function discover() {
 if(phase!=='ready')return;
 index++;phase='question';const item=items[index];
 stopAnswerAudio();answerAudio.src=item.audio;answerAudio.load();$('listen').setAttribute('aria-label',item.name+' cevabını dinle');
 $('bag').disabled=true;$('empty').hidden=true;$('item').hidden=false;
 $('solution').hidden=true;$('reveal').hidden=false;$('think').hidden=false;
 $('asset-error').hidden=true;
 const img=$('item-image');img.src='assets/'+item.image;img.alt=item.name;
 img.classList.remove('portrait');
 $('question').textContent=item.question;$('answer').textContent=item.name;$('clue').textContent=item.clue;
 $('next').textContent=index===4?'Keşfi tamamla →':'Sıradaki fotoğraf →';
 $('instruction').textContent='Fotoğrafa bak, soruyu cevapla.';
 $('bag-hint').textContent='Önce tahminini söyle.';
 $('item').classList.remove('pop');void $('item').offsetWidth;$('item').classList.add('pop');
 progress();announce(`${index+1}. fotoğraf. ${item.question} Tahminini söyle, sonra cevabı gör.`);$('question').focus();
}
function reveal() {
 if(phase!=='question')return;
 phase='answer';$('solution').hidden=false;$('reveal').hidden=true;$('think').hidden=true;
 $('bag-hint').textContent=index===4?'Beş fotoğrafı da gördün!':'Sıradaki fotoğrafa geçebilirsin.';
 progress();announce(items[index].name+'. '+items[index].clue);playAnswerAudio();$('next').focus();
}
function next() {
 if(phase!=='answer')return;
 stopAnswerAudio();
 if(index===items.length-1){finish();return;}
 phase='ready';$('item').hidden=true;$('empty').hidden=false;$('bag').disabled=false;
 $('bag-hint').textContent='Çantaya dokun!';
 $('instruction').textContent='Sıradaki fotoğrafı görmek için çantaya dokun.';
 announce('Sıradaki fotoğraf için çantaya dokun.');$('bag').focus();
}
function finish() {
 phase='finish';$('game').hidden=true;$('finish').hidden=false;
 $('collection').replaceChildren(...items.map(item=>{const img=document.createElement('img');img.src='assets/'+item.image;img.alt=item.name;return img;}));
 $('finish-title').focus();let remaining=5;
 $('countdown').textContent=`Kitabın ${remaining} saniye içinde açılacak.`;
 clearInterval(redirectTimer);
 redirectTimer=setInterval(()=>{remaining--;
 if(remaining<=0){clearInterval(redirectTimer);window.location.assign('kitap/index.html');return;}
 $('countdown').textContent=`Kitabın ${remaining} saniye içinde açılacak.`;
 },1000);
}
$('start').addEventListener('click',start);$('bag').addEventListener('click',discover);
$('reveal').addEventListener('click',reveal);$('next').addEventListener('click',next);
$('reset').addEventListener('click',start);$('again').addEventListener('click',start);
$('item-image').addEventListener('error',()=>{$('asset-error').hidden=false;});
window.addEventListener('pagehide',()=>{clearInterval(redirectTimer);stopAnswerAudio();});
