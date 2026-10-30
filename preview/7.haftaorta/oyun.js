"use strict";
// İlk sürümün aile, okul ve hâl hatır sorma diyalogları.
const characters={
ayse:{name:"Ayşe Teyze",turns:[{line:"Merhaba! Nasılsın?",choices:["İyiyim, teşekkür ederim. Siz nasılsınız?","Hoşça kalın!"],correct:0,hint:"Önce nasıl olduğunu söyleyip sen de hâl hatır sorabilirsin."},{line:"Ben de iyiyim, teşekkür ederim. Evdekiler nasıl?",choices:["Bugün okul güzeldi.","Ailem de iyi, teşekkür ederim."],correct:1,hint:"Ayşe Teyze ailenin nasıl olduğunu soruyor."}],bye:"Çok sevindim! Ailene selam söyle. Görüşürüz!",reply:"Söylerim. Görüşürüz, Ayşe Teyze!"},
mehmet:{name:"Mehmet Amca",turns:[{line:"Günaydın! Hoş geldin. Nasılsın?",choices:["Güle güle!","Günaydın! İyiyim, teşekkür ederim. Siz nasılsınız?"],correct:1,hint:"Mehmet Amca seni karşıladı. Günaydın deyip hâl hatır sorabilirsin."},{line:"Ben de iyiyim, sağ ol. Ailen nasıl?",choices:["Ailem de iyi. Size selamları var!","Bugün okul çok güzeldi."],correct:0,hint:"Mehmet Amca aileni soruyor. Ailenin nasıl olduğunu söyle."}],bye:"Çok teşekkür ederim! Onlara da selam söyle. İyi günler!",reply:"Söylerim. İyi günler, Mehmet Amca!"}
};

const characterCount=Object.keys(characters).length;
const $=s=>document.querySelector(s),dialog=$("#conversation"),win=$("#celebration"),video=$("#lesson-video"),questionDialog=$("#video-question"),finalDialog=$("#final-success");
const storageKey="nasilsin-komsum-v3";
let finished=new Set(),active=null,turn=0,lastStudentLine="",returnFocus=null,locked=false,showWinOnReturn=false;
let stage=1,pendingQuestion=null,answeredQuestions=new Set(),videoFinished=false;
const recipients={ayse:"Ayşe Teyze’ye",mehmet:"Mehmet Amca’ya"};
// Videodaki soruların muhatabı, verilen içerik dökümündeki kişilerdir.
const videoConversations=[
 {start:5,end:10,name:"Özgür",to:"Özgür’e",reply:"İyiyim."},
 {start:10,end:16,name:"Enes",to:"Enes’e",reply:"Çok yorgunum."},
 {start:16,end:22,name:"Yasemin",to:"Yasemin’e",reply:"Üzgünüm."},
 {start:22,end:28,name:"Özge",to:"Özge’ye",reply:"Hastayım."},
 {start:28,end:31,name:"Ecem",to:"Ecem’e",reply:"Mutluyum."},
 {start:31,end:36,name:"Enes",to:"Enes’e",reply:"Kızgınım."},
 {start:36,end:43.5,name:"Özgür",to:"Özgür’e",reply:"Uykusuzum."}
];
const checkpoints=[
 {id:"feeling",time:10,label:"VİDEO SORUSU",question:"Sen nasılsın?"}
];
try{const saved=JSON.parse(localStorage.getItem(storageKey)||"[]");if(Array.isArray(saved))finished=new Set(saved.filter(id=>characters[id]));}catch(e){}
function save(){try{localStorage.setItem(storageKey,JSON.stringify([...finished]));}catch(e){}}
function renderLine(target,text){target.replaceChildren();for(const part of text.split(/(nasılsın(?:ız)?\??)/i)){if(!part)continue;const node=document.createElement(/nasılsın(?:ız)?\??/i.test(part)?"strong":"span");if(node.tagName==="STRONG")node.className="question-focus";node.textContent=part;target.append(node);}}
function update(){const n=finished.size;$("#next-stage").hidden=n<characterCount;$("#stars").textContent=Array.from({length:characterCount},(_,i)=>i<n?"★":"☆").join(" ");$("#stars").setAttribute("aria-label",n+" / "+characterCount+" yıldız");$("#count").textContent=n+" / "+characterCount+" sohbet tamamlandı";document.querySelectorAll(".hotspot").forEach(b=>{const done=finished.has(b.dataset.id);b.classList.toggle("completed",done);b.querySelector(".name-tag b").textContent=done?"✓":"＋";b.querySelector(".wave").textContent=done?"★":"👋";b.setAttribute("aria-label",characters[b.dataset.id].name+" ile "+(done?"yeniden konuş (tamamlandı)":"konuş"));});document.querySelectorAll("#people li").forEach(li=>{const done=finished.has(li.dataset.person);li.classList.toggle("done",done);li.querySelector(".status").textContent=done?"✓":"○";});}
function renderStudentBubble(target,text,label){
 target.replaceChildren();const speaker=document.createElement("b");speaker.className="student-speaker";speaker.textContent=label;
 const line=document.createElement("div");renderLine(line,text);target.append(speaker);target.append(line);
}
function showTurn(focus=false){
 locked=false;const c=characters[active],item=c.turns[turn];
 $("#step").textContent=item?"SOHBET • "+(turn+1)+" / "+c.turns.length:"ŞİMDİ VEDALAŞALIM";
 
 $("#npc-speaker").textContent=item?(turn===0?c.name+" sana soruyor":c.name+" sana cevap veriyor ve soruyor"):c.name+" seninle vedalaşıyor";
 renderLine($("#npc-line"),item?item.line:c.bye);
 $("#answers").replaceChildren();$("#feedback").textContent="";$("#feedback").classList.remove("success");$("#last-answer").replaceChildren();
 $("#reply-label").textContent=item?"Sıra sende. "+recipients[active]+" ne söylersin?":"Şimdi sen vedalaş. "+recipients[active]+" ne söylersin?";
 if(item){item.choices.forEach((text,index)=>{const b=document.createElement("button");b.className="answer";b.setAttribute("aria-label","Senin yanıtın: "+text);renderLine(b,text);b.onclick=()=>choose(index);$("#answers").append(b);});}
 else{const b=document.createElement("button");b.className="primary";b.textContent=c.reply;b.setAttribute("aria-label","Sen vedalaşıyorsun: "+c.reply);b.onclick=complete;$("#answers").append(b);}
 if(focus)$("#answers button").focus();
}
function start(id,button){active=id;turn=0;lastStudentLine="";returnFocus=button;showWinOnReturn=false;$("#dialog-name").textContent="Sohbet";showTurn();dialog.showModal();$("#answers button").focus();}
function choose(index){
 if(locked)return;const c=characters[active],item=c.turns[turn];
 if(index!==item.correct){$("#feedback").textContent="Bir daha deneyelim. "+c.name+" sana soruyor. "+item.hint;return;}
 locked=true;lastStudentLine=item.choices[index];$("#answers").replaceChildren();$("#reply-label").textContent="";
 renderStudentBubble($("#last-answer"),lastStudentLine,"✓ Sen → "+c.name);
 $("#feedback").textContent="Yanıtını seçtin. Şimdi "+c.name+" konuşacak.";$("#feedback").classList.add("success");
 const next=document.createElement("button");next.className="primary continue-button";next.textContent=c.name+(turn+1<c.turns.length?": Cevabını gör →":": Vedasını gör →");next.onclick=()=>{turn++;showTurn(true);};$("#answers").append(next);next.focus();
}
function complete(){if(locked)return;locked=true;const wasDone=finished.has(active);finished.add(active);save();update();showWinOnReturn=finished.size===characterCount&&!wasDone;dialog.close();}
function confetti(){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;const box=$("#confetti");box.replaceChildren();for(let i=0;i<55;i++){const el=document.createElement("i");el.className="confetti";el.style.left=Math.random()*100+"%";el.style.background=["#f5c64f","#6bb9a1","#eb9c90","#a39fd1"][i%4];el.style.animationDelay=Math.random()*.8+"s";el.style.setProperty("--drift",(Math.random()*250-125)+"px");box.append(el);}setTimeout(()=>box.replaceChildren(),4200);}


function formatTime(value){const seconds=Math.max(0,Math.floor(Number.isFinite(value)?value:0));return Math.floor(seconds/60)+":"+String(seconds%60).padStart(2,"0");}
function updateVideoContext(){
 const item=videoConversations.find(c=>video.currentTime>=c.start&&video.currentTime<c.end);
 if(item){
  $("#video-speaker").textContent="Soruyu soran → "+item.name;
  renderLine($("#video-question-context"),item.to+" soruluyor: “Nasılsın, "+item.name+"?”");
  $("#video-answer-context").textContent=item.name+" cevap veriyor: “"+item.reply+"”";
 }else{
  $("#video-speaker").textContent="Videoyu izliyorsun";
  $("#video-question-context").textContent="Videoda kişiler birbirine hâl hatır soruyor.";
  $("#video-answer-context").textContent="Sana yöneltilen soru, video durunca ayrı bir kutuda gelecek.";
 }
}
function updateVideoUI(){
 updateVideoContext();
 const duration=Number.isFinite(video.duration)?video.duration:43;
 $("#video-progress").max=duration;$("#video-progress").value=video.currentTime;
 $("#video-time").textContent=formatTime(video.currentTime)+" / "+formatTime(duration);
 $("#video-toggle").textContent=video.paused?"▶ Oynat":"Ⅱ Duraklat";
 $("#question-count").textContent=answeredQuestions.size+" / "+checkpoints.length+" soru";
}
function playVideo(){
 if(stage!==2||pendingQuestion||videoFinished)return;
 const request=video.play();if(request&&request.catch)request.catch(()=>{$("#video-note").textContent="Başlamak için Oynat düğmesine bas.";updateVideoUI();});
}
function askQuestion(item){
 if(pendingQuestion||stage!==2)return;
 pendingQuestion=item;video.pause();video.currentTime=item.time;
 $("#question-label").textContent=item.label;renderLine($("#question-text"),item.question);
 questionDialog.showModal();$("#answer-done").focus();updateVideoUI();
}
function checkVideo(){
 updateVideoUI();if(stage!==2||pendingQuestion||videoFinished)return;
 const next=checkpoints.find(q=>!answeredQuestions.has(q.id)&&video.currentTime>=q.time);
 if(next)askQuestion(next);
}
function startVideoStage(){
 if(finished.size!==characterCount)return;
 showWinOnReturn=false;if(win.open)win.close();
 stage=2;$("#neighborhood-stage").hidden=true;$("#video-stage").hidden=false;
 $("#stage-one").classList.remove("current");$("#stage-one").classList.add("complete");$("#stage-two").classList.add("current");
 $("#stage-one").removeAttribute("aria-current");$("#stage-two").setAttribute("aria-current","step");
 $("#video-heading").focus();$("#video-note").textContent="Videoyu izle. Soruyu cevapla, Tamam ile devam et.";
 updateVideoUI();playVideo();
}
function answerDone(){
 if(!pendingQuestion)return;
 answeredQuestions.add(pendingQuestion.id);pendingQuestion=null;questionDialog.close();updateVideoUI();playVideo();
}
function finishVideo(){
 if(stage!==2||videoFinished)return;
 if(pendingQuestion)return;
 const missed=checkpoints.find(q=>!answeredQuestions.has(q.id));if(missed){askQuestion(missed);return;}
 videoFinished=true;video.pause();updateVideoUI();$("#video-toggle").textContent="✓ Video tamamlandı";$("#video-toggle").disabled=true;
 $("#stage-two").classList.add("complete");$("#video-note").textContent="Başardın! İki aşamayı da tamamladın.";
 finalDialog.showModal();confetti();
}
function restartVideo(){
 if(questionDialog.open)questionDialog.close();if(finalDialog.open)finalDialog.close();
 pendingQuestion=null;answeredQuestions.clear();videoFinished=false;$("#video-toggle").disabled=false;$("#stage-two").classList.remove("complete");video.currentTime=0;
 $("#video-note").textContent="Videoyu izle. Soruyu cevapla, Tamam ile devam et.";updateVideoUI();playVideo();
}
function backToNeighborhood(){
 video.pause();stage=1;$("#video-stage").hidden=true;$("#neighborhood-stage").hidden=false;
 $("#stage-two").classList.remove("current");$("#stage-one").classList.add("current");$("#stage-two").removeAttribute("aria-current");$("#stage-one").setAttribute("aria-current","step");
 $("#go-video").focus();
}
function reset(){
 stage=1;showWinOnReturn=false;pendingQuestion=null;video.pause();videoFinished=false;answeredQuestions.clear();video.currentTime=0;$("#video-toggle").disabled=false;
 for(const d of [dialog,win,questionDialog,finalDialog])if(d.open)d.close();
 finished.clear();save();update();backToNeighborhood();$("#stage-one").classList.remove("complete");$("#stage-two").classList.remove("complete");$(".hotspot").focus();updateVideoUI();
}
document.querySelectorAll(".hotspot").forEach(b=>b.addEventListener("click",()=>start(b.dataset.id,b)));
$("#close-dialog").onclick=()=>dialog.close();dialog.addEventListener("close",()=>{if(showWinOnReturn){showWinOnReturn=false;win.showModal();}else if(returnFocus)returnFocus.focus();});
$("#reset").onclick=reset;$("#play-again").onclick=reset;$("#explore").onclick=startVideoStage;$("#go-video").onclick=startVideoStage;
win.addEventListener("close",()=>{if(stage===1)$("#go-video").focus();});
$("#video-toggle").onclick=()=>{if(video.paused)playVideo();else video.pause();};
$("#video-mute").onclick=()=>{video.muted=!video.muted;$("#video-mute").setAttribute("aria-pressed",String(video.muted));$("#video-mute").textContent=video.muted?"Ses aç":"Ses kapat";};
$("#answer-done").onclick=answerDone;
questionDialog.addEventListener("cancel",e=>e.preventDefault());
for(const event of ["timeupdate","seeked"])video.addEventListener(event,checkVideo);
for(const event of ["loadedmetadata","pause"])video.addEventListener(event,updateVideoUI);
video.addEventListener("play",()=>{if(pendingQuestion||stage!==2)video.pause();else updateVideoUI();});
video.addEventListener("ended",finishVideo);
video.addEventListener("error",()=>{$("#video-note").textContent="Video açılamadı. 1.mp4 dosyasının index.html ile aynı klasörde olduğundan emin ol.";});
$("#restart-video").onclick=restartVideo;$("#back-neighborhood").onclick=backToNeighborhood;$("#final-restart").onclick=reset;$("#final-close").onclick=()=>finalDialog.close();
finalDialog.addEventListener("close",()=>$("#restart-video").focus());
// Diyalog sesleri kullanıcı tarafından eklenecek. Yalnızca videonun kendi sesi çalar.
update();updateVideoUI();
