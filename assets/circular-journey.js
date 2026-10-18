(function circularHeroController(){
'use strict';
const root=document.getElementById('circular-journey');
if(!root)return;
const steps=[
{name:'Waste Generation & Reduction',category:'Prevent & reduce',description:'The most effective waste-management step often happens before anything reaches a bin. Better product choices, responsible consumption, reuse and repair reduce the waste requiring collection and treatment.',impact:'Less waste generated means lower collection demand, fewer discarded materials and more resources kept in circulation.',tags:['Reduce at source','Reuse & repair','Measure waste'],tint:'#207f58'},
{name:'Source Segregation',category:'Keep streams separate',description:'Households, institutions and businesses separate waste where it is generated. Wet biodegradable materials, clean dry recyclables and items needing special handling follow different collection streams, according to local rules.',impact:'Proper separation preserves the quality of recyclable materials, improves safety, reduces contamination and makes downstream recovery more efficient.',tags:['Wet & dry streams','Special waste care','Cleaner materials'],tint:'#2781a2'},
{name:'Collection & Transportation',category:'Move waste responsibly',description:'Door-to-door collection, community collection points, appropriate vehicles and planned routes move segregated materials to suitable facilities. Reliable transfer records help track where material came from and where it goes.',impact:'Organized collection protects public spaces, keeps valuable materials out of litter, and supports cleaner, more accountable waste logistics.',tags:['Reliable pickup','Route planning','Safe transport'],tint:'#2781a2'},
{name:'Material Recovery Facility (MRF)',category:'Sort for value',description:'A Material Recovery Facility receives and examines collected dry materials. Workers and equipment can separate paper, metal, glass and different plastics, remove contaminants, and prepare suitable materials for recycling.',impact:'Better sorting increases usable secondary raw material and helps direct organics, residuals and hazardous items toward appropriate treatment.',tags:['Inspection & weighing','Material sorting','Baling & grading'],tint:'#27885c'},
{name:'Recycling',category:'Keep materials circulating',description:'Suitable materials are reprocessed into secondary raw materials. In plastic recycling, this may include identifying the polymer, washing, shredding, drying, extrusion and granulation before supplying manufacturers.',impact:'Recycling can reduce demand for virgin resources when recovered material meets quality needs and a real end market exists.',tags:['Polymer separation','Cleaning & processing','New raw materials'],tint:'#1a8b59'},
{name:'Organic Waste Processing',category:'Recover biological value',description:'Source-separated food scraps, garden waste and other suitable biodegradables may be composted or processed in anaerobic digesters. These systems can produce compost, biogas or other useful products.',impact:'Appropriate biological treatment recovers nutrients and can help avoid uncontrolled decomposition of organics mixed into residual waste.',tags:['Composting','Anaerobic digestion','Nutrient recovery'],tint:'#659850'},
{name:'Energy Recovery',category:'Treat suitable residuals',description:'Some non-recyclable waste fractions may be used for controlled energy recovery, where facilities and regulations allow. Feedstock quality, emission controls, ash handling and technical suitability are essential.',impact:'Energy recovery is a possible treatment option for selected residual streams—not a replacement for waste prevention, reuse or material recycling.',tags:['Residual fractions','Technology suitability','Emission safeguards'],tint:'#cc8a45'},
{name:'Scientific Disposal',category:'Safely manage what remains',description:'Residual waste and treatment residues that cannot be safely recovered require authorized final treatment or engineered disposal. Site design, leachate control, environmental monitoring and regulatory oversight limit harm.',impact:'Responsible final disposal protects public health, soil and water while keeping the amount requiring disposal as small as practical.',tags:['Engineered facilities','Leachate protection','Environmental monitoring'],tint:'#688c60'}
];
const nodes=Array.from(root.querySelectorAll('[data-cycle-step]'));
const el=id=>root.querySelector('#'+id);
const counter=el('cycle-detail-counter'),category=el('cycle-detail-category'),title=el('cycle-detail-title'),description=el('cycle-detail-description'),impact=el('cycle-detail-impact'),tags=el('cycle-detail-tags'),icon=el('cycle-detail-icon'),progress=el('cycle-progress-bar'),panel=el('cycle-detail'),tour=el('cycle-tour'),prev=el('cycle-prev'),next=el('cycle-next'),scene=el('cycle-orbit-scene');
const arrowGroup=el('cycle-arrows');
let current=0,timer=null,playing=false,tiltFrame=0;
const atlasIcon=icon.querySelector('.road-atlas-icon');
const ns='http://www.w3.org/2000/svg';
function point(deg){const r=deg*Math.PI/180;return [500+341*Math.cos(r),450+352*Math.sin(r)];}
function addArrowPaths(){
if(!arrowGroup)return;
for(let i=0;i<8;i++){
  const a=-90+i*45+10,b=-90+(i+1)*45-10;
  const [x1,y1]=point(a),[x2,y2]=point(b);
  const path=document.createElementNS(ns,'path');
  path.setAttribute('d',`M ${x1.toFixed(1)} ${y1.toFixed(1)} A 341 352 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`);
  path.setAttribute('class','cycle-segment');path.setAttribute('data-arc',i);arrowGroup.appendChild(path);
  const radians=b*Math.PI/180;
  let tx=-341*Math.sin(radians),ty=352*Math.cos(radians),mag=Math.hypot(tx,ty);tx/=mag;ty/=mag;
  const px=-ty,py=tx;
  const triangle=document.createElementNS(ns,'polygon');
  const tip=[x2+tx*7,y2+ty*7],back=[x2-tx*15,y2-ty*15];
  triangle.setAttribute('points',`${tip[0].toFixed(1)},${tip[1].toFixed(1)} ${(back[0]+px*9).toFixed(1)},${(back[1]+py*9).toFixed(1)} ${(back[0]-px*9).toFixed(1)},${(back[1]-py*9).toFixed(1)}`);
  triangle.setAttribute('class','cycle-arrow');triangle.setAttribute('data-arc',i);arrowGroup.appendChild(triangle);
}}
function update(index,userInitiated=true){
 current=(index+steps.length)%steps.length;if(userInitiated&&playing)pause();
 const item=steps[current];
 nodes.forEach((node,i)=>{const on=i===current;node.classList.toggle('is-active',on);node.setAttribute('aria-pressed',String(on));});
 root.querySelectorAll('[data-arc]').forEach(node=>node.classList.toggle('is-active',Number(node.getAttribute('data-arc'))===current));
 panel.classList.remove('is-updating');void panel.offsetWidth;panel.classList.add('is-updating');
 counter.textContent=String(current+1).padStart(2,'0')+' / 08';
 category.textContent=item.category;title.textContent=item.name;description.textContent=item.description;impact.textContent=item.impact;
 if(atlasIcon){atlasIcon.style.setProperty('--atlas-x',((current%4)*100/3)+'%');atlasIcon.style.setProperty('--atlas-y',(Math.floor(current/4)*100)+'%');}
 progress.style.width=((current+1)*12.5)+'%';progress.parentNode.setAttribute('aria-label','Stage '+(current+1)+' of 8');
 tags.replaceChildren(...item.tags.map(label=>{const chip=document.createElement('span');chip.textContent=label;return chip;}));
 root.dispatchEvent(new CustomEvent('cycle:selected',{detail:{index:current,name:item.name,fromUser:userInitiated}}));
}
function play(){
 if(playing){pause();return;}
 playing=true;tour.innerHTML='<span aria-hidden="true">Ⅱ</span> Pause guided tour';tour.setAttribute('aria-pressed','true');
 timer=setInterval(()=>{if(document.hidden){pause();return;}update(current+1,false);},6500);
}
function pause(){
 clearInterval(timer);timer=null;playing=false;tour.innerHTML='<span aria-hidden="true">▶</span> Play guided tour';tour.setAttribute('aria-pressed','false');
}
root.addEventListener('cycle:choose',event=>{const index=Number(event.detail?.index);if(Number.isInteger(index)&&index>=0&&index<steps.length)update(index);});
nodes.forEach((node,index)=>{
 node.addEventListener('click',()=>update(index));
 node.addEventListener('keydown',event=>{
   if(event.key==='ArrowRight'||event.key==='ArrowDown'){event.preventDefault();const n=(index+1)%8;update(n);nodes[n].focus();}
   else if(event.key==='ArrowLeft'||event.key==='ArrowUp'){event.preventDefault();const n=(index+7)%8;update(n);nodes[n].focus();}
   else if(event.key==='Home'){event.preventDefault();update(0);nodes[0].focus();}
   else if(event.key==='End'){event.preventDefault();update(7);nodes[7].focus();}
 });
});
prev.addEventListener('click',()=>update(current-1));next.addEventListener('click',()=>update(current+1));tour.addEventListener('click',()=>playing?pause():play());document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced&&window.matchMedia('(pointer:fine)').matches){
 scene.addEventListener('pointermove',event=>{
   if(tiltFrame)cancelAnimationFrame(tiltFrame);const rect=scene.getBoundingClientRect();const dx=(event.clientX-rect.left)/rect.width-.5,dy=(event.clientY-rect.top)/rect.height-.5;
   tiltFrame=requestAnimationFrame(()=>{scene.style.setProperty('--tilt-x',`${(1.5-dy*6).toFixed(2)}deg`);scene.style.setProperty('--tilt-y',`${(-3+dx*9).toFixed(2)}deg`);});
 });
 scene.addEventListener('pointerleave',()=>{if(tiltFrame)cancelAnimationFrame(tiltFrame);scene.style.setProperty('--tilt-x','2deg');scene.style.setProperty('--tilt-y','-4deg');});
}
const status=document.createElement('span');status.className='sr-only';status.style.cssText='position:absolute;width:1px;height:1px;clip-path:inset(50%);overflow:hidden;white-space:nowrap';status.setAttribute('role','status');status.setAttribute('aria-live','polite');panel.appendChild(status);
nodes.forEach(node=>node.addEventListener('click',()=>{status.textContent='Selected stage '+(current+1)+': '+steps[current].name;}));
addArrowPaths();update(0,false);
})();
