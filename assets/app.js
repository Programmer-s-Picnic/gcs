
(()=>{'use strict';
 const nav=document.querySelector('.nav'),toggle=document.querySelector('.menu');
 if(nav&&toggle){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Close ✕':'Menu ☰';});nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.textContent='Menu ☰';}});}
 const format=n=>new Intl.NumberFormat('en-IN',{maximumFractionDigits:1}).format(n);
 const range=['population','rate','segregation'].map(id=>document.getElementById(id));
 if(range.every(Boolean)){
  const write=(id,value)=>{document.getElementById(id).textContent=value;};
  const refresh=()=>{let p=+range[0].value,r=+range[1].value,s=+range[2].value,t=p*r/1000;
  write('population-val',format(p));write('rate-val',r.toFixed(2));write('segregation-val',s+'%');write('waste-day',format(t));write('waste-year',format(t*365));write('sorted-day',format(t*s/100));write('mixed-day',format(t*(100-s/100)));document.getElementById('meter-good').style.width=s+'%';};
  range.forEach(el=>el.addEventListener('input',refresh));refresh();
  document.getElementById('reset-sim').addEventListener('click',()=>{range[0].value=100000;range[1].value=.5;range[2].value=50;refresh();});
 }
 const quiz=document.getElementById('sort-quiz');
 if(quiz){
  const questions=[
   ['Clean plastic bottle','Dry recyclables','A clean plastic bottle is commonly accepted in the dry recyclable stream where local collection supports it.'],
   ['Vegetable peels','Wet organics','Vegetable scraps are organic and may be treated by composting or digestion.'],
   ['Used lithium-ion battery','Special handling','Batteries require designated safe collection and treatment.'],
   ['Clean dry cardboard','Dry recyclables','Clean, dry cardboard is commonly a recyclable fibre material.'],
   ['Leftover cooked rice','Wet organics','Food residues are organic waste; follow local collection guidance.'],
   ['Broken mobile phone','Special handling','Electronics require an authorized e-waste collection or recycling route.']
  ];
  let index=0,score=0,answered=false;
  const title=document.getElementById('quiz-item'),feedback=document.getElementById('quiz-feedback'),progress=document.getElementById('quiz-progress'),next=document.getElementById('quiz-next'),buttons=[...quiz.querySelectorAll('[data-answer]')],bar=document.getElementById('quiz-bar');
  const show=()=>{answered=false;if(index===questions.length){title.textContent='Challenge complete';progress.textContent='Your score: '+score+' / '+questions.length;feedback.textContent='Local segregation rules vary. Refer to municipal guidance for your area.';bar.style.width='100%';buttons.forEach(b=>b.hidden=true);next.hidden=false;next.textContent='Try again ↺';return;}title.textContent=questions[index][0];progress.textContent='Item '+(index+1)+' of '+questions.length;feedback.textContent='Select the best waste stream.';bar.style.width=(100*index/questions.length)+'%';next.hidden=true;buttons.forEach(b=>{b.hidden=false;b.disabled=false;});};
  buttons.forEach(button=>button.addEventListener('click',()=>{if(answered)return;answered=true;const ok=button.dataset.answer===questions[index][1];if(ok)score++;feedback.textContent=(ok?'✓ Correct. ':'Not quite. ')+questions[index][2];buttons.forEach(b=>b.disabled=true);next.hidden=false;next.textContent='Next item →';}));
  next.addEventListener('click',()=>{if(index===questions.length){index=0;score=0;}else index++;show();});show();
 }
 const stages=document.querySelectorAll('[data-stage]'),panel=document.getElementById('stage-display');
 if(panel&&stages.length){
  const descriptions=[
   ['1. Generation','A waste stream begins when households, businesses, institutions or industries discard material. Prevention and responsible purchasing reduce waste before it arises.'],
   ['2. Collection','Segregated materials are collected safely through formal or authorized networks. Collection reliability is essential for public health and material quality.'],
   ['3. Sorting','Material recovery facilities separate dry recyclables, organics, residuals and materials requiring special handling. Polymer identification helps avoid contaminating plastic streams.'],
   ['4. Processing','Suitable materials are cleaned, shredded and processed using technology appropriate to the polymer. Not all plastic types can be recycled together or repeatedly.'],
   ['5. New use','Recovered material may become feedstock for manufacturers. Material quality, market demand and traceability determine whether circular value is captured.']
  ];
  stages.forEach(b=>b.addEventListener('click',()=>{stages.forEach(x=>{x.classList.remove('active');x.setAttribute('aria-selected','false');});b.classList.add('active');b.setAttribute('aria-selected','true');const d=descriptions[+b.dataset.stage];panel.innerHTML='<h3>'+d[0]+'</h3><p>'+d[1]+'</p>'; }));
  stages[0].click();
 }
})();
