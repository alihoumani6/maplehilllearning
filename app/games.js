/* Maple Leap — Brain Gym: six quick brain games, tuned for Pre-K to Grade 6.
   Runs in a full-screen overlay. Uses app globals (S, P, save, render, toast, confetti, beep, sOK, sNO, sWIN, buzz, say, ri, dk, isPlus). */
(function(){
'use strict';
var GM=[
 {id:'mem',n:'Memory Match',e:'🃏',skill:'Memory',c:'#7b45c9',how:'Flip two cards. Find the matching pairs!',how0:'Find the matching pictures!'},
 {id:'seq',n:'Leaf Echo',e:'🍁',skill:'Focus',c:'#1f9d5b',how:'Watch the colors light up, then tap them in the same order.',how0:'Watch the lights. Then copy them!'},
 {id:'dash',n:'Number Dash',e:'⚡',skill:'Speed',c:'#f47b20',how:'Answer as many as you can before time runs out!',how0:'Count the pictures. Tap the number!'},
 {id:'odd',n:'Odd One Out',e:'👀',skill:'Attention',c:'#1d5fd1',how:'One picture is different. Spot it fast!',how0:'Find the one that is different!'},
 {id:'word',n:'Word Whiz',e:'🔤',skill:'Language',c:'#d62828',how:'Tap the letters to unscramble each word.',how0:'Find the matching letter!'},
 {id:'clash',n:'Color Clash',e:'🎨',skill:'Flexibility',c:'#12306b',how:'Follow the rule. Tap the right color name!',how0:'Tap the same color!'},
 {id:'pat',n:'Pattern Pop',e:'🧩',skill:'Patterns',c:'#0e9aa7',how:'Spot the pattern and tap what comes next.',how0:'What comes next? Tap it!'},
 {id:'miss',n:'Number Detective',e:'🔍',skill:'Reasoning',c:'#b5651d',how:'Find the missing number that makes it true.',how0:'Find the missing number!'},
 {id:'cmp',n:'Size Showdown',e:'⚖️',skill:'Number sense',c:'#a23b72',how:'Two values. Tap the one that matches the rule.',how0:'Tap the bigger one!'},
 {id:'sort',n:'Sort Squad',e:'🗂️',skill:'Classifying',c:'#2e7d32',how:'Tap every item that fits the rule before time runs out.',how0:'Tap all that belong!'},
 {id:'digit',n:'Digit Memory',e:'🔢',skill:'Working memory',c:'#5e35b1',how:'Remember the digits, then type them back.',how0:'Remember the numbers!'}
];
var LINEUP=[
 ['mem','seq','dash','odd','word','pat'],
 ['mem','dash','odd','word','pat','sort'],
 ['mem','seq','dash','word','pat','miss'],
 ['mem','dash','word','pat','miss','cmp'],
 ['seq','dash','word','miss','sort','digit'],
 ['mem','dash','clash','miss','cmp','digit'],
 ['seq','dash','clash','miss','cmp','digit']
];
function lineup(g){return LINEUP[g]||LINEUP[1]}
var INK={Red:'#ef4444',Blue:'#3b82f6',Green:'#22c55e',Yellow:'#facc15',Purple:'#a855f7',Orange:'#fb923c'};
var CN=['Red','Blue','Green','Yellow','Purple','Orange'];
var run=null;
function gm(id){for(var i=0;i<GM.length;i++)if(GM[i].id===id)return GM[i];return null}
function sh(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function rr(a,b){return a+Math.floor(Math.random()*(b-a+1))}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function gradeOf(p){var g=Math.round(+p.grade);return g>=0&&g<=6?g:1}
function rec(p){
  if(!p.bg||typeof p.bg!=='object'||Array.isArray(p.bg))p.bg={};
  var t=dk();
  if(!p.bgd||typeof p.bgd!=='object'||p.bgd.d!==t)p.bgd={d:t,played:{},paid:0,g:0};
  if(!p.bgd.played||typeof p.bgd.played!=='object')p.bgd.played={};
  return p;
}
function best(p,id){var r=p.bg&&p.bg[id];return (r&&typeof r==='object')?{b:+r.b||0,s:Math.min(3,+r.s||0),n:+r.n||0}:{b:0,s:0,n:0}}
function totalStars(p){var t=0;lineup(gradeOf(p)).forEach(function(id){t+=best(p,id).s});return t}
var TITLES=[[0,'Seedling','🌱'],[3,'Sprout','🌿'],[7,'Sapling','🌳'],[11,'Maple','🍁'],[15,'Mighty Maple','🏆'],[18,'Genius Leaf','🧠']];
function title(t){var r=TITLES[0];TITLES.forEach(function(x){if(t>=x[0])r=x});return r}
function stars(n){var s='';for(var i=0;i<3;i++)s+=i<n?'⭐':'☆';return s}

/* ---------- Brain tab ---------- */
function view(p){
  injectCss();rec(p);var g0=gradeOf(p)===0,t=totalStars(p),ti=title(t),pl=Object.keys(p.bgd.played).length,done=p.bgd.paid;
  var h='<h2 style="color:var(--navy);margin:8px 0 2px">Brain Gym</h2><p class="fine" style="margin:0 0 6px;text-align:left">Quick games that train memory, focus and speed. Tuned for '+esc(gradeLabel(p))+'.</p>';
  h+='<div class="card bgp"><div class="row" style="margin:0"><span style="font-size:36px">'+ti[2]+'</span><span style="flex:1;margin-left:10px"><b style="color:var(--navy);font-size:18px">'+ti[1]+'</b><br><span class="fine" style="text-align:left">'+t+' of 18 stars</span></span></div><div class="meter" style="margin-top:8px"><i style="width:'+Math.round(t/18*100)+'%;background:var(--purple)"></i></div></div>';
  h+='<div class="card"><div class="row" style="margin:0"><b style="color:var(--navy)">Today\'s challenge</b><span>'+(done?'✅ +💎25 earned':Math.min(pl,3)+' / 3 games')+'</span></div><div class="fine" style="text-align:left;margin:4px 0 0">'+(done?'Come back tomorrow for a fresh challenge!':'Play 3 different games to win 💎25.')+'</div></div>';
  h+='<div class="bgg">'+lineup(gradeOf(p)).map(gm).map(function(g){var b=best(p,g.id);return '<button class="bgc" data-act="bg" data-a="'+g.id+'" style="--c:'+g.c+'" aria-label="'+esc(g.n)+', best '+b.s+' of 3 stars"><span class="bge">'+g.e+'</span><b>'+g.n+'</b><span class="bgk">'+(g0?'':g.skill+' · ')+(b.n?stars(b.s):'New!')+'</span></button>'}).join('')+'</div>';
  return h;
}

/* ---------- overlay ---------- */
var CSS='.bgx{position:fixed;inset:0;z-index:55;background:var(--paper);display:flex;flex-direction:column;animation:bgin .28s cubic-bezier(.2,.8,.2,1)}@keyframes bgin{from{opacity:0;transform:translateY(24px) scale(.98)}to{opacity:1;transform:none}}'+
'.bgh{display:flex;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top)) 12px 6px}.bgq{min-width:44px;min-height:44px;border:0;border-radius:14px;background:#eef1f7;font-size:20px;font-weight:800;color:var(--navy)}.bgq:active{transform:scale(.92)}.bgt{flex:1;text-align:center;font-weight:800;color:var(--navy);font-size:17px}.bgs{min-width:64px;text-align:right;font-weight:800;color:var(--navy);font-size:18px}'+
'.bgbar{height:8px;margin:0 14px;border-radius:99px;background:#e8ebf3;overflow:hidden}.bgbar i{display:block;height:100%;width:100%;background:var(--green);transform-origin:left;transition:width .12s linear,background-color .3s}.bgbar.lo i{background:var(--red)}'+
'.bgm{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 14px calc(14px + env(safe-area-inset-bottom));overflow:auto;min-height:0;width:100%;max-width:560px;margin:0 auto}'+
'.bgi{text-align:center}.bgi .big{font-size:84px;line-height:1}.bgi h1{margin:8px 0;color:var(--navy);font-size:30px}.bgi p{font-weight:700;color:var(--mut);margin:6px 0 16px;font-size:17px}'+
'.bgg{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:10px 0 14px}.bgc{border:2px solid var(--line);border-radius:20px;background:#fff;padding:14px 8px;display:flex;flex-direction:column;align-items:center;gap:4px;box-shadow:0 4px 0 var(--line);color:var(--navy);font-size:16px;min-height:132px;transition:transform .14s cubic-bezier(.2,.8,.2,1)}.bgc:active{transform:scale(.95)}.bgc .bge{font-size:44px;width:68px;height:68px;border-radius:20px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--c) 16%,#fff)}.bgc .bgk{font-size:12px;color:var(--mut);font-weight:800}'+
'.mg{display:grid;grid-template-columns:repeat(var(--cols),1fr);gap:10px;width:100%}.mc{aspect-ratio:1;border:0;border-radius:18px;perspective:600px;background:none;padding:0;position:relative;touch-action:manipulation}.mc>span{position:absolute;inset:0;border-radius:18px;display:flex;align-items:center;justify-content:center;backface-visibility:hidden;-webkit-backface-visibility:hidden;transition:transform .28s cubic-bezier(.2,.8,.2,1);font-size:var(--fs)}.mc .f{background:linear-gradient(145deg,#2f7ae5,#1d5fd1);box-shadow:0 5px 0 #12306b;color:#fff}.mc .b{background:#fff;border:3px solid var(--line);transform:rotateY(180deg)}.mc.on .f{transform:rotateY(180deg)}.mc.on .b{transform:rotateY(0)}.mc.ok .b{border-color:var(--green);background:#e9f8ef}.mc:active:not(.on){transform:scale(.95)}'+
'.sp{display:grid;grid-template-columns:1fr 1fr;gap:14px;width:min(100%,360px);aspect-ratio:1}.sp button{border:0;border-radius:26px;opacity:.55;transition:opacity .08s,transform .08s,filter .08s;touch-action:manipulation}.sp button.lit{opacity:1;transform:scale(1.04);filter:brightness(1.15) saturate(1.2);box-shadow:0 0 34px 6px currentColor}.sp.dis button{pointer-events:none}'+
'.bq{font-size:clamp(34px,10vw,56px);font-weight:800;color:var(--navy);text-align:center;margin:6px 0 18px;line-height:1.15;min-height:64px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:2px}.bq.em{font-size:clamp(44px,14vw,72px);letter-spacing:4px}'+
'.bc{display:grid;gap:12px;width:100%}.bc.c2{grid-template-columns:1fr 1fr}.bc.c3{grid-template-columns:1fr 1fr 1fr}.bc button,.og button{border:2px solid var(--line);border-radius:20px;background:#fff;font-weight:800;color:var(--navy);box-shadow:0 4px 0 var(--line);min-height:76px;font-size:clamp(26px,8vw,38px);touch-action:manipulation;transition:transform .12s cubic-bezier(.2,.8,.2,1),background-color .12s}.bc button:active,.og button:active{transform:scale(.94)}.bc button.ok,.og button.ok{background:#e9f8ef;border-color:var(--green)}.bc button.no,.og button.no,.wr.no{background:#fdecec;border-color:var(--red);animation:bgsh .3s}@keyframes bgsh{25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}'+
'.og{display:grid;grid-template-columns:repeat(var(--cols),1fr);gap:10px;width:100%}.og button{min-height:0;aspect-ratio:1;font-size:var(--fs);padding:0;display:flex;align-items:center;justify-content:center}'+
'.cw{background:#1d2433;border-radius:24px;padding:18px 26px;font-size:clamp(44px,14vw,76px);font-weight:900;letter-spacing:.02em;margin:4px 0 6px;text-align:center;min-width:70%}.cd{width:clamp(110px,34vw,170px);aspect-ratio:1;border-radius:50%;margin:6px auto 18px;box-shadow:inset 0 -8px 0 rgba(0,0,0,.14),0 6px 0 rgba(0,0,0,.1)}.cr{font-weight:800;color:var(--navy);font-size:18px;margin:8px 0;text-align:center}.cr b{background:var(--sun);padding:2px 10px;border-radius:99px}.sw{border-radius:50%!important;aspect-ratio:1;min-height:0!important}'+
'.wr{display:flex;gap:8px;justify-content:center;margin:6px 0 16px;border:2px solid transparent;border-radius:16px;padding:6px}.wr button,.wt button{width:var(--tw);height:calc(var(--tw)*1.15);border-radius:14px;font-size:calc(var(--tw)*.58);font-weight:800;color:var(--navy);border:2px solid var(--line);background:#fff;box-shadow:0 4px 0 var(--line);padding:0;touch-action:manipulation}.wr button{background:#eef4ff;border-style:dashed;box-shadow:none}.wr button.f{border-style:solid;background:#fff;box-shadow:0 4px 0 var(--line)}.wt{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}.wt button:disabled{opacity:.25;box-shadow:none}.wt button:active:not(:disabled){transform:scale(.92)}'+
'.bsk{margin-top:16px;border:0;background:none;color:var(--mut);font-weight:800;font-size:15px;min-height:44px;padding:8px 16px}.rs .st{font-size:54px;letter-spacing:6px;line-height:1.35;margin:2px 0}.rs .sc{font-size:46px;font-weight:900;color:var(--navy);line-height:1.2}.rs .rw{display:flex;gap:10px;justify-content:center;margin:12px 0;font-weight:800}.rs .rw span{background:#fff8e1;border:2px solid var(--sun);border-radius:99px;padding:6px 14px}.nb{display:inline-block;background:var(--red);color:#fff;border-radius:99px;padding:3px 12px;font-weight:800;font-size:14px;margin:4px 0}'+
'.lit{}.bgx .pop{animation:bgpop .35s cubic-bezier(.2,1.4,.4,1)}@keyframes bgpop{from{transform:scale(.6);opacity:0}to{transform:none;opacity:1}}'+
'@media (prefers-reduced-motion:reduce){.bgx,.bgx .pop,.bc button.no,.og button.no,.wr.no{animation:none!important}.mc>span{transition:none}}'+
'@media (prefers-contrast:more){.bgc,.bc button,.og button{border-color:#1d2433}}';
function injectCss(){if(document.getElementById('bgcss'))return;var s=document.createElement('style');s.id='bgcss';s.textContent=CSS;document.head.appendChild(s)}

function T(fn,ms){var r=run;var id=setTimeout(function(){if(run===r&&r&&!r.over)fn()},ms);if(r)r.to.push(id);return id}
function clean(){if(!run)return;run.over=true;run.iv.forEach(clearInterval);run.to.forEach(clearTimeout);run.iv=[];run.to=[]}
function $m(){return document.getElementById('bgm')}
function setScore(n){var e=document.getElementById('bgs');if(e)e.textContent=n}
function setBar(f){var b=document.getElementById('bgb'),w=b&&b.parentNode;if(!b)return;f=Math.max(0,Math.min(1,f));b.style.width=(f*100)+'%';w.classList.toggle('lo',f<.25)}
function snd(f){try{if(typeof beep==='function')beep(f,.14,'triangle')}catch(e){}}
function ok(){try{sOK(run?run.streak:0)}catch(e){}try{buzz(12)}catch(e){}}
function bad(){try{sNO()}catch(e){}try{buzz('e')}catch(e){}}
function speak(t){try{if(run&&run.g===0&&typeof say==='function')say({q:t,say:t})}catch(e){}}

function close(){
  if(run){clean();run=null}
  window.removeEventListener('resize',onResize);document.removeEventListener('keydown',onKey);
  var x=document.getElementById('bgx');if(x)x.remove();
  try{render()}catch(e){}
}
function onKey(e){if(e.key==='Escape')close()}
var resizeFn=null;function onResize(){if(resizeFn)resizeFn()}

function open(id){
  var g=gm(id),p=P();if(!g||!p)return;
  injectCss();rec(p);
  if(run){clean();run=null}
  var old=document.getElementById('bgx');if(old)old.remove();
  var gr=gradeOf(p);
  run={id:id,g:gr,iv:[],to:[],over:false,streak:0,score:0};
  var x=document.createElement('div');x.id='bgx';x.className='bgx';x.setAttribute('role','dialog');x.setAttribute('aria-modal','true');x.setAttribute('aria-label',g.n);
  x.innerHTML='<div class="bgh"><button class="bgq" id="bgq" aria-label="Close">✕</button><div class="bgt">'+g.n+'</div><div class="bgs" id="bgs"></div></div><div class="bgbar" id="bgbw" style="visibility:hidden"><i id="bgb"></i></div><div class="bgm" id="bgm"></div>';
  document.body.appendChild(x);
  document.getElementById('bgq').onclick=close;
  document.addEventListener('keydown',onKey);window.addEventListener('resize',onResize);
  intro(g,p);
}
function intro(g,p){
  clean();run.over=false;run.iv=[];run.to=[];resizeFn=null;
  var b=best(p,g.id),gr=run.g;
  document.getElementById('bgbw').style.visibility='hidden';setScore('');
  $m().innerHTML='<div class="bgi pop"><div class="big">'+g.e+'</div><h1>'+g.n+'</h1><p>'+(gr===0?g.how0:g.how)+'</p>'+(b.n?'<p style="margin-top:-6px">Best: '+b.b+' · '+stars(b.s)+'</p>':'')+'<button class="btn full" id="bgp" style="min-width:200px">Play</button></div>';
  document.getElementById('bgp').onclick=function(){start(g.id)};
  speak(g.how0);
}
function start(id){
  var gr=run.g;run.over=false;run.score=0;run.streak=0;setScore(0);resizeFn=null;
  var m0=$m();if(m0){var m1=m0.cloneNode(false);m0.parentNode.replaceChild(m1,m0)}
  document.getElementById('bgbw').style.visibility='hidden';
  ({mem:mem,seq:seq,dash:dash,odd:odd,word:word,clash:clash,pat:pat,miss:miss,cmp:cmp,sort:sortg,digit:digit})[id](gr);
}
function timed(sec,onEnd){
  document.getElementById('bgbw').style.visibility='visible';setBar(1);
  var left=sec,last=performance.now(),t={left:function(){return left},add:function(s){left=Math.min(sec,left+s)},sub:function(s){left-=s}};
  var id=setInterval(function(){var now=performance.now(),dt=Math.min(250,now-last);last=now;if(document.hidden||!run||run.over)return;left-=dt/1000;setBar(left/sec);if(left<=0){clearInterval(id);onEnd()}},100);
  run.iv.push(id);return t;
}

/* ---------- results + rewards ---------- */
function finish(score,st,note){
  if(!run||run.over)return;
  var id=run.id,g=gm(id),p=P();clean();run.over=true;
  rec(p);
  var r=p.bg[id];if(!r||typeof r!=='object')r=p.bg[id]={b:0,s:0,n:0};
  var isBest=score>(+r.b||0)&&score>0;
  r.b=Math.max(+r.b||0,score);r.s=Math.max(Math.min(3,+r.s||0),st);r.n=(+r.n||0)+1;
  var gems=0,xp=0,bonus=0;
  if(score>0){
    xp=2+st*3;gems=st*3+1;
    var cap=Math.max(0,40-(+p.bgd.g||0));gems=Math.min(gems,cap);p.bgd.g=(+p.bgd.g||0)+gems;
    p.bgd.played[id]=1;
    if(!p.bgd.paid&&Object.keys(p.bgd.played).length>=3){p.bgd.paid=1;bonus=25;gems+=25}
    p.gems+=gems;p.xp+=xp;p.wxp=(+p.wxp||0)+xp;if(p.q)p.q.xp=(+p.q.xp||0)+xp;
  }
  save();
  document.getElementById('bgbw').style.visibility='hidden';
  var line=st===3?'Brilliant!':st===2?'Great job!':st===1?'Nice work!':'Good try!';
  $m().innerHTML='<div class="bgi rs pop"><div class="big">'+g.e+'</div><h1>'+line+'</h1><div class="st" aria-label="'+st+' of 3 stars">'+stars(st)+'</div><div class="sc">'+score+'</div>'+(isBest?'<div class="nb">NEW BEST!</div>':'<div class="fine">Best: '+r.b+'</div>')+(note?'<div class="fine">'+esc(note)+'</div>':'')+(score>0?'<div class="rw"><span>💎 +'+gems+'</span><span>⭐ +'+xp+' XP</span></div>':'')+(bonus?'<div class="fine" style="color:var(--green)">🎉 Daily challenge complete! (+💎25 included)</div>':'')+'<div style="display:flex;gap:10px;justify-content:center;margin-top:14px"><button class="btn ghost" id="bgd">Done</button><button class="btn" id="bga">Play again</button></div></div>';
  document.getElementById('bgd').onclick=close;
  document.getElementById('bga').onclick=function(){run.over=false;run.iv=[];run.to=[];start(id)};
  setScore('');
  try{if(st>=2)sWIN();else sOK(0)}catch(e){}
  if(st===3||isBest){try{confetti()}catch(e){}}
  speak(line);
}

/* ---------- 1. Memory Match ---------- */
var MEMP=['🐶','🐱','🐼','🦊','🐸','🐵','🦁','🐙','🍎','🍌','🍓','🍕','🚗','🚀','⚽','🎈','🌈','⭐','🍩','🦋'];
function mem(g){
  var pairs=[2,3,4,6,6,8,8][g],cols=pairs<=2?2:pairs<=3?3:4,rows=Math.ceil(pairs*2/cols);
  var faces=sh(MEMP).slice(0,pairs),deck=sh(faces.concat(faces));
  var open=[],lock=false,matched=0,moves=0;
  $m().innerHTML='<div class="mg" id="mg" style="--cols:'+cols+'">'+deck.map(function(e,i){return '<button class="mc" data-i="'+i+'" aria-label="Card '+(i+1)+'"><span class="f">🍁</span><span class="b">'+e+'</span></button>'}).join('')+'</div>';
  var mg=document.getElementById('mg');
  resizeFn=function(){var w=Math.min(mg.parentNode.clientWidth,window.innerWidth-28),hAvail=window.innerHeight-170;var cell=Math.min((w-10*(cols-1))/cols,(hAvail-10*(rows-1))/rows);cell=Math.max(48,cell);mg.style.width=(cell*cols+10*(cols-1))+'px';mg.style.setProperty('--fs',Math.floor(cell*.52)+'px')};
  resizeFn();
  setScore(moves+' moves');
  mg.addEventListener('click',function(ev){
    var b=ev.target.closest('.mc');if(!b||lock||!run||run.over)return;
    var i=+b.dataset.i;if(b.classList.contains('on')||b.classList.contains('ok'))return;
    b.classList.add('on');snd(500+i*0);open.push(i);
    if(open.length===2){
      moves++;setScore(moves+' moves');
      var a=open[0],c=open[1];open=[];
      var A=mg.children[a],B=mg.children[c];
      if(deck[a]===deck[c]){
        matched++;A.classList.add('ok');B.classList.add('ok');run.streak++;T(ok,200);
        if(matched===pairs){
          var sc=Math.max(10,pairs*60-(moves-pairs)*12),st=moves<=Math.ceil(pairs*1.6)?3:moves<=Math.ceil(pairs*2.4)?2:1;
          T(function(){finish(sc,st,moves+' moves for '+pairs+' pairs')},700);
        }
      }else{
        lock=true;run.streak=0;
        T(function(){A.classList.remove('on');B.classList.remove('on');lock=false},g===0?1100:g<3?850:700);
      }
    }
  });
}

/* ---------- 2. Leaf Echo ---------- */
function seq(g){
  var cols=[['#1f9d5b','Green',392],['#ef4444','Red',523],['#facc15','Yellow',659],['#3b82f6','Blue',784]];
  var step=[900,800,700,620,560,500,450][g],lives=[3,2,2,1,1,1,1][g];
  var TH=[[2,4,6],[3,5,7],[3,6,8],[4,7,9],[4,7,10],[5,8,11],[5,9,12]][g];
  var s=[rr(0,3)],idx=0,inp=false,rounds=0;
  $m().innerHTML='<div class="cr" id="sq" aria-live="polite">Watch…</div><div class="sp dis" id="sp">'+cols.map(function(c,i){return '<button data-i="'+i+'" style="background:'+c[0]+';color:'+c[0]+'" aria-label="'+c[1]+'"></button>'}).join('')+'</div><div class="fine" id="sl" style="margin-top:14px">'+(lives>1?'❤️'.repeat(lives):'')+'</div>';
  var sp=document.getElementById('sp'),sq=document.getElementById('sq'),sl=document.getElementById('sl');
  function light(i,d){var b=sp.children[i];b.classList.add('lit');snd(cols[i][2]);T(function(){b.classList.remove('lit')},d)}
  function play(){
    inp=false;sp.classList.add('dis');sq.textContent='Watch…';idx=0;
    s.forEach(function(v,k){T(function(){light(v,step*.6)},700+k*step)});
    T(function(){inp=true;sp.classList.remove('dis');sq.innerHTML='Your turn! <b>'+s.length+'</b>'},700+s.length*step);
  }
  function tap(e){
    var b=e.target.closest('button');if(!b||!inp||!run||run.over)return;
    e.preventDefault();var i=+b.dataset.i;light(i,160);
    if(i===s[idx]){
      idx++;
      if(idx===s.length){
        inp=false;rounds++;run.score=rounds*50;setScore(run.score);T(ok,250);
        if(rounds>=20){T(function(){finish(rounds*50,3,'Amazing memory!')},500);return}
        s.push(rr(0,3));T(play,900);
      }
    }else{
      inp=false;lives--;bad();sl.textContent=lives>0&&[3,2,2,1,1,1,1][g]>1?'❤️'.repeat(lives):'';
      if(lives<=0){T(function(){finish(rounds*50,rounds>=TH[2]?3:rounds>=TH[1]?2:rounds>=TH[0]?1:0,rounds+' rounds')},700)}
      else{sq.textContent='Oops! Try again';T(play,1200)}
    }
  }
  sp.addEventListener('pointerdown',tap);
  sp.addEventListener('click',function(e){e.preventDefault()});
  play();
}

/* ---------- 3. Number Dash ---------- */
var DE=['🍎','⭐','🐟','🎈','🍓','🐥','🚗','🌸'];
function uniq(ans,cands,n,allowNeg){
  var out=[ans];cands.forEach(function(c){if(out.length<n&&out.indexOf(c)<0&&(allowNeg||c>=0))out.push(c)});
  var k=1;while(out.length<n){var c=ans+k*(k%2?1:-1)*Math.ceil(k/2);if(out.indexOf(c)<0&&(allowNeg||c>=0))out.push(c);k++}
  return sh(out);
}
function dq(g){
  var a,b,c,q,ans,em=false,n=4;
  if(g===0){var k=rr(1,6),e=DE[ri(DE.length)];q=e.repeat(k);ans=k;em=true;n=3;return {q:q,ans:ans,ch:sh([ans].concat(sh([1,2,3,4,5,6].filter(function(v){return v!==ans})).slice(0,2))),em:em,n:3,say:'How many?'}}
  if(g===1){if(Math.random()<.65){a=rr(1,9);b=rr(1,10-a);q=a+' + '+b;ans=a+b}else{a=rr(2,10);b=rr(1,a);q=a+' − '+b;ans=a-b}}
  else if(g===2){if(Math.random()<.5){a=rr(5,15);b=rr(2,20-a);q=a+' + '+b;ans=a+b}else{a=rr(8,20);b=rr(2,a-1);q=a+' − '+b;ans=a-b}}
  else if(g===3){var m=Math.random();if(m<.5){a=rr(2,5);b=rr(2,10);q=a+' × '+b;ans=a*b}else if(m<.8){a=rr(12,60);b=rr(11,39);q=a+' + '+b;ans=a+b}else{a=rr(40,99);b=rr(11,a-1);q=a+' − '+b;ans=a-b}}
  else if(g===4){var m4=Math.random();if(m4<.55){a=rr(2,10);b=rr(2,10);q=a+' × '+b;ans=a*b}else if(m4<.85){b=rr(2,10);ans=rr(2,10);q=(b*ans)+' ÷ '+b}else{a=rr(100,500);b=rr(50,400);q=a+' + '+b;ans=a+b}}
  else if(g===5){var m5=Math.random();if(m5<.4){a=rr(3,12);b=rr(3,9);c=rr(1,20);q=a+' × '+b+' − '+c;ans=a*b-c;if(ans<0){c=0;q=a+' × '+b;ans=a*b}}else if(m5<.7){a=rr(2,9);b=rr(2,9);c=rr(2,6);q='('+a+' + '+b+') × '+c;ans=(a+b)*c}else{b=rr(3,12);ans=rr(5,15);q=(b*ans)+' ÷ '+b}}
  else{var m6=Math.random();if(m6<.3){a=rr(6,15);b=rr(6,15);q=a+' × '+b;ans=a*b}else if(m6<.55){a=rr(2,12);b=rr(a+1,25);q=a+' − '+b;ans=a-b}else if(m6<.8){a=rr(2,9);b=rr(2,9);c=rr(2,9);q=a+' × '+b+' + '+c;ans=a*b+c}else{b=rr(4,15);ans=rr(6,20);q=(b*ans)+' ÷ '+b}}
  var neg=ans<0;
  return {q:q+' = ?',ans:ans,ch:uniq(ans,[ans+1,ans-1,ans+10,ans-10,ans+2,ans-2],4,neg),em:false,n:4,say:null};
}
function dash(g){
  var TH=g===0?[4,7,10]:[6,10,14],right=0,best=0,busy=false,cur;
  var t=timed(g===0?60:45,function(){end()});
  function end(){if(!run||run.over)return;var st=right>=TH[2]?3:right>=TH[1]?2:right>=TH[0]?1:0;finish(run.score,st,right+' correct')}
  function next(){
    busy=false;cur=dq(g);
    $m().innerHTML='<div class="bq '+(cur.em?'em':'')+'" aria-live="polite">'+esc(cur.q)+'</div><div class="bc '+(cur.n===3?'c3':'c2')+'">'+cur.ch.map(function(v){return '<button data-v="'+v+'">'+v+'</button>'}).join('')+'</div>';
    if(g===0&&right===0)speak('How many?');
  }
  $m().addEventListener('pointerdown',function(e){
    var b=e.target.closest('.bc button');if(!b||busy||!run||run.over)return;
    busy=true;var v=+b.dataset.v;
    if(v===cur.ans){
      right++;run.streak++;run.score+=10+(run.streak>=3?5:0);setScore(run.score);b.classList.add('ok');ok();
      T(next,g===0?450:160);
    }else{
      run.streak=0;b.classList.add('no');bad();t.sub(g===0?0:1.5);
      Array.prototype.forEach.call($m().querySelectorAll('.bc button'),function(x){if(+x.dataset.v===cur.ans)x.classList.add('ok')});
      T(next,g===0?800:450);
    }
  });
  next();
}

/* ---------- 4. Odd One Out ---------- */
var OE=['🍎','🐸','🌞','🚗','🐟','🎈','🍌','🐶','🏠','⚽','🌳','🍪'];
var OM=[['🍎','🍏'],['🐶','🐱'],['🐻','🐼'],['🌞','🌝'],['🚗','🚕'],['🦊','🐱'],['🍊','🍋'],['🐰','🐭'],['🍓','🍒'],['⭐','🌟']];
var OH=[['😀','😃'],['😊','🙂'],['🐶','🐕'],['🕐','🕑'],['🔺','🔻'],['🔵','🟦'],['🌕','🌖'],['b','d'],['p','q'],['6','9'],['m','w'],['O','Q'],['E','F'],['🙂','🙃'],['↩️','↪️'],['🍎','🍅']];
function odd(g){
  var n=[4,6,9,9,12,16,16][g],cols=[2,3,3,3,4,4,4][g],rows=Math.ceil(n/cols);
  var TH=g<=1?[4,7,10]:[5,9,13],right=0,busy=false,ans=-1;
  var t=timed(g===0?60:40,function(){end()});
  function end(){if(!run||run.over)return;finish(run.score,right>=TH[2]?3:right>=TH[1]?2:right>=TH[0]?1:0,right+' found')}
  function next(){
    busy=false;var pr;
    if(g<=1){var q=sh(OE);pr=[q[0],q[1]]}else if(g<=3)pr=OM[ri(OM.length)].slice();else pr=OH[ri(OH.length)].slice();
    if(Math.random()<.5)pr.reverse();
    ans=ri(n);var cells='';
    for(var i=0;i<n;i++)cells+='<button data-i="'+i+'" aria-label="Picture '+(i+1)+'">'+esc(i===ans?pr[1]:pr[0])+'</button>';
    $m().innerHTML='<div class="cr">Tap the one that is <b>different</b></div><div class="og" id="og" style="--cols:'+cols+'">'+cells+'</div>';
    var og=document.getElementById('og');
    resizeFn=function(){var w=Math.min(og.parentNode.clientWidth,window.innerWidth-28),hAvail=window.innerHeight-210;var cell=Math.max(48,Math.min((w-10*(cols-1))/cols,(hAvail-10*(rows-1))/rows));og.style.width=(cell*cols+10*(cols-1))+'px';og.style.setProperty('--fs',Math.floor(cell*.56)+'px')};
    resizeFn();
    if(g===0&&right===0)speak('Find the one that is different!');
  }
  $m().addEventListener('pointerdown',function(e){
    var b=e.target.closest('.og button');if(!b||busy||!run||run.over)return;
    busy=true;var i=+b.dataset.i;
    if(i===ans){right++;run.streak++;run.score+=10+(run.streak>=3?5:0);setScore(run.score);b.classList.add('ok');ok();T(next,220)}
    else{run.streak=0;b.classList.add('no');bad();t.sub(2);var og=document.getElementById('og');if(og&&og.children[ans])og.children[ans].classList.add('ok');T(next,650)}
  });
  next();
}

/* ---------- 5. Word Whiz ---------- */
var WL={
 1:[['cat','🐱'],['dog','🐶'],['sun','☀️'],['hat','🎩'],['bus','🚌'],['pig','🐷'],['cow','🐮'],['bed','🛏️'],['cup','☕'],['bee','🐝'],['fox','🦊'],['key','🔑']],
 2:[['frog','🐸'],['star','⭐'],['fish','🐟'],['bear','🐻'],['cake','🎂'],['ship','🚢'],['moon','🌙'],['tree','🌳'],['bird','🐦'],['duck','🦆'],['milk','🥛'],['rain','🌧️']],
 3:[['apple','🍎'],['grape','🍇'],['tiger','🐯'],['plane','✈️'],['train','🚆'],['house','🏠'],['cloud','☁️'],['river','🏞️'],['horse','🐴'],['pizza','🍕'],['snake','🐍'],['clock','🕒']],
 4:[['planet','🪐'],['garden','🌷'],['rabbit','🐰'],['pencil','✏️'],['butter','🧈'],['window','🪟'],['monkey','🐵'],['banana','🍌'],['castle','🏰'],['rocket','🚀'],['turtle','🐢'],['guitar','🎸']],
 5:[['library','📚'],['kitchen','🍳'],['rainbow','🌈'],['captain','🧑‍✈️'],['dolphin','🐬'],['penguin','🐧'],['volcano','🌋'],['balloon','🎈'],['giraffe','🦒'],['musical','🎶'],['monster','👾'],['popcorn','🍿']],
 6:[['mountain','⛰️'],['treasure','💎'],['football','🏈'],['elephant','🐘'],['notebook','📓'],['hospital','🏥'],['airplane','🛩️'],['umbrella','☂️'],['dinosaur','🦕'],['computer','💻'],['sandwich','🥪'],['scissors','✂️']]
};
function word(g){
  if(g===0)return letters();
  var list=sh(WL[g]),wi=0,right=0,TH=g>=5?[2,4,6]:[3,5,8],busy=false,cur,slots,tiles;
  var t=timed(60,function(){end()});
  function end(){if(!run||run.over)return;finish(run.score,right>=TH[2]?3:right>=TH[1]?2:right>=TH[0]?1:0,right+' words')}
  function scr(w){var l=w.split(''),s;var k=0;do{s=sh(l);k++}while(s.join('')===w&&k<20);return s}
  function next(){
    busy=false;if(wi>=list.length){list=sh(WL[g]);wi=0}
    cur=list[wi++];var w=cur[0];tiles=scr(w);slots=[];
    var tw=Math.max(34,Math.min(60,Math.floor((Math.min(window.innerWidth,520)-40-8*(w.length-1))/w.length)));
    $m().innerHTML='<div class="bq em" style="min-height:0;font-size:clamp(64px,22vw,96px)" aria-hidden="true">'+cur[1]+'</div><div class="cr">'+w.length+' letters</div><div class="wr" id="wr" style="--tw:'+tw+'px">'+w.split('').map(function(_,i){return '<button data-s="'+i+'" aria-label="Letter slot '+(i+1)+'"></button>'}).join('')+'</div><div class="wt" id="wt" style="--tw:'+tw+'px">'+tiles.map(function(c,i){return '<button data-t="'+i+'" aria-label="Letter '+c+'">'+c.toUpperCase()+'</button>'}).join('')+'</div><button class="bsk" id="bsk">Skip ⏭</button>';
    document.getElementById('bsk').onclick=function(){if(!busy){run.streak=0;next()}};
  }
  function paint(){
    var wr=document.getElementById('wr'),wt=document.getElementById('wt');if(!wr)return;
    Array.prototype.forEach.call(wr.children,function(b,i){var ti=slots[i];b.textContent=ti!=null?tiles[ti].toUpperCase():'';b.classList.toggle('f',ti!=null)});
    Array.prototype.forEach.call(wt.children,function(b,i){b.disabled=slots.indexOf(i)>=0})
  }
  $m().addEventListener('pointerdown',function(e){
    if(!run||run.over||busy)return;
    var tb=e.target.closest('.wt button'),sb=e.target.closest('.wr button');
    if(tb&&!tb.disabled){
      slots.push(+tb.dataset.t);snd(520);paint();
      if(slots.length===cur[0].length){
        var guess=slots.map(function(i){return tiles[i]}).join('');
        busy=true;
        if(guess===cur[0]){right++;run.streak++;run.score+=20+(cur[0].length-3)*5;setScore(run.score);document.getElementById('wr').classList.add('pop');ok();T(next,650)}
        else{run.streak=0;bad();document.getElementById('wr').classList.add('no');t.sub(2);T(function(){slots=[];busy=false;var w=document.getElementById('wr');if(w)w.classList.remove('no');paint()},600)}
      }
    }else if(sb){
      var si=+sb.dataset.s;if(slots[si]!=null){slots.splice(si,1);paint()}
    }
  });
  next();
}
function letters(){
  var AL='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),right=0,busy=false,cur,TH=[5,9,13];
  var t=timed(60,function(){end()});
  function end(){if(!run||run.over)return;finish(run.score,right>=TH[2]?3:right>=TH[1]?2:right>=TH[0]?1:0,right+' letters')}
  function next(){
    busy=false;var L=AL[ri(26)];var ch=[L];while(ch.length<6){var c=AL[ri(26)];if(ch.indexOf(c)<0)ch.push(c)}ch=sh(ch);cur=L;
    $m().innerHTML='<div class="cr">Find this letter</div><div class="bq" style="font-size:clamp(84px,28vw,130px);margin:0 0 14px" aria-label="Letter '+L+'">'+L.toLowerCase()+'</div><div class="bc c3">'+ch.map(function(c){return '<button data-v="'+c+'" aria-label="Letter '+c+'">'+c+'</button>'}).join('')+'</div>';
    speak('Find the letter '+L);
  }
  $m().addEventListener('pointerdown',function(e){
    var b=e.target.closest('.bc button');if(!b||busy||!run||run.over)return;busy=true;
    if(b.dataset.v===cur){right++;run.streak++;run.score+=10+(run.streak>=3?5:0);setScore(run.score);b.classList.add('ok');ok();T(next,420)}
    else{run.streak=0;b.classList.add('no');bad();Array.prototype.forEach.call($m().querySelectorAll('.bc button'),function(x){if(x.dataset.v===cur)x.classList.add('ok')});T(next,850)}
  });
  next();
}

/* ---------- 6. Color Clash ---------- */
function clash(g){
  var nc=[3,4,4,5,5,6,6][g],names=CN.slice(0,nc),TH=g<=1?[6,10,14]:[6,11,16],right=0,busy=false,cur,rule='ink',count=0;
  var t=timed(40,function(){end()});
  function end(){if(!run||run.over)return;finish(run.score,right>=TH[2]?3:right>=TH[1]?2:right>=TH[0]?1:0,right+' correct')}
  function next(){
    busy=false;var ans=names[ri(nc)];
    if(g<=1){
      cur=ans;
      $m().innerHTML='<div class="cr">Tap the <b>same color</b></div><div class="cd pop" style="background:'+INK[ans]+'" aria-label="'+ans+' circle"></div><div class="bc '+(nc===3?'c3':'c2')+'">'+sh(names).map(function(n){return '<button class="sw" data-v="'+n+'" style="background:'+INK[n]+';border-color:'+INK[n]+';min-height:84px" aria-label="'+n+'"></button>'}).join('')+'</div>';
      if(right===0)speak('Tap the same color!');
      return;
    }
    if(g>=4&&count>0&&count%5===0)rule=rule==='ink'?'word':'ink';
    var word=names[ri(nc)],ink=Math.random()<.3?word:names.filter(function(n){return n!==word})[ri(nc-1)];
    cur=rule==='ink'?ink:word;count++;
    $m().innerHTML='<div class="cr">'+(rule==='ink'?'Tap the <b>INK COLOR</b>':'Tap what the <b>WORD SAYS</b>')+'</div><div class="cw" style="color:'+INK[ink]+'" aria-label="'+(rule==='ink'?'The word '+word+' written in '+ink+' ink':'The word '+word)+'">'+word.toUpperCase()+'</div><div class="bc c2" style="margin-top:12px">'+sh(names).map(function(n){return '<button data-v="'+n+'" style="font-size:22px;min-height:68px">'+n+'</button>'}).join('')+'</div>';
  }
  $m().addEventListener('pointerdown',function(e){
    var b=e.target.closest('.bc button');if(!b||busy||!run||run.over)return;busy=true;
    if(b.dataset.v===cur){right++;run.streak++;run.score+=10+(run.streak>=3?5:0);setScore(run.score);b.classList.add('ok');ok();T(next,g<=1?380:200)}
    else{run.streak=0;b.classList.add('no');bad();t.sub(1.5);Array.prototype.forEach.call($m().querySelectorAll('.bc button'),function(x){if(x.dataset.v===cur)x.classList.add('ok')});T(next,650)}
  });
  next();
}


/* ---------- generic multiple-choice engine ---------- */
function mcq(g,gen,TH,secs){
  var right=0,busy=false,cur,t=timed(secs,function(){end()});
  function end(){if(!run||run.over)return;finish(run.score,right>=TH[2]?3:right>=TH[1]?2:right>=TH[0]?1:0,right+' correct')}
  function next(){
    busy=false;cur=gen(g);run.ans=String(cur.ans);
    $m().innerHTML=(cur.hint?'<div class="cr">'+esc(cur.hint)+'</div>':'')+'<div class="bq '+(cur.em?'em':'')+'" aria-live="polite" style="'+(cur.qs||'')+'">'+esc(cur.q)+'</div><div class="bc '+(cur.n===3?'c3':'c2')+'">'+cur.ch.map(function(v){return '<button data-v="'+esc(v)+'"'+(cur.bs?' style="'+cur.bs+'"':'')+'>'+esc(v)+'</button>'}).join('')+'</div>';
    if(g===0&&right===0)speak(cur.hint||'');
  }
  $m().addEventListener('pointerdown',function(e){
    var b=e.target.closest('.bc button');if(!b||busy||!run||run.over)return;busy=true;
    if(b.dataset.v===String(cur.ans)){right++;run.streak++;run.score+=10+(run.streak>=3?5:0);setScore(run.score);b.classList.add('ok');ok();T(next,g<=1?420:180)}
    else{run.streak=0;b.classList.add('no');bad();t.sub(g===0?0:1.5);Array.prototype.forEach.call($m().querySelectorAll('.bc button'),function(x){if(x.dataset.v===String(cur.ans))x.classList.add('ok')});T(next,g<=1?800:520)}
  });
  next();
}
function numch(ans,n,neg){var c=[ans+1,ans-1,ans+2,ans-2,ans+10,ans-10,ans*2];return uniq(ans,sh(c),n,neg).map(String)}
/* ---------- Pattern Pop ---------- */
var PE=['🔴','🔵','🟢','🟡','🟣','🟠','⭐','🌙','🍎','🍌','🐶','🐱'];
function patq(g){
  if(g<=1){
    var e=sh(PE).slice(0,3),forms=g===0?[[0,1,0,1,0,1],[0,0,1,0,0,1]]:[[0,1,0,1,0,1],[0,0,1,0,0,1],[0,1,2,0,1,2],[0,1,1,0,1,1],[0,1,2,2,0,1]];
    var f=forms[ri(forms.length)];
    return {q:f.slice(0,5).map(function(i){return e[i]}).join(' ')+' ❓',ans:e[f[5]],ch:sh(e),em:true,n:3,hint:'What comes next?',bs:'font-size:48px'};
  }
  var a,d,arr=[],k;
  if(g===2){d=[1,2,5,10,3][ri(5)];a=rr(0,20);for(k=0;k<5;k++)arr.push(a+d*k)}
  else if(g===3){d=rr(3,9);if(Math.random()<.3){a=rr(40,70);for(k=0;k<5;k++)arr.push(a-d*k)}else{a=rr(0,15);for(k=0;k<5;k++)arr.push(a+d*k)}}
  else if(g===4){var m=ri(3);if(m===0){a=rr(1,5);for(k=0;k<5;k++)arr.push(a*Math.pow(2,k))}else if(m===1){a=rr(1,3);for(k=0;k<5;k++)arr.push(a*Math.pow(3,k))}else{a=rr(5,20);var u=rr(3,8),v=rr(1,u-1);arr=[a];for(k=1;k<5;k++)arr.push(arr[k-1]+(k%2?u:-v))}}
  else if(g===5){var m5=ri(3);if(m5===0){for(k=1;k<=5;k++)arr.push(k*k+rr(0,0))}else if(m5===1){a=rr(1,5);d=rr(1,3);arr=[a];for(k=1;k<5;k++)arr.push(arr[k-1]+d*k)}else{a=rr(2,9);d=rr(2,5);arr=[a];for(k=1;k<5;k++)arr.push(arr[k-1]*(k%2?2:1)+(k%2?0:d))}}
  else{var m6=ri(4);if(m6===0){var x=rr(1,4),y=rr(1,5);arr=[x,y];for(k=2;k<6;k++)arr.push(arr[k-1]+arr[k-2])}else if(m6===1){for(k=1;k<=5;k++)arr.push(k*k*k)}else if(m6===2){a=rr(2,4);var r=rr(3,4);for(k=0;k<5;k++)arr.push(a*Math.pow(r,k))}else{a=rr(1,5);arr=[a];for(k=1;k<6;k++)arr.push(arr[k-1]+k*k)}}
  var ans=arr[arr.length-1],shown=arr.slice(0,arr.length-1);
  return {q:shown.join(', ')+', ?',ans:ans,ch:numch(ans,4,false),n:4,hint:'Find the rule. What comes next?',qs:'font-size:clamp(28px,8vw,44px)'};
}
function pat(g){mcq(g,patq,g<=1?[4,7,10]:[4,7,10],g===0?60:50)}
/* ---------- Number Detective ---------- */
function missq(g){
  var a,b,c,ans,q,m;
  if(g<=2){m=ri(3);if(m===0){a=rr(2,9);ans=rr(1,10-a>0?10-a:1);b=a+ans;q='? + '+a+' = '+b;ans=b-a}else if(m===1){a=rr(5,15);ans=rr(2,20-a);q=a+' + ? = '+(a+ans)}else{b=rr(3,9);ans=rr(b+1,20);q='? − '+b+' = '+(ans-b)}}
  else if(g===3){m=ri(3);if(m===0){a=rr(2,9);ans=rr(2,9);q=a+' × ? = '+(a*ans)}else if(m===1){a=rr(12,60);ans=rr(11,40);q='? + '+a+' = '+(a+ans)}else{ans=rr(11,60);b=rr(5,10);q='? − '+b+' = '+(ans-b)}}
  else if(g===4){m=ri(3);if(m===0){b=rr(2,9);ans=rr(5,12);q='? ÷ '+b+' = '+ans;ans=b*ans}else if(m===1){a=rr(3,9);ans=rr(3,12);q='? × '+a+' = '+(a*ans)}else{a=rr(2,5);ans=rr(3,10);c=rr(1,9);q=a+' × ? + '+c+' = '+(a*ans+c)}}
  else if(g===5){m=ri(3);if(m===0){a=rr(2,6);ans=rr(2,12);c=rr(1,15);q=a+'x + '+c+' = '+(a*ans+c)+',  x = ?'}else if(m===1){a=rr(2,5);ans=rr(2,10);c=rr(1,10);q=a+'x − '+c+' = '+(a*ans-c)+',  x = ?'}else{ans=rr(3,15);a=rr(2,9);q='x ÷ '+a+' + '+rr(1,1)+' = ?  (x = '+(a*ans)+')';ans=ans+1}}
  else{m=ri(3);if(m===0){a=rr(2,9);ans=rr(2,12);c=rr(1,20);q=a+'x − '+c+' = '+(a*ans-c)+',  x = ?'}else if(m===1){a=rr(2,6);ans=rr(2,10);c=rr(1,6);q=a+'(x + '+c+') = '+(a*(ans+c))+',  x = ?'}else{ans=rr(-9,-1);a=rr(2,9);c=rr(1,12);q=a+'x + '+c+' = '+(a*ans+c)+',  x = ?'}}
  return {q:q,ans:ans,ch:numch(ans,4,g>=6),n:4,hint:g===0?'':'Find the missing number',qs:'font-size:clamp(28px,8.5vw,46px)'};
}
function miss(g){mcq(g,missq,[5,9,13],50)}
/* ---------- Size Showdown ---------- */
function fr(n,d){return {l:n+'/'+d,v:n/d}}
function cmpq(g){
  var A,B,rule='bigger';
  if(g<=3){var m=ri(2);if(g<=2||m===0){var a=g<=2?rr(5,60):rr(100,899),b=a+(Math.random()<.5?-1:1)*rr(1,g<=2?9:40);A={l:String(a),v:a};B={l:String(b),v:b}}else{var d1=rr(2,8),d2=rr(2,8);while(d2===d1)d2=rr(2,8);A=fr(1,d1);B=fr(1,d2)}}
  else if(g===4){var m4=ri(2);if(m4===0){var d=rr(4,10),n1=rr(1,d-1),n2=rr(1,d-1);while(n2===n1)n2=rr(1,d-1);A=fr(n1,d);B=fr(n2,d)}else{var x=rr(100,999),y=x+rr(1,60)*(Math.random()<.5?-1:1);A={l:String(x),v:x};B={l:String(y),v:y}}}
  else if(g===5){var m5=ri(3);if(m5===0){var p=rr(1,9)/10,q2=p+(rr(1,9)/100)*(Math.random()<.5?1:-1);q2=Math.round(q2*100)/100;A={l:p.toFixed(1),v:p};B={l:q2.toFixed(2),v:q2}}else if(m5===1){var dd=rr(2,10),nn=rr(1,dd-1),dec=Math.round(rr(1,99))/100;A=fr(nn,dd);B={l:dec.toFixed(2),v:dec}}else{var d3=rr(3,9),n3=rr(1,d3-1),d4=rr(3,9),n4=rr(1,d4-1);A=fr(n3,d3);B=fr(n4,d4)}}
  else{var m6=ri(3);if(m6===0){var u=rr(-20,20),w=rr(-20,20);A={l:String(u),v:u};B={l:String(w),v:w}}else if(m6===1){var pc=rr(10,95),dn=rr(2,8),nm=rr(1,dn-1);A={l:pc+'%',v:pc/100};B=fr(nm,dn)}else{var f1=rr(1,9)/10,f2=Math.round((f1+(rr(1,9)/100)*(Math.random()<.5?1:-1))*100)/100;A={l:'0.'+Math.round(f1*10),v:f1};B={l:f2.toFixed(2),v:f2}}if(Math.random()<.4)rule='smaller'}
  if(A.v===B.v){return cmpq(g)}
  var big=A.v>B.v?A:B,sm=A.v>B.v?B:A,ans=rule==='bigger'?big.l:sm.l;
  if(A.l===B.l)return cmpq(g);
  return {q:'',ans:ans,ch:sh([A.l,B.l]),n:2,hint:'Tap the '+rule+' one',bs:'font-size:clamp(30px,9vw,48px);min-height:120px'};
}
function cmp(g){mcq(g,cmpq,[6,10,14],45)}
/* ---------- Sort Squad ---------- */
var CATS={animals:['🐶','🐱','🐸','🐟','🐦','🐵','🐰','🦊'],food:['🍎','🍌','🍕','🍓','🍪','🥕','🍇','🍞'],rides:['🚗','🚌','✈️','🚲','🚀','🚂','🚁','🛵']};
var PR=[2,3,5,7,11,13,17,19,23,29,31,37];
function sortg(g){
  var right=0,busy=false,TH=[3,5,7],t=timed(55,function(){end()}),tgt,found,items;
  function end(){if(!run||run.over)return;finish(run.score,right>=TH[2]?3:right>=TH[1]?2:right>=TH[0]?1:0,right+' rounds')}
  function next(){
    busy=false;var k=rr(3,4),hint,yes,no,n,cols;
    if(g<=3){var keys=sh(Object.keys(CATS)),tk=keys[0];yes=sh(CATS[tk]).slice(0,k);no=sh(CATS[keys[1]].concat(CATS[keys[2]])).slice(0,9-k);hint='Tap every '+({animals:'animal 🐾',food:'food 🍽️',rides:'ride 🚗'})[tk];n=9;cols=3}
    else{var rules=[['even number',function(v){return v%2===0}],['multiple of 3',function(v){return v%3===0}],['multiple of 5',function(v){return v%5===0}],['prime number',function(v){return PR.indexOf(v)>=0}]],ru=rules[ri(g>=4?4:3)],pool=[];for(var v=2;v<=40;v++)pool.push(v);
      var ys=sh(pool.filter(ru[1])).slice(0,k+1),ns=sh(pool.filter(function(v){return !ru[1](v)})).slice(0,12-ys.length);yes=ys.map(String);no=ns.map(String);hint='Tap every '+ru[0];n=12;cols=4}
    items=sh(yes.map(function(v){return {v:v,y:1}}).concat(no.map(function(v){return {v:v,y:0}})));found=0;tgt=yes.length;
    run.ans=items.map(function(x,i){return x.y?i:-1}).filter(function(i){return i>=0}).join(',');
    var rows=Math.ceil(items.length/cols);
    $m().innerHTML='<div class="cr" aria-live="polite">'+esc(hint)+'</div><div class="og" id="og" style="--cols:'+cols+'">'+items.map(function(x,i){return '<button data-i="'+i+'">'+esc(x.v)+'</button>'}).join('')+'</div>';
    var og=document.getElementById('og');
    resizeFn=function(){var w=Math.min(og.parentNode.clientWidth,window.innerWidth-28),hA=window.innerHeight-210;var cell=Math.max(48,Math.min((w-10*(cols-1))/cols,(hA-10*(rows-1))/rows));og.style.width=(cell*cols+10*(cols-1))+'px';og.style.setProperty('--fs',Math.floor(cell*(g<=3?.56:.42))+'px')};
    resizeFn();
    if(g<=1&&right===0)speak(hint.replace(/[^\w ]/g,''));
  }
  $m().addEventListener('pointerdown',function(e){
    var b=e.target.closest('.og button');if(!b||busy||!run||run.over||b.classList.contains('ok'))return;
    var it=items[+b.dataset.i];
    if(it.y){b.classList.add('ok');found++;snd(600+found*80);if(found===tgt){busy=true;right++;run.streak++;run.score+=20+(run.streak>=3?5:0);setScore(run.score);ok();T(next,380)}}
    else{run.streak=0;b.classList.add('no');bad();t.sub(2);T(function(){b.classList.remove('no')},320)}
  });
  next();
}
/* ---------- Digit Memory ---------- */
function digit(g){
  var back=g>=6,len=3,lives=2,bestLen=0,TH=back?[3,5,7]:[4,6,8],digits,entry,inp=false;
  function round(){
    digits=[];while(digits.length<len){var d=ri(10);if(digits[digits.length-1]!==d)digits.push(d)}
    run.ans=(back?digits.slice().reverse():digits).join('');entry=[];inp=false;
    $m().innerHTML='<div class="cr" id="dc" aria-live="polite">Remember '+len+' digits'+(back?' — then type them <b>BACKWARDS</b>':'')+'</div><div class="bq" id="dd" style="font-size:clamp(90px,30vw,150px);min-height:150px"></div><div class="fine">'+(lives>1?'❤️'.repeat(lives):'❤️')+'</div>';
    digits.forEach(function(d,i){T(function(){var e=document.getElementById('dd');if(e)e.textContent=d;snd(440+d*40)},900+i*850);T(function(){var e=document.getElementById('dd');if(e)e.textContent=''},900+i*850+600)});
    T(pad,900+len*850);
  }
  function pad(){
    inp=true;var slots='';for(var i=0;i<len;i++)slots+='<button disabled data-s="'+i+'"></button>';
    $m().innerHTML='<div class="cr">Type them'+(back?' <b>BACKWARDS</b>':' in order')+'</div><div class="wr" id="wr" style="--tw:'+Math.max(34,Math.min(54,Math.floor(320/len)))+'px">'+slots+'</div><div class="bc c3" id="kp" style="max-width:340px">'+[1,2,3,4,5,6,7,8,9,'⌫',0].map(function(k){return '<button data-k="'+k+'" style="min-height:62px;font-size:28px"'+(k==='⌫'?' aria-label="Delete"':'')+'>'+k+'</button>'}).join('')+'</div>';
    paint();
  }
  function paint(){var wr=document.getElementById('wr');if(!wr)return;Array.prototype.forEach.call(wr.children,function(b,i){b.textContent=entry[i]!=null?entry[i]:'';b.classList.toggle('f',entry[i]!=null)})}
  $m().addEventListener('pointerdown',function(e){
    var b=e.target.closest('#kp button');if(!b||!inp||!run||run.over)return;
    var k=b.dataset.k;
    if(k==='⌫'){entry.pop();paint();return}
    entry.push(+k);snd(500);paint();
    if(entry.length===len){
      inp=false;var good=entry.join('')===run.ans;
      if(good){bestLen=len;run.score=bestLen*50;setScore(run.score);ok();len++;var w=document.getElementById('wr');if(w)w.classList.add('pop');if(len>12){T(function(){finish(run.score,3,'Incredible memory!')},500);return}T(round,800)}
      else{lives--;bad();var w2=document.getElementById('wr');if(w2)w2.classList.add('no');if(lives<=0)T(function(){finish(bestLen*50,bestLen>=TH[2]?3:bestLen>=TH[1]?2:bestLen>=TH[0]?1:0,'Best: '+bestLen+' digits')},900);else T(round,1000)}
    }
  });
  round();
}

window.BG={LINEUP:LINEUP,ans:function(){return run&&run.ans},GM:GM,view:view,open:open,close:close,rec:rec,best:best,totalStars:totalStars,css:injectCss,_dq:dq};
})();
