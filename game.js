'use strict';

// ===== INISIALISASI CANVAS & SAVE DATA (LOCALSTORAGE) =====
const C=document.getElementById('c'),X=C.getContext('2d'),U=document.getElementById('ui'),PB=document.getElementById('pb'),TC=document.getElementById('tc');
const W=800,H=450,T=32;C.width=W;C.height=H;X.imageSmoothingEnabled=false;
const KEY='apm_save_v1';
const D={best:0,total:0,coins:0,score:0,done:[],owned:['pensil'],skin:'pensil',acc:[],last:1,tix:0,spinDay:'',spinUsed:0,snd:true,touch:('ontouchstart' in window)||matchMedia('(pointer:coarse)').matches};
let S;try{S=Object.assign({},D,JSON.parse(localStorage.getItem(KEY)))}catch(e){S={...D}}
S.done=[...(S.done||[])];
S.owned=Array.isArray(S.owned)?[...S.owned]:['pensil'];
if(!S.owned.includes('pensil'))S.owned.push('pensil');
if(!S.owned.includes(S.skin))S.skin='pensil';
S.acc=Array.isArray(S.acc)?S.acc.filter(id=>S.owned.includes(id)):[];
if(S.shoe&&S.owned.includes(S.shoe)&&!S.acc.includes(S.shoe))S.acc.push(S.shoe);
delete S.shoe;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
addEventListener('beforeunload',save);addEventListener('pagehide',save);

// ===== LEVELS =====
const L=[
{n:'Dunia Angka',len:70,sp:50,g:[[20,2],[40,2]],p:[[12,9,4],[26,9,3],[30,7,3],[46,9,4],[55,9,3]],e:[10,18,24,33,37,45,52,58,63],lab:'0123456789'.split('')},
{n:'Hutan Operasi',len:85,sp:60,g:[[18,3],[34,3],[52,3],[66,2]],p:[[10,9,3],[22,9,3],[26,7,3],[38,9,4],[44,9,3],[48,7,3],[58,9,3],[62,9,2],[72,9,4]],e:[12,16,24,30,37,42,48,56,62,70,76],lab:['+','-','×']},
{n:'Gunung Perkalian',len:100,sp:70,g:[[14,3],[28,3],[40,3],[54,3],[68,3],[82,3]],p:[[10,9,3],[18,9,3],[22,7,3],[26,5,3],[32,9,3],[36,7,3],[44,9,3],[47,7,3],[50,5,3],[58,9,3],[62,7,3],[72,9,3],[75,7,3],[78,5,3],[86,9,3],[90,7,3]],e:[12,20,24,33,38,46,52,60,64,74,80,88,94],lab:['×','6×7','9','×','8×8']},
{n:'Labirin Pembagian',len:100,sp:80,g:[[16,2],[30,3],[46,3],[60,2],[76,3]],p:[[8,9,3],[20,9,4],[26,7,3],[36,9,3],[40,9,3],[50,9,3],[54,7,3],[64,9,3],[68,7,3],[72,5,3],[82,9,4],[88,9,3]],e:[10,14,22,28,34,40,44,52,56,66,72,80,86,92],lab:['÷','=','x²','√','12÷3']},
{n:'Kastil Rumus',len:70,sp:90,g:[[16,3],[30,3],[44,2]],p:[[10,9,3],[20,9,3],[24,7,3],[34,9,3],[38,7,3]],e:[12,22,28,36,40],lab:['π','Σ','∫','∞','x²+y²'],boss:1},
{n:'Taman Angka',len:90,sp:55,g:[[18,2],[36,3],[54,2],[72,3]],p:[[10,9,3],[22,9,3],[26,7,3],[40,9,3],[46,9,3],[58,9,4],[64,7,3],[78,9,3]],e:[12,16,24,30,34,42,48,52,60,66,76,82],lab:['1','2','3×3','5','7','9']},
{n:'Goa Rumus',len:100,sp:70,g:[[14,3],[30,3],[44,3],[60,3],[78,3]],p:[[8,9,3],[18,9,3],[22,7,3],[34,9,3],[38,7,3],[48,9,3],[52,7,3],[56,5,3],[64,9,3],[68,7,3],[82,9,3],[86,7,3]],e:[10,20,26,35,41,47,50,58,66,72,83,88,94],lab:['E=mc²','a²+b²','πr²','Δ','√x']},
{n:'Langit Matema',len:100,sp:75,g:[[16,3],[32,3],[48,3],[64,3],[80,3]],p:[[10,9,3],[20,9,3],[24,7,3],[28,5,3],[36,9,3],[42,7,3],[52,9,3],[56,7,3],[60,5,3],[68,9,3],[72,7,3],[84,9,3],[88,7,3]],e:[12,22,26,35,40,45,54,58,67,70,76,86,92],lab:['8','∞','÷','%','Σ']},
{n:'Sekolah Dasar',len:110,sp:80,g:[[16,2],[30,3],[44,2],[58,3],[74,2],[90,3]],p:[[8,9,3],[20,9,4],[26,7,3],[36,9,3],[40,9,2],[48,9,3],[52,7,3],[62,9,3],[66,7,3],[70,5,3],[80,9,3],[84,7,3],[94,9,3],[98,7,3]],e:[10,14,22,28,36,42,47,51,56,64,72,77,86,96,102],lab:['2×2','10','=','5+5','1×1']},
{n:'Buku Akhir',len:92,sp:90,g:[[14,3],[28,3],[42,3],[56,2]],p:[[8,9,3],[18,9,3],[22,7,3],[32,9,3],[36,7,3],[46,9,3],[50,7,3],[60,9,3]],e:[10,20,25,34,40,48,52,59],lab:['∫','Σ','π','dx','sin'],boss:2,bx:76,a0:62,a1:84}
];
const th=[['#5ec8ff','#d6f3ff','#58c23a','#8b5a2b','#c98a4b','#fff'],['#2f7d4f','#8fd9a8','#3f9b3f','#5d4037','#8d6e63','#1f5a35'],['#7aa7e0','#d8e8ff','#a7a7a7','#5f6368','#8a8f98','#8d99ae'],['#120a26','#2b1a4d','#7a52b8','#3b2a66','#6b4fa0','#53378a'],['#2a0535','#8a1c3c','#777','#2b2b2b','#6d6d6d','#ff6b2d'],
['#7fd4ff','#e3ffd0','#5fc23a','#8b5a2b','#d77ad9','#3f9b3f'],['#1c130d','#3b2a1e','#8a7a62','#4a3626','#6e5640','#2e2118'],['#3d9bff','#d0f0ff','#ffffff','#cfe2ff','#b9d3f5','#fff'],['#8fd8ff','#eaf8ff','#58b04a','#a67c52','#e0a030','#e8c07a'],['#f6e7bd','#e4cb8f','#7b4b22','#efe0b0','#cfb578','#c9ae72']];
const ecol=['#ff5252','#ab47bc','#ff9800','#26a69a','#ec407a'];

// ===== STATE =====
let st='menu',lv=0,P,en=[],coins=[],solids=[],cam=0,t=0,lives=3,ls=0,lvCoins=0,boss=null,pj=0;
let at=0,mi=0,mp=0,sv=0,cj=-9,lob=0;
const K={l:0,r:0,j:0};

const addScore=n=>{S.score+=n;S.total+=n;if(S.score>S.best)S.best=S.score};
const ov=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const solidAt=(x,y)=>solids.some(s=>x>=s.x&&x<s.x+s.w&&y>=s.y&&y<s.y+s.h);

function build(i){
  lv=i;const d=L[i];solids=[];coins=[];en=[];boss=null;lvCoins=0;cam=0;t=0;
  let x=0;const gs=[...d.g].sort((a,b)=>a[0]-b[0]);
  for(const[gx,gw]of gs){if(gx>x)solids.push({x:x*T,y:12*T,w:(gx-x)*T,h:2*T,g:1});
    for(let k=0;k<3;k++)coins.push({x:(gx+gw/2)*T-8+(k-1)*28,y:12*T-110+Math.abs(k-1)*22});x=gx+gw}
  solids.push({x:x*T,y:12*T,w:(d.len-x)*T,h:2*T,g:1});
  solids.filter(s=>s.g).forEach(s=>{for(let k=s.x+4*T;k<s.x+s.w-T;k+=7*T)coins.push({x:k+8,y:12*T-60})});
  d.p.forEach(([px,py,pw])=>{solids.push({x:px*T,y:py*T,w:pw*T,h:T});for(let k=0;k<pw;k++)coins.push({x:(px+k)*T+8,y:py*T-26})});
  d.e.forEach((ex,k)=>en.push({x:ex*T,y:0,w:k%5==4?38:28,h:k%5==4?22:28,sh:k%5,vx:0,vy:0,dir:-1,lab:d.lab[k%d.lab.length],col:ecol[k%5],sp:d.sp+(k%3)*8,dt:0}));
  if(d.boss){boss={x:(d.bx||58)*T,y:0,w:64,h:64,vx:0,vy:0,dir:-1,hp:3,big:1,inv:0,jt:2,a0:(d.a0||48)*T,a1:(d.a1||66)*T,dt:0,lab:'=',pi:d.boss==2,dc:3,ds:0};en.push(boss)}
  P={x:2*T,y:10*T,w:22,h:30,vx:0,vy:0,face:1,inv:1.5,cy:0,jb:0,jp:0,cp:{x:2*T,y:10*T}};
}
function start(i,sk){build(i);lives=3;ls=S.score;S.last=i+1;save();const c=CS[i+1];
  if(c&&c.pre&&!sk)cut(c.pre,()=>{st='play';ui('');bgmSync()});else{st='play';ui('');bgmSync()}}

// ===== PHYSICS =====
function move(o,dt){
  o.hitx=false;o.x+=o.vx*dt;
  for(const s of solids)if(ov(o,s)){if(o.vx>0)o.x=s.x-o.w;else if(o.vx<0)o.x=s.x+s.w;o.hitx=true}
  o.y+=o.vy*dt;o.on=false;
  for(const s of solids)if(ov(o,s)){if(o.vy>0){o.y=s.y-o.h;o.on=true;o.floor=s}else o.y=s.y+s.h;o.vy=0}
}
function hurt(){
  lives--;sfx(120,.4,'sawtooth');
  if(lives<=0){st='over';save();bgmSync();jingle('over');ui(`<h2>GAME OVER</h2><p>Skor: ${S.score}</p><div class=row><button class=g data-a=retry>Coba Lagi</button><button data-a=menu>Menu</button></div>`);return}
  P.x=P.cp.x;P.y=P.cp.y;P.vx=P.vy=0;P.inv=2;
}
function complete(){
  st='done';bgmSync();jingle('win');const b=lives*200;addScore(b);
  if(!S.done.includes(lv+1))S.done.push(lv+1);S.last=Math.min(10,lv+2);save();
  const html=lv==9?`<h1>MENANG!</h1><p>Kamu mengalahkan BOS π! Semua pelajaran Mat sudah aman!</p><p>Skor: ${S.score} • Best: ${S.best}</p><button data-a=menu>Menu Utama</button>`
  :`<h2>LEVEL SELESAI!</h2><p>${L[lv].n}<br>${lv==4?'THE GREAT EQUATION kalah! Taman Sekolah terbuka!<br>':''}Bonus nyawa: +${b} • Skor: ${S.score}</p><div class=row><button class=g data-a=next>Level Berikutnya</button><button data-a=levels>Peta</button><button data-a=menu>Menu</button></div>`;
  const fin=()=>{st='done';bgmSync();ui(html)},c=CS[lv+1];
  if(c&&c.post)cut(c.post,fin);else fin();
}

function update(dt){
  t+=dt;const d=L[lv];
  const dir=K.r-K.l,a=2200*dt;P.vx+=Math.max(-a,Math.min(a,dir*190-P.vx));if(dir)P.face=dir;
  if(K.j&&!pj)P.jb=.12;pj=K.j;P.jb-=dt;P.cy=P.on?.1:P.cy-dt;
  if(P.jb>0&&P.cy>0){P.vy=-650;P.jb=0;P.cy=0;P.jp=1;sfx(520,.12)}
  if(!K.j&&P.jp&&P.vy<-260){P.vy=-260;P.jp=0}
  P.vy=Math.min(900,P.vy+1800*dt);P.pb=P.y+P.h;move(P,dt);if(P.on)P.jp=0;
  P.x=Math.max(0,Math.min(d.len*T-P.w,P.x));P.inv-=dt;
  if(P.on&&P.floor.g&&P.x>P.floor.x+T&&P.x<P.floor.x+P.floor.w-2*T&&P.x>P.cp.x-8*T)P.cp={x:P.x,y:P.y-2};
  for(const c of coins)if(!c.got&&Math.abs(P.x+11-c.x-8)<18&&Math.abs(P.y+15-c.y-8)<22){c.got=1;S.coins++;lvCoins++;addScore(50);sfx(1000,.08)}
  for(const e of en){
    if(e.dead){e.dt-=dt;continue}
    e.vy=Math.min(900,e.vy+1800*dt);e.vx=e.dir*(e.ds>0?560:e.big?60+30*(3-e.hp):e.sp);if(e.inv>0)e.inv-=dt;
    e.pt=e.y;move(e,dt);if(e.hitx)e.dir*=-1;
    if(e.big){
      if(e.pi){if(Math.abs(P.x-e.x)<W){e.dc-=dt;if(e.ds>0){e.ds-=dt;e.x=Math.max(e.a0,Math.min(e.a1-e.w,e.x))}else if(e.dc<=0){e.dc+=3;e.ds=.45;e.dir=P.x+11<e.x+32?-1:1;sfx(180,.35,'sawtooth')}}}
      if(!(e.ds>0)){if(e.x<e.a0)e.dir=1;if(e.x+e.w>e.a1)e.dir=-1}
      e.jt-=dt;if(e.on&&e.jt<0&&!(e.ds>0)){e.vy=-560;e.jt=1.5+Math.random()}}
    else{if(e.on&&!solidAt(e.dir>0?e.x+e.w+2:e.x-2,e.y+e.h+2))e.dir*=-1;if(e.y>H+80){e.dead=1;e.dt=0}}
    if(ov(P,e)){
      const stomp=(P.vy-e.vy)>0&&(P.pb<=e.pt+12||P.y+P.h-e.y<(e.big?36:18));
      if(stomp){
        if(e.big){if(e.inv<=0){e.hp--;e.inv=1;sfx(300,.2);if(e.hp<=0){e.dead=1;e.dt=.8;addScore(1000);S.tix=(S.tix||0)+10}}}
        else{e.dead=1;e.dt=.4;addScore(100)}
        P.vy=K.j?-560:-400;P.jp=0;sfx(700,.1);
        if(e.big){P.y=e.y-P.h-1;P.on=false;P.inv=Math.max(P.inv,.5)}
      }else if(P.inv<=0){hurt();if(st!='play')return}
    }
  }
  en=en.filter(e=>!(e.dead&&e.dt<=0&&!e.big));
  if(P.y>H+80){hurt();if(st!='play')return}
  if(P.x+P.w>(d.len-3)*T&&(!boss||boss.dead))complete();
  cam=Math.max(0,Math.min(d.len*T-W,P.x-W/2+40));
}

// ===== DRAW =====
function bg(){
  const h=th[lv];let g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,h[0]);g.addColorStop(1,h[1]);X.fillStyle=g;X.fillRect(0,0,W,H);
  for(let i=0;i<14;i++){
    const px=((i*190-cam*.4)%2660+2660)%2660-120,k=i%3;X.fillStyle=lv==4?'#3a1245':h[5];
    if(lv==0){X.fillStyle='#fff';X.fillRect(px,50+k*35,64,14);X.fillRect(px+12,40+k*35,36,14)}
    else if(lv==1){X.fillStyle='#4e342e';X.fillRect(px+16,290,14,94);X.fillStyle=h[5];X.fillRect(px,230+k*10,46,70);X.fillRect(px+8,200+k*10,30,40)}
    else if(lv==2){X.beginPath();X.moveTo(px-100,384);X.lineTo(px,190+k*30);X.lineTo(px+100,384);X.fill();X.fillStyle='#fff';X.fillRect(px-14,190+k*30,28,14)}
    else if(lv==3){X.beginPath();X.moveTo(px,0);X.lineTo(px+40,0);X.lineTo(px+20,60+k*30);X.fill()}
    else if(lv==4){X.fillRect(px,150+k*30,50,234);for(let j=0;j<3;j++)X.fillRect(px+j*20,136+k*30,10,14)}
    else bgx(i,px,k)
  }
  deco();
}
function draw(){
  if(st=='cut'){drawCut();return}
  if(st=='map'){drawMap();return}
  if(st=='menu'){drawLobby();return}
  bg();const h=th[lv];
  for(const s of solids){
    const x=s.x-cam;if(x>W||x+s.w<0)continue;
    X.fillStyle=s.g?h[3]:h[4];X.fillRect(x,s.y,s.w,s.h);X.fillStyle=h[2];X.fillRect(x,s.y,s.w,8);
    X.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<s.w;i+=T)X.fillRect(x+i,s.y+8,2,s.h-8);if(!s.g)X.fillRect(x,s.y+s.h-4,s.w,4)
  }
  const d=L[lv],fx=(d.len-3)*T-cam,on=!boss||boss.dead;
  X.fillStyle='#ddd';X.fillRect(fx,200,4,184);X.fillStyle=on?'#2ecc40':'#777';X.fillRect(fx+4,204,34,22);X.fillStyle='#fff';X.font='bold 12px monospace';X.textAlign='left';X.fillText(on?'FINISH':'TERKUNCI',fx-14,194);
  for(const c of coins)if(!c.got){const w=Math.abs(Math.cos(t*4+c.x))*12+2;const cx=c.x-cam;if(cx<-40||cx>W+40)continue;X.fillStyle='#000';X.fillRect(cx+8-w/2-2,c.y-2,w+4,20);X.fillStyle='#ffd93b';X.fillRect(cx+8-w/2,c.y,w,16)}
  for(const e of en)drawE(e);
  drawP();
  if(st!='menu')hud();
}
const ES=[{ey:4,ew:8,eh:7,dx:6,ly:24,f1:15,f2:10},{ey:13,ew:5,eh:6,dx:4,ly:26,f1:12,f2:9},{ey:5,ew:8,eh:7,dx:6,ly:24,f1:15,f2:10},{ey:6,ew:8,eh:7,dx:6,ly:23,f1:15,f2:10},{ey:3,ew:7,eh:6,dx:8,ly:19,f1:11,f2:9}];
function drawE(e){
  const x=Math.round(e.x-cam),y=Math.round(e.y);if(x>W+80||x<-100)return;
  if(e.dead){X.fillStyle=e.big?'#d62839':e.col;X.fillRect(x,y+e.h-8,e.w,8);return}
  if(e.big){
    if(e.pi){drawPi(e,x,y);return}
    X.fillStyle='#000';X.fillRect(x-3,y-3,e.w+6,e.h+6);X.fillStyle=e.inv>0&&((t*14)|0)%2?'#fff':'#d62839';X.fillRect(x,y,e.w,e.h);
    X.fillStyle='#ffd93b';for(let i=0;i<4;i++)X.fillRect(x+i*16,y-8,10,8);
    X.fillStyle='#fff';X.fillRect(x+12,y+14,14,14);X.fillRect(x+38,y+14,14,14);X.fillStyle='#000';X.fillRect(x+18+e.dir*3,y+20,6,8);X.fillRect(x+44+e.dir*3,y+20,6,8);X.fillRect(x+10,y+10,18,4);X.fillRect(x+36,y+10,18,4);
    X.fillStyle='#ffd93b';X.font='bold 26px monospace';X.textAlign='center';X.fillText('= ? =',x+32,y+54);return}
  const q=ES[e.sh],w=e.w,h=e.h,cx=x+w/2;
  X.beginPath();
  if(e.sh==1){X.moveTo(cx,y);X.lineTo(x+w,y+h);X.lineTo(x,y+h);X.closePath()}
  else if(e.sh==2){X.moveTo(x+w*.25,y);X.lineTo(x+w*.75,y);X.lineTo(x+w,y+h/2);X.lineTo(x+w*.75,y+h);X.lineTo(x+w*.25,y+h);X.lineTo(x,y+h/2);X.closePath()}
  else if(e.sh==3)X.arc(cx,y+h/2,w/2,0,7);
  else X.rect(x,y,w,h);
  X.lineJoin='round';X.lineWidth=4;X.strokeStyle='#000';X.stroke();X.fillStyle=e.col;X.fill();
  const f=((t*8)|0)%2,d=Math.floor((q.ew-3)/2);X.fillStyle='#222';X.fillRect(cx-10,y+h-2,8,4+f);X.fillRect(cx+2,y+h-2,8,4+1-f);
  for(const sx of[-1,1]){const ex=Math.round(cx+sx*q.dx-q.ew/2);X.fillStyle='#fff';X.fillRect(ex,y+q.ey,q.ew,q.eh);X.fillStyle='#000';X.fillRect(ex+d+e.dir*d,y+q.ey+2,3,q.eh-3)}
  const n=e.lab.length;X.fillStyle='#fff';X.font=`bold ${n>3?8:n>2?q.f2:q.f1}px monospace`;X.textAlign='center';X.fillText(e.lab,cx,y+q.ly);
}
function drawP(){
  if(P.inv>0&&((t*20)|0)%2)return;
  X.save();X.translate(Math.round(P.x-cam+11),Math.round(P.y+15));X.scale(P.face,1);
  if((S.skin=='pensil'||S.skin=='buku')&&Math.abs(P.vx)>20&&P.on)X.rotate(Math.sin(t*18)*.1);X.translate(0,-15);
  chr(X,S.skin,S.acc,Math.abs(P.vx)>20&&P.on?Math.sin(t*18):0);X.restore();
}
function hud(){
  X.fillStyle='rgba(0,0,0,.55)';X.fillRect(0,0,W,28);X.font='bold 15px monospace';X.textAlign='left';X.fillStyle='#fff';
  X.fillText('SKOR '+S.score,8,19);X.fillStyle='#ffd93b';X.fillText('● '+S.coins,160,19);X.fillStyle='#ff4d6d';X.fillText('♥'.repeat(Math.max(0,lives)),250,19);X.fillStyle='#7ad7ff';X.fillText('🎟 '+(S.tix||0),340,19);
  X.fillStyle='#fff';X.textAlign='right';X.fillText(`LV${lv+1} ${L[lv].n}`,W-62,19);
  if(boss&&!boss.dead&&boss.x-cam<W+100){X.textAlign='center';X.fillStyle='#000';X.fillRect(W/2-102,38,204,22);X.fillStyle='#ffd93b';X.fillText(boss.pi?'BOS π (PI)':'THE GREAT EQUATION',W/2,34);X.fillStyle='#d62839';X.fillRect(W/2-100,44,66*boss.hp,14)}
  if(st=='play'&&t<2.8){
    X.textAlign='center';X.font='bold 34px monospace';X.fillStyle='#000';X.fillText(L[lv].n,W/2+2,152);X.fillStyle='#ffd93b';X.fillText(L[lv].n,W/2,150);
    const sn='♪ '+(BGM['lv'+lv]?.name||'');X.font='bold 15px monospace';X.fillStyle='#000';X.fillText(sn,W/2+1,176);X.fillStyle='#7ad7ff';X.fillText(sn,W/2,175);
  }
}

// ===== HIASAN LATAR (ANIMASI) =====
const wr=(sp,o,par,m)=>((o+at*sp-cam*par)%m+m)%m-80,ww=(a,m)=>((a%m)+m)%m;
function bird(x,y,s,c){const f=Math.sin(at*9+x*.1)*5*s;X.strokeStyle=c;X.lineWidth=2*s;X.beginPath();X.moveTo(x-9*s,y-f);X.lineTo(x,y+3*s);X.lineTo(x+9*s,y-f);X.stroke()}
function bat(x,y,s,c){const f=Math.sin(at*14+x*.1)*6*s;X.fillStyle=c;X.beginPath();X.moveTo(x,y);X.lineTo(x-15*s,y-f-4*s);X.lineTo(x-8*s,y+4*s);X.lineTo(x+8*s,y+4*s);X.lineTo(x+15*s,y-f-4*s);X.fill();X.fillRect(x-3*s,y-4*s,6*s,8*s)}
function plane(x,y,s,tr,ban){
  if(tr){X.fillStyle='rgba(255,255,255,.45)';X.fillRect(x-260,y,230,3)}
  if(ban){X.strokeStyle='#fff';X.lineWidth=2;X.beginPath();X.moveTo(x-40*s,y);X.lineTo(x-70*s,y+4);X.stroke();X.fillStyle='#fff';X.fillRect(x-170*s,y-8,100*s,24);X.fillStyle='#d62839';X.font='bold 15px monospace';X.textAlign='center';X.fillText(ban,x-120*s,y+9)}
  X.fillStyle='#e63946';X.fillRect(x-30*s,y-6*s,60*s,12*s);X.beginPath();X.moveTo(x-30*s,y-6*s);X.lineTo(x-42*s,y-18*s);X.lineTo(x-22*s,y-6*s);X.fill();
  X.fillStyle='#fff';X.fillRect(x-30*s,y-1*s,60*s,3*s);X.fillStyle='#ffd93b';X.fillRect(x-8*s,y+2*s,26*s,5*s);X.fillStyle='#9bd7ff';X.fillRect(x+8*s,y-10*s,12*s,6*s);
  const c=Math.abs(Math.cos(at*25));X.fillStyle='#222';X.fillRect(x+30*s,y-9*s*c,3*s,18*s*c)}
function deco(){
  const k=lv,R=W+240,n=ww;
  if(k==0){X.fillStyle=X.strokeStyle='#ffe066';X.lineWidth=4;X.beginPath();for(let i=0;i<12;i++){const a=i*Math.PI/6+at*.3;X.moveTo(700+Math.cos(a)*38,70+Math.sin(a)*38);X.lineTo(700+Math.cos(a)*52,70+Math.sin(a)*52)}X.stroke();X.beginPath();X.arc(700,70,28,0,7);X.fill();
    for(let i=0;i<4;i++)bird(wr(34+i*9,i*210,.3,R),70+i*36+Math.sin(at+i)*8,1.2-i*.12,'#2b3a55');
    plane(wr(85,400,.12,1900),125,1,0,'2+3=5')}
  else if(k==1){
    for(let i=0;i<3;i++)bird(wr(30+i*8,i*300,.3,R),60+i*40+Math.sin(at+i)*8,1,'#1b3d2a');
    for(let i=0;i<6;i++){const x=wr(16+i*3,i*170,.6,R),y=290-i*14+Math.sin(at*2+i*2)*26,w=Math.abs(Math.sin(at*12+i))*6+1;X.fillStyle=ecol[i%5];X.fillRect(x-w,y-3,w,6);X.fillRect(x,y-3,w,6)}
    for(let i=0;i<10;i++){X.fillStyle=i%2?'#e08a2e':'#f2c94c';X.fillRect(n(i*97+Math.sin(at*1.5+i)*14+at*14-cam*.5,W),n(i*61+at*36,H),5,3)}}
  else if(k==2){
    for(let i=0;i<2;i++)bird(wr(22+i*8,i*500,.25,R),100+i*60+Math.sin(at*.8+i)*10,1.9,'#3b2e22');
    plane(wr(70,200,.1,1900),70,.8,1,0);
    for(let i=0;i<30;i++){X.fillStyle='#fff';const z=i%3?2:3;X.fillRect(n(i*73+Math.sin(at+i)*20+at*8-cam*.5,W),n(i*53+at*(30+i%4*8),H),z,z)}}
  else if(k==3){
    for(let i=0;i<26;i++){X.fillStyle=`rgba(255,255,255,${.35+.5*Math.sin(at*2+i)**2})`;X.fillRect(n(i*83-cam*.08,W),(i*37)%210,2,2)}
    X.fillStyle='#e9e1ff';X.beginPath();X.arc(110,70,24,0,7);X.fill();X.fillStyle='#1d1238';X.beginPath();X.arc(121,64,22,0,7);X.fill();
    for(let i=0;i<7;i++){const x=n(i*131+Math.sin(at*.7+i)*25-cam*.3,W),y=130+(i*53)%190+Math.sin(at+i)*14;X.fillStyle=`rgba(170,130,255,${.3+.2*Math.sin(at*2+i)})`;X.beginPath();X.arc(x,y,11,0,7);X.fill();X.fillStyle='#e6dcff';X.beginPath();X.arc(x,y,4,0,7);X.fill()}
    for(let i=0;i<4;i++)bat(wr(40+i*14,i*260,.35,R),70+i*50+Math.sin(at*2+i)*22,1.2,'#07020f')}
  else if(k==4){
    const g=X.createLinearGradient(0,H-110,0,H);g.addColorStop(0,'rgba(255,90,20,0)');g.addColorStop(1,'rgba(255,90,20,.4)');X.fillStyle=g;X.fillRect(0,H-110,W,110);
    X.fillStyle='rgba(255,107,45,.25)';X.beginPath();X.arc(120,85,48,0,7);X.fill();X.fillStyle='#ff6b2d';X.beginPath();X.arc(120,85,34,0,7);X.fill();
    for(let i=0;i<5;i++)bat(wr(50+i*15,i*230,.35,R),60+i*45+Math.sin(at*2+i)*20,1.4,'#12001a');
    for(let i=0;i<24;i++){X.fillStyle=`rgba(255,${130+i*4},60,.8)`;X.fillRect(n(i*61+Math.sin(at+i)*14-cam*.4,W),H-n(i*47+at*(30+i%4*12),H),3,3)}
    const ph=at%8;if(ph<.15){X.fillStyle='rgba(255,255,255,.2)';X.fillRect(0,0,W,H);const bx=n((at/8|0)*251+100,W);X.strokeStyle='#fff';X.lineWidth=3;X.beginPath();X.moveTo(bx,0);X.lineTo(bx-14,70);X.lineTo(bx+8,70);X.lineTo(bx-10,150);X.stroke()}}
  else deco2(k)
}

// ===== LEVEL 6-10: LATAR, HIASAN, BOS π =====
function bgx(i,px,k){
  const m=i%4,F9=['E=mc²','∫x dx','Σn','√(a²+b²)','sin²+cos²=1','πr²','a²=b²+c²','Δ=b²-4ac','lim x→∞','log₁₀'];
  if(lv==5){
    X.fillStyle='#3f9b3f';X.beginPath();X.arc(px+25,384,48,Math.PI,0);X.fill();
    X.fillStyle='#2e7d32';X.fillRect(px+60,280+k*10,4,104);
    X.fillStyle=['#ff5c8a','#ffd93b','#b06cff','#ff8a3d'][i%4];
    for(let a=0;a<6;a++){X.beginPath();X.arc(px+62+Math.cos(a*1.047+at*.5)*10,276+k*10+Math.sin(a*1.047+at*.5)*10,8,0,7);X.fill()}
    X.fillStyle='#ffd93b';X.beginPath();X.arc(px+62,276+k*10,6,0,7);X.fill();
    if(i%3==0){X.fillStyle='#fff';X.font='bold 22px monospace';X.textAlign='center';X.fillText(i%2?'7':'3',px+25,360)}
  }else if(lv==6){
    X.fillStyle='#1c130d';X.beginPath();X.moveTo(px,0);X.lineTo(px+50,0);X.lineTo(px+25,70+k*35);X.fill();
    X.fillStyle='#4a3626';X.fillRect(px+110,250+k*10,26,134);X.fillRect(px+104,240+k*10,38,12);
    if(m<3){X.font='bold 15px monospace';X.textAlign='center';X.fillStyle=`rgba(140,255,170,${.45+.25*Math.sin(at*2+i)})`;X.fillText(['E=mc²','a²+b²=c²','πr²','(a+b)²','V=πr²t','x=-b/2a'][(i+k)%6],px+40,150+k*40)}
  }else if(lv==7){
    X.fillStyle='rgba(255,255,255,.9)';const y=60+k*60+(i%2)*80;X.beginPath();for(const[a,b,r]of[[20,0,22],[46,-10,28],[76,0,22]]){X.moveTo(px+a+r,y+b);X.arc(px+a,y+b,r,0,7)}X.fill();X.fillRect(px+20,y,56,22)
  }else if(lv==8){
    if(m==0){X.fillStyle='#e8c07a';X.fillRect(px-20,250,170,134);X.fillStyle='#c0392b';X.fillRect(px-30,236,190,16);X.fillStyle='#7ec8ff';for(let a=0;a<3;a++)for(let b=0;b<2;b++)X.fillRect(px-4+a*48,270+b*50,30,34);X.fillStyle='#6b4a2b';X.fillRect(px+110,330,26,54)}
    else if(m==1){X.fillStyle='#6d4c41';X.fillRect(px+30,300,12,84);X.fillStyle='#43a047';X.beginPath();X.arc(px+36,290,36,0,7);X.fill()}
    else if(m==2){X.fillStyle='#ccc';X.fillRect(px+40,230,5,154);X.fillStyle='#fff';X.fillRect(px+45,232,26,20);X.strokeStyle='#ff6a00';X.lineWidth=3;X.beginPath();X.moveTo(px+45,252);X.lineTo(px+70,252);X.stroke()}
    else{X.fillStyle='#8d99ae';X.fillRect(px,320,120,4);X.fillRect(px,345,120,4);for(let a=0;a<=6;a++)X.fillRect(px+a*20,310,4,74)}
  }else{
    X.font='bold 20px monospace';X.textAlign='center';X.fillStyle='rgba(90,50,20,.45)';X.fillText(F9[(i*3+k)%10],px+60,110+k*70+(i%2)*30);
    X.fillRect(px,200+k*40,100,2)
  }
}
function deco2(k){
  if(k==5){
    X.fillStyle='#ffe066';X.beginPath();X.arc(690,70,30,0,7);X.fill();
    for(let i=0;i<9;i++){const x=wr(20+i*5,i*130,.5,W+240),y=90+(i*47)%220+Math.sin(at*2+i)*26,f=Math.abs(Math.sin(at*12+i))*9+1;X.fillStyle=['#ff7ab8','#ffd93b','#7ad7ff','#b78cff'][i%4];X.fillRect(x-f-1,y-6,f+1,10);X.fillRect(x,y-6,f+1,10);X.fillStyle='#222';X.fillRect(x-1,y-5,2,10)}
    for(let i=0;i<14;i++){X.fillStyle=i%2?'#ffb3d1':'#fff';X.fillRect(ww(i*89+Math.sin(at+i)*18+at*12-cam*.5,W),ww(i*53+at*(24+i%3*8),H),4,3)}
  }else if(k==6){
    for(let i=0;i<6;i++){X.fillStyle='#7ad7ff';X.fillRect(ww(i*150+40-cam*.5,W),(at*140+i*70)%230,3,7)}
    for(let i=0;i<14;i++){X.fillStyle=`rgba(140,255,170,${.3+.5*Math.sin(at*3+i)**2})`;X.fillRect(ww(i*97+Math.sin(at+i)*20-cam*.3,W),150+(i*37)%220,3,3)}
    const g=X.createRadialGradient(W/2,H/2,160,W/2,H/2,470);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.55)');X.fillStyle=g;X.fillRect(0,0,W,H)
  }else if(k==7){
    X.globalAlpha=.5;['#ff5252','#ffb142','#ffd93b','#58c23a','#4aa8ff'].forEach((c,j)=>{X.strokeStyle=c;X.lineWidth=6;X.beginPath();X.arc(200-cam*.05,420,300-j*6,Math.PI*1.12,Math.PI*1.88);X.stroke()});X.globalAlpha=1;
    const cx=580-cam*.03,by=330,ring=(x,y,w,h,t,c)=>{X.fillStyle=c;X.fillRect(x,y,w,t);X.fillRect(x,y+h-t,w,t);X.fillRect(x,y,t,h);X.fillRect(x+w-t,y,t,h)};
    ring(cx-43,by-103,86,106,18,'#6a3d7a');ring(cx-40,by-100,80,100,12,'#ffc2e8');
    ring(cx-31,by-183,62,86,18,'#6a3d7a');ring(cx-28,by-180,56,80,12,'#ffc2e8');
    X.fillStyle='#ffc2e8';for(let a=0;a<5;a++)X.fillRect(cx-28+a*12,by-192,8,12);
    X.fillStyle='#e63946';X.beginPath();X.moveTo(cx-34,by-180);X.lineTo(cx-22,by-212);X.lineTo(cx-10,by-180);X.fill();X.beginPath();X.moveTo(cx+10,by-180);X.lineTo(cx+22,by-212);X.lineTo(cx+34,by-180);X.fill();
    X.fillStyle='#ddd';X.fillRect(cx-1,by-224,3,34);X.fillStyle='#ffd93b';X.fillRect(cx+2,by-224,16,9+Math.sin(at*5)*2);
    X.fillStyle='#6a3d7a';X.fillRect(cx-8,by-30,16,30);X.fillStyle='rgba(255,255,255,.95)';X.beginPath();for(const a of[-60,-30,0,30,60]){X.moveTo(cx+a+22,by+2);X.arc(cx+a,by+2,22,0,7)}X.fill();
    for(let i=0;i<3;i++)bird(wr(30+i*8,i*300,.3,W+240),60+i*40+Math.sin(at+i)*8,1.2,'#2b3a55');
    plane(wr(60,300,.1,1900),70,.8,1,0)
  }else if(k==8){
    X.fillStyle='#ffe066';X.beginPath();X.arc(700,70,30,0,7);X.fill();
    for(let i=0;i<3;i++)bird(wr(30+i*8,i*300,.3,W+240),60+i*40+Math.sin(at+i)*8,1.1,'#2b3a55');
    X.fillStyle='#ff7a1a';X.beginPath();X.arc(ww(at*70,W+60)-30,360-Math.abs(Math.sin(at*4))*90,10,0,7);X.fill();X.strokeStyle='#000';X.lineWidth=1.5;X.stroke()
  }else{
    X.fillStyle='rgba(120,70,30,.13)';for(let y=44;y<H-60;y+=30)X.fillRect(0,y,W,2);
    X.font='bold 26px monospace';X.textAlign='center';const S9=['π','Σ','∫','√','∞','Δ','θ','%'];
    for(let i=0;i<10;i++){X.fillStyle=`rgba(90,50,20,${.25+.2*Math.sin(at+i)})`;X.fillText(S9[i%8],ww(i*83+Math.sin(at+i)*20-cam*.35,W),H-ww(i*47+at*(16+i%3*6),H-60))}
    const g=X.createRadialGradient(W/2,H/2,200,W/2,H/2,480);g.addColorStop(0,'rgba(60,30,0,0)');g.addColorStop(1,'rgba(60,30,0,.35)');X.fillStyle=g;X.fillRect(0,0,W,H)
  }
}
function drawPi(e,x,y){
  const ds=e.ds>0,wn=!ds&&e.dc<.6&&e.dc>0&&((t*16)|0)%2;x+=wn?((t*40)|0)%2*4-2:0;
  if(ds){for(let k=1;k<=4;k++){X.globalAlpha=.5-k*.1;X.fillStyle='#4fc3f7';X.fillRect(x-e.dir*k*22,y,e.w,e.h)}X.globalAlpha=1;X.fillStyle='#fff';for(let k=0;k<4;k++)X.fillRect(x-e.dir*(40+k*16)-(e.dir>0?30:0),y+10+k*14,30,3)}
  X.fillStyle='#000';X.fillRect(x-3,y-3,e.w+6,e.h+6);
  X.fillStyle=e.inv>0&&((t*14)|0)%2?'#fff':wn?'#ff5252':'#1e88e5';X.fillRect(x,y,e.w,e.h);
  X.fillStyle='#ffd93b';for(let i=0;i<4;i++)X.fillRect(x+i*16,y-8,10,8);
  X.fillRect(x+8,y+6,48,8);X.fillRect(x+16,y+14,8,22);X.fillRect(x+40,y+14,8,22);X.fillRect(x+44,y+32,10,5);
  X.fillStyle='#fff';X.fillRect(x+12,y+42,14,14);X.fillRect(x+38,y+42,14,14);X.fillStyle='#000';X.fillRect(x+18+e.dir*3,y+46,6,8);X.fillRect(x+44+e.dir*3,y+46,6,8);X.fillRect(x+10,y+38,18,4);X.fillRect(x+36,y+38,18,4);
  if(wn){X.fillStyle='#ff5252';X.font='bold 30px monospace';X.textAlign='center';X.fillText('!',x+32,y-14)}
}

// ===== LOBI (BERANDA) =====
function drawLobby(){
  cam=0;bg();const h=th[lv],gy=360,sc=7,cx=W/2;
  X.fillStyle=h[3];X.fillRect(0,gy,W,H-gy);X.fillStyle=h[2];X.fillRect(0,gy,W,8);
  X.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<W;i+=T)X.fillRect(i,gy+8,2,H-gy-8);
  const jt=at-cj,jy=jt>=0&&jt<.55?Math.round(Math.sin(jt/.55*Math.PI)*70/sc)*sc:0,br=1+Math.sin(at*3)*.02;
  X.fillStyle='rgba(0,0,0,.28)';X.fillRect(cx-60+jy/3,gy+3,120-jy*2/3,8);
  X.save();X.translate(Math.round(cx),Math.round(gy-2-jy));X.scale(sc,sc*br);X.translate(0,-31);chr(X,S.skin,S.acc,0);X.restore();
}

// ===== PETA LEVEL =====
const MN=[[160,330],[290,245],[420,325],[560,210],[680,135]],RC=['#b7f07a','#2f8f4f','#c4ccd8','#8a6cd0','#b8455a'];
const MT=[
  {x:86,y:230,s:.92,t:0},{x:116,y:186,s:.78,t:1},{x:96,y:286,s:.85,t:1},
  {x:204,y:162,s:.82,t:0},{x:234,y:126,s:.72,t:1},
  {x:374,y:122,s:.76,t:0},{x:416,y:168,s:.9,t:1},{x:454,y:114,s:.74,t:0},{x:486,y:154,s:.8,t:1},
  {x:294,y:344,s:.88,t:1},
  {x:544,y:320,s:.95,t:0},{x:614,y:282,s:1.02,t:1},{x:668,y:228,s:.92,t:0},{x:632,y:344,s:.86,t:1},{x:704,y:286,s:.9,t:0}
].sort((a,b)=>a.y-b.y);
const MB=[
  {o:40,y:76,sp:38,s:.95,p:0},{o:18,y:92,sp:38,s:.8,p:1.4},
  {o:310,y:146,sp:28,s:.75,p:2.6},
  {o:540,y:68,sp:44,s:1.05,p:.8},{o:515,y:84,sp:44,s:.82,p:2.1}
];
function drawMapTrees(){
  for(const tr of MT){
    const x=tr.x,y=tr.y,s=tr.s,sw=Math.sin(at*2.2+x*.05)*1.2*s;
    X.save();
    X.fillStyle='rgba(20,55,20,.26)';X.beginPath();X.ellipse(x,y+1,13*s,4.5*s,0,0,7);X.fill();
    X.fillStyle='#1b1b1b';X.fillRect(x-4*s,y-12*s,8*s,13*s);
    X.fillStyle='#7c4d2b';X.fillRect(x-2.5*s,y-11*s,5*s,11*s);
    if(tr.t==0){
      for(const[by,ty,hw]of[[y-9*s,y-26*s,13*s],[y-19*s,y-36*s,10*s]]){
        X.fillStyle='#2e7d32';X.beginPath();X.moveTo(x+sw,ty);X.lineTo(x-hw,by);X.lineTo(x,by);X.closePath();X.fill();
        X.fillStyle='#1b5e20';X.beginPath();X.moveTo(x+sw,ty);X.lineTo(x+hw,by);X.lineTo(x,by);X.closePath();X.fill();
        X.strokeStyle='#1b1b1b';X.lineWidth=2;X.beginPath();X.moveTo(x+sw,ty);X.lineTo(x-hw,by);X.lineTo(x+hw,by);X.closePath();X.stroke();
      }
    }else{
      const r=12*s,cy=y-19*s,cx=x+sw*.7;
      X.fillStyle='#2e7d32';X.beginPath();X.arc(cx,cy,r,0,7);X.fill();
      X.fillStyle='#4caf50';X.beginPath();X.arc(cx-1.5*s,cy-2*s,r*.82,0,7);X.fill();
      X.fillStyle='#81c784';X.beginPath();X.arc(cx-3.5*s,cy-4*s,r*.42,0,7);X.fill();
      X.strokeStyle='#1b1b1b';X.lineWidth=2;X.beginPath();X.arc(cx,cy,r,0,7);X.stroke();
    }
    X.restore();
  }
}
function drawMapBirds(){
  X.save();X.lineCap='round';
  for(const b of MB){
    const x=((b.o+at*b.sp)%(W+80))-40;
    const y=b.y+Math.sin(at*2.4+b.p)*4;
    const fl=Math.sin(at*11+b.p)*(5.5*b.s),w=8.5*b.s;
    X.strokeStyle='rgba(15,40,70,.18)';X.lineWidth=2*b.s;
    X.beginPath();X.moveTo(x-w,y+16-fl*.6);X.quadraticCurveTo(x-w*.4,y+16-w*.4,x,y+16);X.quadraticCurveTo(x+w*.4,y+16-w*.4,x+w,y+16-fl*.6);X.stroke();
    X.strokeStyle='#1e293b';X.lineWidth=2.2*b.s;
    X.beginPath();X.moveTo(x-w,y-fl);X.quadraticCurveTo(x-w*.4,y-w*.55,x,y);X.quadraticCurveTo(x+w*.4,y-w*.55,x+w,y-fl);X.stroke();
  }
  X.restore();
}
const unl=i=>i==0||S.done.includes(i);const goMi=q=>{if((q>=5)!=(mi>=5))mp=q;mi=q};
function openMap(){mi=Math.min(9,Math.max(0,S.last-1));if(!unl(mi))mi=0;mp=mi;st='map';ui('');bgmSync()}
function mapKey(e){if(tr)return;const c=e.code,go=d=>{const q=mi+d;if(q>=0&&q<10&&unl(q)){goMi(q);sfx(600,.06)}};
  if(c=='ArrowLeft'||c=='KeyA')go(-1);else if(c=='ArrowRight'||c=='KeyD')go(1);else if(c=='Enter'||c=='Space'){const m=mi;trans(()=>start(m))}else if(c=='Escape')menu();else return;e.preventDefault()}
const bz=(a,b,u)=>{const v=1-u,f=(p,q,r,s)=>v*v*v*p+3*v*v*u*q+3*v*u*u*r+u*u*u*s;return[f(a[0],a[0]+60,b[0]-60,b[0]),f(a[1],a[1],b[1],b[1])]};
function tx(s,x,y,z,c,al){X.font=`bold ${z}px monospace`;X.textAlign=al||'center';X.lineWidth=4;X.strokeStyle='#000';X.strokeText(s,x,y);X.fillStyle=c;X.fillText(s,x,y)}
const btn=(x,y,w,h,c,s)=>{X.fillStyle='#000';X.fillRect(x-3,y-3,w+6,h+9);X.fillStyle=c;X.fillRect(x,y,w,h);tx(s,x+w/2,y+h-9,18,'#fff')};
function drawMap(){
  const pg=mi>=5?1:0,B=pg*5;
  if(pg)mapBg2();else{
  let g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#8fd3f4');g.addColorStop(1,'#2e7fb8');X.fillStyle=g;X.fillRect(0,0,W,H);
  X.fillStyle='rgba(255,255,255,.3)';for(let i=0;i<16;i++)X.fillRect(((i*131+at*8)%900)-50,(i*67)%H+Math.sin(at*2+i)*3,26,3);
  X.fillStyle='rgba(12,52,92,.28)';X.beginPath();X.ellipse(400,239,392,211,0,0,7);X.fill();
  X.fillStyle='#f1dfa5';X.beginPath();X.ellipse(400,232,390,210,0,0,7);X.fill();
  X.fillStyle='#6fbf4a';X.beginPath();X.ellipse(400,232,370,192,0,0,7);X.fill();
  X.save();X.beginPath();X.ellipse(400,232,370,192,0,0,7);X.clip();
  MN.forEach((n,i)=>{const r=X.createRadialGradient(n[0],n[1],10,n[0],n[1],105);r.addColorStop(0,RC[i]);r.addColorStop(1,'rgba(111,191,74,0)');X.fillStyle=r;X.fillRect(n[0]-105,n[1]-105,210,210)});X.restore();
  drawMapTrees();}
  X.lineCap=X.lineJoin='round';X.beginPath();X.moveTo(MN[0][0],MN[0][1]);for(let i=1;i<5;i++){const a=MN[i-1],b=MN[i];X.bezierCurveTo(a[0]+60,a[1],b[0]-60,b[1],b[0],b[1])}
  X.strokeStyle='#5a3d22';X.lineWidth=24;X.stroke();X.strokeStyle='#d9b77a';X.lineWidth=18;X.stroke();X.strokeStyle='rgba(255,255,255,.6)';X.lineWidth=3;X.setLineDash([3,12]);X.stroke();X.setLineDash([]);
  MN.forEach((n,i)=>{const x=n[0],y=n[1]-56;
    if(pg){scn2(i,x,y);return}
    if(i==0){for(let k=0;k<5;k++){X.fillStyle=k%2?'#ff7aa2':'#fff';X.beginPath();X.arc(x-30+k*15,y+(k%2)*9,5,0,7);X.fill()}tx('1 2 3',x,y-12,16,'#fff')}
    else if(i==1){X.fillStyle='#1f5a35';for(let k=-1;k<2;k++){X.beginPath();X.moveTo(x+k*30-12,y+18);X.lineTo(x+k*30,y-14-(k==0)*8);X.lineTo(x+k*30+12,y+18);X.fill()}}
    else if(i==2){for(let k=-1;k<2;k+=2){X.fillStyle='#8a8f98';X.beginPath();X.moveTo(x+k*22-24,y+20);X.lineTo(x+k*22,y-18);X.lineTo(x+k*22+24,y+20);X.fill();X.fillStyle='#fff';X.beginPath();X.moveTo(x+k*22-8,y-4);X.lineTo(x+k*22,y-18);X.lineTo(x+k*22+8,y-4);X.fill()}}
    else if(i==3){X.fillStyle='#53378a';[[-30,0,16,22],[-8,-8,16,30],[14,4,16,18],[32,-6,12,26]].forEach(q=>X.fillRect(x+q[0],y+q[1],q[2],q[3]));tx('?',x,y-14,20,'#ffd93b')}
    else{X.fillStyle='#4a3a5a';X.fillRect(x-26,y-4,52,24);for(let k=-1;k<2;k++){X.fillRect(x+k*20-7,y-18,14,18);X.fillRect(x+k*20-7,y-22,4,4);X.fillRect(x+k*20+3,y-22,4,4)}X.fillStyle='#d62839';X.fillRect(x,y-40,2,18);X.fillRect(x+2,y-40,12+Math.sin(at*6)*3,7)}});
  MN.forEach((n,i0)=>{const i=B+i0,ok=unl(i),dn=S.done.includes(i+1);
    if(i==mi){X.strokeStyle='#fff';X.lineWidth=3;X.beginPath();X.arc(n[0],n[1],25+Math.sin(at*5)*3,0,7);X.stroke()}
    X.fillStyle='#000';X.beginPath();X.arc(n[0],n[1],21,0,7);X.fill();X.fillStyle=dn?'#2a9d4a':ok?'#ffd93b':'#777';X.beginPath();X.arc(n[0],n[1],17,0,7);X.fill();
    tx(ok?(dn?'✓':''+(i+1)):'🔒',n[0],n[1]+6,ok?18:14,'#fff')});
  const m0=mp-B,f=Math.max(0,Math.min(3,m0|0)),q=bz(MN[f],MN[f+1],Math.max(0,Math.min(1,m0-f))),ay=q[1]-36-Math.abs(Math.sin(at*7))*(Math.abs(mp-mi)>.05?9:2),ax=q[0];
  X.fillStyle='#000';X.fillRect(ax-10,ay-2,20,30);X.fillStyle='#ff7aa2';X.fillRect(ax-8,ay,16,5);X.fillStyle='#ffd93b';X.fillRect(ax-8,ay+5,16,13);X.fillStyle='#f2c28b';X.beginPath();X.moveTo(ax-8,ay+18);X.lineTo(ax+8,ay+18);X.lineTo(ax,ay+27);X.fill();X.fillStyle='#000';X.fillRect(ax-4,ay+9,3,4);X.fillRect(ax+2,ay+9,3,4);
  if(!pg)drawMapBirds();
  tx(pg?'TAMAN SEKOLAH MAT':'PETA DUNIA MAT',W/2,36,26,'#ffd93b');
  tx(`Level ${mi+1}: ${L[mi].n}  (♪ ${BGM['lv'+mi].name})`,W/2,H-66,16,'#fff');
  btn(10,10,92,30,'#e63946','◀ Menu');btn(W/2-75,H-52,150,38,'#2a9d4a','MAIN ▶');
  if(!pg)btn(W-136,H-52,126,38,unl(5)?'#8e44ad':'#777','Hal 2 ▶');else btn(10,H-52,126,38,'#8e44ad','◀ Hal 1');
}

const RC2=['#ff9ed2','#a78a6a','#bfe6ff','#ffd27a','#f2e2b0'];
function mapBg2(){
  let g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#a8e4ff');g.addColorStop(.17,'#d9f5ff');g.addColorStop(.18,'#7ccf5a');g.addColorStop(1,'#4fa83c');X.fillStyle=g;X.fillRect(0,0,W,H);
  X.fillStyle='rgba(255,255,255,.08)';for(let r=0;r<10;r++)for(let c=0;c<25;c++)if((r+c)%2==0)X.fillRect(c*32,82+r*37,32,37);
  X.fillStyle='#fff';for(let i=0;i<W;i+=22){X.fillRect(i+3,52,14,30);X.beginPath();X.moveTo(i+3,52);X.lineTo(i+10,44);X.lineTo(i+17,52);X.fill()}
  X.fillStyle='#d9c8a0';X.fillRect(0,58,W,4);X.fillRect(0,70,W,4);
  MN.forEach((n,i)=>{const r=X.createRadialGradient(n[0],n[1],10,n[0],n[1],105);r.addColorStop(0,RC2[i]);r.addColorStop(1,'rgba(124,207,90,0)');X.fillStyle=r;X.fillRect(n[0]-105,n[1]-105,210,210)});
  const fc=['#ff6fa5','#ffd93b','#fff','#b78cff','#ff9a3d'];
  for(let i=0;i<48;i++){const x=(i*173+40)%(W-20)+10,y=98+(i*97)%330+Math.sin(at*2+i)*1.5;X.fillStyle=fc[i%5];X.fillRect(x-4,y,9,3);X.fillRect(x-1,y-3,3,9);X.fillStyle='#ffd93b';X.fillRect(x-1,y,3,3)}
  for(let k=0;k<3;k++){X.fillStyle='rgba(255,255,255,.75)';X.fillRect(18,300-k*34,34,30);tx(''+(k+1),35,323-k*34,18,'#e63946')}
  X.fillStyle='#2e7d32';X.fillRect(0,H-14,W,14);for(let i=0;i<W;i+=28){X.beginPath();X.arc(i+14,H-14,14,Math.PI,0);X.fill()}
  X.lineCap=X.lineJoin='round';X.beginPath();X.moveTo(MN[0][0],MN[0][1]);for(let i=1;i<5;i++){const a=MN[i-1],b=MN[i];X.bezierCurveTo(a[0]+60,a[1],b[0]-60,b[1],b[0],b[1])}
  X.strokeStyle='#5a3d22';X.lineWidth=24;X.stroke();X.strokeStyle='#d9b77a';X.lineWidth=18;X.stroke();X.strokeStyle='rgba(255,255,255,.6)';X.lineWidth=3;X.setLineDash([3,12]);X.stroke();X.setLineDash([]);
  for(let i=0;i<5;i++){const x=(i*190+at*(14+i*3))%(W+60)-30,y=120+(i*61)%260+Math.sin(at*2+i)*22,f=Math.abs(Math.sin(at*12+i))*7+1;X.fillStyle=['#ff7ab8','#ffd93b','#7ad7ff','#b78cff','#ff9a3d'][i];X.fillRect(x-f-1,y-5,f+1,9);X.fillRect(x,y-5,f+1,9);X.fillStyle='#222';X.fillRect(x-1,y-4,2,9)}
}
function scn2(i,x,y){
  if(i==0){for(let k=-1;k<2;k++){const fx=x+k*26,fy=y+4-(k==0)*8;X.fillStyle='#2e7d32';X.fillRect(fx-1,fy+8,3,22);X.fillStyle=['#ff6fa5','#ffd93b','#b78cff'][k+1];for(let a=0;a<6;a++){X.beginPath();X.arc(fx+Math.cos(a*1.047)*7,fy+Math.sin(a*1.047)*7,5,0,7);X.fill()}X.fillStyle='#fff';X.beginPath();X.arc(fx,fy,4,0,7);X.fill()}tx('7 8 9',x,y-18,16,'#fff')}
  else if(i==1){X.fillStyle='#6b5440';X.beginPath();X.arc(x,y+24,36,Math.PI,0);X.fill();X.fillStyle='#1c130d';X.beginPath();X.arc(x,y+24,20,Math.PI,0);X.fill();tx('πr²',x,y-20,16,'#8dffaa')}
  else if(i==2){X.fillStyle='#fff';X.beginPath();for(const[a,b,r]of[[-24,16,16],[0,6,22],[24,16,16]]){X.moveTo(x+a+r,y+b);X.arc(x+a,y+b,r,0,7)}X.fill();tx('8',x,y+16,36,'#ff9ed2')}
  else if(i==3){X.fillStyle='#e8c07a';X.fillRect(x-30,y,60,24);X.fillStyle='#c0392b';X.fillRect(x-35,y-10,70,12);X.fillStyle='#7ec8ff';X.fillRect(x-22,y+6,12,10);X.fillRect(x+10,y+6,12,10);X.fillStyle='#6b4a2b';X.fillRect(x-4,y+10,8,14);X.fillStyle='#ddd';X.fillRect(x+34,y-30,3,40);X.fillStyle='#e63946';X.fillRect(x+37,y-30,14,8)}
  else{X.fillStyle='#000';X.fillRect(x-34,y-12,68,38);X.fillStyle='#8b5a2b';X.fillRect(x-31,y-9,62,32);X.fillStyle='#f4e4b8';X.fillRect(x-27,y-5,26,24);X.fillRect(x+1,y-5,26,24);tx('π',x,y+14,22,'#c0392b')}
}

// ===== UI =====
function ui(h,l){lob=!!l;U.innerHTML=h||'';U.classList.toggle('on',!!h);U.classList.toggle('lobby',!!l);PB.hidden=st!='play';TC.hidden=!(S.touch&&st=='play')}
const stats=()=>`<p>Best ${S.best} • Total ${S.total} • Koin ${S.coins}</p>`;
function menu(){st='menu';save();lv=Math.max(0,Math.min(9,S.last-1));bgmSync();
  ui(`<div class="lb ttl"><h1>AWAS PELAJARAN MAT!</h1>${stats()}</div>
<div class="lb top"><span class=coin>● ${S.coins}</span><button class=ic data-a=set aria-label=Settings>⚙</button></div>
<div class="lb side"><button data-a=levels>Pilih Level</button><button class=o data-a=shop>Shop</button><button class=y data-a=spin>Spin</button><button class=g data-a=how>Cara Main</button></div>
<div class="lb pl"><div class=lvn><small>LEVEL ${lv+1}</small><br>${L[lv].n}</div><button class="g play" data-a=play>Play</button></div>`,1)}
function pause(){if(st=='play'){st='pause';save();bgmSync();ui(`<h2>PAUSE</h2><p>♪ ${BGM['lv'+lv].name}</p><div class=row><button class=g data-a=resume>Lanjut</button><button data-a=retry>Ulang Level</button><button class=r data-a=menu>Menu</button></div>`)}else if(st=='pause'){st='play';bgmSync();ui('')}}
}
const A={
  play(){const i=Math.max(0,Math.min(9,S.last-1));trans(()=>start(i))},
  newg(){if(confirm('Ulang dari Level 1? Progress level dan skor dihapus. Koin, karakter, dan aksesoris tetap aman.')){S.done=[];S.last=1;S.score=0;save();A.set()}},
  levels(){openMap()},
  go(n){start(+n)},
  how(){ui(`<h2>CARA BERMAIN</h2><p>Bantu karaktermu melewati 10 dunia matematika! Injak monster dari atas untuk mengalahkannya, kumpulkan koin, hindari jurang, dan capai bendera FINISH.</p><p>Keyboard: A/D atau ◀ ▶ = gerak • Space/W/▲ = lompat • Esc = pause<br>HP/Tablet: tombol layar (multitouch)</p><button data-a=menu>Kembali</button>`)},
  set(){ui(`<h2>SETTINGS</h2>${stats()}<div class=row><button data-a=snd>Suara & Musik: ${S.snd?'ON':'OFF'}</button><button data-a=tch>Tombol Sentuh: ${S.touch?'ON':'OFF'}</button></div><div class=row><button data-a=newg>Ulang Level 1</button><button class=r data-a=reset>Reset Semua</button></div><button data-a=menu>Kembali</button>`)},
  menu,resume:pause,
  shop:SHOP.shop,
  buy:SHOP.buy,
  retry(){S.score=ls;start(lv,1)},
  next(){start(lv+1)},
  snd(){S.snd=!S.snd;save();bgmSync();A.set()},
  tch(){S.touch=!S.touch;save();A.set()},
  reset(){if(confirm('Reset SEMUA progress, skor, koin, dan isi toko? Tidak bisa dibatalkan.')){S={...D,done:[],owned:['pensil'],acc:[],touch:S.touch,snd:S.snd};save();bgmSync();A.set()}}
};
U.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&!b.disabled&&A[b.dataset.a])A[b.dataset.a](b.dataset.n)});
PB.addEventListener('click',pause);
C.addEventListener('pointerdown',e=>{const r=C.getBoundingClientRect(),x=(e.clientX-r.left)*W/r.width,y=(e.clientY-r.top)*H/r.height;
  if(st=='cut'){if(x>W-112&&y<40)cutEnd();else cutNext();return}
  if(st=='menu'){if(lob&&!tr&&Math.abs(x-W/2)<80&&y>110&&y<360&&at-cj>.6){cj=at;sfx(520,.12)}return}
  if(st!='map')return;
  if(x<106&&y<46){menu();return}
  const B=mi>=5?5:0;
  if(y>H-56&&y<H-8){if(B==0&&x>W-146){if(unl(5)){goMi(5);sfx(600,.06)}else sfx(150,.15,'sawtooth');return}if(B==5&&x<136){goMi(4);sfx(600,.06);return}}
  for(let j=0;j<5;j++){const i=B+j;if(Math.hypot(x-MN[j][0],y-MN[j][1])<30){if(!unl(i))sfx(150,.15,'sawtooth');else if(i==mi&&Math.abs(mp-mi)<.1)trans(()=>start(i));else{mi=i;sfx(600,.06)}return}}
  if(Math.abs(x-W/2)<76&&y>H-56&&y<H-8){const m=mi;trans(()=>start(m))}});

// ===== INPUT =====
const km={ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',ArrowUp:'j',KeyW:'j',Space:'j'};
addEventListener('keydown',e=>{
  if(st=='cut'){if(!e.repeat){if(e.code=='Escape')cutEnd();else if(['Space','Enter','ArrowRight','KeyZ'].includes(e.code))cutNext()}e.preventDefault();return}
  if(st=='map'){mapKey(e);return}if(e.code=='Escape'){pause();return}const k=km[e.code];if(k){K[k]=1;e.preventDefault()}});
addEventListener('keyup',e=>{const k=km[e.code];if(k)K[k]=0});
addEventListener('blur',()=>{K.l=K.r=K.j=0;if(st=='play')pause()});
document.querySelectorAll('[data-k]').forEach(b=>{
  const k=b.dataset.k,on=e=>{e.preventDefault();K[k]=1;b.classList.add('on')},off=e=>{e.preventDefault();K[k]=0;b.classList.remove('on')};
  b.addEventListener('pointerdown',on);['pointerup','pointercancel','pointerleave'].forEach(n=>b.addEventListener(n,off));
});
addEventListener('contextmenu',e=>e.preventDefault());

// ===== TRANSISI AWAN PIXEL =====
const CT=document.getElementById('cl'),XT=CT.getContext('2d');CT.width=W;CT.height=H;
const PS=8,NC=W/PS,CM=H+400,TIN=1,THD=.3,TOUT=1,Y0=H+240,YH=-200,Y1=-CM-240,OL='#2b4c7e';
let tr=null,sd=11;const rnd=()=>(sd=sd*16807%2147483647)/2147483647,es=p=>.5-Math.cos(Math.PI*p)/2;
const prof=()=>{const a=new Array(NC).fill(16);for(let i=0;i<18;i++){const c=rnd()*NC,r=4+rnd()*6,m=32+rnd()*32;for(let k=0;k<NC;k++){const d=(k-c)/r;if(Math.abs(d)<1)a[k]=Math.max(a[k],Math.round(Math.sqrt(1-d*d)*m/PS)*PS)}}return a};
const TP=prof(),BP=prof(),PT=[];
for(let i=0;i<90;i++)PT.push([Math.floor(rnd()*NC)*PS,80+Math.floor(rnd()*((CM-160)/PS))*PS,(2+Math.floor(rnd()*5))*PS,(1+Math.floor(rnd()*2))*PS,rnd()<.5?'#dcefff':'#c3e0f7']);
const CP=[['....XXXX....','..XXXXXXXX..','.XXXXXXXXXX.','XXXXXXXXXXXX','.LLLLLLLLLL.'],
 ['......XXXX......','..XXXXXXXXXX....','..XXXXXXXXXXXX..','XXXXXXXXXXXXXXXX','.LLLLLLLLLLLLLL.'],
 ['..XXXX..','.XXXXXX.','XXXXXXXX','.LLLLLL.']];
const PF=[];for(let i=0;i<14;i++)PF.push({x:Math.round((-20+rnd()*(W-60))/PS)*PS,o:40+rnd()*200,p:i%3,s:rnd()<.5?1:2,d:i<7?-1:1});
function pcl(x,y,p,s){const cs=PS*s,R=CP[p];x=Math.round(x/PS)*PS;y=Math.round(y/PS)*PS;
  for(let pass=0;pass<2;pass++)for(let r=0;r<R.length;r++)for(let c=0;c<R[r].length;c++){const q=R[r][c];if(q=='.')continue;
    if(!pass){XT.fillStyle=OL;XT.fillRect(x+c*cs-4,y+r*cs-4,cs+8,cs+8)}else{XT.fillStyle=q=='L'?'#bfdcf2':'#fff';XT.fillRect(x+c*cs,y+r*cs,cs,cs)}}}
function drawTr(){
  const y=tr.y;XT.clearRect(0,0,W,H);
  const te=c=>y+64-TP[c],be=c=>y+CM-64+BP[c];
  XT.fillStyle='#fff';for(let c=0;c<NC;c++){const a=Math.max(0,te(c)),b=Math.min(H,be(c));if(b>a)XT.fillRect(c*PS,a,PS,b-a)}
  for(const p of PT){const py=y+p[1];if(py>H||py+p[3]<0)continue;XT.fillStyle=p[4];XT.fillRect(p[0],py,p[2],p[3])}
  XT.fillStyle='#bfdcf2';for(let c=0;c<NC;c++)XT.fillRect(c*PS,be(c)-PS,PS,PS);
  XT.fillStyle=OL;
  for(let c=0;c<NC;c++){const x=c*PS,t=te(c),b=be(c);
    XT.fillRect(x,t-4,PS,4);XT.fillRect(x,b,PS,4);
    if(c>0){const tl=te(c-1),bl=be(c-1);if(tl>t)XT.fillRect(x,t,4,tl-t);if(bl<b)XT.fillRect(x,bl,4,b-bl)}
    if(c<NC-1){const tn=te(c+1),bn=be(c+1);if(tn>t)XT.fillRect(x+PS-4,t,4,tn-t);if(bn<b)XT.fillRect(x+PS-4,bn,4,b-bn)}}
  for(const f of PF)pcl(f.x,f.d<0?y-f.o:y+CM+f.o,f.p,f.s)
}
function trans(cb){if(tr)return;tr={t:0,f:0,y:Y0,cb};CT.style.pointerEvents='auto';sfx(330,.3,'triangle')}
function stepTr(dt){
  if(!tr)return;tr.t+=dt;const a=TIN+THD,b=a+TOUT;let y;
  if(tr.t<TIN)y=Y0+(YH-Y0)*es(tr.t/TIN);
  else if(tr.t<a){y=YH;if(!tr.f){tr.f=1;tr.cb()}}
  else if(tr.t<b)y=YH+(Y1-YH)*es((tr.t-a)/TOUT);
  else{tr=null;XT.clearRect(0,0,W,H);CT.style.pointerEvents='none';return}
  tr.y=Math.round(y/PS)*PS;drawTr()
}

// ===== LOOP =====
let lt=0;
function loop(ts){const dt=Math.min(.033,(ts-lt)/1000||0);lt=ts;at=ts/1000;if(st=='play'&&!(tr&&tr.t<TIN+THD)){update(dt);if(at-sv>3){sv=at;save()}}if(st=='map')mp+=(mi-mp)*Math.min(1,dt*7);draw();stepTr(dt);requestAnimationFrame(loop)}
build(0);menu();requestAnimationFrame(loop);
