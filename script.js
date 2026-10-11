const sections=["home","about","strengths","experience","likes","projects","visitor"];
export function showSection(id){
  if(!sections.includes(id))id="home";
  sections.forEach(s=>document.getElementById(s)?.classList.toggle("visible",s===id));
  document.querySelectorAll("[data-section]").forEach(b=>b.classList.toggle("active",b.dataset.section===id));
  logAction("section_view",id);
  history.replaceState(null,"",`#${id}`);
  window.scrollTo({top:0,behavior:"instant"});
}
document.querySelectorAll("[data-section]").forEach(el=>el.addEventListener("click",event=>{event.preventDefault();const id=el.dataset.section;showSection(id);window.sceneControls?.moveCameraTo(id);}));

export function toast(msg){const t=document.querySelector("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}

let db;
try {
const request=indexedDB.open("heemang-3d-analytics",1);
request.onupgradeneeded=e=>{db=e.target.result;db.createObjectStore("events",{autoIncrement:true})};
request.onsuccess=e=>{db=e.target.result;logAction("visit","home");refreshStats()};
request.onerror=()=>{document.querySelector("#topInterest").textContent="저장 불가";};
} catch {document.querySelector("#topInterest").textContent="저장 불가";}

export function logAction(type,value){
  if(!db)return;
  db.transaction("events","readwrite").objectStore("events").add({type,value,time:Date.now()});
  setTimeout(refreshStats,50);
}
function readEvents(){
  return new Promise(resolve=>{if(!db)return resolve([]);const req=db.transaction("events","readonly").objectStore("events").getAll();req.onsuccess=()=>resolve(req.result)});
}
async function refreshStats(){
  const events=await readEvents(); const views=events.filter(e=>e.type==="visit").length;
  document.querySelector("#visitCount").textContent=views; document.querySelector("#liveVisit").textContent=Math.max(1,views);
  document.querySelector("#clickCount").textContent=events.filter(e=>e.type.includes("click")||e.type==="section_view").length;
  const counts={};events.filter(e=>e.type==="section_view").forEach(e=>counts[e.value]=(counts[e.value]||0)+1);
  const top=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];document.querySelector("#topInterest").textContent=top?top[0]:"-";
}
document.querySelector("#themeBtn").onclick=()=>{
  document.body.classList.toggle("warm");
  window.sceneControls?.toggleLamp();
  toast(document.body.classList.contains("warm")?"따뜻한 조명":"차가운 조명");
};


showSection(location.hash.slice(1)||"home");
window.addEventListener("hashchange",()=>showSection(location.hash.slice(1)||"home"));
import("./scene.js").catch(()=>{document.body.classList.add("scene-unavailable");document.querySelector(".scene-help").textContent="3D 배경을 불러오지 못했습니다. 소개와 프로젝트 메뉴는 계속 사용할 수 있습니다.";});
