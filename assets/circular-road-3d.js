import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
(function road3DModule(THREE,OrbitControls) {
'use strict';
const root=document.getElementById('circular-journey');
const mount=document.getElementById('road3d-canvas');
if(!root||!mount)return;
let renderer;
try{
 const probe=document.createElement('canvas');
 const gl=probe.getContext('webgl2',{powerPreference:'low-power'})||probe.getContext('webgl',{powerPreference:'low-power'});
 if(!gl)throw new Error('WebGL unavailable');
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
}catch(error){console.info('Interactive 3D road unavailable; using the accessible 2D waste cycle.',error);return;}
const reduceMotion=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
const phone=window.matchMedia('(max-width:600px)').matches;
const COLORS=['#40b57b','#3e91c8','#55a8ca','#50b393','#69b64c','#92bb59','#e5a356','#95ab77'];
// Shared client-diagram atlas: eight images in four columns and two rows.
const STAGE_ATLAS_URL='./assets/road-images/eight-stages.webp';
const labels=['Generation & Reduction','Source Segregation','Collection & Transport','Material Recovery (MRF)','Recycling','Organic Processing','Energy Recovery','Scientific Disposal'];
const titles=['Waste Generation & Reduction','Source Segregation','Collection & Transportation','Material Recovery Facility','Recycling','Organic Waste Processing','Energy Recovery','Scientific Disposal'];
const scene=new THREE.Scene();
scene.background=new THREE.Color('#e5f1e5');
scene.fog=new THREE.Fog('#e5f1e5',32,75);
const camera=new THREE.PerspectiveCamera(phone?55:49,1,0.1,130);
camera.position.set(phone?21:19,phone?28:22,phone?25:23);
const START={position:camera.position.clone(),target:new THREE.Vector3(0,0.8,0)};
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,phone?1.25:1.75));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.25;
renderer.shadowMap.enabled=!phone;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.domElement.setAttribute('aria-label','Rotate the three-dimensional waste management road by dragging. Use the camera controls and the eight stage buttons to explore.');
renderer.domElement.setAttribute('tabindex','0');
renderer.domElement.style.touchAction='none';
mount.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);
controls.target.copy(START.target);
controls.enableDamping=!reduceMotion;controls.dampingFactor=.085;
controls.enablePan=false;controls.minDistance=9;controls.maxDistance=48;
controls.minPolarAngle=.06;controls.maxPolarAngle=Math.PI/2-0.045;
controls.rotateSpeed=.72;controls.zoomSpeed=.82;
controls.screenSpacePanning=false;
controls.update();
const hemi=new THREE.HemisphereLight('#f4fff0','#597969',2.1);scene.add(hemi);
const sun=new THREE.DirectionalLight('#fff5dc',2.65);
sun.position.set(-10,24,12);sun.castShadow=!phone;
sun.shadow.mapSize.set(phone?512:1024,phone?512:1024);
sun.shadow.camera.left=-19;sun.shadow.camera.right=19;sun.shadow.camera.top=19;sun.shadow.camera.bottom=-19;
sun.shadow.camera.far=75;sun.shadow.bias=-.0003;scene.add(sun);
const fill=new THREE.DirectionalLight('#a8e8d8',1.1);fill.position.set(12,8,-12);scene.add(fill);
const road=new THREE.Group();scene.add(road);
const pavement=new THREE.MeshStandardMaterial({color:'#305b50',roughness:.8,metalness:.12});
const baseMat=new THREE.MeshStandardMaterial({color:'#163e36',roughness:.7,metalness:.15});
const curbMat=new THREE.MeshStandardMaterial({color:'#afdc99',roughness:.48,metalness:.1});
const dashMat=new THREE.MeshStandardMaterial({color:'#deefc0',emissive:'#85b77a',emissiveIntensity:.15,roughness:.55});
const lush=new THREE.MeshStandardMaterial({color:'#b3d9ab',roughness:1});
const ground=new THREE.Mesh(new THREE.CircleGeometry(24,96),new THREE.MeshStandardMaterial({color:'#d3e7d2',roughness:1}));
ground.rotation.x=-Math.PI/2;ground.position.y=-.18;ground.receiveShadow=!phone;scene.add(ground);
const groundRing=new THREE.Mesh(new THREE.RingGeometry(10.8,19.6,96),new THREE.MeshBasicMaterial({color:'#c5dfc3',transparent:true,opacity:.34,side:THREE.DoubleSide}));
groundRing.rotation.x=-Math.PI/2;groundRing.position.y=-.166;scene.add(groundRing);
function annulus(inner,outer,height,depth,material){
 const shape=new THREE.Shape();shape.absarc(0,0,outer,0,Math.PI*2,false);
 const hole=new THREE.Path();hole.absarc(0,0,inner,0,Math.PI*2,true);shape.holes.push(hole);
 const g=new THREE.ExtrudeGeometry(shape,{depth,steps:1,bevelEnabled:true,bevelThickness:.11,bevelSize:.06,bevelSegments:2,curveSegments:128});
 g.rotateX(-Math.PI/2);g.translate(0,height,0);
 const mesh=new THREE.Mesh(g,material);mesh.castShadow=!phone;mesh.receiveShadow=!phone;road.add(mesh);return mesh;
}
annulus(6.15,9.15,.29,.40,baseMat);
annulus(6.35,8.95,.69,.19,pavement);
function rail(radius,color,height){
 const mesh=new THREE.Mesh(new THREE.TorusGeometry(radius,.045,8,140),new THREE.MeshStandardMaterial({color,roughness:.48,metalness:.15}));
 mesh.rotation.x=-Math.PI/2;mesh.position.y=height;road.add(mesh);
}
rail(6.45,'#9ad79a',.95);rail(8.83,'#abd89d',.95);
rail(7.68,'#3a826a',.92);
for(let i=0;i<80;i++){
 const a=(i+.5)*Math.PI*2/80,r=7.68,len=.58;
 const geo=new THREE.BoxGeometry(len,.017,.082);
 const dash=new THREE.Mesh(geo,dashMat);
 dash.position.set(Math.cos(a)*r,.934,Math.sin(a)*r);
 dash.rotation.y=-a-Math.PI/2;road.add(dash);
}
function arrowAt(angle){
 const shape=new THREE.Shape();
 shape.moveTo(-.42,-.14);shape.lineTo(.05,-.14);shape.lineTo(.05,-.3);shape.lineTo(.55,0);
 shape.lineTo(.05,.3);shape.lineTo(.05,.14);shape.lineTo(-.42,.14);shape.closePath();
 const g=new THREE.ShapeGeometry(shape);
 g.rotateX(-Math.PI/2);
 const mesh=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:'#a3dcb1',transparent:true,opacity:.83,side:THREE.DoubleSide,depthWrite:false}));
 const r=7.67;mesh.position.set(Math.cos(angle)*r,.964,Math.sin(angle)*r);
 mesh.rotation.y=-angle-Math.PI/2;road.add(mesh);
}
for(let i=0;i<8;i++)arrowAt(-Math.PI/2+(i+.55)*Math.PI/4);
const innerGreen=new THREE.Mesh(new THREE.CircleGeometry(6.14,96),lush);innerGreen.rotation.x=-Math.PI/2;innerGreen.position.y=-.13;innerGreen.receiveShadow=!phone;scene.add(innerGreen);
function makeCircle(r,h,y,material){
 const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,64),material);
 mesh.position.y=y;mesh.castShadow=!phone;mesh.receiveShadow=!phone;scene.add(mesh);return mesh;
}
makeCircle(4.4,.48,.18,new THREE.MeshStandardMaterial({color:'#8ebe9d',roughness:.7}));
makeCircle(3.98,.42,.55,new THREE.MeshStandardMaterial({color:'#e7f7e1',roughness:.75}));
makeCircle(2.9,.24,.89,new THREE.MeshStandardMaterial({color:'#d4ebc8',metalness:.1,roughness:.62}));
makeCircle(1.92,.26,1.12,new THREE.MeshStandardMaterial({color:'#0e7653',metalness:.14,roughness:.47}));
rail(4.1,'#ffffff',.80);rail(3.0,'#76b885',1.04);
function rounded(ctx,x,y,w,h,r){
 ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
 ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);
 ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}
const atlasImage=new Image(),atlasPainters=[];
atlasImage.addEventListener('load',()=>{for(const draw of atlasPainters)draw();renderer.render(scene,camera);},{once:true});
atlasImage.addEventListener('error',()=>console.warn('Waste-management stage image atlas unavailable'),{once:true});
atlasImage.src=STAGE_ATLAS_URL;
function atlasDraw(ctx,texture,index,x,y,width,height){
 const paint=()=>{
  if(!atlasImage.naturalWidth)return;
  ctx.drawImage(atlasImage,(index%4)*144,Math.floor(index/4)*144,144,144,x,y,width,height);
  texture.needsUpdate=true;
 };
 if(atlasImage.complete&&atlasImage.naturalWidth)paint();else atlasPainters.push(paint);
}
function badgeTexture(head,detail,index,accent,isCenter=false,iconIndex=-1){
 const canvas=document.createElement('canvas');canvas.width=640;canvas.height=isCenter?264:240;
 const ctx=canvas.getContext('2d');
 ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.shadowColor='rgba(3,45,29,.28)';ctx.shadowBlur=23;ctx.shadowOffsetY=11;
 rounded(ctx,19,17,602,canvas.height-39,32);
 ctx.fillStyle=isCenter?'#f4ffefe9':'#fafff8f3';ctx.fill();ctx.shadowColor='transparent';
 ctx.strokeStyle=isCenter?'#419b78':'#7daf96';ctx.lineWidth=4;ctx.stroke();
 const a=new THREE.Color(accent).getStyle();
 ctx.fillStyle=a;rounded(ctx,34,34,87,canvas.height-74,23);ctx.fill();
 ctx.fillStyle='#ffffff';ctx.textAlign='center';ctx.font='800 64px Manrope,Arial,sans-serif';ctx.fillText(index,78,isCenter?135:83);
 ctx.textAlign='left';ctx.fillStyle='#123f31';
 ctx.font='800 39px Manrope,Arial,sans-serif';
 if(isCenter){ctx.font='800 53px Manrope,Arial,sans-serif';ctx.fillText(head,146,114);ctx.fillStyle='#517c63';ctx.font='700 29px Manrope,Arial,sans-serif';ctx.fillText(detail,148,162);}
 else {
 const words=head.split(' ');let line='',ys=[];
 for(const word of words){
  const next=line?line+' '+word:word;
  if(ctx.measureText(next).width>454&&line){ys.push(line);line=word;}else line=next;
 }
 if(line)ys.push(line);
 if(ys.length>2){ctx.font='800 32px Manrope,Arial,sans-serif';ys=[];const half=Math.ceil(words.length/2);ys.push(words.slice(0,half).join(' '),words.slice(half).join(' '));}
 const firstY=ys.length===1?114:92;
 ys.forEach((text,i)=>ctx.fillText(text,144,firstY+i*48));
 ctx.fillStyle='#5c886e';ctx.font='700 24px Manrope,Arial,sans-serif';ctx.fillText(detail,146,ys.length===1?166:186);
 }
 const tex=new THREE.CanvasTexture(canvas);
tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);
if(iconIndex>=0)atlasDraw(ctx,tex,iconIndex,42,96,70,70);
return tex;
}
const centerSprite=new THREE.Sprite(new THREE.SpriteMaterial({map:badgeTexture('GeoCirculus','Nothing Wasted · Everything Circulated.','↻','#16784f',true),transparent:true,depthWrite:false}));
centerSprite.position.set(0,3.4,0);centerSprite.scale.set(6,2.53,1);scene.add(centerSprite);
const positions=[],pickTargets=[],stageObjects=[];
const padGeo=new THREE.CylinderGeometry(.66,.81,.28,32);
const towerGeo=new THREE.CylinderGeometry(.19,.27,.62,20);
const ballGeo=new THREE.SphereGeometry(.40,18,12);
for(let i=0;i<8;i++){
 const angle=-Math.PI/2+i*Math.PI/4;
 const x=7.63*Math.cos(angle),z=7.63*Math.sin(angle);
 const color=new THREE.Color(COLORS[i]);
 const postGroup=new THREE.Group();postGroup.position.set(x,0,z);
 road.add(postGroup);positions.push(new THREE.Vector3(x,1.2,z));
 const mat=new THREE.MeshStandardMaterial({color,roughness:.3,metalness:.25,emissive:color,emissiveIntensity:.18});
 const base=new THREE.Mesh(padGeo,new THREE.MeshStandardMaterial({color:'#e5f4df',roughness:.52,metalness:.12}));
 base.position.y=1.10;base.castShadow=!phone;postGroup.add(base);
 const post=new THREE.Mesh(towerGeo,mat);post.position.y=1.57;post.castShadow=!phone;postGroup.add(post);
 const sphere=new THREE.Mesh(ballGeo,mat);
 sphere.position.y=2.02;sphere.castShadow=!phone;postGroup.add(sphere);
 const glowRing=new THREE.Mesh(new THREE.TorusGeometry(.78,.09,12,32),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.44}));
 glowRing.rotation.x=-Math.PI/2;glowRing.position.y=1.27;postGroup.add(glowRing);
 const iconCanvas=document.createElement('canvas');
 iconCanvas.width=192;iconCanvas.height=192;
 const iconTexture=new THREE.CanvasTexture(iconCanvas);
 iconTexture.colorSpace=THREE.SRGBColorSpace;
 atlasDraw(iconCanvas.getContext('2d'),iconTexture,i,0,0,192,192);
 const iconSprite=new THREE.Sprite(new THREE.SpriteMaterial({map:iconTexture,transparent:true,depthTest:false,depthWrite:false}));
 iconSprite.position.set(0,2.74,0);iconSprite.scale.set(1.34,1.34,1);
 postGroup.add(iconSprite);
 const number=new THREE.Sprite(new THREE.SpriteMaterial({map:badgeTexture(labels[i],i===3?'Recovery & sorting':'Waste management',String(i+1).padStart(2,'0'),COLORS[i],false,i),transparent:true,depthTest:false,depthWrite:false}));
 number.position.set(0,4.18,0);number.scale.set(3.2,1.20,1);postGroup.add(number);
 for(const mesh of [base,post,sphere,glowRing,iconSprite,number]){mesh.userData.stageIndex=i;pickTargets.push(mesh);}
 const target={group:postGroup,ball:sphere,ring:glowRing,base:base,material:mat,sprite:number,icon:iconSprite};stageObjects.push(target);
}
const treeStem=new THREE.CylinderGeometry(.105,.14,.8,8),treeCrown=new THREE.ConeGeometry(.60,1.55,10);
const trunkMaterial=new THREE.MeshStandardMaterial({color:'#6b8b72',roughness:.9});
const leafMaterials=['#3d956a','#5da978','#8bb88a'].map(color=>new THREE.MeshStandardMaterial({color,roughness:.95}));
for(let i=0;i<(phone?14:32);i++){
 const a=i*2.399,r=10.7+(i%4)*.6,x=r*Math.cos(a),z=r*Math.sin(a);
 const tree=new THREE.Group();
 const trunk=new THREE.Mesh(treeStem,trunkMaterial);trunk.position.y=.21;
 const crown=new THREE.Mesh(treeCrown,leafMaterials[i%3]);crown.position.y=1.2;
 tree.add(trunk,crown);tree.position.set(x,0,z);
 tree.scale.setScalar(.62+(i%4)*.15);scene.add(tree);
}
const controlsBtns={
 perspective:document.getElementById('road3d-perspective'),
 top:document.getElementById('road3d-top'),
 focus:document.getElementById('road3d-focus'),
 reset:document.getElementById('road3d-reset')
};
const stageButtons=[...root.querySelectorAll('[data-road-stop]')];
const fullView=document.getElementById('road3d-view');
const fullButton=document.getElementById('road3d-fullscreen');
const exitButton=document.getElementById('road3d-exit');
const fullCount=document.getElementById('road3d-fullscreen-count');
const fullTitle=document.getElementById('road3d-fullscreen-title');
const fullDescription=document.getElementById('road3d-fullscreen-description');
const fullTour=document.getElementById('road3d-fullscreen-tour');
const fullTourSymbol=fullTour.querySelector('.road3d-tour-symbol');
const fullTourLabel=fullTour.querySelector('.road3d-tour-label');
const fullTourDuration=fullTour.querySelector('.road3d-tour-duration');
function updateFullTour(playing){
 fullTour.setAttribute('aria-pressed',String(playing));
 fullTour.setAttribute('aria-label',playing?'Pause guided tour':'Play guided tour through the eight stages');
 fullTourSymbol.textContent=playing?'Ⅱ':'▶';
 fullTourLabel.textContent=playing?'Pause guided tour':'Play guided tour';
 fullTourDuration.textContent=playing?'Auto-advancing every 6.5s':'8 stages · 6.5s each';
 fullTour.classList.toggle('is-playing',playing);
}
fullTour.addEventListener('click',()=>root.dispatchEvent(new CustomEvent('cycle:toggle-tour')));
root.addEventListener('cycle:tour-state',event=>updateFullTour(Boolean(event.detail?.playing)));
updateFullTour(document.getElementById('cycle-tour')?.getAttribute('aria-pressed')==='true');
function isFullscreen(){return document.fullscreenElement===fullView;}
function refreshFullscreen(){
 const open=isFullscreen();
 fullButton.textContent=open?'⤢ Exit fullscreen':'⛶ Fullscreen';
 fullButton.setAttribute('aria-pressed',String(open));
 fullButton.setAttribute('aria-label',open?'Exit fullscreen 3D view':'Enter fullscreen 3D view');
 exitButton.hidden=!open;
 // The canvas changes dimensions after the Fullscreen API transition.
 requestAnimationFrame(()=>requestAnimationFrame(resize));
}
async function toggleFullscreen(){
 if(!document.fullscreenEnabled||!fullView.requestFullscreen){
  fullButton.setAttribute('title','Fullscreen unavailable in this browser');
  return;
 }
 try{
  if(isFullscreen())await document.exitFullscreen();
  else await fullView.requestFullscreen();
 }catch(error){
  console.warn('Fullscreen request did not complete',error);
  fullButton.setAttribute('title','Fullscreen was blocked by your browser');
 }
}
fullButton.addEventListener('click',toggleFullscreen);
exitButton.addEventListener('click',()=>{if(isFullscreen())toggleFullscreen();});
document.addEventListener('fullscreenchange',refreshFullscreen);
document.addEventListener('keydown',event=>{
 if(event.key.toLowerCase()!=='f'||event.repeat||event.altKey||event.ctrlKey||event.metaKey)return;
 const focused=document.activeElement;
 if(focused===renderer.domElement||focused===mount||fullView.contains(focused)){
  event.preventDefault();toggleFullscreen();
 }
});
const changeStage=delta=>root.dispatchEvent(new CustomEvent('cycle:choose',{detail:{index:(current+delta+8)%8}}));
document.getElementById('road3d-fullscreen-prev').addEventListener('click',()=>changeStage(-1));
document.getElementById('road3d-fullscreen-next').addEventListener('click',()=>changeStage(1));

let current=0,flight=null,visibility=true,disposed=false;
function cameraView(type,index=current){
 if(type==='top')return {pos:new THREE.Vector3(.01,phone?31:29,.01),target:new THREE.Vector3(0,.2,0)};
 if(type==='focus'){
  const p=positions[index];const radial=new THREE.Vector3(p.x,0,p.z).normalize();
  return {pos:p.clone().add(radial.multiplyScalar(7.3)).add(new THREE.Vector3(3.8,10.8,4.4)),target:p.clone().add(new THREE.Vector3(0,1.15,0))};
 }
 return {pos:START.position.clone(),target:START.target.clone()};
}
function setActivePreset(name){
 Object.entries(controlsBtns).forEach(([key,btn])=>{if(!btn||key==='reset')return;const active=key===name;btn.classList.toggle('is-active',active);btn.setAttribute('aria-pressed',String(active));});
}
function animateCamera(type,index=current){
 const end=cameraView(type,index);
 setActivePreset(type==='reset'?'perspective':type);
 if(reduceMotion){camera.position.copy(end.pos);controls.target.copy(end.target);controls.update();flight=null;return;}
 flight={start:performance.now(),duration:950,a:camera.position.clone(),b:controls.target.clone(),end};
}
controls.addEventListener('start',()=>{flight=null;setActivePreset('');});
function select(i,fly=true){
 current=i;
 stageButtons.forEach((b,n)=>{const active=n===i;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active));});
 stageObjects.forEach((obj,n)=>{
  const on=n===i;
  obj.material.emissiveIntensity=on?.85:.17;
  obj.material.roughness=on?.2:.45;
  obj.ring.material.opacity=on?.95:.34;
  obj.group.scale.setScalar(on?1.19:1);
 });
 if(fly)animateCamera('focus',i);
}
stageButtons.forEach((button,i)=>button.addEventListener('click',()=>root.dispatchEvent(new CustomEvent('cycle:choose',{detail:{index:i}}))));
for(const [name,btn] of Object.entries(controlsBtns)){
 if(!btn)continue;
 btn.addEventListener('click',()=>animateCamera(name==='reset'?'perspective':name));
}
root.addEventListener('cycle:selected',event=>{
 const n=Number(event.detail?.index);
 if(Number.isInteger(n)&&n>=0&&n<8){
  select(n,true);
  fullCount.textContent=String(n+1).padStart(2,'0')+' / 08 · CIRCULAR JOURNEY';
  fullTitle.textContent=document.getElementById('cycle-detail-title').textContent;
  fullDescription.textContent=document.getElementById('cycle-detail-description').textContent;
 }
});
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
let start=null;
renderer.domElement.addEventListener('pointerdown',event=>{start={x:event.clientX,y:event.clientY};});
renderer.domElement.addEventListener('pointerup',event=>{
 if(!start)return;
 const distance=Math.hypot(event.clientX-start.x,event.clientY-start.y);start=null;
 if(distance>9)return;
 const r=renderer.domElement.getBoundingClientRect();
 pointer.set((event.clientX-r.left)/r.width*2-1,-((event.clientY-r.top)/r.height*2-1));
 raycaster.setFromCamera(pointer,camera);
 const hits=raycaster.intersectObjects(pickTargets,false);
 if(hits.length){
  const id=hits[0].object.userData.stageIndex;
  if(Number.isInteger(id))root.dispatchEvent(new CustomEvent('cycle:choose',{detail:{index:id}}));
 }
});
let lastFrame=0;
const tempCam=new THREE.Vector3(),tempTarget=new THREE.Vector3();
function tick(time){
 if(disposed)return;
 requestAnimationFrame(tick);
 if((!visibility&&!isFullscreen())||document.hidden)return;
 if(phone&&time-lastFrame<30)return;lastFrame=time;
 if(flight){
  const t=Math.max(0,Math.min(1,(time-flight.start)/flight.duration)),v=t*t*(3-2*t);
  tempCam.copy(flight.a).lerp(flight.end.pos,v);tempTarget.copy(flight.b).lerp(flight.end.target,v);
  camera.position.copy(tempCam);controls.target.copy(tempTarget);
  if(t>=1)flight=null;
 }
 controls.update();renderer.render(scene,camera);
}
function resize(){
 const rect=mount.getBoundingClientRect();
 if(rect.width<50||rect.height<50)return;
 camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();
 renderer.setSize(rect.width,rect.height,false);
 renderer.render(scene,camera);
}
window.addEventListener('resize',resize);
if('ResizeObserver'in window)new ResizeObserver(resize).observe(mount);
if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visibility=entries[0]?.isIntersecting??true;},{threshold:.02}).observe(mount);
renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();disposed=true;document.documentElement.classList.remove('road3d-ready');console.warn('WebGL context lost; returned to accessible diagram.');});
select(0,false);
exitButton.hidden=true;
if(!document.fullscreenEnabled){fullButton.disabled=true;fullButton.title='Fullscreen is unavailable in this browser';}
document.documentElement.classList.add('road3d-ready');
resize();requestAnimationFrame(tick);
})(THREE,OrbitControls);
