'use strict';
const people = [
  {id:'ayse',clueAudio:'oyun',name:'Ayşe',answer:'Mutluyum',clue:'Oyun oynadım. Çok eğlendim!',speech:'Mutluyum, teşekkür ederim!',hint:'Çok eğlenmiş. Nasıl hissediyor?',options:['Mutluyum','Üzgünüm','Yorgunum'],position:'50% 44%'},
  {id:'ali',clueAudio:'oyuncagim',name:'Ali',answer:'Üzgünüm',clue:'Oyuncağım kırıldı. Ağlamak istiyorum.',speech:'Üzgünüm. Bana eşlik eder misin?',hint:'Yüzüne bir daha bak.',options:['Üzgünüm','İyiyim','Kızgınım'],position:'50% 40%'},
  {id:'ece',clueAudio:'cokkostum',answerAudio:'yorgunum',name:'Ece',answer:'Yorgunum',clue:'Çok koştum. Dinlenmek istiyorum.',speech:'Yorgunum. Biraz dinleneceğim.',hint:'Koşudan sonra uzanıp dinleniyor. Nasıl hissediyor?',options:['Hastayım','Yorgunum','Mutluyum'],position:'50% 50%'},
  {id:'mert',clueAudio:'burnum',name:'Mert',answer:'Hastayım',clue:'Burnum akıyor. Evde dinleniyorum.',speech:'Hastayım. Bugün dinleniyorum.',hint:'Elindeki mendile bak.',options:['İyiyim','Hastayım','Kızgınım'],position:'50% 46%'},
  {id:'can',clueAudio:'arkadasim',name:'Can',answer:'Kızgınım',clue:'Arkadaşım oyuncağımı izinsiz aldı. Kaşlarımı çattım!',speech:'Kızgınım. Biraz sakinleşmek istiyorum.',hint:'Kaşlarını çatmış. Nasıl hissediyor?',options:['Mutluyum','Yorgunum','Kızgınım'],position:'50% 43%'}
];
const $ = id => document.getElementById(id);
const video = $('lessonVideo');
const VIDEO_QUESTION_TIME = 21.4;
let order=[], index=0, state='welcome', selected=null, found=new Set(), sound=true;
let scanTimer=null, nextTimer=null, currentAudio=null;
let videoQuestionAsked=false, videoQuestionAnswered=false;
const person=()=>order[index];
const shuffle = input => {
  const a=[...input];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
};
function stopSound(){if(currentAudio){currentAudio.pause();currentAudio.currentTime=0;currentAudio=null;}}
function play(id,onEnd){
  stopSound();
  if(!sound)return;
  const clip=new Audio('sesler/'+id+'.wav');
  currentAudio=clip;
  if(onEnd)clip.addEventListener('ended',()=>{if(currentAudio===clip)onEnd();},{once:true});
  clip.play().catch(()=>{
    if(currentAudio===clip&&state==='question')$('feedback').textContent='Sesi dinlemek için Dinle’ye bas.';
  });
}
function cancelTimers(){clearTimeout(scanTimer);clearTimeout(nextTimer);scanTimer=null;nextTimer=null;}
function show(view){['welcome','searching','question'].forEach(id=>$(id).hidden=id!==view);}
function renderFriends(){
  $('friends').replaceChildren(...people.map(p=>{
    const active=(state==='question'||state==='answered')&&person()?.id===p.id;
    const card=document.createElement('div');
    card.className='friend'+(found.has(p.id)?' done':'')+(active?' active':'');
    const img=document.createElement('img');img.src='gorseller/'+p.id+'.jpg';img.alt='';img.style.objectPosition=p.position;
    const name=document.createElement('strong');name.textContent=p.name;
    card.append(img,name);return card;
  }));
  $('progressBar').style.width=(found.size/people.length*100)+'%';
}
function setStage(isVideo){
  $('radarGame').hidden=isVideo;$('friendsSection').hidden=isVideo;
  $('videoStage').hidden=!isVideo;$('complete').hidden=true;
  $('stageRadar').classList.toggle('active',!isVideo);$('stageVideo').classList.toggle('active',isVideo);
  $('stageRadar').removeAttribute('aria-current');$('stageVideo').removeAttribute('aria-current');
  $(isVideo?'stageVideo':'stageRadar').setAttribute('aria-current','step');
}
function start(){
  cancelTimers();stopSound();video.pause();
  videoQuestionAsked=false;videoQuestionAnswered=false;$('videoPrompt').hidden=true;
  order=shuffle(people);index=0;found.clear();
  setStage(false);scan();
}
function scan(){
  cancelTimers();stopSound();state='searching';selected=null;show('searching');
  $('question').classList.remove('answered');$('radar').classList.remove('found');$('radar').classList.add('scanning');
  $('portrait').hidden=true;$('radarCenter').hidden=false;$('radarStatus').textContent='Aranıyor…';
  $('round').textContent=(index+1)+' / '+people.length;renderFriends();scanTimer=setTimeout(ask,2000);
}
function ask(){
  const p=person();state='question';show('question');$('radar').classList.remove('scanning');$('radar').classList.add('found');
  $('radarCenter').hidden=true;$('personPhoto').src='gorseller/'+p.id+'.jpg';$('personPhoto').style.objectPosition=p.position;
  $('personPhoto').alt=p.name+' adlı oyun karakterinin fotoğrafı';$('portrait').hidden=false;$('personName').textContent=p.name;
  $('radarStatus').textContent=p.name+' bulundu!';$('clue').textContent=p.clue;$('feedback').textContent='';
  $('success').hidden=true;$('check').hidden=false;$('check').disabled=true;
  const legend=document.createElement('legend');legend.className='sr-only';legend.textContent='Cevabını seç';
  $('answers').replaceChildren(legend,...shuffle(p.options).map((text,i)=>{
    const label=document.createElement('label');label.className='choice';
    const radio=document.createElement('input');radio.type='radio';radio.name='answer';radio.value=text;radio.id='option-'+i;
    const word=document.createElement('span');word.textContent=text;
    const letter=document.createElement('span');letter.className='letter';letter.textContent=['A','B','C'][i];letter.setAttribute('aria-hidden','true');
    radio.addEventListener('change',()=>{selected=text;$('check').disabled=false;$('feedback').textContent='';});
    label.append(radio,word,letter);return label;
  }));
  renderFriends();$('questionTitle').focus({preventScroll:true});
  $('listenQuestion').hidden=false;
  $('listenClue').setAttribute('aria-label',p.name+' adlı çocuğun cümlesini dinle');
}
function check(){
  if(state!=='question'||!selected)return;
  const p=person(),chosen=[...$('answers').querySelectorAll('input')].find(r=>r.value===selected);
  if(selected!==p.answer){
    chosen.closest('label').classList.add('wrong');chosen.disabled=true;chosen.checked=false;selected=null;$('check').disabled=true;
    $('feedback').textContent='Tekrar dene. '+p.hint;return;
  }
  state='answered';found.add(p.id);$('answers').querySelectorAll('input').forEach(r=>r.disabled=true);
  $('question').classList.add('answered');$('check').hidden=true;$('feedback').textContent='';$('success').hidden=false;
  $('speech').textContent=p.name+': “'+p.speech+'”';$('listenAnswer').hidden=!p.answerAudio;$('next').firstChild.textContent=index===people.length-1?'Videoya geç ':'Devam et ';
  renderFriends();scheduleNext();
}
function scheduleNext(){clearTimeout(nextTimer);if($('autoNext').checked&&state==='answered')nextTimer=setTimeout(next,6000);}
function next(){if(state!=='answered')return;cancelTimers();stopSound();index++;if(index>=order.length)beginVideo();else scan();}
function beginVideo(){
  cancelTimers();stopSound();state='video';setStage(true);video.load();video.muted=!sound;
  videoQuestionAsked=false;videoQuestionAnswered=false;$('videoPrompt').hidden=true;$('videoError').hidden=true;
  $('videoStage').scrollIntoView({block:'start',behavior:'smooth'});resumeVideo();
}
function resumeVideo(){
  if(state!=='video')return;
  stopSound();$('videoStart').hidden=true;$('pauseVideo').disabled=false;
  video.play().catch(()=>{if(state==='video'){$('videoStart').hidden=false;$('pauseVideo').disabled=true;}});
}
function askVideoQuestion(){
  if(videoQuestionAsked||videoQuestionAnswered)return;
  videoQuestionAsked=true;state='video-question';video.pause();$('videoStart').hidden=true;
  $('videoPrompt').hidden=false;$('pauseVideo').disabled=true;$('videoPromptTitle').focus();
}
function answerDone(){
  if(state!=='video-question')return;
  stopSound();videoQuestionAnswered=true;$('videoPrompt').hidden=true;state='video';
  if(video.ended)finish();else resumeVideo();
}
function finish(){
  stopSound();video.pause();state='complete';$('videoStage').hidden=true;$('complete').hidden=false;
  $('stageVideo').removeAttribute('aria-current');$('finishTitle').focus();
}
function updateVideoProgress(){
  const duration=Number.isFinite(video.duration)?video.duration:42.98;
  const format=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
  $('videoTime').textContent=format(video.currentTime)+' / '+format(duration);
  const progress=Math.min(100,video.currentTime/duration*100);
  $('videoProgressBar').style.width=progress+'%';$('videoProgress').setAttribute('aria-valuenow',String(Math.round(progress)));
  if(state==='video'&&!videoQuestionAsked&&video.currentTime>=VIDEO_QUESTION_TIME)askVideoQuestion();
}
video.addEventListener('timeupdate',updateVideoProgress);video.addEventListener('loadedmetadata',updateVideoProgress);
video.addEventListener('play',()=>{
  if(state==='video-question'){video.pause();return;}
  $('pauseVideo').textContent='Duraklat';$('videoStart').hidden=true;
});
video.addEventListener('pause',()=>{$('pauseVideo').textContent='Devam et';});
video.addEventListener('ended',()=>{if(state!=='video')return;if(!videoQuestionAnswered)askVideoQuestion();else finish();});
video.addEventListener('error',()=>{$('videoError').hidden=false;$('videoStart').hidden=false;});
$('playVideo').addEventListener('click',resumeVideo);$('answerDone').addEventListener('click',answerDone);
$('pauseVideo').addEventListener('click',()=>{if(state!=='video')return;if(video.paused)resumeVideo();else video.pause();});
$('start').addEventListener('click',start);$('restart').addEventListener('click',start);$('check').addEventListener('click',check);$('next').addEventListener('click',next);
$('autoNext').addEventListener('change',scheduleNext);
$('listenQuestion').addEventListener('click',()=>{if(!sound){sound=true;updateSound();}play('merhaba');});
$('listenClue').addEventListener('click',()=>{if(!sound){sound=true;updateSound();}$('feedback').textContent='';play(person().clueAudio);});
$('listenAnswer').addEventListener('click',()=>{if(!sound){sound=true;updateSound();}if(person().answerAudio)play(person().answerAudio);scheduleNext();});
function updateSound(){
  $('sound').textContent=sound?'Ses açık':'Ses kapalı';$('sound').setAttribute('aria-pressed',String(sound));video.muted=!sound;
}
$('sound').addEventListener('click',()=>{sound=!sound;updateSound();if(!sound)stopSound();});
$('fullscreen').addEventListener('click',async()=>{
  try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}
  catch{$('fullscreen').textContent='Tam ekran açılamadı';}
});
document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'Küçük ekran':'Tam ekran';});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){stopSound();if(state==='answered')clearTimeout(nextTimer);if(state==='video')video.pause();}
  else if(state==='answered')scheduleNext();
});
people.forEach(p=>{const img=new Image();img.src='gorseller/'+p.id+'.jpg';});renderFriends();
