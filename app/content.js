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
const api={genK,makeLesson,MATH,READ,genMath,genRead,genLogic};
if(typeof module!=='undefined')module.exports=api;else root.MapleContent=api;
})(typeof window!=='undefined'?window:globalThis);
