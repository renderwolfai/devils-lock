import { startPlayer } from "./kit/player.js";
import { G, txt, canvasTex, ease } from "./kit/core.js";
import { placeOverlay } from "./kit/art-placement.js";
import { reelFrameSprite } from "./kit/reel-frame.js";
import { animFor, playFrames } from "./kit/stylized.js";

const DISPLAY = "Trebuchet MS, Arial Rounded MT Bold, sans-serif";
const C = { red:0xef3027, wine:0x671529, dark:0x220c1a, gold:0xffc31c, pale:0xffef72, teal:0x20d3bd, pink:0xff7a9e };
const NAMES = {
  H1:"Golden Crown", H2:"Money Rolls", H3:"Gems", H4:"Trident",
  A:"Ace", K:"King", Q:"Queen", J:"Jack", T:"Ten", 9:"Nine",
  DV:"The Devil", CN:"Cash Coin", JP:"Jackpot Coin", PG:"Piglet",
  base:"Devil's Lock", "mini-pigs":"Mini Pig Respin", free:"Fiendish Free Games",
  leftPig:"Left Pig", rightPig:"Right Pig",
  "rewind-coin":"Rewind Coin", "rewind-coins":"Rewind Coins", "rewind-jackpot":"Rewind Jackpot",
  "left-pig-burst":"Left Pig Burst", "right-pig-burst":"Right Pig Burst",
};
let scene;

function label(text, size, fill="#fff2a0", stroke="#3a0b19", thickness=7) {
  return txt(text,{fontFamily:DISPLAY,fontSize:size,fontWeight:"900",fill,stroke,strokeThickness:thickness,align:"center",dropShadow:true,dropShadowColor:"#13050c",dropShadowBlur:2,dropShadowDistance:4});
}

function addRank(container, size, id, color) {
  const t=label(id,Math.round(size*.58),color,"#3c1020",Math.max(4,size*.055));t.position.set(size/2,size/2);container.addChild(t);
}
function addCoin(container,size,jackpot=false){
  const g=G(),u=size/100;g.lineStyle(7*u,0x7c2b12,1);g.beginFill(C.gold);g.drawCircle(50*u,50*u,34*u);g.endFill();g.lineStyle(4*u,C.pale,.95);g.drawCircle(50*u,50*u,27*u);
  if(jackpot){g.beginFill(C.wine);g.drawCircle(50*u,50*u,20*u);g.endFill();g.beginFill(C.pale);g.drawPolygon([50,28,56,42,72,43,60,53,64,69,50,59,36,69,40,53,28,43,44,42].map(v=>v*u));g.endFill();}
  else {const t=label("$",40*u,"#8c281a","#ffe96b",3*u);t.position.set(50*u,50*u);g.addChild(t);}container.addChild(g);
}
function addPicture(container,size,id){
  const g=G(),u=size/100;
  if(id==="H1"){g.lineStyle(5*u,0x6d2516,1);g.beginFill(C.gold);g.drawPolygon([18,68,16,31,36,46,50,17,64,46,84,31,81,68].map(v=>v*u));g.drawRoundedRect(18*u,64*u,64*u,17*u,6*u);g.endFill();for(const [x,y,c] of [[32,56,C.red],[50,48,0x39d7c4],[68,56,0xb051e5]]){g.beginFill(c);g.drawCircle(x*u,y*u,5*u);g.endFill();}}
  if(id==="H2"){for(let i=0;i<3;i++){g.lineStyle(4*u,0x173e27,1);g.beginFill(0x55c46d);g.drawRoundedRect((15+i*17)*u,(26+i*8)*u,42*u,50*u,8*u);g.endFill();g.lineStyle(6*u,C.gold,.95);g.moveTo((32+i*17)*u,(29+i*8)*u);g.lineTo((32+i*17)*u,(73+i*8)*u);}}
  if(id==="H3"){for(const [x,y,c] of [[34,56,C.red],[54,39,C.teal],[66,61,0x9d57e8]]){g.lineStyle(4*u,0x43162a,1);g.beginFill(c);g.drawPolygon([x,y-24,x+19,y-8,x+13,y+17,x-13,y+17,x-19,y-8].map(v=>v*u));g.endFill();}}
  if(id==="H4"){g.lineStyle(9*u,C.gold,1);g.moveTo(50*u,82*u);g.lineTo(50*u,28*u);g.moveTo(50*u,35*u);g.lineTo(28*u,18*u);g.moveTo(50*u,35*u);g.lineTo(72*u,18*u);g.moveTo(28*u,18*u);g.lineTo(28*u,37*u);g.moveTo(72*u,18*u);g.lineTo(72*u,37*u);g.lineStyle(12*u,C.red,1);g.moveTo(50*u,63*u);g.lineTo(50*u,84*u);}
  container.addChild(g);
}
function addDevil(container,size){
  const g=G(),u=size/100;g.lineStyle(5*u,0x521124,1);g.beginFill(C.red);g.drawCircle(50*u,51*u,31*u);g.endFill();g.beginFill(0x5c1831);g.drawPolygon([28,30,16,5,38,23,62,23,84,5,72,31].map(v=>v*u));g.endFill();g.beginFill(0xffffff);g.drawEllipse(39*u,45*u,9*u,7*u);g.drawEllipse(61*u,45*u,9*u,7*u);g.endFill();g.beginFill(0x2a0713);g.drawCircle(41*u,46*u,3*u);g.drawCircle(59*u,46*u,3*u);g.endFill();g.lineStyle(4*u,0x3b0918,1);g.arc(50*u,57*u,19*u,.15,2.98);g.beginFill(C.gold);g.drawPolygon([58,66,64,65,61,73].map(v=>v*u));g.endFill();container.addChild(g);
}
function addPig(container,size){
  const g=G(),u=size/100;g.lineStyle(5*u,0x7c2544,1);g.beginFill(C.pink);g.drawEllipse(51*u,56*u,32*u,25*u);g.endFill();g.beginFill(0xffa9bd);g.drawCircle(75*u,51*u,18*u);g.endFill();g.beginFill(0x53142b);g.drawPolygon([64,36,60,17,72,31,82,31,91,16,90,38].map(v=>v*u));g.endFill();g.beginFill(0xffc3cf);g.drawEllipse(79*u,57*u,10*u,7*u);g.endFill();g.beginFill(0x4a1025);g.drawCircle(72*u,47*u,2.5*u);g.drawCircle(82*u,47*u,2.5*u);g.endFill();g.lineStyle(4*u,C.gold,1);g.moveTo(39*u,31*u);g.lineTo(61*u,31*u);container.addChild(g);
}

const game = await startPlayer({
  orientation:"portrait",
  maxPitch:104,
  theme:{background:C.dark,bar:0x210c18,panel:0x431126,accent:C.gold,accentDim:0x9a5a19,button:C.red,text:"#fff0a4",label:"#ffb7a6",font:DISPLAY,displayFont:DISPLAY,titleColor:"#ffe66b",spinFill:C.red,spinIcon:C.pale},
  names:NAMES,
  hudFilter:(key)=>!["accumulator:leftPig","accumulator:rightPig"].includes(key),
  framedFilter:()=>false,
  valueDisplayFilter:(id)=>id==="CN"||id==="JP",
  art(tex,ctx){
    const s=tex.cellBg.width;
    tex.cellBg=canvasTex(s,s,x=>{const q=x.createRadialGradient(s*.5,s*.42,4,s*.5,s*.5,s*.72);q.addColorStop(0,"#8d2638");q.addColorStop(.55,"#491126");q.addColorStop(1,"#1b0815");x.fillStyle=q;x.fillRect(0,0,s,s);x.strokeStyle="rgba(255,195,40,.55)";x.lineWidth=4;x.strokeRect(4,4,s-8,s-8);x.strokeStyle="rgba(255,244,140,.18)";x.lineWidth=2;x.strokeRect(9,9,s-18,s-18);});
    for(const id of ["H1","H2","H3","H4"])tex[id]=ctx.kit.bake(c=>addPicture(c,s,id),s,s);
    const rankColors={A:"#ef3a37",K:"#4b92ff",Q:"#d35be8",J:"#4ed06b",T:"#ff8f2b",9:"#27d4cf"};
    for(const [id,color] of Object.entries(rankColors))tex[id]=ctx.kit.bake(c=>addRank(c,s,id,color),s,s);
    if(ctx.art.stylized&&ctx.art.images.NINE)tex["9"]=ctx.art.images.NINE;
    tex.DV=ctx.kit.bake(c=>addDevil(c,s),s,s);tex.CN=ctx.kit.bake(c=>addCoin(c,s,false),s,s);tex.JP=ctx.kit.bake(c=>addCoin(c,s,true),s,s);tex.PG=ctx.kit.bake(c=>addPig(c,s),s,s);
  },
  describe:`<h2>DEVIL'S LOCK</h2><p>40 fixed paylines pay left to right. The Devil is wild and can appear only in the centre seat. When he lands he collects every visible Cash Coin and Jackpot Coin.</p><h2>PIGGY BANKS</h2><p>Every base-game Devil feeds both pigs. A burst awards 6 Fiendish Free Games; both pigs award 12. Mini Pigs may lock the visible money for one respin before the feature.</p><h2>FIENDISH FREE GAMES</h2><p>The Devil stays locked in the centre and collects on every spin. Each Piglet adds 3 games. MINI and MINOR jackpots may arrive boosted.</p><h2>REWIND</h2><p>A losing base spin may rewind into a guaranteed Devil-and-coin result. Maximum round win: 2,013× total bet.</p>`,
  hooks:{
    beforeLand(pass,ctx){scene?.spinStart(pass,ctx);return{staggerMs:70};},
    async afterLand(pass,ctx){await scene?.cellRipple(pass,ctx);},
    async event(e,ctx){return await scene?.event(e,ctx)??false;},
    async afterRound(result,ctx){await scene?.afterRound(result,ctx);},
  },
});
document.title=game?.cfg?.name??document.title;
if(game)scene=makeScene(game);

function makeScene({kit,world,backdrop,art,layers}){
  const {W,H,app,tween,wait}=kit,grid=window.__game.grid,b=grid.bounds,cx=b.x+b.w/2;
  const DEVIL_SCALE=1.22;
  const animatedDevils=new WeakSet();
  let surfaceMode="base",freeModeActive=false;
  const syncCellSurfaces=()=>{const tint=surfaceMode==="base"?0x141318:0xffffff;for(const reel of grid.reels)for(const slot of reel.slots)slot.bg.tint=tint;};
  const syncDevilSize=()=>{for(const reel of grid.reels)for(const slot of reel.slots)if(slot.sym==="DV"&&!animatedDevils.has(slot))slot.s.scale.set(DEVIL_SCALE);};
  syncCellSurfaces();
  backdrop.sortableChildren=true;
  const sky=new PIXI.Sprite(canvasTex(W,H,x=>{const q=x.createRadialGradient(W*.5,H*.35,25,W*.5,H*.42,W*.78);q.addColorStop(0,"#1dc5b3");q.addColorStop(.18,"#57213a");q.addColorStop(.58,"#210b19");q.addColorStop(1,"#08030a");x.fillStyle=q;x.fillRect(0,0,W,H);}));sky.zIndex=0;backdrop.addChildAt(sky,0);
  const lounge=G();lounge.zIndex=1;lounge.beginFill(0x2b0c1d,.88);lounge.drawPolygon([0,0,W*.17,0,W*.26,H*.6,W*.16,H,0,H]);lounge.drawPolygon([W,0,W*.83,0,W*.74,H*.6,W*.84,H,W,H]);lounge.endFill();lounge.lineStyle(18,0x5b241c,.9);lounge.drawCircle(cx,H*.27,Math.min(W*.3,210));lounge.lineStyle(7,C.gold,.55);lounge.drawCircle(cx,H*.27,Math.min(W*.27,194));backdrop.addChild(lounge);
  const glow=G();glow.zIndex=1;glow.beginFill(C.red,.13);glow.drawCircle(cx,H*.34,Math.min(W*.42,300));glow.endFill();glow.filters=[new PIXI.BlurFilter(36)];backdrop.addChild(glow);
  const proceduralFrame=G();proceduralFrame.lineStyle(24,0x5c1d15,1);proceduralFrame.drawRoundedRect(b.x-24,b.y-24,b.w+48,b.h+48,26);proceduralFrame.lineStyle(15,C.gold,1);proceduralFrame.drawRoundedRect(b.x-16,b.y-16,b.w+32,b.h+32,21);proceduralFrame.lineStyle(4,C.pale,.9);proceduralFrame.drawRoundedRect(b.x-9,b.y-9,b.w+18,b.h+18,16);proceduralFrame.beginFill(0x6b1730);proceduralFrame.drawPolygon([cx-55,b.y-24,cx-28,b.y-72,cx-8,b.y-31,cx+8,b.y-31,cx+28,b.y-72,cx+55,b.y-24]);proceduralFrame.endFill();layers.boardOverlay.addChild(proceduralFrame);grid.frame.visible=false;
  const entry=art.manifest?.images?.REEL_FRAME;
  if(art.stylized&&art.images.REEL_FRAME&&entry?.geometry){const generated=reelFrameSprite(art.images.REEL_FRAME,entry.geometry,grid,{fit:"contain"});if(generated){proceduralFrame.visible=false;layers.boardOverlay.addChild(generated);}}
  const fx=new PIXI.Container();layers.boardOverlay.addChild(fx);
  const defaultTitle=world.children.find(c=>c instanceof PIXI.Text&&String(c.text).toUpperCase()==="DEVIL'S LOCK");if(defaultTitle)defaultTitle.visible=false;
  const title=art.stylized&&art.images.TITLE?new PIXI.Sprite(art.images.TITLE):label("DEVIL'S LOCK",38,["#fff486","#ff9b21"],"#641329",9);
  if(art.stylized&&art.images.TITLE){
    if(!placeOverlay(art,"TITLE",title,{x:24,y:8,width:285,height:82}))title.position.set(165,50);
  }else title.position.set(165,50);
  world.addChild(title);
  const pigLayer=new PIXI.Container();layers.boardOverlay.addChild(pigLayer);
  function makeMeter(x,side){const holder=new PIXI.Container();holder.position.set(x,b.y-54);let body;if(art.stylized&&art.images.PIG_METER){body=new PIXI.Sprite(art.images.PIG_METER);body.anchor.set(.5);body.scale.set(.14);}else{body=G();body.lineStyle(5,0x76203f,1);body.beginFill(C.pink);body.drawEllipse(0,0,56,38);body.endFill();body.beginFill(0x5a172f);body.drawPolygon([-34,-24,-42,-58,-18,-32,18,-32,42,-58,34,-24]);body.endFill();body.beginFill(C.gold);body.drawRoundedRect(-18,-43,36,6,3);body.endFill();}holder.addChild(body);const shelf=G();shelf.lineStyle(9,C.gold,1);shelf.moveTo(-72,43);shelf.lineTo(72,43);holder.addChild(shelf);const tag=label(side,15,"#fff3ae","#4a1023",4);tag.position.set(0,58);holder.addChild(tag);pigLayer.addChild(holder);return{holder,body,fill:0};}
  const pigs={leftPig:makeMeter(b.x+95,"LEFT PIG"),rightPig:makeMeter(b.x+b.w-95,"RIGHT PIG")};
  const glowingCoins=new Set();
  function syncFreeCoinTint(){
    const active=new Set();
    if(freeModeActive)for(const column of grid.liveCells())for(const slot of column){
      if(slot.sym!=="CN"&&slot.sym!=="JP")continue;active.add(slot);slot.s.tint=0xaaff88;glowingCoins.add(slot);
    }
    for(const slot of glowingCoins)if(!active.has(slot)){slot.s.tint=0xffffff;glowingCoins.delete(slot);}
  }
  let t=0,heat=.15;const embers=[];for(let i=0;i<26;i++){const e=G();e.beginFill(i%4?0xff8a23:C.pale,.75);e.drawCircle(0,0,1+Math.random()*2);e.endFill();e.position.set(Math.random()*W,H*.15+Math.random()*H*.7);backdrop.addChild(e);embers.push(e);}app.ticker.add(()=>{t+=app.ticker.deltaMS;glow.alpha=.1+heat*.18+.025*Math.sin(t/360);embers.forEach((e,i)=>{e.y-=.18+(i%5)*.025;e.x+=Math.sin(t/700+i)*.13;if(e.y<H*.08){e.y=H*.9;e.x=Math.random()*W;}});for(const p of Object.values(pigs))p.body.rotation=.018*Math.sin(t/230+p.fill);syncCellSurfaces();syncDevilSize();syncFreeCoinTint();});
  const burst=(x,y,color=C.gold,n=18)=>{for(let i=0;i<n;i++){const q=G();q.beginFill(i%3?color:C.pale,.9);i%4?q.drawCircle(0,0,2+Math.random()*3):q.drawPolygon([0,-6,4,4,-4,2]);q.endFill();q.position.set(x,y);fx.addChild(q);const a=Math.random()*Math.PI*2,r=35+Math.random()*85;tween(q,{x:x+Math.cos(a)*r,y:y+Math.sin(a)*r-30,rotation:(Math.random()-.5)*7,alpha:0},430+Math.random()*380,ease.out).then(()=>q.destroy());}};
  async function banner(text,color="#ffe86c",ms=600){const shade=G();shade.beginFill(0x18020d,.6);shade.drawRect(0,0,W,H-82);shade.endFill();fx.addChild(shade);const m=label(text,44,color,"#5b1024",10);m.position.set(cx,b.y+b.h/2);m.scale.set(.35);m.alpha=0;fx.addChild(m);await Promise.all([tween(m,{alpha:1},140),tween(m.scale,{x:1,y:1},300,ease.back)]);await wait(ms);await Promise.all([tween(m,{alpha:0},160),tween(shade,{alpha:0},160)]);m.destroy();shade.destroy();}
  async function flameLine(e,ctx){const g=G();g.lineStyle(7,0xff6a1b,.95);e.cells.forEach(([c,r],i)=>{const p=grid.center(c,r);i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y);});g.filters=[new PIXI.BlurFilter(1.2)];fx.addChild(g);ctx.sound.tone(380+e.count*42,.24,{type:"triangle",v:.055,to:720});await tween(g,{alpha:0},520);g.destroy();return true;}
  async function collect(e,ctx){
    let total=0;
    const freeCollect=freeModeActive||ctx?.activeMode==="free";
    const devil=grid.liveCells().flat().find(cell=>cell.sym==="DV");
    const generatedAnim=devil&&art.stylized?animFor(art,"DV","collect"):null;
    let generatedRun=null;
    const target=devil?grid.center(2,1):{x:cx,y:b.y+b.h/2};
    const read=label("DEVIL'S LOCK  0×",27,"#fff192","#5a1024",7);read.position.set(cx,b.y-18);fx.addChild(read);
    const halo=G();halo.lineStyle(10,C.gold,.8);halo.drawCircle(0,0,38);halo.lineStyle(4,C.pale,.9);halo.drawCircle(0,0,48);halo.position.set(target.x,target.y);halo.scale.set(.35);halo.alpha=0;fx.addChildAt(halo,0);
    if(devil){
      animatedDevils.add(devil);devil.s.scale.set(DEVIL_SCALE);
      if(generatedAnim){generatedRun=playFrames(devil.s,generatedAnim,{still:art.images.DV,loops:1});await Promise.all([tween(halo,{alpha:.9},130),tween(halo.scale,{x:1,y:1},180,ease.back)]);}
      else{await Promise.all([tween(devil.s.scale,{x:1.45,y:1.12},130,ease.out),tween(devil.s,{rotation:-.1},130),tween(halo,{alpha:.9},130),tween(halo.scale,{x:1,y:1},180,ease.back)]);await Promise.all([tween(devil.s.scale,{x:1.3,y:1.3},140,ease.back),tween(devil.s,{rotation:0},140)]);}
    }
    try{
      for(const [c,r] of e.cells){
        const p=grid.center(c,r),coin=new PIXI.Container();
        const coinFace=G();coinFace.lineStyle(4,0x873014,1);coinFace.beginFill(C.gold);coinFace.drawCircle(0,0,16);coinFace.endFill();coin.addChild(coinFace);coin.position.set(p.x,p.y);fx.addChild(coin);ctx.sound.tone(freeCollect?760+total*34:560+total*24,.13,{type:"sine",v:.045,to:freeCollect?1220:820});
        const lean=devil&&!generatedRun?tween(devil.s,{rotation:(c<2?-.09:.09)},150,ease.in):Promise.resolve();
        await Promise.all([tween(coin,{x:target.x,y:target.y,rotation:Math.PI*2,alpha:.2},freeCollect?265:210,ease.in),lean]);coin.destroy();
        if(devil&&!generatedRun){await Promise.all([tween(devil.s.scale,{x:1.55,y:1.18},80,ease.out),tween(halo.scale,{x:1.22,y:1.22},80,ease.out)]);await Promise.all([tween(devil.s.scale,{x:1.3,y:1.3},120,ease.back),tween(devil.s,{rotation:0},120),tween(halo.scale,{x:1,y:1},120,ease.back)]);}
        else if(generatedRun){await tween(halo.scale,{x:1.18,y:1.18},70,ease.out);await tween(halo.scale,{x:1,y:1},100,ease.back);}
        total=Number(e.payAmount);read.text=`DEVIL'S LOCK  ${total.toFixed(2).replace(/0+$/,'').replace(/\.$/,'')}×`;burst(target.x,target.y,C.gold,9);
      }
      if(devil){
        ctx.sound.noise(.18,{v:.035,f:240,to:620});
        if(generatedRun)await Promise.all([generatedRun.done,tween(halo,{alpha:0},260),tween(halo.scale,{x:1.55,y:1.55},260,ease.out)]);
        else{await Promise.all([tween(devil.s.scale,{x:1.62,y:1.62},110,ease.out),tween(halo,{alpha:0},260),tween(halo.scale,{x:1.55,y:1.55},260,ease.out)]);await tween(devil.s.scale,{x:DEVIL_SCALE,y:DEVIL_SCALE},220,ease.back);}
      }
      await wait(180);await tween(read,{alpha:0},150);return true;
    }finally{
      generatedRun?.stop();if(devil){devil.s.scale.set(DEVIL_SCALE);devil.s.rotation=0;animatedDevils.delete(devil);}read.destroy();halo.destroy();
    }
  }
  async function rewind(e,ctx){ctx.sound.noise(.35,{v:.04,f:420,to:110});const tint=G();tint.beginFill(0x70451b,.36);tint.drawRect(0,0,W,H-80);tint.endFill();fx.addChild(tint);const watch=label("↶  REWIND",46,"#ffe28b","#4b2511",9);watch.position.set(cx,b.y+b.h/2);watch.scale.set(.5);fx.addChild(watch);await tween(watch,{rotation:-Math.PI*.18,x:cx-20},260,ease.back);await wait(250);await Promise.all([tween(tint,{alpha:0},150),tween(watch,{alpha:0,rotation:0},150)]);tint.destroy();watch.destroy();return true;}
  function updatePig(e){const p=pigs[e.key];if(!p)return;const value=Number(e.newValue);p.fill=value;const stage=Math.min(4,Math.floor(value/4));p.body.scale.set((art.stylized&&art.images.PIG_METER?.baseTexture?.valid?.valueOf?.()?0.14:1)*(1+stage*.055));burst(p.holder.x,p.holder.y-8,C.gold,7);kit.tween(p.body,{rotation:.12},90,ease.out).then(()=>kit.tween(p.body,{rotation:-.08},100)).then(()=>kit.tween(p.body,{rotation:0},100));}
  return{
    spinStart(pass,ctx){surfaceMode=ctx?.activeMode==="base"?"base":"feature";if(ctx?.activeMode==="free")freeModeActive=true;else if(ctx?.activeMode==="base")freeModeActive=false;heat=.25;},
    async cellRipple(pass,ctx){if((pass.resolve?.iteration??0)!==0)return;const order=[];for(let c=0;c<5;c++)for(let r=0;r<3;r++)if(!(c===2&&r===1))order.push([c,r]);order.push([2,1]);for(const [c,r] of order){const cell=grid.cell(c,r);if(cell){cell.alpha=.62;await tween(cell,{alpha:1},28);ctx.sound.tone(115+c*10+r*4,.035,{type:"square",v:.012});}}},
    async event(e,ctx){
      if(e.type==="symbol-mutate"&&e.mutationType==="symbol"&&e.symbols?.includes("DV")){const p=grid.center(2,1);burst(p.x,p.y,C.red,24);ctx.sound.noise(.22,{v:.05,f:180,to:540});}
      if(e.type==="win"&&e.source==="award-values")return collect(e,ctx);
      if(e.type==="win"&&e.evaluatorType!=="anywhere")return flameLine(e,ctx);
      if(e.type==="prize-resolved"&&String(e.prizeId).startsWith("rewind"))return rewind(e,ctx);
      if(e.type==="state-update"&&pigs[e.key])updatePig(e);
      if(e.type==="prize-resolved"&&String(e.prizeId).endsWith("pig-burst")){const p=String(e.prizeId).startsWith("left")?pigs.leftPig:pigs.rightPig;burst(p.holder.x,p.holder.y,C.pale,45);await banner("6 FREE GAMES");return true;}
      if(e.type==="mode-enter"&&e.modeId==="mini-pigs"){surfaceMode="feature";await banner("MINI PIG RESPIN","#ffb4cb",500);return true;}
      if(e.type==="mode-enter"&&e.modeId==="free"){freeModeActive=true;surfaceMode="feature";heat=1;await banner(`${e.spins} FIENDISH FREE GAMES`);return true;}
      if(e.type==="state-update"&&e.namespace==="spin-counter"&&e.key==="free"&&Number(e.newValue)>Number(e.oldValue)&&Number(e.oldValue)>0){await banner(`PIGLET  +${Number(e.newValue)-Number(e.oldValue)} GAMES`,"#ffb7cb",350);return true;}
      if(e.type==="win-capped"){await banner("2,013×  MAXIMUM WIN","#fff38a",900);return true;}
      if(e.type==="mode-exit"&&e.modeId==="free"){freeModeActive=false;heat=.2;await banner("THE DEVIL BOWS","#ffe175",400);surfaceMode="base";}
      return false;
    },
    async afterRound(result,ctx){const x=Number(result?.totalWinX??0);if(x>=20){heat=1;await banner(x>=100?"FIENDISH MEGA WIN":"DEVILISH BIG WIN","#fff278",800);for(let i=0;i<6;i++)burst(100+Math.random()*(W-200),100+Math.random()*420,C.gold,18);}surfaceMode="base";heat=.15;},
  };
}
