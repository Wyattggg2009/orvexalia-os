(function windows(){
window.OrvexaliaWindows=function(api){
const {el,add,group,button,defs,state,permitted,toast}=api;
const items=new Map();let layer=100,seq=0;
const compact=new URLSearchParams(location.search).has("windowApp");
function render(){const bar=document.querySelector("#window-dock");if(!bar)return;bar.replaceChildren();bar.hidden=!items.size;for(const [id,item] of items){const b=button((item.minimized?"◫ ":"▣ ")+item.title,()=>{item.minimized=!item.minimized;item.box.hidden=item.minimized;if(!item.minimized)item.box.style.zIndex=String(++layer);render()});bar.append(b)}}
function close(id){const item=items.get(id);if(item){item.box.remove();items.delete(id);render()}}
function open(app){if(compact)throw Error("Open windows from the main desktop.");if(!defs[app]||!permitted(app))throw Error("Choose an available application.");if(["connect","family","security"].includes(app))throw Error("Open this privacy-sensitive app in the main workspace.");if(items.size>=6)throw Error("Close a window first (maximum six).");
const id=++seq,title=defs[app].name,box=el("section","os-window"),bar=group("row os-titlebar"),label=el("strong","",title),frame=el("iframe","os-frame");frame.title=title;const url=new URL(location.href);url.search="";url.searchParams.set("windowApp",app);frame.src=url.href;frame.setAttribute("allow","fullscreen");frame.allowFullscreen=true;
box.style.left=Math.min(40+items.size*30,Math.max(0,innerWidth-280))+"px";box.style.top=(80+items.size*22)+"px";box.style.zIndex=String(++layer);const item={title,box,minimized:false,app};items.set(id,item);
const min=button("−",()=>{item.minimized=true;box.hidden=true;render()});min.setAttribute("aria-label","Minimize");const max=button("□",()=>box.classList.toggle("os-max"));max.setAttribute("aria-label","Maximize");const x=button("×",()=>close(id),"danger");x.setAttribute("aria-label","Close");add(bar,label,group("row",min,max,x));add(box,bar,frame);document.body.append(box);box.addEventListener("pointerdown",()=>box.style.zIndex=String(++layer));
bar.addEventListener("pointerdown",e=>{if(e.target.closest("button")||box.classList.contains("os-max"))return;const r=box.getBoundingClientRect(),dx=e.clientX-r.left,dy=e.clientY-r.top;bar.setPointerCapture(e.pointerId);const move=ev=>{box.style.left=Math.max(0,Math.min(innerWidth-140,ev.clientX-dx))+"px";box.style.top=Math.max(0,Math.min(innerHeight-60,ev.clientY-dy))+"px"};const up=()=>{bar.removeEventListener("pointermove",move);bar.removeEventListener("pointerup",up);bar.removeEventListener("pointercancel",up)};bar.addEventListener("pointermove",move);bar.addEventListener("pointerup",up);bar.addEventListener("pointercancel",up)});
render()}
return{open,closeAll:()=>{for(const id of [...items.keys()])close(id)},count:()=>items.size,compact};
};
})();
