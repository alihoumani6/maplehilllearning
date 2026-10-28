/* Maple Leap - lesson content generators (pure logic, no DOM) */
(function(root){
const ri=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[ri(0,a.length-1)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=ri(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;}
const NAMES=["Mia","Liam","Noah","Ava","Zoe","Ben","Ella","Sam","Maya","Leo","Nina","Omar","Aya","Jack","Priya","Ali"];
function uniq(a){return [...new Set(a)];}
function mc(q,a,wrongs,o){a=String(a);let w=uniq(wrongs.map(String)).filter(x=>x!==a);return Object.assign({t:'mc',q,a,choices:shuffle([a,...w.slice(0,3)])},o||{});}
function numChoices(ans,near,min){min=(min===undefined)?0:min;let s=new Set();let c=[ans+1,ans-1,ans+2,ans-2,ans+10,ans-10,ans+3,ans*2].concat(near||[]);for(const x of shuffle(c)){if(x!==ans&&x>=min&&Number.isFinite(x))s.add(x);if(s.size>=3)break;}let k=1;while(s.size<3){if(ans+k!==ans)s.add(ans+k);k++;}return [...s];}
function mcn(q,ans,o,near,min){return mc(q,ans,numChoices(ans,near,min),o);}
function num(q,a,o){return Object.assign({t:'num',q,a:String(a)},o||{});}
function ord(q,sentence,o){const words=sentence.replace(/[.?!]$/,'').split(' ');const end=sentence.match(/[.?!]$/);return Object.assign({t:'ord',q,words:shuffle(words),a:words.join(' '),end:end?end[0]:'',full:sentence},o||{});}
function clock(h,m){const cx=60,cy=60;let s=`<svg viewBox="0 0 120 120" width="150" height="150" role="img" aria-label="clock"><circle cx="60" cy="60" r="56" fill="#fff" stroke="#12306b" stroke-width="5"/>`;
 for(let i=1;i<=12;i++){const a=i*Math.PI/6;s+=`<text x="${cx+44*Math.sin(a)}" y="${cy-44*Math.cos(a)+5}" font-size="14" font-weight="800" text-anchor="middle" fill="#12306b">${i}</text>`;}
 const ha=((h%12)+m/60)*Math.PI/6,ma=m*Math.PI/30;
 s+=`<line x1="60" y1="60" x2="${60+28*Math.sin(ha)}" y2="${60-28*Math.cos(ha)}" stroke="#d62828" stroke-width="6" stroke-linecap="round"/><line x1="60" y1="60" x2="${60+40*Math.sin(ma)}" y2="${60-40*Math.cos(ma)}" stroke="#12306b" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="60" r="4" fill="#12306b"/></svg>`;return s;}
const tm=(h,m)=>h+":"+String(m).padStart(2,'0');
const fmt=n=>String(Math.round(n*100)/100);
/* ---------------- MATH ---------------- */
const MATH={
1:[d=>{const m=d<1?10:20;const a=ri(1,m-1),b=ri(1,m-a);return mcn(`${a} + ${b} = ?`,a+b);},
 d=>{const m=d<1?10:20;const a=ri(3,m),b=ri(1,a-1);return mcn(`${a} − ${b} = ?`,a-b);},
 d=>{const m=d<1?10:20;const a=ri(1,m-1),s=ri(a+1,m);return num(`${a} + ? = ${s}`,s-a);},
 d=>{let a=ri(10,99),b=ri(10,99);while(a===b)b=ri(10,99);const big=Math.random()<.5;return mc(big?'Which number is bigger?':'Which number is smaller?',big?Math.max(a,b):Math.min(a,b),[big?Math.min(a,b):Math.max(a,b),a+b>150?a-1:a+1,b+10]);},
 d=>{const n=ri(3,12),e=pick(["🍎","⭐","🐟","🌳","🐞"]);return mcn(`How many? ${e.repeat(n)}`,n);},
 d=>{const h=ri(1,12),half=d>=2&&Math.random()<.5;const m=half?30:0;return mc('What time is it?',tm(h,m),[tm(h%12+1,m),tm((h+10)%12+1,m),tm(h,m?0:30)],{svg:clock(h,m)});},
 d=>{const combos=[["2 dimes",20],["1 dime and 1 nickel",15],["3 nickels",15],["1 quarter",25],["1 quarter and 1 nickel",30],["2 nickels",10],["1 dime and 2 nickels",20]];const c=pick(combos);return mcn(`How many cents? ${c[0]}\n(nickel = 5¢, dime = 10¢, quarter = 25¢)`,c[1],{},[c[1]+5,c[1]-5]);},
 d=>{const b=[["How many sides does a triangle have?",3,[4,2,5]],["How many corners does a square have?",4,[3,5,2]],["How many sides does a circle have?",0,[1,2,4]],["How many sides does a hexagon have?",6,[5,8,4]],["How many corners does a rectangle have?",4,[2,3,6]],["How many sides does a pentagon have?",5,[4,6,3]]];const x=pick(d<1?b.slice(0,5):b);return mc(x[0],x[1],x[2]);},
 d=>{const n=pick(NAMES),a=ri(3,10),b=ri(1,8);if(Math.random()<.5)return mcn(`${n} has ${a} apples. A friend gives ${b} more. How many apples now?`,a+b);const bb=ri(1,a-1);return mcn(`${n} has ${a} apples and eats ${bb}. How many are left?`,a-bb);},
 d=>{const n=ri(1,98),after=Math.random()<.5;return mcn(after?`What number comes right after ${n}?`:`What number comes right before ${n+1}?`,after?n+1:n);}],
2:[d=>{const a=ri(10,60),b=ri(10,99-a);return mcn(`${a} + ${b} = ?`,a+b);},
 d=>{const a=ri(30,99),b=ri(10,a-5);return mcn(`${a} − ${b} = ?`,a-b);},
 d=>{const n=ri(100,999),pl=pick([["ones",2],["tens",1],["hundreds",0]]);const dg=String(n);const ans=dg[pl[1]];return mc(`In ${n}, which digit is in the ${pl[0]} place?`,ans,dg.split('').concat([String((+ans+3)%10)]));},
 d=>{const t=ri(1,9)*10,o=ri(1,9);return mcn(`${t} + ${o} = ?`,t+o);},
 d=>{const st=pick([2,5,10]),s=ri(0,4)*st;return num(`Skip count: ${[0,1,2,3].map(i=>s+i*st).join(', ')}, ?`,s+4*st);},
 d=>{const n=ri(10,99);return mc(`Is ${n} even or odd?`,n%2?'odd':'even',[n%2?'even':'odd']);},
 d=>{const h=ri(1,12),m=ri(0,11)*5;return mc('What time is it?',tm(h,m),[tm(h,(m+15)%60),tm(h%12+1,m),tm(h,(m+30)%60)],{svg:clock(h,m)});},
 d=>{const c=pick([["1 toonie and 1 loonie",3],["2 loonies",2],["1 toonie",2],["3 loonies",3],["1 toonie and 2 loonies",4]]);return mcn(`How many dollars? ${c[0]}\n(loonie = $1, toonie = $2)`,c[1],{},[],1);},
 d=>{const a=ri(10,99),b=ri(10,99);if(a===b)return null;return mc(`Which is correct? ${a} __ ${b}`,a>b?'>':'<',[a>b?'<':'>']);},
 d=>{const n=ri(5,49);return num(`Double ${n} = ?`,n*2);},
 d=>{const n=pick(NAMES),a=ri(20,60),b=ri(10,35);return mcn(`${n} read ${a} pages on Monday and ${b} on Tuesday. How many pages in all?`,a+b);}],
3:[d=>{const m=[5,7,10,12][d];const a=ri(2,m),b=ri(2,m);return mcn(`${a} × ${b} = ?`,a*b);},
 d=>{const m=[5,7,10,12][d];const a=ri(2,m),b=ri(2,m);return mcn(`${a*b} ÷ ${a} = ?`,b);},
 d=>{const den=pick([2,3,4,5]),k=ri(2,6);return num(`What is 1/${den} of ${den*k}?`,k);},
 d=>{const n=ri(11,98),to=pick([10,100]);const r=to===10?Math.round(n/10)*10:Math.round(n*3/100)*100;const v=to===10?n:n*3;return mcn(`Round ${v} to the nearest ${to}.`,Math.round(v/to)*to,{},[Math.floor(v/to)*to,Math.ceil(v/to)*to+to]);},
 d=>{const l=ri(3,12),w=ri(2,9);return mcn(`A rectangle is ${l} cm long and ${w} cm wide. What is its perimeter (cm)?`,2*(l+w));},
 d=>{const a=ri(2,9),b=ri(2,9);return num(`${a} × ? = ${a*b}`,b);},
 d=>{const c=ri(2,6),e=ri(3,9);return mcn(`There are ${c} boxes with ${e} pencils in each. How many pencils in all?`,c*e);},
 d=>{const pairs=[["1/2","1/4"],["1/3","1/6"],["1/2","1/8"],["1/4","1/5"]];const p=pick(pairs);return mc('Which fraction is larger?',p[0],[p[1]]);},
 d=>{const h=ri(1,10),m=pick([0,15,30,45]),dur=pick([15,30,45]);let tot=h*60+m+dur;let hh=Math.floor(tot/60)%12||12,mm=tot%60;return mc(`A movie starts at ${tm(h,m)} and lasts ${dur} minutes. When does it end?`,tm(hh,mm),[tm(hh,(mm+15)%60),tm(hh%12+1,mm),tm(hh,(mm+30)%60)]);}],
4:[d=>{const a=ri(1000,[4000,6000,8000,9000][d]),b=ri(100,[900,2000,3000,4000][d]);return mcn(`${a} + ${b} = ?`,a+b,{},[a+b+100,a+b-100,a+b+1000]);},
 d=>{const a=ri(3000,9000),b=ri(100,2500);return mcn(`${a} − ${b} = ?`,a-b,{},[a-b+100,a-b-100,a-b+1000]);},
 d=>{const a=ri(11,[30,50,80,99][d]),b=ri(2,9);return mcn(`${a} × ${b} = ?`,a*b,{},[a*b+10,a*b-10]);},
 d=>{const b=ri(3,9),q=ri(4,12),r=ri(1,b-1);return num(`What is the remainder of ${b*q+r} ÷ ${b}?`,r);},
 d=>{const p=pick([[1,2],[1,3],[1,4],[2,3],[3,4]]),k=pick([2,3,4]);return num(`${p[0]}/${p[1]} = ?/${p[1]*k}`,p[0]*k);},
 d=>{const l=ri(4,15),w=ri(3,12);return mcn(`A garden is ${l} m long and ${w} m wide. What is its area (m²)?`,l*w,{},[2*(l+w)]);},
 d=>{const n=pick([12,18,20,24,30,36,40,48]);const fs=[];for(let i=2;i<n;i++)if(n%i===0)fs.push(i);const f=pick(fs);const nf=[];for(let i=2;i<n+6;i++)if(n%i!==0)nf.push(i);return mc(`Which number is a factor of ${n}?`,f,shuffle(nf).slice(0,3));},
 d=>{const n=ri(1200,9899);return mcn(`Round ${n} to the nearest thousand.`,Math.round(n/1000)*1000,{},[Math.floor(n/1000)*1000,Math.ceil(n/1000)*1000+1000,Math.round(n/100)*100]);},
 d=>{const t=ri(1,9);return mc(`Which fraction equals 0.${t}?`,`${t}/10`,[`${t}/100`,`1/${t+1}`,`${t}/${t+10}`]);},
 d=>{const n=pick(NAMES),p=ri(3,9),c=ri(4,9),e=ri(2,10);return mcn(`${n} buys ${p} packs of cards with ${c} cards each, then gives away ${e}. How many cards are left?`,p*c-e);}],
5:[d=>{const a=ri(11,99)/10,b=ri(11,99)/10;return mc(`${a.toFixed(1)} + ${b.toFixed(1)} = ?`,(a+b).toFixed(1),[(a+b+0.1).toFixed(1),(a+b-0.1).toFixed(1),(a+b+1).toFixed(1)]);},
 d=>{const n=ri(12,99)/10,p=pick([10,100]);return mc(`${n.toFixed(1)} × ${p} = ?`,fmt(n*p),[fmt(n*p/10),fmt(n*p*10),fmt(n/p)]);},
 d=>{const pairs=[["1/2","1/4","3/4"],["1/3","1/6","1/2"],["1/2","1/3","5/6"],["1/4","1/8","3/8"],["2/5","1/10","1/2"]];const p=pick(pairs);return mc(`${p[0]} + ${p[1]} = ?`,p[2],["1/2","2/3","1/4","3/4","5/6","7/8","3/8"].filter(x=>x!==p[2]).slice(0,5));},
 d=>{const a=ri(2,9),b=ri(2,9),c=ri(2,9);return Math.random()<.5?mcn(`${a} + ${b} × ${c} = ?`,a+b*c):mcn(`(${a} + ${b}) × ${c} = ?`,(a+b)*c);},
 d=>{const l=ri(2,9),w=ri(2,9),h=ri(2,9);return mcn(`A box is ${l} cm long, ${w} cm wide and ${h} cm tall. What is its volume (cm³)?`,l*w*h);},
 d=>{const m=ri(5,20);const dv=[ri(1,5),-ri(1,5),ri(1,5)];const s=dv.reduce((x,y)=>x+y,0);const arr=[m+dv[0],m+dv[1],m+dv[2],m-s];return mcn(`What is the average (mean) of ${arr.join(', ')}?`,m,{},[Math.max(...arr),Math.min(...arr)]);},
 d=>{const pr=pick([11,13,17,19,23]),cm=pick([9,15,21,25,27,33,35]);return mc('Which number is prime?',pr,[cm,pick([4,6,8]),pick([10,12,14])]);},
 d=>{const n=ri(2,5),b=ri(2,4);const v=Math.pow(b,n);return mcn(`${b}${["⁰","¹","²","³","⁴","⁵"][n]} = ?`,v);},
 d=>{const pr=ri(2,9)*25/100*4,q=ri(2,5);const price=ri(1,4)+pick([0.25,0.5,0.75]);return mc(`A pen costs $${price.toFixed(2)}. How much do ${q} pens cost?`,'$'+(price*q).toFixed(2),['$'+(price*q+0.5).toFixed(2),'$'+(price*q-0.25).toFixed(2),'$'+(price+q).toFixed(2)]);}],
6:[d=>{const p=pick([10,20,25,50,75]);const base=pick([20,40,60,80,100,120,200]);return mcn(`What is ${p}% of ${base}?`,base*p/100,{},[base*p/10,base-p]);},
 d=>{const a=ri(2,5),b=ri(2,5);if(a===b)return null;const k=ri(2,6);return mcn(`The ratio of boys to girls is ${a}:${b}. There are ${(a+b)*k} students. How many are boys?`,a*k);},
 d=>{const a=ri(1,9),b=ri(1,9);const t=pick(['add','sub']);return t==='add'?mcn(`−${a} + ${a+b} = ?`,b,{},[-b,a],-20):mcn(`${a} − ${a+b} = ?`,-b,{},[b,a+b],-20);},
 d=>{const x=ri(2,15),a=ri(2,12);return num(`x + ${a} = ${x+a}. What is x?`,x);},
 d=>{const x=ri(2,12),k=ri(2,9);return num(`${k}x = ${k*x}. What is x?`,x);},
 d=>{const m=ri(3,15);const arr=[m-4,m-1,m,m+2,m+5];return mcn(`What is the median of ${shuffle(arr).join(', ')}?`,m);},
 d=>{const b=ri(2,5),n=ri(2,5);const v=Math.pow(b,n);return mcn(`${b}^${n} = ?`,v);},
 d=>{const b=ri(2,10)*2,h=ri(2,10);return mcn(`A triangle has base ${b} cm and height ${h} cm. What is its area (cm²)?`,b*h/2,{},[b*h]);},
 d=>{const n=ri(2,6),c=ri(2,5);return mc(`${n*3} apples cost $${n*c*3/3*1}. What does 1 apple cost?`,'$'+(n*c/(n*3)).toFixed(2),['$'+(c).toFixed(2),'$'+(c/2).toFixed(2),'$'+(n).toFixed(2)])},
 d=>{const arr=shuffle([-7,-3,0,2,5]).slice(0,4);const s=arr.slice().sort((a,b)=>a-b);return mc(`Which list is in order from least to greatest?`,s.join(', '),[s.slice().reverse().join(', '),shuffle(s).join(', '),arr.join(', ')]);}]
};
/* ---- Ontario-aligned additions: data, probability, geometry, measurement, money ---- */
(function(){
const cm$=v=>'$'+v.toFixed(2);
const fr=(a,b)=>a+'/'+b;
const PETS=[['dogs','🐶'],['cats','🐱'],['fish','🐟'],['birds','🐦'],['rabbits','🐰']];
const FRUIT=[['apples','🍎'],['bananas','🍌'],['grapes','🍇'],['pears','🍐'],['oranges','🍊']];
const dataLow=d=>{const [a,b]=shuffle(FRUIT).slice(0,2);const x=ri(2,6),y=ri(1,x-1);if(Math.random()<.5)return mc(`${a[1].repeat(x)} ${a[0]}, ${b[1].repeat(y)} ${b[0]}. Which has more?`,a[0],[b[0],'They are the same','Cannot tell']);return mcn(`${a[1].repeat(x)} ${a[0]}, ${b[1].repeat(y)} ${b[0]}. How many more ${a[0]} than ${b[0]}?`,x-y,{},[x+y]);};
const dataMid=d=>{const p=shuffle(PETS).slice(0,3),v=[ri(6,12),ri(3,8),ri(1,5)];const t=`Favourite pets: ${p.map((e,i)=>e[0]+' '+v[i]).join(', ')}.`;const k=ri(0,2);if(k===0)return mcn(`${t} How many students answered in all?`,v[0]+v[1]+v[2]);if(k===1)return mc(`${t} Which pet is the most popular?`,p[0][0],[p[1][0],p[2][0],'They are tied']);return mcn(`${t} How many more chose ${p[0][0]} than ${p[2][0]}?`,v[0]-v[2],{},[v[0]+v[2]]);};
const dataHigh=d=>{const n=ri(5,7);let a=[];for(let i=0;i<n;i++)a.push(ri(2,9));const m=pick(a);a=a.concat([m,m]);a=shuffle(a);const cnt={};a.forEach(x=>cnt[x]=(cnt[x]||0)+1);const best=Object.keys(cnt).sort((x,y)=>cnt[y]-cnt[x]);if(cnt[best[0]]===cnt[best[1]])return null;return mcn(`What is the mode of ${a.join(', ')}?`,+best[0],{},[+best[1],Math.max.apply(null,a)]);};
const probLow=d=>{const r=ri(4,7),b=ri(1,2);return mc(`A bag has ${r} red 🔴 and ${b} blue 🔵 counters. You pick without looking. Which colour is more likely?`,'red',['blue','They are equally likely','Cannot tell']);};
const probLow2=d=>{const o=shuffle([['The sun will rise tomorrow','certain'],['You will find a unicorn at school','impossible'],['A coin lands on heads','possible'],['You flip a coin and get heads or tails','certain']])[0];return mc(`${o[0]}. Is this impossible, possible or certain?`,o[1],['impossible','possible','certain'].filter(x=>x!==o[1]).concat(['unlikely']));};
const probMid=d=>{const n=pick([4,5,8,10]),k=ri(1,n-1);return mc(`A spinner has ${n} equal parts and ${k} of them are red. What is the probability of landing on red?`,fr(k,n),[fr(n-k,n),fr(k,n+2),fr(1,k+1),fr(n,k)]);};
const probHigh=d=>{const q=pick([['an even number on a regular 6-sided die','3/6'],['a number greater than 4 on a 6-sided die','2/6'],['a 3 on a 6-sided die','1/6'],['heads on a fair coin','1/2']]);return mc(`What is the probability of rolling or flipping ${q[0]}?`,q[1],['1/3','2/3','1/4','5/6','1/6','3/6','1/2'].filter(x=>x!==q[1]));};
const geo1=d=>{const s=pick([['cube',6,'faces'],['cube',8,'corners'],['rectangular prism',6,'faces'],['triangle',3,'sides'],['square pyramid',5,'faces']]);return mcn(`How many ${s[2]} does a ${s[0]} have?`,s[1]);};
const geoSym=d=>{const s=pick([['square',4],['rectangle',2],['equilateral triangle',3],['circle','many']]);if(s[1]==='many')return mc('Which shape has the most lines of symmetry?','circle',['square','rectangle','triangle']);return mcn(`How many lines of symmetry does a ${s[0]} have?`,s[1]);};
const geoAng=d=>{const a=pick([30,45,60,90,100,120,135,150]);const t=a<90?'acute':(a===90?'right':'obtuse');return mc(`An angle measures ${a}°. What kind of angle is it?`,t,['acute','right','obtuse','straight'].filter(x=>x!==t));};
const geoCoord=d=>{const x=ri(1,8),y=ri(1,8),dx=ri(1,4);return mc(`Start at the point (${x}, ${y}) on a grid. Move ${dx} to the right. Where are you now?`,`(${x+dx}, ${y})`,[`(${x}, ${y+dx})`,`(${x-dx<0?x+dx+1:x-dx}, ${y})`,`(${y+dx}, ${x})`]);};
const geoTri=d=>{const a=ri(30,80),b=ri(30,80);if(a+b>=150)return null;return mcn(`Two angles in a triangle are ${a}° and ${b}°. What is the third angle (°)?`,180-a-b);};
const meaLow=d=>{const s=pick([['How many days are in a week?',7],['How many hours are in one day?',24],['How many minutes are in one hour?',60]]);return mcn(s[0],s[1]);};
const meaLow2=d=>{const s=pick([['a pencil','a bus','longer'],['a mouse','an elephant','heavier'],['a spoon','a swimming pool','holds more water']]);return mc(`Which one is ${s[2].replace('holds more water','able to hold more water')}?`,s[1],[s[0],'They are the same','Cannot tell']);};
const meaMid=d=>{const k=pick([['m','cm',100],['kg','g',1000],['L','mL',1000],['cm','mm',10]]);const n=ri(2,9);return mcn(`${n} ${k[0]} = ? ${k[1]}`,n*k[2],{},[n*k[2]/10,n*k[2]*10]);};
const meaElapsed=d=>{const h=ri(1,5),m=pick([15,30,45]);const sh=ri(7,11);const eh=sh+h;const f=(H,M)=>`${H}:${String(M).padStart(2,'0')}`;return mc(`A class starts at ${f(sh,0)} and ends at ${f(eh,m)}. How long is the class?`,`${h} h ${m} min`,[`${h+1} h ${m} min`,`${h} h ${m===30?15:30} min`,`${h-1<1?2:h-1} h ${m} min`]);};
const meaArea=d=>{const b=ri(3,12),h=ri(3,9);return mcn(`A parallelogram has base ${b} cm and height ${h} cm. What is its area (cm²)?`,b*h,{},[2*(b+h)]);};
const monLow=d=>{const t=pick([[1,'toonie',2],[2,'loonies',2],[3,'loonies',3]]);return mcn(`You have ${t[0]===1?'a':t[0]} ${t[1]}. How many dollars is that?`,t[0]*(t[1]==='toonie'?2:1));};
const monMid=d=>{const p=pick([1.25,2.35,3.4,4.15,5.6,6.75,7.5]);const pay=pick([10,20]);return mc(`You buy a snack for ${cm$(p)} and pay with $${pay}. How much change do you get?`,cm$(pay-p),[cm$(pay-p+1),cm$(pay-p-0.1),cm$(p+pay)]);};
const monNickel=d=>{const c=ri(101,499)/100;const r=Math.round(c*20)/20;const wr=[c,r+0.05,r-0.05].map(cm$);return mc(`In Canada, cash totals round to the nearest 5¢. What does ${cm$(c)} round to when paying cash?`,cm$(r),wr.filter(x=>x!==cm$(r)).concat([cm$(r+0.1)]));};
const monHst=d=>{const p=pick([10,20,30,40,50,60]);return mc(`In Ontario, HST is 13%. A book costs $${p}. How much HST is added?`,cm$(p*.13),[cm$(p*.1),cm$(p*.15),cm$(p*.013),cm$(p*1.13)]);};
const monHst2=d=>{const p=pick([10,20,50,100]);return mc(`In Ontario, HST is 13%. A game costs $${p}. What is the total with HST?`,cm$(p*1.13),[cm$(p*1.1),cm$(p*1.15),cm$(p+13),cm$(p*.13)]);};
const add=(g,fs)=>fs.forEach(f=>MATH[g].push(f));
add(1,[dataLow,probLow,geo1,meaLow,meaLow2,monLow]);
add(2,[dataLow,probLow,probLow2,geo1,geoSym,meaLow,meaLow2,monMid]);
add(3,[dataMid,probLow2,probMid,geoSym,geoAng,meaMid,monMid,monNickel]);
add(4,[dataMid,probMid,geoAng,geoCoord,meaMid,meaElapsed,monNickel]);
add(5,[dataMid,dataHigh,probMid,probHigh,geoAng,geoCoord,geoTri,meaMid,meaElapsed,monHst,monNickel]);
add(6,[dataHigh,probHigh,geoCoord,geoTri,meaMid,meaArea,monHst,monHst2]);
})();
/* fix up generated nulls and bad ones */
function genMath(g,d,n){const gens=MATH[g];const out=[];let guard=0;while(out.length<n&&guard++<200){const f=gens[ri(0,gens.length-1)];let q;try{q=f(d);}catch(e){q=null;}if(!q)continue;if(q.t==='mc'&&(q.choices.length<4||!q.choices.includes(q.a)))continue;if(out.some(o=>o.q===q.q))continue;out.push(q);}return out;}
/* ---------------- READING ---------------- */
const S=(w,r,x)=>({t:'mc',q:`Which word means almost the same as “${w}”?`,a:r,choices:shuffle([r,...x])});
const A=(w,r,x)=>({t:'mc',q:`Which word means the opposite of “${w}”?`,a:r,choices:shuffle([r,...x])});
const Gm=(q,r,x)=>({t:'mc',q,a:r,choices:shuffle([r,...x])});
const Sp=(r,x)=>({t:'mc',q:'Which word is spelled correctly?',a:r,choices:shuffle([r,...x])});
const O=s=>ord('Tap the words to build the sentence.',s);
const C=(p,q,r,x)=>({t:'mc',passage:p,q,a:r,choices:shuffle([r,...x])});
const P=(q,r,x)=>Gm(q,r,x);
const READ={
1:[S("happy","glad",["mad","sleepy","hungry"]),S("little","small",["huge","loud","fast"]),S("fast","quick",["slow","heavy","cold"]),S("begin","start",["stop","finish","wait"]),
 A("hot","cold",["warm","sunny","red"]),A("up","down",["over","high","top"]),A("day","night",["noon","light","play"]),A("happy","sad",["glad","nice","funny"]),
 Gm("I ___ a happy dog.","am",["is","are"]),Gm("She ___ my friend.","is",["am","are"]),Gm("They ___ playing.","are",["is","am"]),Gm("One dog, two ___.","dogs",["dog","dogses"]),Gm("Yesterday I ___ to the park.","walked",["walk","walking"]),Gm("I have ___ apple.","an",["a","two"]),
 Sp("friend",["freind","frend","frind"]),Sp("because",["becuz","becase","becuse"]),Sp("said",["sed","sayd","sead"]),Sp("they",["thay","thei","thae"]),
 O("The dog runs fast."),O("I like to read books."),O("We play at the park."),
 C("Sam has a red kite. The wind is strong. Sam's kite goes up, up, up!","What color is the kite?","red",["blue","green","yellow"]),C("Sam has a red kite. The wind is strong. Sam's kite goes up, up, up!","Where does the kite go?","up",["down","home","under"]),
 C("Lily has a small cat named Pip. Pip likes to nap in the sun.","What is the cat's name?","Pip",["Lily","Sam","Sun"]),C("Lily has a small cat named Pip. Pip likes to nap in the sun.","Where does Pip like to nap?","in the sun",["in the rain","on the bed","in a box"])],
2:[S("glad","happy",["angry","tired","hungry"]),S("tired","sleepy",["excited","loud","quick"]),S("shut","close",["open","push","carry"]),S("quick","fast",["slow","tall","soft"]),
 A("early","late",["soon","first","quick"]),A("empty","full",["small","clean","light"]),A("loud","quiet",["noisy","big","happy"]),A("wet","dry",["cold","soft","damp"]),
 Gm("One mouse, two ___.","mice",["mouses","mouse","mices"]),Gm("One foot, two ___.","feet",["foots","feets","foot"]),Gm("Yesterday we ___ pizza.","ate",["eat","eated","eating"]),Gm("He ___ to school yesterday.","went",["goed","go","going"]),Gm("My brother ___ taller than me.","is",["are","am"]),Gm("The birds ___ singing.","are",["is","am"]),Gm("“Do not” can be written as…","don't",["dont","do'nt","d'ont"]),
 Sp("different",["diferent","diffrent","differant"]),Sp("beautiful",["beutiful","beautifull","beatiful"]),Sp("listen",["lisen","lissen","listin"]),Sp("answer",["anser","answar","anwser"]),
 O("The little bird sings a song."),O("We went to the library after school."),O("My mom made a big dinner."),
 P("Which sentence is correct?","Where is my hat?",["where is my hat?","Where is my hat."]),P("Which sentence is correct?","I like cats, dogs, and fish.",["I like cats dogs and fish","i like cats, dogs, and fish."]),
 C("Ben planted a seed in a pot. He gave it water and sun. Soon a green sprout popped out.","What did Ben plant?","a seed",["a flower","a tree","a bean pot"]),C("Ben planted a seed in a pot. He gave it water and sun. Soon a green sprout popped out.","What did the seed get?","water and sun",["candy and snow","only music","a toy"]),
 C("On Saturday, Zoe and her dad baked cookies. Zoe stirred the dough. The cookies smelled sweet.","Who baked cookies with Zoe?","her dad",["her mom","her friend","her teacher"]),C("On Saturday, Zoe and her dad baked cookies. Zoe stirred the dough. The cookies smelled sweet.","What did Zoe do?","stirred the dough",["ate all the cookies","washed dishes","bought flour"])],
3:[S("enormous","huge",["tiny","quiet","funny"]),S("rapid","quick",["slow","tall","wet"]),S("courageous","brave",["scared","lazy","noisy"]),S("tidy","neat",["messy","fast","weak"]),
 A("ancient","modern",["old","huge","dusty"]),A("generous","selfish",["kind","rich","happy"]),A("difficult","easy",["hard","long","tough"]),A("expand","shrink",["grow","stretch","spread"]),
 Gm("She ___ her homework before dinner.","finished",["finish","finishing","finishs"]),Gm("There ___ three birds in the tree.","are",["is","am","be"]),Gm("___ going to the zoo.","They're",["Their","There","Theyre"]),Gm("I put my books over ___.","there",["their","they're","thare"]),Gm("The dog wagged ___ tail.","its",["it's","its'","it"]),Gm("Her room is ___ than mine.","bigger",["more big","biggest","bigest"]),Gm("He ran ___.","quickly",["quick","quicken","quickness"]),
 Sp("necessary",["neccessary","necesary","nesessary"]),Sp("separate",["seperate","separat","seperete"]),Sp("receive",["recieve","receeve","riceive"]),Sp("Wednesday",["Wensday","Wednsday","Wendsday"]),
 O("The brave knight rescued the little dragon."),O("After lunch, we played soccer outside."),O("Can you help me find my missing shoe?"),
 P("Which sentence is correct?","Mia's dog is brown.",["Mias dog is brown.","Mia's dog, is brown.","Mias' dog is brown."]),P("Which sentence is correct?","“Let's go,” said Tom.",["Lets go, said Tom.","“Let's go” said Tom.","“Lets go,” said tom."]),
 C("Beavers build dams with sticks and mud. The dam makes a pond. In the pond, beavers build a lodge to stay safe and warm.","What do beavers use to build dams?","sticks and mud",["rocks and sand","glass","paper"]),C("Beavers build dams with sticks and mud. The dam makes a pond. In the pond, beavers build a lodge to stay safe and warm.","Why do beavers build lodges?","to stay safe and warm",["to catch fish","to play games","to store snow"]),
 C("The class planted a garden. Each student picked a vegetable. Maya chose carrots because they grow underground.","Why did Maya choose carrots?","they grow underground",["they are sweet","they are tall","they are red"]),C("The class planted a garden. Each student picked a vegetable. Maya chose carrots because they grow underground.","What did each student pick?","a vegetable",["a flower","a tool","a seed packet"])],
4:[S("reluctant","unwilling",["eager","careful","angry"]),S("conceal","hide",["show","find","carry"]),S("fragile","delicate",["strong","heavy","bright"]),S("ample","plenty",["little","broken","quiet"]),
 A("transparent","opaque",["clear","shiny","thin"]),A("scarce","plentiful",["rare","small","costly"]),A("vague","clear",["unsure","blurry","dull"]),A("ascend","descend",["climb","rise","jump"]),
 Gm("Each of the students ___ a pencil.","has",["have","having","are"]),Gm("She runs faster ___ her brother.","than",["then","that","as"]),Gm("I don't know ___ it will rain.","whether",["weather","wether","whither"]),Gm("She has ___ a letter.","written",["wrote","write","writed"]),Gm("We ___ finished already.","have",["has","having","is"]),Gm("Neither of the books ___ torn.","is",["are","were","be"]),Gm("Which sentence has a simile?","He ran like the wind.",["He is a lion.","The wind howled.","Time flies."]),
 Sp("government",["goverment","govenment","govermant"]),Sp("environment",["enviroment","envirnment","environmant"]),Sp("library",["libary","liberry","librery"]),Sp("restaurant",["resturant","restarant","restraunt"]),
 O("The explorers crossed the frozen river at dawn."),O("Our teacher read an exciting story about pirates."),
 P("Which sentence is correct?","We bought apples, bananas, and grapes.",["We bought apples bananas and grapes.","We bought, apples bananas and grapes.","We bought apples, bananas and, grapes."]),P("Which sentence is correct?","“Where did you go?” asked Sam.",["“Where did you go.” asked Sam.","Where did you go? asked Sam.","“Where did you go?” Asked Sam."]),
 C("Every winter, Ottawa's Rideau Canal becomes the world's largest naturally frozen skating rink. Skaters glide along nearly eight kilometres of ice. Many people stop for hot chocolate and a BeaverTail.","What happens to the Rideau Canal in winter?","it becomes a skating rink",["it dries up","it becomes a road","it floods the city"]),C("Every winter, Ottawa's Rideau Canal becomes the world's largest naturally frozen skating rink. Skaters glide along nearly eight kilometres of ice. Many people stop for hot chocolate and a BeaverTail.","About how long is the skating route?","nearly eight kilometres",["two kilometres","eighty kilometres","eight metres"]),
 C("A caterpillar eats leaves until it is big. Then it forms a chrysalis. Inside, it changes. Weeks later, a butterfly comes out.","What comes out at the end?","a butterfly",["a moth","a beetle","a leaf"]),C("A caterpillar eats leaves until it is big. Then it forms a chrysalis. Inside, it changes. Weeks later, a butterfly comes out.","What does the caterpillar do inside the chrysalis?","it changes",["it eats more leaves","it flies away","it sleeps forever"])],
5:[S("meticulous","careful",["careless","loud","quick"]),S("abundant","plentiful",["rare","small","silent"]),S("diligent","hardworking",["lazy","angry","clumsy"]),S("hinder","block",["help","guide","carry"]),
 A("hostile","friendly",["angry","distant","loud"]),A("temporary","permanent",["short","brief","quick"]),A("mandatory","optional",["required","strict","urgent"]),A("ignite","extinguish",["light","burn","spark"]),
 Gm("If I ___ you, I would study.","were",["was","am","be"]),Gm("She is the ___ student in class.","smartest",["smarter","most smart","smartist"]),Gm("He ___ the race despite the rain.","won",["win","winned","wins"]),Gm("Between you and ___, it's a secret.","me",["I","myself","mine"]),Gm("To ___ did you give the book?","whom",["who","whose","who's"]),Gm("Which word is the adverb? “She spoke softly.”","softly",["She","spoke","the"]),
 Sp("occurrence",["occurence","ocurrence","occurance"]),Sp("embarrass",["embarass","embarras","embarrasse"]),Sp("accommodate",["accomodate","acommodate","acomodate"]),Sp("definitely",["definately","definitly","defanitely"]),
 O("Despite the heavy rain, the festival continued all evening."),O("The scientist carefully recorded every result in her notebook."),
 P("Which sentence is correct?","I like pizza; my sister prefers pasta.",["I like pizza, my sister prefers pasta.","I like pizza my; sister prefers pasta.","I like, pizza my sister prefers pasta."]),P("Which sentence is correct?","It's a beautiful day.",["Its a beautiful day.","It's a beautiful day","Its' a beautiful day."]),
 C("Plants make their own food through photosynthesis. Their leaves absorb sunlight, take in carbon dioxide from the air, and use water from the soil. The plant produces sugar for energy and releases oxygen.","What do plants release?","oxygen",["carbon dioxide","sunlight","soil"]),C("Plants make their own food through photosynthesis. Their leaves absorb sunlight, take in carbon dioxide from the air, and use water from the soil. The plant produces sugar for energy and releases oxygen.","What do leaves absorb?","sunlight",["oxygen","sugar","soil"]),
 C("Marco wanted to join the school orchestra. At first his violin squeaked, and he almost quit. But he practiced every day for a month. At the concert, his solo made the audience clap.","Why did Marco almost quit?","his violin squeaked",["he lost the violin","he hated music","the concert was cancelled"]),C("Marco wanted to join the school orchestra. At first his violin squeaked, and he almost quit. But he practiced every day for a month. At the concert, his solo made the audience clap.","What helped Marco improve?","practicing every day",["buying a new violin","skipping the concert","playing louder"])],
6:[S("ambiguous","unclear",["obvious","careful","loud"]),S("benevolent","kind",["cruel","shy","greedy"]),S("scrutinize","examine",["ignore","praise","hide"]),S("candid","honest",["secretive","rude","shy"]),
 A("frugal","wasteful",["thrifty","careful","poor"]),A("verbose","concise",["wordy","polite","loud"]),A("rigid","flexible",["stiff","strong","cold"]),A("obscure","obvious",["hidden","dark","strange"]),
 Gm("Which sentence uses a metaphor?","Her smile was sunshine.",["She smiled like the sun.","She smiled brightly.","She smiled at me."]),Gm("The storm will ___ our plans.","affect",["effect","affection","affective"]),Gm("The ___ of the experiment surprised us.","effect",["affect","affects","affected"]),Gm("___ jacket is this?","Whose",["Who's","Whos","Who"]),Gm("There are ___ cookies left.","fewer",["less","lesser","little"]),Gm("The list of items ___ long.","is",["are","were","be"]),Gm("“The ball was thrown by Ana.” This sentence is in…","passive voice",["active voice","a question","a command"]),
 Sp("bureaucracy",["beaurocracy","bureacracy","buerocracy"]),Sp("rhythm",["rythm","rhythem","rhythym"]),Sp("privilege",["priviledge","privelege","privilige"]),Sp("pronunciation",["pronounciation","pronunsiation","pronunciashun"]),
 O("Although it was late, the team continued practicing under the lights."),O("The author uses vivid imagery to bring the setting to life."),
 P("Which sentence uses a colon correctly?","You will need three things: paper, pencils, and a ruler.",["You will need three things paper, pencils, and a ruler.","You will need: three things paper pencils and a ruler.","You will: need three things, paper pencils, and a ruler."]),P("Which sentence is correct?","“I'm ready,” she said, “let's begin.”",["“I'm ready” she said “let's begin.”","“I'm ready,” she said “let's begin”.","I'm ready, she said, let's begin."]),
 C("In 1915, Dr. John McCrae, a Canadian soldier and physician, wrote the poem “In Flanders Fields.” The poem uses poppies to honour fallen soldiers, and today poppies are worn in Canada each November.","Why do Canadians wear poppies in November?","to honour fallen soldiers",["to celebrate summer","to welcome spring","to support farmers"]),C("In 1915, Dr. John McCrae, a Canadian soldier and physician, wrote the poem “In Flanders Fields.” The poem uses poppies to honour fallen soldiers, and today poppies are worn in Canada each November.","Who wrote the poem?","Dr. John McCrae",["a farmer","a teacher","a French poet"]),
 C("Scientists studying coral reefs found that warmer oceans cause corals to lose their colour, a process called bleaching. Bleached corals are not dead, but they are weak and may starve.","What causes bleaching?","warmer ocean water",["colder water","too many fish","loud noise"]),C("Scientists studying coral reefs found that warmer oceans cause corals to lose their colour, a process called bleaching. Bleached corals are not dead, but they are weak and may starve.","Are bleached corals dead?","not necessarily",["yes, always","no, they are stronger","they turn into rocks"])]
};
/* ---- Reading additions mapped to Ontario Language (2023) expectations ---- */
(function(){
const T=(g,q,a,w,ex,sk,extra)=>{const o=Object.assign({t:'mc',q,a:String(a),choices:shuffle([String(a),...w.map(String)].slice(0,4)),ex:'L:'+ex,sk:sk||'LB'},extra||{});return o;};
const add=(g,arr)=>arr.forEach(x=>READ[g].push(x));
/* parts of speech: [sentence, word, class] */
const POS={
 low:[['The dog runs fast.','dog','noun'],['The dog runs fast.','runs','verb'],['A big cat sat down.','big','adjective'],['A big cat sat down.','cat','noun'],['Birds sing in the tree.','sing','verb'],['I see a red ball.','red','adjective'],['Mom bakes bread.','bakes','verb'],['Mom bakes bread.','bread','noun']],
 mid:[['The tiny kitten crept quietly.','tiny','adjective'],['The tiny kitten crept quietly.','quietly','adverb'],['The tiny kitten crept quietly.','crept','verb'],['She gave him a gift.','She','pronoun'],['We ate lunch under the tree.','under','preposition'],['Tom and Mia laughed.','and','conjunction'],['Ben ran swiftly home.','swiftly','adverb'],['They played at the park.','They','pronoun']],
 high:[['Although it rained, we played outside.','Although','conjunction'],['The scientist carefully measured the water.','carefully','adverb'],['The scientist carefully measured the water.','scientist','noun'],['Running is good exercise.','Running','gerund'],['The book on the shelf is mine.','on','preposition'],['The students who studied passed.','who','relative pronoun'],['Our team won the game.','Our','possessive pronoun'],['She sang a beautiful song.','beautiful','adjective']]};
const posQ=(g,row)=>{const all=g<=2?['noun','verb','adjective']:(g<=4?['noun','verb','adjective','adverb','pronoun']:['noun','verb','adjective','adverb','pronoun','conjunction','preposition']);const base=['noun','verb','adjective','adverb','pronoun','preposition','conjunction'];const w=shuffle(base.filter(x=>x!==row[2])).slice(0,3);return T(g,`In “${row[0]}”, what kind of word is “${row[1]}”?`,row[2],w,'B3.2','LD');};
for(let g=1;g<=6;g++){const src=g<=2?POS.low:(g<=4?POS.mid:POS.high);const rows=g===1?POS.low.slice(0,6):src;add(g,rows.map(r=>posQ(g,r)).filter(q=>q.choices.includes(q.a)));}
/* morphemes: meaning */
const MORPH={
 1:[['un-','not'],['re-','again'],['-less','without'],['-ful','full of']],
 2:[['un-','not'],['re-','again'],['pre-','before'],['-less','without'],['-ful','full of'],['dis-','not or opposite of']],
 3:[['pre-','before'],['mis-','wrongly'],['-able','able to be'],['-er','one who'],['dis-','not or opposite of'],['sub-','under']],
 4:[['sub-','under'],['inter-','between'],['-ology','the study of'],['bi-','two'],['tri-','three'],['-able','able to be']],
 5:[['micro-','very small'],['tele-','far'],['bio-','life'],['auto-','self'],['semi-','half'],['trans-','across']],
 6:[['anti-','against'],['mega-','very large'],['hydro-','water'],['geo-','earth'],['chron-','time'],['port','carry']]};
const MW=['not','again','before','without','full of','under','between','two','far','life','self','half','across','against','water','earth','time','carry','the study of','three','very small','very large','wrongly','able to be','one who'];
for(let g=1;g<=6;g++){add(g,MORPH[g].map(m=>T(g,`What does the ${m[0].startsWith('-')?'suffix':(m[0].endsWith('-')?'prefix':'word part')} “${m[0]}” mean?`,m[1],shuffle(MW.filter(x=>x!==m[1])).slice(0,3),g===1?'B2.6':(g<=3?'B2.3':'B2.1'),'LB')));}
add(2,[T(2,'What does “unhappy” mean?','not happy',['very happy','happy again','without joy and fun'],'B2.3'),T(2,'What does “rewrite” mean?','write again',['not write','write before','write under'],'B2.3')]);
add(3,[T(3,'What does “careless” mean?','without care',['full of care','care again','not careful and kind'],'B2.3'),T(3,'What does “misread” mean?','read wrongly',['read again','not read','read before'],'B2.3')]);
add(4,[T(4,'What does “submarine” most likely mean?','under the sea',['above the sea','across the sea','a type of boat only'],'B2.1')]);
add(5,[T(5,'What does “telescope” most likely help you do?','see far things',['see tiny things','hear sounds','measure time'],'B2.1')]);
add(6,[T(6,'What does “antibiotic” most likely mean?','against life (germs)',['for life','study of life','self life'],'B2.1')]);
/* text forms and features */
const FORMS=[[1,'A story about a talking fox is…','fiction',['nonfiction','a recipe','a poster']],[1,'A book that tells true facts about whales is…','nonfiction',['fiction','a fairy tale','a song']],[2,'A set of steps to make a sandwich is a…','procedure (how-to)',['poem','fairy tale','diary']],[2,'A text with rhyming lines and a rhythm is a…','poem',['recipe','news report','map']],[3,'A true story about a person’s life, written by someone else, is a…','biography',['fable','poem','recipe']],[3,'A short story that ends with a lesson, often with animal characters, is a…','fable',['biography','news report','manual']],[4,'Which text would you read to get facts about volcanoes?','an informational article',['a fairy tale','a poem','a fable']],[4,'A story told by someone about their own life is an…','autobiography',['biography','encyclopedia','fable']],[5,'Which text form is meant to convince the reader to agree?','persuasive writing',['a recipe','a diary','a riddle']],[5,'An Indigenous oral story passed down through generations is called a…','traditional story',['news article','manual','advertisement']],[6,'Which text form presents both sides and gives evidence for a position?','an argument or editorial',['a diary entry','a limerick','a menu']],[6,'A report explains a topic using facts, headings and…','evidence from sources',['made-up characters','rhymes','jokes']]];
FORMS.forEach(f=>add(f[0],[T(f[0],f[1],f[2],f[3],'C1.2','LC')]));
const FEAT=[[1,'Which part of a book shows the title and the author’s name?','the cover',['the index','a glossary','a map']],[2,'What does a caption do?','explains a picture',['lists the chapters','gives the author’s name','shows page numbers']],[2,'A heading tells you…','what a section is about',['who wrote the book','where to buy it','how long it is']],[3,'Where would you look to find a word’s meaning at the back of a book?','the glossary',['the cover','the dedication','a caption']],[3,'Which text feature helps you find the page for a topic?','the table of contents',['a caption','a diagram','a bold word']],[4,'What is an index used for?','finding where topics are in the book',['showing pictures','explaining a map','giving the author’s name']],[4,'Why do authors use bold words?','to show important or new vocabulary',['to make text longer','to show who is talking','to end a story']],[5,'What does a diagram help the reader understand?','how parts fit together or work',['how the author feels','the plot of a story','a rhyme']],[5,'A sidebar in an article usually gives…','extra information on the topic',['the title','the main character','an ending']],[6,'What is the purpose of a timeline in an article?','to show events in order',['to compare two ideas','to explain a word','to persuade']],[6,'A graph in an informational text is used to…','present data clearly',['tell a story','show rhymes','name the author']]];
FEAT.forEach(f=>add(f[0],[T(f[0],f[1],f[2],f[3],'C1.3','LC')]));
/* point of view */
const POV=[[2,'“I walked to the store and bought milk.” Who is telling the story?','the narrator (first person)',['someone outside the story','nobody','the milk']],[2,'“She walked to the store.” This is written in…','third person',['first person','second person','no person']],[3,'“We built a fort in the yard.” This is written in…','first person',['third person','second person','past tense only']],[3,'“Max opened the door slowly.” This is written in…','third person',['first person','second person','first and third']],[4,'“You will need two eggs and a bowl.” This is written in…','second person',['first person','third person','no person']],[4,'Which sentence is told from first person?','I felt nervous before the show.',['She felt nervous before the show.','They felt nervous before the show.','Mia felt nervous before the show.']],[5,'Which point of view uses “he”, “she” and “they”?','third person',['first person','second person','plural person']],[5,'A narrator who says “I” is telling the story from…','first person',['third person','second person','an outside view']],[6,'Which sentence is told from third person?','Nina stared at the empty field.',['I stared at the empty field.','We stared at the empty field.','You stared at the empty field.']],[6,'Why might an author choose first person?','to share a character’s thoughts directly',['to use fewer words','to avoid dialogue','to make facts clearer']]];
POV.forEach(f=>add(f[0],[T(f[0],f[1],f[2],f[3],'C1.6','LC')]));
/* main idea with short passages */
const MAIN=[[1,'Bees fly from flower to flower. They collect sweet nectar. Bees make honey.','What is the passage mostly about?','bees and honey',['flowers only','a picnic','a garden gate']],[1,'Tom has a red ball. He kicks it high. Tom plays with his ball all day.','What is the passage mostly about?','Tom playing with a ball',['Tom eating lunch','a red hat','a rainy day']],[2,'Frogs start as eggs. Then they become tadpoles. Later, tadpoles grow legs and become frogs.','What is the main idea?','how a frog grows',['why frogs are green','where frogs sleep','what frogs eat']],[2,'Our class made a garden. We planted seeds, watered them, and waited. Soon, tiny plants popped up.','What is the main idea?','the class grew a garden',['the class ate lunch','plants are tall','it rained all week']],[3,'Wolves live in groups called packs. Pack members hunt together and care for the young. Each wolf has a job.','What is the main idea?','wolves work together in packs',['wolves live alone','wolves are small','wolves eat plants']],[3,'The Rideau Canal was built long ago. Today people skate on it in winter and paddle on it in summer.','What is the main idea?','the canal is used in all seasons',['the canal is dry','people dislike winter','the canal is very new']],[4,'Recycling saves resources. It keeps waste out of landfills and uses less energy than making new things. Many cities offer blue-bin programs.','What is the main idea?','recycling helps the environment',['landfills are fun','blue is a nice colour','factories are closing']],[4,'Octopuses are clever. They can open jars, solve puzzles, and escape from tanks.','What is the main idea?','octopuses are intelligent',['octopuses are slow','octopuses live in lakes','octopuses are tiny']],[5,'Many Canadian cities now have bike lanes. Cycling reduces traffic, cuts pollution, and improves health. Cities that invest in bike lanes often see more riders each year.','Which sentence best states the main idea?','bike lanes bring several benefits to cities',['bikes are faster than cars','pollution does not matter','all cities have the same lanes']],[5,'Sleep is important for students. It helps memory, mood, and focus. Without enough sleep, learning becomes harder.','Which sentence best states the main idea?','sleep supports learning',['students should stay up late','mood is unrelated to sleep','focus is a bad habit']],[6,'Coral reefs cover less than one percent of the ocean floor, yet they support about a quarter of marine species. Warming water and pollution threaten them.','Which sentence best states the main idea?','coral reefs are valuable and at risk',['reefs are found everywhere','marine species are few','ocean floors are cold']],[6,'Before electricity, people relied on candles and oil lamps. Evenings were shorter and tasks were done in daylight. Electric light changed daily life.','Which sentence best states the main idea?','electric light changed daily life',['candles were better','daylight is rare','lamps were never used']]];
MAIN.forEach(f=>add(f[0],[T(f[0],f[2],f[3],f[4],'C2.6','LC',{passage:f[1]})]));
/* phonics and rhyme (grades 1-3) */
const PH=[[1,'Which word starts with the same sound as “ship”?','shop',['chop','sip','top'],'B2.3'],[1,'Which word starts with the same sound as “chip”?','chair',['shirt','ship','pig'],'B2.3'],[1,'Which word has the short a sound, as in “cat”?','map',['mop','mud','mat-less'.slice(0,0)||'mean'],'B2.4'],[1,'Which word rhymes with “cake”?','lake',['lock','kick','cook'],'C3.1'],[1,'Which word rhymes with “bat”?','hat',['bit','but','bag'],'C3.1'],[1,'Which word sounds like a bee buzzing?','buzz',['moo','roar','pop'],'C3.1'],[2,'Which word has the long a sound, as in “rain”?','train',['trap','trim','tram'],'B2.1'],[2,'Which word has the /th/ sound?','thumb',['tub','sum','fun'],'B2.1'],[2,'Which words rhyme?','light, night',['light, lift','night, nest','light, late'],'C3.1'],[2,'Which sentence uses alliteration?','Sally sells seashells.',['The cat sat on the mat.','I like to read books.','We went to the park.'],'C3.1'],[3,'Which word has the same vowel sound as “boat”?','coat',['cot','cut','cat'],'B2.1'],[3,'Which word has a silent letter?','knee',['kite','kick','keep'],'B2.2'],[3,'Which sentence has onomatopoeia?','The bees buzzed around the flowers.',['The bees flew around the flowers.','Bees live in hives.','Flowers are colourful.'],'C3.1']];
PH.forEach(f=>{const q=T(f[0],f[1],f[2],f[3].filter(x=>x),f[4],f[4]==='C3.1'?'LC':'LB');add(f[0],[q]);});
/* capitalization & punctuation */
const CP=[[1,'Which sentence starts correctly?','The sun is hot.',['the sun is hot.','THE sun is hot.','the Sun is hot.']],[1,'Which sentence ends correctly?','Where is my hat?',['Where is my hat.','Where is my hat','where is my hat']],[2,'Which sentence has the correct capital letters?','Maya lives in Ottawa.',['maya lives in ottawa.','Maya lives in ottawa.','maya Lives in Ottawa.']],[2,'Which sentence is punctuated correctly?','We saw a dog, a cat, and a bird.',['We saw a dog a cat and a bird.','We saw, a dog a cat and a bird.','We saw a dog, a cat and, a bird.']],[3,'Which sentence uses an apostrophe correctly?','That is Ben’s coat.',['That is Bens’ coat.','That is Ben’s’ coat.','That is Bens coat’.']],[3,'Which uses quotation marks correctly?','“Come here,” said Mom.',['Come here, “said Mom.”','“Come here, said Mom.”','Come “here,” said Mom.']],[4,'Which sentence is correct?','My sister, who is ten, loves soccer.',['My sister who is ten, loves soccer.','My sister, who is ten loves soccer.','My, sister who is ten, loves soccer.']],[5,'Which sentence uses a comma correctly after an introductory phrase?','After lunch, we played outside.',['After lunch we, played outside.','After, lunch we played outside.','After lunch we played, outside.']],[6,'Which sentence uses a semicolon correctly?','I studied hard; the test was easy.',['I studied; hard the test was easy.','I studied hard the test; was easy.','I; studied hard the test was easy.']]];
CP.forEach(f=>add(f[0],[T(f[0],f[1],f[2],f[3],'B3.3','LD')]));
})();
function genRead(g,n){return shuffle(READ[g]).slice(0,n).map(q=>JSON.parse(JSON.stringify(q)).t==='ord'?ord(q.q,q.full):Object.assign({},q,{choices:shuffle(q.choices)}));}
/* ---------------- LOGIC ---------------- */
const SHAPES=[["🔴","🔵","🟢","🟡"],["🐶","🐱","🐭","🐰"],["⭐","🌙","☀️","☁️"],["🍎","🍌","🍇","🍊"]];
function numPattern(g,d){const hard=g>=5||(g>=3&&d>=2);const types=['add','sub'];if(g>=2)types.push('alt');if(g>=3)types.push('mul');if(g>=4)types.push('sq','tri');if(g>=5)types.push('fib');const ty=pick(types);let seq=[],ans;
 if(ty==='add'){const s=ri(1,20),k=g<=1?pick([1,2,3,5,10]):ri(2,hard?9:5);for(let i=0;i<6;i++)seq.push(s+i*k);}
 else if(ty==='sub'){const k=g<=1?pick([1,2,3,5,10]):ri(2,hard?9:5);const s=Math.max(g<=1?ri(30,50):ri(40,90),k*5+3);for(let i=0;i<6;i++)seq.push(s-i*k);}
 else if(ty==='mul'){const k=pick([2,3]),s=ri(1,4);for(let i=0;i<6;i++)seq.push(s*Math.pow(k,i));}
 else if(ty==='alt'){const a=ri(2,5),b=ri(1,3);let v=ri(1,10);for(let i=0;i<6;i++){seq.push(v);v+=i%2?b:a;}}
 else if(ty==='sq'){const o=ri(0,3);for(let i=1;i<=6;i++)seq.push((i+o)*(i+o));}
 else if(ty==='tri'){let v=0;for(let i=1;i<=6;i++){v+=i;seq.push(v);}}
 else{let a=ri(1,3),b=ri(1,4);seq=[a,b];while(seq.length<6)seq.push(seq[seq.length-1]+seq[seq.length-2]);}
 const show=seq.slice(0,5);ans=seq[5];
 const hint={add:'The numbers go up by the same amount each time.',sub:'The numbers go down by the same amount each time.',mul:'Each number is multiplied to get the next.',alt:'Two different jumps take turns.',sq:'Think about square numbers.',tri:'The jump gets bigger by 1 each time.',fib:'Add the two numbers before it.'}[ty];
 return mc(`What number comes next?\n${show.join(', ')}, ?`,ans,numChoices(ans,[seq[4]+1,seq[4]*2],0),{explain:hint});}
function shapePattern(g,d){const set=pick(SHAPES);const [a,b,c]=shuffle(set);const pats=[[a,b,a,b,a,b],[a,a,b,a,a,b],[a,b,c,a,b,c],[a,b,b,a,b,b]];const p=pick(g<3?pats.slice(0,3):pats);const ans=p[5];const wrong=set.filter(x=>x!==ans);return mc(`What comes next?\n${p.slice(0,5).join(' ')} ?`,ans,wrong,{explain:'Look for the part that repeats.',big:true});}
const ODD=[[["🍎","🍌","🍇","🚗"],"🚗","The car is not a fruit."],[["dog","cat","cow","car"],"car","A car is not an animal."],[["red","blue","green","chair"],"chair","A chair is not a colour."],[["2","4","6","9"],"9","9 is odd. The others are even."],[["triangle","square","circle","apple"],"apple","An apple is not a shape."],[["Monday","Friday","July","Sunday"],"July","July is a month. The rest are days."],[["3","6","9","10"],"10","10 is not in the 3 times table."],[["spoon","fork","knife","pillow"],"pillow","A pillow is not cutlery."],[["canoe","boat","ship","bicycle"],"bicycle","A bicycle is not on water."],[["12","15","18","20"],"20","20 is not a multiple of 3."],[["Ottawa","Toronto","Paris","Montreal"],"Paris","Paris is not in Canada."],[["whale","shark","dolphin","trout"],"whale","Hmm, think about which are fish or mammals."]];
function oddOne(){const o=pick(ODD.slice(0,11));return mc("Which one does not belong?",o[1],o[0].filter(x=>x!==o[1]),{explain:o[2]});}
function deduce(g,d){const n=(g<=2)?3:(g<=4?4:5);const people=shuffle(NAMES).slice(0,n);const attr=pick([["taller","tallest","shortest"],["older","oldest","youngest"],["faster","fastest","slowest"]]);const clues=[];for(let i=0;i<n-1;i++)clues.push(`${people[i]} is ${attr[0]} than ${people[i+1]}.`);const askTop=Math.random()<.5;return mc(`${shuffle(clues).join(' ')}\nWho is the ${askTop?attr[1]:attr[2]}?`,askTop?people[0]:people[n-1],people.filter(p=>p!==(askTop?people[0]:people[n-1])).slice(0,3),{explain:'Line everyone up from first to last.'});}
function numRiddle(g,d){const N=g<=2?20:(g<=4?60:100);const nums=[...Array(N).keys()].map(i=>i+1);const n=ri(Math.floor(N/4),N);const dsum=x=>String(x).split('').reduce((s,c)=>s+ +c,0);
 const pool=[[`I am even.`,x=>x%2===0,n%2===0],[`I am odd.`,x=>x%2===1,n%2===1],[`I am more than ${n-ri(3,8)}.`,null,null],[`I am less than ${n+ri(3,8)}.`,null,null],[`I am a multiple of ${[2,3,5,4].filter(k=>n%k===0)[0]||1}.`,null,null],[`My digits add up to ${dsum(n)}.`,x=>dsum(x)===dsum(n),true]];
 let cand=nums,clues=[];const preds=[];
 const mk=[()=>{const lo=n-ri(3,8);return [`I am more than ${lo}.`,x=>x>lo]},()=>{const hi=n+ri(3,8);return [`I am less than ${hi}.`,x=>x<hi]},()=>{const k=[2,3,4,5].filter(k=>n%k===0);if(!k.length)return null;const kk=pick(k);return [`I am a multiple of ${kk}.`,x=>x%kk===0]},()=>[n%2===0?'I am even.':'I am odd.',x=>x%2===n%2],()=>[`My digits add up to ${dsum(n)}.`,x=>dsum(x)===dsum(n)]].slice(0,g>=4?5:4);
 let tries=0;while(cand.length>1&&tries++<40){const c=pick(g>=4?mk:mk.slice(0,4))();if(!c)continue;if(clues.includes(c[0]))continue;const nc=cand.filter(c[1]);if(nc.length<cand.length&&nc.includes(n)){cand=nc;clues.push(c[0]);}}
 if(cand.length>1||clues.length>6)return null;return num(`Who am I?\n${clues.join('\n')}`,n,{explain:'Cross out numbers that do not fit each clue.'});}
const RID=[["I have hands but I cannot clap. What am I?","a clock",1],["What has four legs but cannot walk?","a table",1],["What gets wetter the more it dries?","a towel",1],["What goes up but never comes down?","your age",1],["I have keys but no locks. What am I?","a keyboard",1],["What has a ring but no finger?","a phone",1],["What has to be broken before you can use it?","an egg",2],["The more you take, the more you leave behind. What am I?","footsteps",2],["What can travel around the world while staying in a corner?","a stamp",2],["What has many teeth but cannot bite?","a comb",2],["What can you catch but not throw?","a cold",2],["What has an eye but cannot see?","a needle",2]];
function riddle(g){const pool=RID.filter(r=>g<=2?r[2]===1:(g<=4?true:r[2]===2||Math.random()<.3));const r=pick(pool);const wr=shuffle(RID.filter(x=>x[1]!==r[1])).slice(0,3).map(x=>x[1]);return mc(r[0],r[1],wr);}
const ANA=[["Hot is to cold as up is to ___","down",["over","high","warm"]],["Bird is to fly as fish is to ___","swim",["walk","climb","sing"]],["Day is to night as summer is to ___","winter",["sunny","hot","July"]],["Finger is to hand as toe is to ___","foot",["shoe","leg","sock"]],["Puppy is to dog as kitten is to ___","cat",["mouse","lion","bird"]],["Pen is to write as scissors are to ___","cut",["paper","draw","glue"]]];
function analogy(){const a=pick(ANA);return mc(a[0],a[1],a[2]);}
function genLogic(g,d,n){const fns=[()=>numPattern(g,d),()=>numPattern(g,d),()=>shapePattern(g,d),()=>oddOne(),()=>deduce(g,d),()=>numRiddle(g,d),()=>riddle(g),()=>analogy(),()=>numPattern(g,d)];const out=[];let guard=0;while(out.length<n&&guard++<200){const q=pick(fns)();if(!q)continue;if(out.some(o=>o.q===q.q))continue;if(q.t==='mc'&&(q.choices.length<4||!q.choices.includes(q.a)))continue;out.push(q);}return out;}
/* ---------------- MATCH PAIRS ---------------- */
const NW=[["2","two"],["3","three"],["4","four"],["5","five"],["6","six"],["7","seven"],["8","eight"],["9","nine"],["10","ten"],["12","twelve"]];
const ANT=[["hot","cold"],["up","down"],["day","night"],["happy","sad"],["big","small"],["fast","slow"],["wet","dry"],["open","shut"],["old","new"],["loud","quiet"]];
const SYN3=[["enormous","huge"],["rapid","quick"],["courageous","brave"],["tidy","neat"],["ancient","old"],["difficult","hard"],["glad","happy"],["tiny","small"]];
const SYN5=[["meticulous","careful"],["abundant","plentiful"],["diligent","hardworking"],["candid","honest"],["benevolent","kind"],["ambiguous","unclear"],["frugal","thrifty"],["scrutinize","examine"]];
const FD=[["1/2","0.5"],["1/4","0.25"],["3/4","0.75"],["1/5","0.2"],["1/10","0.1"],["2/5","0.4"],["4/5","0.8"]];
const FP=[["1/2","50%"],["1/4","25%"],["3/4","75%"],["1/5","20%"],["1/10","10%"],["2/5","40%"],["4/5","80%"]];
const SH=[["triangle","3 sides"],["square","4 sides"],["pentagon","5 sides"],["hexagon","6 sides"],["octagon","8 sides"],["circle","0 sides"]];
const RM=[["IV","4"],["IX","9"],["XII","12"],["XV","15"],["XX","20"],["XL","40"],["VII","7"]];
function pairQ(g,subj){let src;
 if(subj==='math'){if(g===1)src=NW;else if(g===2){const ns=shuffle([3,4,5,6,7,8,9,10,12,15]).slice(0,4);src=ns.map(n=>[String(n),String(n*2)]);}
  else if(g===3){const ms=shuffle([[3,4],[6,7],[5,8],[9,3],[7,8],[4,6],[2,9]]).slice(0,4);src=ms.map(m=>[m[0]+" × "+m[1],String(m[0]*m[1])]);}
  else if(g===4)src=FD;else if(g===5)src=FP;else{const ps=shuffle([[10,70],[25,40],[50,30],[20,25],[75,8],[10,200]]).slice(0,4);src=ps.map(p=>[p[0]+"% of "+p[1],String(p[0]*p[1]/100)]);}}
 else if(subj==='read')src=g<=2?ANT:(g<=4?SYN3:SYN5);
 else src=g<=3?SH:RM;
 const pairs=shuffle(src).slice(0,4);if(pairs.length<4)return null;
 const type=subj==='read'&&g<=2?'Match the opposites.':(subj==='read'?'Match the words that mean the same.':'Match each pair.');
 return {t:'pair',q:type,pairs,left:shuffle(pairs.map(p=>p[0])),right:shuffle(pairs.map(p=>p[1])),a:pairs.map(p=>p[0]+' = '+p[1]).join(', ')};}

/* ---------------- LITTLE LEAPERS (Pre-K / K): audio-first pre-reader content ---------------- */
const ABC='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const PIC={A:['apple','🍎'],B:['bear','🐻'],C:['cat','🐱'],D:['dog','🐶'],E:['egg','🥚'],F:['fish','🐟'],G:['goat','🐐'],H:['hat','🎩'],I:['ice cream','🍦'],J:['juice','🧃'],K:['kite','🪁'],L:['lion','🦁'],M:['moon','🌙'],N:['nut','🥜'],O:['octopus','🐙'],P:['pig','🐷'],Q:['queen','👑'],R:['rabbit','🐰'],S:['sun','☀️'],T:['tiger','🐯'],U:['umbrella','☂️'],V:['van','🚐'],W:['whale','🐳'],Z:['zebra','🦓']};
const PHON={B:'buh',C:'kuh',D:'duh',F:'fff',G:'guh',H:'huh',J:'juh',K:'kuh',L:'lll',M:'mmm',N:'nnn',P:'puh',R:'rrr',S:'sss',T:'tuh',V:'vvv',W:'wuh',Z:'zzz'};
const SOUNDSET='BCDFGHJKLMNPRSTVWZAEOU'.split('').filter(l=>PIC[l]);
const sameSnd=(a,b)=>a===b||(a==='C'&&b==='K')||(a==='K'&&b==='C');
const CVC=[['cat','🐱'],['dog','🐶'],['pig','🐷'],['sun','☀️'],['hat','🎩'],['bus','🚌'],['bed','🛏️'],['box','📦'],['fox','🦊'],['log','🪵'],['pen','🖊️'],['van','🚐'],['web','🕸️'],['ant','🐜'],['bat','🦇'],['bug','🐛'],['rat','🐀'],['cap','🧢'],['map','🗺️']];
const RHYME=[[['cat','🐱'],['hat','🎩'],['bat','🦇']],[['dog','🐶'],['log','🪵'],['frog','🐸']],[['bee','🐝'],['tree','🌳'],['key','🔑']],[['star','⭐'],['car','🚗']],[['mouse','🐭'],['house','🏠']],[['fish','🐟'],['dish','🍽️']],[['boat','⛵'],['coat','🧥']],[['cake','🎂'],['snake','🐍']],[['bear','🐻'],['chair','🪑']]];
const SIGHT=['the','and','I','a','to','is','you','it','we','see','like','go','my','can','look','me','he','she','are','was','said','in','on','up'];
const SENT=['I see a cat.','The dog can run.','We like the sun.','I can see a bug.','The pig is big.','I go to bed.','A fox can run.','The bus is red.','I like my hat.','Look at the bat.'];
const bigl=t=>`<div class="bigl">${t}</div>`;
const spoken=a=>a.join(', ');
function kmc(q,say,a,wrongs,o){a=String(a);const w=uniq(wrongs.map(String)).filter(x=>x!==a);return Object.assign({t:'mc',q,say,a,choices:shuffle([a,...w.slice(0,3)]),big:true,k:1},o||{});}
const lower=l=>l.toLowerCase();
const others=(pool,not,n)=>shuffle(pool.filter(x=>x!==not)).slice(0,n);
function kLetterPool(d){return ABC.slice(0,d<1?8:(d<2?16:26)).split('');}
const KABC=[
 d=>{const P=kLetterPool(d),l=pick(P);return kmc(`Tap the letter ${l}`,`Find the letter ${l}.`,l,others(P,l,3),{after:`${l}. That's the letter ${l}.`});},
 d=>{const P=kLetterPool(d),l=pick(P);return kmc('What letter is this?','What letter is this?',l,others(P,l,3),{svg:bigl(l),after:`${l}. That's the letter ${l}.`});},
 d=>{const P=kLetterPool(Math.max(1,d)),l=pick(P);return kmc('Find the big letter.','Find the big letter that matches the little letter.',l,[...others(['B','D','P','Q','R','M','N','H','U','V'],l,3)],{svg:bigl(lower(l)),after:`${lower(l)} is the little ${l}.`});},
 d=>{const P=kLetterPool(Math.max(1,d)),l=pick(P);return kmc('Find the little letter.','Find the little letter that matches the big letter.',lower(l),others(['b','d','p','q','r','m','n','h','u','v'],lower(l),3),{svg:bigl(l),after:`${l} is the big ${lower(l)}.`});},
 d=>{const P=ABC.split('').filter(l=>PIC[l]),l=pick(P.slice(0,d<1?10:P.length)),w=PIC[l];return kmc(`${w[1]} starts with…`,`${w[0]} starts with which letter?`,l,others(P,l,3),{svg:bigl(w[1]),after:`${w[0]} starts with ${l}.`});},
 d=>{const i=ri(0,d<2?7:22);const seq=ABC.slice(i,i+3).split('');const l=seq[2];return kmc('What comes next?','What letter comes next?',l,others(kLetterPool(3),l,3),{svg:bigl(seq.slice(0,2).join(' ')+' _'),after:`${seq.join(', ')}.`});},
 d=>{const i=ri(0,22);const seq=ABC.slice(i,i+3).split('');const l=seq[1];return kmc('What is missing?','Which letter is missing?',l,others(kLetterPool(3),l,3),{svg:bigl(seq[0]+' _ '+seq[2]),after:`${seq.join(', ')}.`});}
];
const KABC_W=[[0,1,2],[0,1,2,3,4],[1,2,3,4,5,6],[2,3,4,5,6]];
function genKAbc(d,n){const idx=KABC_W[Math.min(3,d)];const out=[];for(let i=0;i<n;i++)out.push(KABC[idx[i%idx.length]](d));return shuffle(out);}
const KSND=[
 d=>{const L=SOUNDSET,l=pick(L),w=PIC[l];const wr=shuffle(L.filter(x=>!sameSnd(x,l))).slice(0,3).map(x=>PIC[x]);const names=[w,...wr];const sh=shuffle(names);
  return kmc(`Starts with ${l}?`,`Which picture starts with the letter ${l}?`,w[1],wr.map(x=>x[1]),{svg:bigl(l),after:`${l}. ${w[0]}. ${l} says ${PHON[l]||l}.`,pics:1});},
 d=>{const g=pick(RHYME),a=g[0],b=g[1],wr=shuffle(RHYME.filter(x=>x!==g)).slice(0,3).map(x=>pick(x));return kmc(`What rhymes with ${a[0]}?`,`Which one rhymes with ${a[0]}?`,b[1],wr.map(x=>x[1]),{svg:bigl(a[1]),after:`${a[0]} and ${b[0]} rhyme.`,pics:1});},
 d=>{const l=pick(SOUNDSET.filter(x=>PHON[x])),w=PIC[l];return kmc(`${l} says…`,`The letter ${l} says ${PHON[l]}. Which one starts with ${PHON[l]}?`,w[1],shuffle(SOUNDSET.filter(x=>!sameSnd(x,l))).slice(0,3).map(x=>PIC[x][1]),{svg:bigl(l),after:`${l} says ${PHON[l]}, like ${w[0]}.`,pics:1});},
 d=>{const c=pick(CVC),wr=others(CVC.map(x=>x[1]),c[1],3);return kmc('Blend the sounds.',`Let's blend the sounds. ${c[0].split('').join(', ')}. What word is it?`,c[1],wr,{svg:bigl(c[0].split('').join(' ')),after:`${c[0].split('').join(', ')}. ${c[0]}!`,pics:1});}
];
const KSND_W=[[0,2],[0,1,2],[0,1,2,3],[1,2,3]];
function genKSound(d,n){const idx=KSND_W[Math.min(3,d)];const out=[];for(let i=0;i<n;i++)out.push(KSND[idx[i%idx.length]](d));return shuffle(out);}
const KWRD=[
 d=>{const c=pick(CVC),wr=others(CVC.map(x=>x[1]),c[1],3);return kmc('Which picture is this word?','Read the word. Which picture matches?',c[1],wr,{svg:bigl(c[0]),after:`${c[0]}. That says ${c[0]}.`,pics:1});},
 d=>{const c=pick(CVC),near=others(CVC.map(x=>x[0]),c[0],3);return kmc(`Tap the word ${c[0]}`,`Tap the word ${c[0]}.`,c[0],near,{svg:bigl(c[1]),after:`${c[0]}.`});},
 d=>{const w=pick(SIGHT);return kmc(`Tap the word "${w}"`,`Tap the word ${w}.`,w,others(SIGHT,w,3),{svg:bigl(w),after:`${w}.`});},
 d=>{const c=pick(CVC);return {t:'ord',q:'Spell the word.',say:`Spell the word ${c[0]}. Put the letters in order.`,words:shuffle(c[0].split('')),a:c[0].split('').join(' '),end:'',full:c[0].toUpperCase(),svg:bigl(c[1]),big:true,k:1,after:`${c[0].split('').join(', ')}. ${c[0]}!`};},
 d=>{const s=pick(SENT);const o=ord('Build the sentence.',s,{say:'Put the words in order to make a sentence.',k:1,after:s});return o;}
];
const KWRD_W=[[0,1,2],[0,1,2,1],[0,2,3,1,3],[3,4,2,3,4]];
function genKWords(d,n){const idx=KWRD_W[Math.min(3,d)];const out=[];for(let i=0;i<n;i++)out.push(KWRD[idx[i%idx.length]](d));return shuffle(out);}
const TR_A=['L','I','T','H','E','F','O','C'],TR_B=['A','V','W','X','Y','Z','N','M','K','U','J','D','P','B','R','S','G','Q'],TR_L=['l','i','t','o','c','a','e','s','u','v','w','n','m','h','r','b','d','p','g'];
const TR_N=['1','2','3','4','5','6','7','8','9','0'];
function trq(g,txt,say){return {t:'trace',q:txt,say,a:g,glyph:g,k:1,after:say?'':''};}
function genKWrite(d,n){const pool=d<1?TR_A:(d<2?TR_A.concat(TR_B.slice(0,8)):(d<3?TR_B.concat(TR_L.slice(0,8)):TR_L.concat(TR_N)));const out=[];const used=new Set();
 while(out.length<n){const g=pick(pool);if(used.has(g)&&used.size<pool.length)continue;used.add(g);const isN=/\d/.test(g),isLow=/[a-z]/.test(g);out.push(trq(g,`Trace the ${isN?'number':'letter'} ${g}`,`Trace the ${isN?'number':(isLow?'little letter':'big letter')} ${g}. Follow the gray shape with your finger.`));}
 if(d>=2){out[out.length-1]={t:'trace',q:'Trace your name!',say:'Trace your name! Follow the gray letters with your finger.',a:'{NAME}',glyph:'{NAME}',k:1,name:1};}
 return out;}
function genK(subject,d,n){return subject==='abc'?genKAbc(d,n):(subject==='sound'?genKSound(d,n):(subject==='words'?genKWords(d,n):genKWrite(d,n)));}
function makeLesson(g,subject,d){if(g===0){const n=subject==='write'?6:8;const out=[],seen=new Set();for(let t=0;t<8&&out.length<n;t++){genK(subject,d,n*2).forEach(q=>{const k=q.q+(q.svg||'')+q.a;if(!seen.has(k)&&out.length<n){seen.add(k);out.push(q)}})}return out;}const L=subject==='math'?genMath(g,d,8):(subject==='read'?genRead(g,8):genLogic(g,d,8));const pq=pairQ(g,subject);if(pq&&L.length>=4)L.splice(3,1,pq);return L;}
/* ---- Ontario curriculum strand tagging (strand level, Math 2020 / Language 2023 / Kindergarten) ---- */
const STRANDS={
MA:['Mathematical thinking & processes','Math A'],MB1:['Number sense','Math B1'],MB2:['Operations','Math B2'],MC1:['Patterns','Math C1'],MC2:['Equations & unknowns','Math C2'],
MD1:['Data literacy','Math D1'],MD2:['Probability','Math D2'],ME1:['Geometry & spatial reasoning','Math E1'],ME2:['Measurement','Math E2'],MF1:['Financial literacy','Math F1'],
LB:['Foundations of language (word study & vocabulary)','Language B'],LC:['Comprehension (reading)','Language C'],LD:['Composition (sentences & conventions)','Language D'],KL:['Kindergarten: language & literacy','Kindergarten']};
function strandOf(q,subject){
 if(subject==='abc'||subject==='sound'||subject==='words'||subject==='write')return 'KL';
 const t=String(q.q||'');
 if(subject==='read'){if(q.passage)return 'LC';if(q.t==='ord')return 'LD';if(/spelled|opposite|means the same|same as|synonym|meaning/i.test(t))return 'LB';return 'LD';}
 if(subject==='logic'){if(/pattern|next|sequence|what comes|missing/i.test(t))return 'MC1';if(/riddle|I am a number|number am I/i.test(t))return 'MB1';return 'MA';}
 if(/chance|likely|probab|impossible|certain|spinner|die\b/i.test(t))return 'MD2';
 if(/\$|¢|cents|dollar|toonie|loonie|HST|change do you/i.test(t))return 'MF1';
 if(/mean\b|median|mode\b|average|favourite|graph|tally|which has more|how many more .* than/i.test(t)&&!/\d+\s*[+×÷]/.test(t))return 'MD1';
 if(/perimeter|area|volume|minutes|hours?\b|\bh\b|clock|time is it|starts at|lasts|\bcm\b|\bmm\b|\bkg\b|\bmL\b|\bL\b|\bm\b|=\s*\?\s*(cm|mm|g|mL)/i.test(t))return 'ME2';
 if(/sides|corners|faces|angle|symmetr|triangle|square|rectangle|circle|coordinate|grid|\(\d+, \d+\)/i.test(t))return 'ME1';
 if(/skip count|pattern|sequence/i.test(t))return 'MC1';
 if(/\bx\b|\?\s*=\s*\d|[+−]\s*\?\s*=|\d\s*[+−×÷]\s*\?/.test(t))return 'MC2';
 if(/[+−×÷]|gives|more\.|left|in all|each|packs|boxes|double|cost|remainder|\^|[²³⁴⁵]/i.test(t))return 'MB2';
 return 'MB1';
}
/* ---- Ontario specific-expectation tagging (closest expectation; null = beyond / outside the grade's expectations) ---- */
function exOf(q,g,subject){
 const t=String(q.q||''),nums=(t.match(/\d+(?:\.\d+)?/g)||[]).map(Number),mx=nums.length?Math.max.apply(null,nums):0;
 const M=c=>'M:'+c,Lg=c=>'L:'+c;
 if(g<1||g>6)return null;
 if(subject==='read'){
  if(q.passage){if(/main idea|mostly about|best title|is this (story|passage|text) about/i.test(t))return Lg('C2.6');if(/why|infer|probably|suggest|feel|likely|lesson|moral/i.test(t))return Lg('C3.2');if(/metaphor|simile|imagery/i.test(t))return Lg('C3.1');return Lg('C1.1');}
  if(q.t==='ord')return Lg('B3.1');
  if(/spelled/i.test(t))return g===1?Lg('B2.5'):(g<=3?Lg('B2.2'):Lg('D2.6'));
  if(/opposite|means the same|synonym/i.test(t))return g===1?Lg('B2.7'):(g<=3?Lg('B2.4'):Lg('B2.2'));
  if(/metaphor|simile|figurative/i.test(t))return Lg('C3.1');
  if(/correct|punctuat|capital|comma|apostrophe|colon|semicolon|quotation/i.test(t))return Lg('B3.3');
  return Lg('B3.2');
 }
 if(subject==='logic'){if(/pattern|next|sequence|what comes|missing/i.test(t))return M('C1.3');return null;}
 if(subject!=='math')return null;
 const mon=/\$|¢|cents|dollar|toonie|loonie|change do you|HST/i.test(t);
 if(/chance|likely|probab|impossible|certain|spinner|die\b|flipping/i.test(t)){if(/probability/i.test(t))return g>=5?M('D2.1'):null;return g<=4?M('D2.1'):null;}
 if(mon){
  if(/HST/.test(t))return g===5?M('F1.2'):null;
  if(/nearest 5¢/.test(t))return null;
  if(/change do you/.test(t))return g===3?M('F1.1'):(g===4?M('F1.2'):(g===5?M('F1.2'):null));
  if(/cost|\$/.test(t)&&/pens|apples cost|What does/i.test(t))return g===5?M('F1.2'):(g===6?M('B2.12'):null);
  if(/toonie|loonie|cents|¢|dollars/.test(t))return g<=2?M('F1.1'):null;
 }
 if(/skip count/i.test(t))return g===2?M('B1.4'):(g===3?M('B1.4'):null);
 if(/pattern|sequence/i.test(t))return M('C1.3');
 if(/mean\b|median|average/i.test(t))return g>=4?M('D1.5'):(g===3?M('D1.4'):null);
 if(/mode\b/i.test(t))return g===2?M('D1.4'):(g===3?M('D1.4'):(g>=4?M('D1.5'):null));
 if(/favourite|which has more|how many more .* than|answered in all|most popular/i.test(t))return M('D1.5');
 if(/perimeter/i.test(t))return g===3?M('E2.1'):null;
 if(/area/i.test(t)){if(/rectangle|garden/i.test(t))return g===4?M('E2.5'):(g===3?M('E2.9'):null);if(/triangle|parallelogram/i.test(t))return g===5?M('E2.5'):null;return null;}
 if(/volume/i.test(t))return null;
 if(/elapsed|starts at|lasts|class starts|how long is the class/i.test(t))return g===4?M('E2.3'):(g===3?M('E2.6'):null);
 if(/what time is it/i.test(t))return g===2?M('E2.4'):(g===3?M('E2.6'):null);
 if(/days are in a week/i.test(t))return g===1?M('E2.3'):null;
 if(/hours are in one day|minutes are in one hour/i.test(t))return g===2?M('E2.4'):(g===3?M('E2.6'):null);
 if(/longer|heavier|more water/i.test(t))return g===1?M('E2.2'):null;
 if(/=\s*\?\s*(cm|mm|mL|g)\b|\d+ (m|kg|L|cm) = \?/.test(t)){if(/kg|mL|L\b/.test(t))return g===4?M('E2.1'):(g===5?M('E2.2'):(g===6?M('E2.1'):null));return g===3?M('E2.2'):(g===2?M('E2.2'):(g===5?M('E2.2'):(g===6?M('E2.1'):null)));}
 if(/lines of symmetry|most lines of symmetry/i.test(t))return g===2?M('E1.1'):null;
 if(/(sides|corners|faces) does a/i.test(t))return g<=3?M('E1.1'):null;
 if(/angle/i.test(t)&&/third angle|triangle/i.test(t))return g===5?M('E1.1'):null;
 if(/angle/i.test(t))return g===4?M('E2.4'):(g===5?M('E2.3'):null);
 if(/Cartesian|grid|point \(/i.test(t))return g===4?M('E1.2'):(g===5?M('E1.4'):(g===6?M('E1.3'):null));
 if(/How many\? /.test(t))return g===1?M('B1.1'):null;
 if(/right (before|after)/i.test(t))return g===1?M('B1.5'):null;
 if(/Which number is (bigger|smaller)/i.test(t))return g===1?M('B1.3'):null;
 if(/in order from least|least to greatest/i.test(t))return g===6?M('B1.3'):null;
 if(/which digit/i.test(t))return g===2?M('B1.1'):(g===3?M('B1.5'):null);
 if(/Round .* to the nearest/i.test(t)){if(/nearest (10|100|1000|ten|hundred|thousand)/.test(t))return (g>=3&&g<=4)?M('B1.3'):null;if(/whole/.test(t))return g===4?M('B1.8'):null;if(/tenth/.test(t))return g===5?M('B1.6'):null;return null;}
 if(/what is #?\d*\/\d* of|\bof \d+\??$/i.test(t)&&/\//.test(t))return g===3?M('B2.8'):null;
 if(/fraction equals|\d+\.\d+/.test(t)&&/fraction/i.test(t))return g===4?M('B1.9'):null;
 if(/\/\d+ \+ \d+\/\d+/.test(t))return g===5?M('B2.5'):(g===6?M('B2.5'):null);
 if(/\/\d+ = \?\/\d+/.test(t))return g===5?M('B1.3'):null;
 if(/prime|factor|\^|[²³⁴⁵]/i.test(t))return g===6?M('B2.6'):null;
 if(/remainder/i.test(t))return g===4?M('B2.6'):null;
 if(/\bx\b|\dx = /.test(t))return g===6?M('C2.3'):null;
 if(/\?\s*=\s*\d|[+−]\s*\?\s*=|\d\s*[×÷]\s*\?/.test(t)||/\+ \? = /.test(t))return g===1||g===2||g===3?M('C2.3'):(g===4?M('C2.2'):(g===5?M('C2.3'):M('C2.3')));
 if(/Double/i.test(t))return g===2?M('B2.3'):null;
 if(/\d+\.\d+\s*[×+]/.test(t))return g===5?M('B1.5'):null;
 if(/\(\d+ \+ \d+\) ×|\d+ \+ \d+ × /.test(t))return g===5?M('B2.1'):null;
 if(/[−-]\s*\d+ \+|^−/.test(t))return null;
 if(/boxes|packs|each|read .* pages|buys/i.test(t)){if(g===2)return M('B2.4');if(g===3)return M('B2.7');if(g===4)return M('B2.5');return M('B2.4');}
 if(/gives|more\.|eats|left|in all/i.test(t))return g===1?M('B2.4'):(g===2?M('B2.4'):(g===3?M('B2.5'):M('B2.4')));
 if(/\d+ ?[×]\s*\d+/.test(t))return g===3?(mx<=10&&nums.every(n=>[2,5,10].includes(n))?M('B2.2'):M('B2.6')):(g===4?(mx<=10?M('B2.2'):M('B2.5')):(g===5?(mx<=12?M('B2.2'):M('B2.6')):null));
 if(/\d+ ?÷\s*\d+/.test(t))return g===3?(nums.some(n=>[2,5,10].includes(n))?M('B2.2'):M('B2.6')):(g===4?(mx<=100?M('B2.2'):M('B2.6')):(g===5?M('B2.7'):null));
 if(/\d+ ?[+−]\s*\d+/.test(t)){
  if(g===1)return mx<=10?M('B2.2'):M('B2.3');
  if(g===2)return mx<=20?M('B2.2'):(mx<=50?M('B2.3'):M('B2.4'));
  if(g===3)return mx<=200?M('B2.3'):M('B2.5');
  if(g===4)return M('B2.4');
  return M('B2.4');
 }
 return null;
}

/* ---- "Here's why": a short, true explanation for every question, built from the question itself ---- */
const TOPIC={MA:'Problem solving',MB1:'Numbers',MB2:'Adding, subtracting, multiplying, dividing',MC1:'Patterns',MC2:'Missing numbers',MD1:'Graphs and data',MD2:'Chance',ME1:'Shapes',ME2:'Measuring and time',MF1:'Money',LB:'Words and spelling',LC:'Reading stories',LD:'Writing sentences',KL:'Letters and sounds'};
function whyOf(q,subject){
 try{
  const t=String(q.q||''),a=String(q.a==null?'':q.a);
  if(q.explain)return String(q.explain);
  if(q.t==='ord'&&q.full)return 'The sentence reads: “'+q.full+'” It starts with a capital letter and ends with a punctuation mark.';
  if(q.t==='pair')return 'The matches are: '+a+'.';
  if(q.t==='trace')return 'Go slowly and keep your finger on the gray shape.';
  let m;
  if((m=t.match(/means almost the same as “(.+?)”/)))return '“'+m[1]+'” and “'+a+'” mean almost the same thing.';
  if((m=t.match(/means the opposite of “(.+?)”/)))return '“'+m[1]+'” and “'+a+'” are opposites.';
  if(/spelled correctly/i.test(t))return 'It is spelled “'+a+'”. Say it slowly and listen for each part.';
  if(t.includes('___')){const full=t.replace('___',a);return 'It reads: “'+full+'”. Say the sentence in your head to check that it sounds right.';}
  if(/which sentence is correct/i.test(t))return '“'+a+'” has the capital letter and punctuation in the right places.';
  if(q.passage){
   const sents=q.passage.split(/(?<=[.!?])\s+/),words=(a+' '+t).toLowerCase().replace(/[^a-z0-9' ]/g,' ').split(/\s+/).filter(w=>w.length>2&&!['the','what','who','where','why','how','does','did','was','are','and','which','this','that'].includes(w));
   let best=null,bs=0;sents.forEach(x=>{const xl=x.toLowerCase();let sc=0;words.forEach(w=>{if(xl.includes(w))sc+=(a.toLowerCase().includes(w)?3:1)});if(sc>bs){bs=sc;best=x}});
   return best?'Look back at the story: “'+best.trim()+'”':'Go back to the story and look for the answer in the words.';
  }
  if((m=t.match(/what kind of word is “(.+?)”/))){const d={noun:'names a person, place or thing',verb:'shows an action',adjective:'describes a noun',adverb:'tells how, when or where something happens',preposition:'shows where or when, like in, on or under',pronoun:'takes the place of a noun',conjunction:'joins words or sentences'};return '“'+m[1]+'” is a '+a+(d[a]?': a '+a+' '+d[a]+'.':'.');}
  if((m=t.match(/^Double (\d+)/i)))return m[1]+' + '+m[1]+' = '+a+'. Double means two of the same number.';
  if((m=t.match(/^Half of (\d+)/i)))return 'Split '+m[1]+' into 2 equal parts: '+m[1]+' ÷ 2 = '+a+'.';
  if((m=t.match(/factor of (\d+)/i))&&Number(m[1])%Number(a)===0)return a+' × '+(Number(m[1])/Number(a))+' = '+m[1]+', so '+a+' divides '+m[1]+' with nothing left over.';
  if((m=t.match(/multiple of (\d+)/i))&&Number(a)%Number(m[1])===0)return m[1]+' × '+(Number(a)/Number(m[1]))+' = '+a+', so '+a+' is in the '+m[1]+' times table.';
  if((m=t.match(/prefix “(.+?)”/)))return 'The prefix “'+m[1]+'” goes at the start of a word. It means “'+a+'”.';
  if((m=t.match(/suffix “(.+?)”/)))return 'The suffix “'+m[1]+'” goes at the end of a word. It means “'+a+'”.';
  if((m=t.match(/(\d+)\/(\d+) of (\d+)/))&&Number(m[3])%Number(m[2])===0&&Math.abs(Number(m[3])/Number(m[2])*Number(m[1])-Number(a))<1e-9)return 'Split '+m[3]+' into '+m[2]+' equal groups: '+m[3]+' ÷ '+m[2]+' = '+(Number(m[3])/Number(m[2]))+(m[1]==='1'?'.':'. Then take '+m[1]+' of those groups: '+a+'.');
  {const ns=(t.match(/\d+(?:\.\d+)?/g)||[]).map(Number);if(ns.length===2&&/[a-z]{3,}/i.test(t)&&!/[$¢%]/.test(t)){const [x,y]=ns,A=Number(a);const c=[[x+y,x+' + '+y],[Math.abs(x-y),Math.max(x,y)+' − '+Math.min(x,y)],[x*y,x+' × '+y],[y?x/y:NaN,x+' ÷ '+y]];const hit=c.find(z=>Math.abs(z[0]-A)<1e-9);if(hit)return hit[1]+' = '+a+'.';}}
  const mm=t.match(/(\d+(?:\.\d+)?)\s*([+−\-×÷x*\/])\s*(\d+(?:\.\d+)?)\s*(?:=|\?|$)/);
  if(mm&&!/[a-z]{4,}/i.test(t.replace(/(what|is|the|answer|solve|find|equals|how|much|many)/gi,''))){
   const x=+mm[1],y=+mm[3],o=mm[2];let r=null,tip='';
   if(o==='+'){r=x+y;tip='Count up from '+x+', or split the numbers into tens and ones.'}
   else if(o==='−'||o==='-'){r=x-y;tip='Count back '+y+' from '+x+', or think: '+y+' plus what makes '+x+'?'}
   else if(o==='×'||o==='x'||o==='*'){r=x*y;tip='Think of '+x+' groups of '+y+', or skip count by '+y+'.'}
   else{r=x/y;tip='Think: '+y+' times what number makes '+x+'?'}
   if(r!==null&&Math.abs(r-Number(a))<1e-9)return x+' '+o+' '+y+' = '+a+'. '+tip;
  }
  const sk=q.sk||strandOf(q,subject);
  const tips={MB1:'Think carefully about the sizes of the numbers or things you are comparing.',MB2:'Work it out one step at a time, then check by doing the opposite operation.',MC1:'Look at how the numbers or shapes change each time. That change is the rule.',MC2:'Put your answer back in the problem. If both sides match, it is right.',MD1:'Read the graph or table carefully, then count or compare the numbers.',MD2:'Think about how many outcomes there are and how many match.',ME1:'Picture the shape and compare it with the names and properties you know.',ME2:'Check the units and read the measurement carefully.',MF1:'Add the money up in steps, coins or bills together.',MA:'Read the problem again and decide what it is asking before you calculate.',LB:'Say each choice out loud, slowly, and listen to it.',LC:'',LD:'Read the sentence out loud and listen for what sounds right.',KL:'Say the sound slowly and match it to the letter.'};
  return tips[sk]||'';
 }catch(e){return ''}
}
const _ml=makeLesson;function makeLessonT(g,subject,d){const L=_ml(g,subject,d);L.forEach(q=>{try{if(!q.sk)q.sk=strandOf(q,subject);if(!q.ex)q.ex=exOf(q,g,subject)||'X';if(!q.explain){const w=whyOf(q,subject);if(w)q.explain=w}}catch(e){}});return L;}
const api={genK,makeLesson:makeLessonT,strandOf,exOf,whyOf,TOPIC,STRANDS,MATH,READ,genMath,genRead,genLogic};
if(typeof module!=='undefined')module.exports=api;else root.MapleContent=api;
})(typeof window!=='undefined'?window:globalThis);
