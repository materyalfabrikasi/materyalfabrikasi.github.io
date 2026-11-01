"use strict";
// Resim ve tıklama alanları aynı 3:2 koordinat düzleminde tutulur.
(() => {
 const frame=document.querySelector(".scene-frame"),scene=document.querySelector(".scene"),layout=document.querySelector(".map-space"),card=document.querySelector(".map-card");
 const dialogs=[...document.querySelectorAll("dialog")];
 function viewport(){return {width:window.visualViewport?.width||window.innerWidth,height:window.visualViewport?.height||window.innerHeight};}
 function fitScene(){
  if(!frame||!scene||!layout||!card||layout.clientWidth<=0||layout.clientHeight<=0)return;
  const chrome=card.querySelector(".map-top").offsetHeight+card.querySelector(".map-bottom").offsetHeight+2;
  const width=Math.max(0,Math.min(layout.clientWidth-2,(layout.clientHeight-chrome)*1.5));
  card.style.width=(width+2)+"px";
  card.style.height=(width/1.5+chrome)+"px";
  scene.style.width=width+"px";scene.style.height=width/1.5+"px";
 }
 function fitDialog(dialog){
  if(!dialog.open||!dialog.offsetWidth||!dialog.offsetHeight)return;
  const size=viewport();const scale=Math.min(1,(size.width-24)/dialog.offsetWidth,(size.height-24)/dialog.offsetHeight);
  dialog.style.setProperty("--dialog-scale",String(Math.max(.1,scale)));
 }
 function fitAll(){fitScene();dialogs.forEach(fitDialog);}
 const observer=new ResizeObserver(()=>fitAll());
 if(layout)observer.observe(layout);if(frame)observer.observe(frame);dialogs.forEach(d=>observer.observe(d));
 const openObserver=new MutationObserver(()=>requestAnimationFrame(fitAll));
 dialogs.forEach(d=>openObserver.observe(d,{attributes:true,attributeFilter:["open"]}));
 window.addEventListener("resize",fitAll);window.visualViewport?.addEventListener("resize",fitAll);
 if(document.fonts?.ready)document.fonts.ready.then(fitAll);
 requestAnimationFrame(fitAll);
})();
