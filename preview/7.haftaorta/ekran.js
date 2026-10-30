"use strict";
// Resim ve tıklama alanları aynı 3:2 koordinat düzleminde tutulur.
(() => {
 const frame=document.querySelector(".scene-frame"),scene=document.querySelector(".scene");
 const dialogs=[...document.querySelectorAll("dialog")];
 function viewport(){return {width:window.visualViewport?.width||window.innerWidth,height:window.visualViewport?.height||window.innerHeight};}
 function fitScene(){
  if(!frame||!scene||frame.clientWidth<=0||frame.clientHeight<=0)return;
  const width=Math.min(frame.clientWidth,frame.clientHeight*1.5);
  scene.style.width=width+"px";scene.style.height=width/1.5+"px";
 }
 function fitDialog(dialog){
  if(!dialog.open||!dialog.offsetWidth||!dialog.offsetHeight)return;
  const size=viewport();const scale=Math.min(1,(size.width-24)/dialog.offsetWidth,(size.height-24)/dialog.offsetHeight);
  dialog.style.setProperty("--dialog-scale",String(Math.max(.1,scale)));
 }
 function fitAll(){fitScene();dialogs.forEach(fitDialog);}
 const observer=new ResizeObserver(()=>fitAll());
 if(frame)observer.observe(frame);dialogs.forEach(d=>observer.observe(d));
 const openObserver=new MutationObserver(()=>requestAnimationFrame(fitAll));
 dialogs.forEach(d=>openObserver.observe(d,{attributes:true,attributeFilter:["open"]}));
 window.addEventListener("resize",fitAll);window.visualViewport?.addEventListener("resize",fitAll);
 if(document.fonts?.ready)document.fonts.ready.then(fitAll);
 requestAnimationFrame(fitAll);
})();
