import {showSection,toast,logAction} from "./script.js";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050816);
scene.fog = new THREE.FogExp2(0x070b1e, 0.018);

const camera = new THREE.PerspectiveCamera(48, innerWidth/innerHeight, .1, 200);
camera.position.set(0, 5.2, 15);

const renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
document.querySelector("#scene").appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping=true; controls.dampingFactor=.055;
controls.minDistance=8; controls.maxDistance=25;
controls.minPolarAngle=Math.PI*.28; controls.maxPolarAngle=Math.PI*.62;
controls.target.set(0,3.2,0);

const sectionCamera = {
  home:[0,5.2,15], about:[-2,4.2,11], strengths:[4,4.0,10], experience:[6,3.6,10], likes:[-5,3.2,10], projects:[-2,4.0,9], visitor:[0,5.0,14]
};
function moveCameraTo(section){
  const p=sectionCamera[section]||sectionCamera.home;
  const from=camera.position.clone(), to=new THREE.Vector3(...p);
  const startTarget=controls.target.clone(), endTarget=new THREE.Vector3(0,3.1,0);
  const t0=performance.now(), dur=900;
  function step(now){
    const q=Math.min(1,(now-t0)/dur), e=q<.5?2*q*q:1-Math.pow(-2*q+2,2)/2;
    camera.position.lerpVectors(from,to,e); controls.target.lerpVectors(startTarget,endTarget,e);
    if(q<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function focus3DTarget(name){
  const map={projects:screen, strengths:hotspots.find(h=>h.userData.section==='strengths'), experience:hotspots.find(h=>h.userData.section==='experience'), likes:hotspots.find(h=>h.userData.section==='likes'), about:hotspots.find(h=>h.userData.section==='about')};
  const obj=map[name];
  if(!obj)return false;
  const target=obj.getWorldPosition(new THREE.Vector3());
  const from=camera.position.clone();
  const dir=from.clone().sub(target).normalize();
  const to=target.clone().add(dir.multiplyScalar(name==='projects'?5.5:5)); to.y=Math.max(2.5,to.y);
  const startTarget=controls.target.clone(), t0=performance.now(), dur=1100;
  function step(now){
    const q=Math.min(1,(now-t0)/dur), e=q<.5?2*q*q:1-Math.pow(-2*q+2,2)/2;
    camera.position.lerpVectors(from,to,e); controls.target.lerpVectors(startTarget,target,e);
    if(q<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step); return true;
}
scene.add(new THREE.HemisphereLight(0x9caeff,0x10162d,1.2));
const moon = new THREE.DirectionalLight(0xbac8ff,2.4); moon.position.set(-8,14,8); moon.castShadow=true; scene.add(moon);
const lamp = new THREE.PointLight(0xffc87c,25,16); lamp.position.set(-5,4,-2); scene.add(lamp);

function mat(color, rough=.55, metal=.05){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});}
const floor = new THREE.Mesh(new THREE.CylinderGeometry(8,8,.35,64),mat(0x171c35,.85));
floor.position.y=-.2; floor.receiveShadow=true; scene.add(floor);
const rug = new THREE.Mesh(new THREE.CylinderGeometry(5.4,5.4,.08,64),mat(0x272e50,.9)); rug.position.y=.02; scene.add(rug);

function box(w,h,d,color,x,y,z,opts={}){
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color,opts.rough??.5,opts.metal??.05));
  m.position.set(x,y,z); m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;
}
box(4.5,.35,.45,0x11172b,-5,2.2,-2);
box(4.5,.35,.45,0x11172b,-5,4.5,-2);
for(let i=0;i<5;i++) box(.18,2.1,.18,0x272d48,-7.05+i*.75,3.25,-2);
const desk=box(4,.35,1.6,0x242b49,-2,2,-3);
box(4,.25,.25,0x11162b,-2,.9,-3); box(.25,1.2,.25,0x11162b,-3.6,1.35,-3); box(.25,1.2,.25,0x11162b,-.4,1.35,-3);
const monitor=box(2.5,1.5,.12,0x10162a,-2,3.05,-3.55);
const screen=box(2.25,1.25,.02,0x5569d8,-2,3.05,-3.63);
screen.userData.section="projects";

const bed=box(5,.6,2.5,0x222946,4,1.05,-3);
box(5,.35,.25,0x10162a,4,1.7,-4.05); box(.35,2,.35,0x12182e,1.8,1.7,-4);
const pillow=box(1.6,.35,1.1,0x606b91,5.1,1.55,-3.65); pillow.rotation.z=-.04;

const plantStem=new THREE.Mesh(new THREE.CylinderGeometry(.05,.08,2.5,10),mat(0x315844)); plantStem.position.set(6,1.4,-1); scene.add(plantStem);
for(let i=0;i<7;i++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(.42,12,8),mat(0x456e50));leaf.scale.set(1,.45,.4);leaf.position.set(6+Math.sin(i*2)*.7,2.4+Math.cos(i*1.7)*1.1,-1);scene.add(leaf)}

const guitar=new THREE.Group();
const body=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),mat(0x8b5a36)); body.scale.set(.75,.95,.25); guitar.add(body);
const neck=box(1.8,.13,.13,0x6e4b30,0,0,0); neck.rotation.z=Math.PI/2; neck.position.x=1.35; guitar.add(neck);
guitar.position.set(-6,1.2,1);guitar.rotation.z=-.2;scene.add(guitar);

const avatar=new THREE.Group();
const bodyA=new THREE.Mesh(new THREE.CapsuleGeometry(.7,1.7,8,16),mat(0x20283c)); bodyA.position.y=2.1; bodyA.castShadow=true; avatar.add(bodyA);
const head=new THREE.Mesh(new THREE.SphereGeometry(.62,24,16),mat(0xc98d6b)); head.position.y=3.65; head.castShadow=true;avatar.add(head);
const hair=new THREE.Mesh(new THREE.SphereGeometry(.65,24,16,0,Math.PI*2,0,Math.PI*.55),mat(0x15151d)); hair.position.y=3.95;avatar.add(hair);
for(const x of [-.42,.42]){const leg=box(.38,1.5,.4,0x171b29,x,1,0);avatar.add(leg)}
avatar.position.set(0,0,1); scene.add(avatar);

const starGeo=new THREE.BufferGeometry(), starPts=[];
for(let i=0;i<500;i++) starPts.push((Math.random()-.5)*70,Math.random()*35+4,(Math.random()-.5)*55-18);
starGeo.setAttribute("position",new THREE.Float32BufferAttribute(starPts,3));
const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xcdd6ff,size:.07,transparent:true,opacity:.8}));scene.add(stars);

const hotspots=[];
function hotspot(label,section,x,y,z){
  const g=new THREE.Group();
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.42,.035,8,32),new THREE.MeshBasicMaterial({color:0x91a3ff}));
  const dot=new THREE.Mesh(new THREE.SphereGeometry(.12,12,12),new THREE.MeshBasicMaterial({color:0xffffff}));
  g.add(ring,dot);g.position.set(x,y,z);g.userData={label,section};scene.add(g);hotspots.push(g);
}
hotspot("소개","about",-2,3.2,-3.8);
hotspot("강점 & 취향","strengths",3,3.1,-1.7);
hotspot("경험","experience",5,2.5,-3.7);
hotspot("좋아하는 것","likes",-5,2.2,-1.5);
hotspot("프로젝트","projects",-2,3,-3.7);

const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
renderer.domElement.addEventListener("pointerdown",e=>{
  pointer.x=e.clientX/innerWidth*2-1;pointer.y=-(e.clientY/innerHeight)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const hits=raycaster.intersectObjects(scene.children,true);
  let obj=hits.find(h=>h.object.parent?.userData?.section || h.object.userData?.section);
  if(obj){const data=obj.object.userData.section?obj.object.userData:obj.object.parent.userData; showSection(data.section); toast(`${data.label||data.section}으로 이동합니다`); logAction("3d_click",data.section);}
});

addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

const clock=new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);const t=clock.getElapsedTime();
  controls.update();
  avatar.position.y=Math.sin(t*1.3)*.035;
  hotspots.forEach((h,i)=>{h.rotation.z=t*(.6+i*.05);const s=1+Math.sin(t*2+i)*.08;h.scale.setScalar(s)});
  stars.rotation.y=t*.003;
  renderer.render(scene,camera);
}
animate();

window.sceneControls={moveCameraTo,toggleLamp(){lamp.color.getHex()===0xffc87c?lamp.color.set(0x8eb2ff):lamp.color.set(0xffc87c);}};
