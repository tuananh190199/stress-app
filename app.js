/* MindRelief — app.js (Simon highlight mạnh, Typing đoạn dài, Snake + Flappy có Start & điểm) */

/* ===== Questions (detailed) ===== */
const PHQ9 = [
  "Trong 2 tuần qua, bạn có thấy ít hứng thú hoặc ít niềm vui khi làm các hoạt động thường ngày (học tập, công việc, sinh hoạt cá nhân…)?",
  "Bạn có cảm giác buồn bã, chán nản, tuyệt vọng, hoặc tinh thần đi xuống hầu như không cải thiện?",
  "Bạn có khó ngủ, ngủ chập chờn, tỉnh giấc giữa đêm hoặc ngủ quá nhiều so với bình thường?",
  "Bạn mệt mỏi, thiếu năng lượng hoặc dễ kiệt sức ngay cả khi làm những việc đơn giản?",
  "Bạn có chán ăn, ăn kém hoặc ngược lại ăn nhiều hơn bình thường vì cảm xúc?",
  "Bạn có cảm giác tự ti, tự trách, cho rằng mình là gánh nặng, kém giá trị so với người khác?",
  "Bạn thấy khó tập trung khi làm việc/học, đọc sách, xem phim hay trò chuyện với người khác?",
  "Bạn có lúc cử động chậm, uể oải, hoặc bồn chồn, đứng ngồi không yên đến mức người khác nhận ra?",
  "Trong 2 tuần qua, có khi nào bạn nghĩ rằng mình không muốn tồn tại hoặc có ý nghĩ làm tổn hại bản thân?",
];
const GAD7 = [
  "Bạn có thường xuyên căng thẳng, lo lắng, bồn chồn mà khó giải thích rõ nguyên nhân?",
  "Khi lo lắng, bạn có khó dừng lại hoặc khó kiểm soát dòng suy nghĩ lo âu?",
  "Bạn có lo nghĩ quá nhiều về nhiều vấn đề (công việc, học tập, sức khỏe, gia đình…), khó tách ra nghỉ ngơi?",
  "Bạn thấy khó thư giãn, khó tìm được trạng thái bình tĩnh ngay cả khi đã rảnh?",
  "Bạn có cảm giác bồn chồn, khó ngồi yên, cơ thể căng hoặc giật mình dễ dàng?",
  "Bạn dễ cáu hoặc dễ khó chịu hơn bình thường, phản ứng mạnh trước chuyện nhỏ?",
  "Bạn lo sợ điều xấu sắp xảy ra, hay dự cảm bất an liên tục?",
];
const PSS10 = [
  "Trong 1 tháng qua, bạn có bị bất ngờ hoặc bối rối bởi những việc ngoài dự kiến?",
  "Bạn cảm thấy khó kiểm soát những việc quan trọng trong cuộc sống?",
  "Bạn cảm thấy căng thẳng, áp lực vì nhiều chuyện xảy ra đồng thời?",
  "Bạn cảm thấy tự tin vào khả năng giải quyết vấn đề của bản thân?",
  "Mọi việc diễn ra theo ý bạn hoặc trong tầm kiểm soát hợp lý?",
  "Bạn không thể đối phó nổi với tất cả những việc bạn phải làm?",
  "Bạn kiểm soát được sự khó chịu/khó khăn nảy sinh trong cuộc sống?",
  "Bạn kiểm soát tốt hầu hết các việc đang diễn ra xung quanh mình?",
  "Bạn tức giận vì những việc ngoài tầm kiểm soát của mình?",
  "Bạn cảm thấy các khó khăn chồng chất đến mức không vượt qua nổi?",
];
const PHQ_GAD_OPTIONS = [
  { v: 0, label: "0 — Không hề" },
  { v: 1, label: "1 — Vài ngày" },
  { v: 2, label: "2 — Hơn nửa số ngày" },
  { v: 3, label: "3 — Gần như mỗi ngày" },
];
const PSS_OPTIONS = [
  { v: 0, label: "0 — Không bao giờ" },
  { v: 1, label: "1 — Hiếm khi" },
  { v: 2, label: "2 — Thỉnh thoảng" },
  { v: 3, label: "3 — Khá thường xuyên" },
  { v: 4, label: "4 — Rất thường xuyên" },
];
const PSS_REVERSED_IDX = new Set([3,4,6,7]);

/* ===== Helpers ===== */
const sum = a => a.reduce((x,y)=>x+(Number.isFinite(y)?y:0),0);
const classifyPHQ = s => s<=4?{l:"Tối thiểu",c:"ok"}:s<=9?{l:"Nhẹ",c:"ok"}:s<=14?{l:"Trung bình",c:"warn"}:s<=19?{l:"Khá nặng",c:"bad"}:{l:"Nặng",c:"bad"};
const classifyGAD = s => s<=4?{l:"Tối thiểu",c:"ok"}:s<=9?{l:"Nhẹ",c:"ok"}:s<=14?{l:"Trung bình",c:"warn"}:{l:"Nặng",c:"bad"};
const classifyPSS = s => s<=13?{l:"Thấp",b:"LOW",c:"ok"}:s<=26?{l:"Vừa",b:"MID",c:"warn"}:{l:"Cao",b:"HIGH",c:"bad"};
const svg = (g1="#7c5cff",g2="#22d3ee",icon="🎮") =>
 "data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${g1}'/><stop offset='100%' stop-color='${g2}'/></linearGradient></defs><rect fill='url(#g)' x='0' y='0' width='640' height='360' rx='24'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Segoe UI,Roboto,Arial' font-size='88' fill='white'>${icon}</text></svg>`);
function animalSVG(a="elephant"){const icon=a==="tiger"?"🐯":"🐘",g1=a==="tiger"?"#f59e0b":"#60a5fa",g2=a==="tiger"?"#ef4444":"#22d3ee";const s=`<svg xmlns='http://www.w3.org/2000/svg' width='900' height='900'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${g1}'/><stop offset='100%' stop-color='${g2}'/></linearGradient></defs><rect fill='url(#g)' x='0' y='0' width='900' height='900' rx='36'/><rect x='40' y='40' width='820' height='820' rx='32' fill='white' opacity='.9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, Segoe UI, Roboto, Arial' font-size='540'>${icon}</text></svg>`;return "data:image/svg+xml;utf8,"+encodeURIComponent(s);}

/* ===== Games registry ===== */
const GAMES = [
  { id:"coloring", name:"Coloring", intensity:"LOW", tags:["focus","calming"], desc:"Tô màu thư giãn, tập trung vào thao tác đơn giản.", img: svg("#60a5fa","#a78bfa","🎨"), playInline:true },
  { id:"sudoku", name:"Sudoku", intensity:"LOW", tags:["puzzle","focus"], desc:"Câu đố số rèn luyện sự tập trung.", img: svg("#34d399","#22d3ee","🧩"), playInline:true },
  { id:"jigsaw", name:"Jigsaw Puzzle", intensity:"LOW", tags:["puzzle","calming"], desc:"Ghép hình 3×3 — hỗ trợ chọn ảnh thực tế từ máy.", img: svg("#f472b6","#fb7185","🧠"), playInline:true },
  { id:"memory", name:"Memory Match", intensity:"LOW", tags:["focus","calming"], desc:"Lật cặp biểu tượng giống nhau (4×4).", img: svg("#06b6d4","#60a5fa","🃏"), playInline:true },
  { id:"mole", name:"Whack-a-Mole", intensity:"MID", tags:["quick","reflex"], desc:"Đập chuột 3×3 — ghi điểm trong 30s.", img: svg("#f97316","#f59e0b","🐹"), playInline:true },
  { id:"react", name:"Reaction Timer", intensity:"LOW", tags:["focus","quick"], desc:"Đo tốc độ phản xạ — nhấn thật nhanh khi đổi màu.", img: svg("#84cc16","#22c55e","⚡"), playInline:true },
  { id:"breath", name:"Breathing Pacer", intensity:"LOW", tags:["calming"], desc:"Hít-giữ-thở 4-7-8 bằng vòng tròn dẫn nhịp.", img: svg("#a78bfa","#7c5cff","🫁"), playInline:true },
  { id:"fifteen", name:"15-Puzzle", intensity:"LOW", tags:["puzzle","focus"], desc:"Trượt số 4×4, sắp 1→15.", img: svg("#22d3ee","#34d399","🔢"), playInline:true },
  { id:"simon", name:"Simon Says", intensity:"LOW", tags:["memory","focus"], desc:"Nhớ và lặp lại chuỗi 4 màu tăng dần độ dài.", img: svg("#e879f9","#a78bfa","🟥"), playInline:true },
  { id:"typing", name:"Typing Test", intensity:"LOW", tags:["focus","quick"], desc:"Gõ nhanh trong 30s — đoạn văn dài.", img: svg("#f472b6","#fb7185","⌨️"), playInline:true },
  { id:"snake", name:"Snake", intensity:"MID", tags:["reflex","focus"], desc:"Điều khiển rắn ăn mồi, tốc độ tăng dần.", img: svg("#10b981","#059669","🐍"), playInline:true },
  { id:"breakout", name:"Brick Breaker", intensity:"MID", tags:["reflex"], desc:"Vợt bóng phá gạch — thư giãn cổ điển.", img: svg("#38bdf8","#22d3ee","🏓"), playInline:true },
  { id:"flappy", name:"Flappy Box", intensity:"MID", tags:["reflex","quick"], desc:"Nhấp để nhảy qua cột — có điểm & kỷ lục.", img: svg("#fb923c","#f97316","📦"), playInline:true },

  { id:"uno", name:"Uno!", intensity:"MID", tags:["social","quick"], img: svg("#f59e0b","#f97316","🃏"), playInline:false, url:"https://play.google.com/store/apps/details?id=com.matteljv.uno" },
  { id:"pvz", name:"Plants vs. Zombies", intensity:"HIGH", tags:["action","strategy"], img: svg("#22c55e","#16a34a","🧟"), playInline:false, url:"https://www.ea.com/games/plants-vs-zombies" },
  { id:"playtogether", name:"Play Together", intensity:"HIGH", tags:["social","life-sim"], img: svg("#38bdf8","#22d3ee","👥"), playInline:false, url:"https://play.google.com/store/apps/details?id=com.haegin.playtogether" },
];

/* ===== Recommendation ===== */
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];}return a;}
function pick(bucket,phq,gad){
  const anxietyHigh=gad>=10, depressionHigh=phq>=10;
  const filtered=GAMES.filter(g=> bucket==="LOW"?g.intensity==="LOW": bucket==="MID"?g.intensity!=="HIGH":true)
    .map(g=>{let s=1; if(anxietyHigh){ if(["coloring","sudoku","jigsaw","memory","breath","react","fifteen","simon","typing"].includes(g.id)) s+=0.6; if(g.tags.includes("action")) s-=0.3;}
              if(depressionHigh){ if(g.tags.includes("social")) s+=0.3; if(g.tags.includes("quick")) s+=0.2; }
              return {...g,_s:s};})
    .sort((a,b)=>b._s-a._s);
  return shuffle(filtered.slice(0,12)).slice(0,6);
}

/* ===== Router & Home ===== */
const state={phq:Array(PHQ9.length).fill(undefined), gad:Array(GAD7.length).fill(undefined), pss:Array(PSS10.length).fill(undefined)};
const views={home:document.getElementById("view-home"), survey:document.getElementById("view-survey")};
let gameView,lastView="home";
function showView(name){document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  if(name==="home"){views.home.classList.add("active"); lastView="home";}
  else if(name==="survey"){views.survey.classList.add("active"); lastView="survey";}
  else if(name.startsWith("game:")) showGameDetail(name.split(":")[1]);
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-goto]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();showView(el.getAttribute("data-goto"));}));
function renderHomeGallery(){const wrap=document.getElementById("game-cards-home");wrap.innerHTML="";
  GAMES.forEach(g=>{const card=document.createElement("div");card.className="card";card.style.cursor="pointer";
    card.innerHTML=`<img src="${g.img}" alt="${g.name}" style="width:100%;height:160px;object-fit:cover;border-radius:12px;margin-bottom:8px;border:1px solid var(--line)"/><h4>${g.name}</h4><p>${g.desc}</p>`;
    card.addEventListener("click",()=>{lastView="home";showView(`game:${g.id}`);}); wrap.appendChild(card);});}

/* ===== Game view ===== */
function ensureGameView(){ if(gameView) return; gameView=document.createElement("section"); gameView.id="view-game"; gameView.className="view"; gameView.innerHTML=`<div class="container" id="game-detail"></div>`; document.getElementById("app").appendChild(gameView);}
function showGameDetail(id){
  ensureGameView(); document.querySelectorAll(".view").forEach(v=>v.classList.remove("active")); gameView.classList.add("active");
  const g=GAMES.find(x=>x.id===id); const el=document.getElementById("game-detail");
  const tags=g.tags.map(t=>`<span class="choice" style="pointer-events:none">${t}</span>`).join(" ");
  let bodyHTML="";
  if(g.playInline){
    const map={coloring:inlineColoringHTML,sudoku:inlineSudokuHTML,jigsaw:inlineJigsawHTML,memory:inlineMemoryHTML,mole:inlineMoleHTML,react:inlineReactHTML,breath:inlineBreathHTML,fifteen:inlineFifteenHTML,simon:inlineSimonHTML,typing:inlineTypingHTML,snake:inlineSnakeHTML,breakout:inlineBreakoutHTML,flappy:inlineFlappyHTML};
    bodyHTML=(map[g.id]||(()=>"<div class='mt-16'>Chưa hỗ trợ.</div>"))();
  } else bodyHTML=`<div class="mt-16"><a class="btn btn--primary" href="${g.url}" target="_blank" rel="noopener">Mở trò chơi</a></div>`;
  const backResultsBtn=(lastView==="results")?`<a class="btn" href="#" id="back-results">← Kết quả khảo sát</a>`:"";
  el.innerHTML=`<div class="actions" style="margin-bottom:12px"><a class="btn" href="#" id="back-home">← Trang chủ</a>${backResultsBtn}</div>
  <div class="cards" style="margin-top:4px"><div class="card" style="grid-column:1/-1">
    <img src="${g.img}" alt="${g.name}" style="width:100%;height:260px;object-fit:cover;border-radius:14px;border:1px solid var(--line);margin-bottom:12px"/>
    <h2 style="margin:0 0 6px">${g.name}</h2><p class="muted" style="margin:0 0 10px">${g.desc}</p>
    <div class="q-options">${tags}</div>${bodyHTML}</div></div>`;
  el.querySelector("#back-home").addEventListener("click",e=>{e.preventDefault();showView("home");});
  const br=el.querySelector("#back-results"); if(br) br.addEventListener("click",e=>{e.preventDefault();showView("survey");document.getElementById("results").classList.remove("hidden");document.getElementById("results").scrollIntoView({behavior:"smooth",block:"start"});lastView="results";});
  const initMap={coloring:initColoring,sudoku:initSudoku,jigsaw:initJigsaw,memory:initMemory,mole:initMole,react:initReact,breath:initBreath,fifteen:initFifteen,simon:initSimon,typing:initTyping,snake:initSnake,breakout:initBreakout,flappy:initFlappy};
  (initMap[g.id]||(()=>{}))(el);
}

/* ===== Inline games ===== */
/* Coloring */
function inlineColoringHTML(){return `<div class="q-card" style="margin-top:12px"><div class="q-title">Chơi nhanh — Coloring</div>
<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><label style="font-size:12px">Màu</label><input type="color" id="color"/>
<label style="font-size:12px">Cỡ bút</label><input type="range" id="size" min="2" max="24" value="6"/><button class="btn" id="clear">Xoá</button></div>
<canvas id="canvas" width="680" height="360" style="width:100%;max-width:680px;border:1px solid var(--line);border-radius:12px;background:#fff"></canvas></div>`;}
function initColoring(scope){const c=scope.querySelector("#canvas"),ctx=c.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,c.width,c.height);let drawing=false,color="#4f46e5",size=6;
const pos=e=>{const r=c.getBoundingClientRect();const X=e.touches?e.touches[0].clientX:e.clientX;const Y=e.touches?e.touches[0].clientY:e.clientY;return{x:X-r.left,y:Y-r.top};};
const draw=e=>{if(!drawing)return;e.preventDefault();const {x,y}=pos(e);ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,size/2,0,Math.PI*2);ctx.fill();};
c.addEventListener('mousedown',()=>drawing=true);c.addEventListener('mouseup',()=>drawing=false);c.addEventListener('mouseleave',()=>drawing=false);c.addEventListener('mousemove',draw);
c.addEventListener('touchstart',()=>drawing=true);c.addEventListener('touchend',()=>drawing=false);c.addEventListener('touchmove',draw);
scope.querySelector('#color').addEventListener('change',e=>color=e.target.value);scope.querySelector('#size').addEventListener('input',e=>size=+e.target.value);
scope.querySelector('#clear').addEventListener('click',()=>{ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=color;});}

/* Sudoku */
function inlineSudokuHTML(){return `<div class="q-card" style="margin-top:12px"><div class="q-title">Sudoku 9×9 (bản đơn giản)</div>
<div class="sudoku-wrap"><div id="sudoku-board" class="sudoku-board"></div></div>
<div class="mt-16" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center"><button class="btn" id="btn-check">Kiểm tra</button><button class="btn" id="btn-clear">Xoá nhập</button><div id="sudoku-msg" class="muted"></div></div></div>`;}
function initSudoku(scope){const puzzle=[0,0,0,2,6,0,7,0,1, 6,8,0,0,7,0,0,9,0, 1,9,0,0,0,4,5,0,0, 8,2,0,1,0,0,0,4,0, 0,0,4,6,0,2,9,0,0, 0,5,0,0,0,3,0,2,8, 0,0,9,3,0,0,0,7,4, 0,4,0,0,5,0,0,3,6, 7,0,3,0,1,8,0,0,0];
const solution=[4,3,5,2,6,9,7,8,1, 6,8,2,5,7,1,4,9,3, 1,9,7,8,3,4,5,6,2, 8,2,6,1,9,5,3,4,7, 3,7,4,6,8,2,9,1,5, 9,5,1,7,4,3,6,2,8, 5,1,9,3,2,6,8,7,4, 2,4,8,9,5,7,1,3,6, 7,6,3,4,1,8,2,5,9];
const board=scope.querySelector("#sudoku-board");board.innerHTML="";
puzzle.forEach((v,i)=>{const cell=document.createElement("input");cell.type="text";cell.inputMode="numeric";cell.maxLength=1;cell.className="sudoku-cell";cell.value=v?String(v):"";if(v)cell.disabled=true;
const r=(i/9)|0,c=i%9; if(c%3===0)cell.classList.add("sudoku-thick-left"); if(r%3===0)cell.classList.add("sudoku-thick-top"); if(c===8)cell.classList.add("sudoku-thick-right"); if(r===8)cell.classList.add("sudoku-thick-bottom");
cell.addEventListener("input",()=>{cell.value=cell.value.replace(/[^1-9]/g,"").slice(0,1);}); board.appendChild(cell);});
scope.querySelector("#btn-clear").onclick=()=>{[...board.children].forEach((cell,idx)=>{if(!puzzle[idx])cell.value="";}); scope.querySelector("#sudoku-msg").textContent="";};
scope.querySelector("#btn-check").onclick=()=>{const ok=[...board.children].every((cell,idx)=>Number(cell.value||0)===solution[idx]); scope.querySelector("#sudoku-msg").textContent=ok?"🎉 Chính xác!":"Chưa đúng, thử lại nhé.";};}

/* Jigsaw */
function inlineJigsawHTML(){return `<div class="q-card" style="margin-top:12px"><div class="q-title">Jigsaw 3×3 — chọn ảnh thực tế hoặc dùng chủ đề mẫu</div>
<div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap"><div>
<canvas id="jigsaw" width="450" height="450" style="width:100%;max-width:450px;border:1px solid var(--line);border-radius:12px;background:#fff"></canvas>
<div class="mt-16" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><button class="btn" id="shuffle">Xáo trộn</button>
<label class="btn" for="pick-file" style="cursor:pointer">Chọn ảnh từ máy</label><input id="pick-file" type="file" accept="image/*" style="display:none"/><span id="jigsaw-msg" class="muted"></span></div></div>
<div style="min-width:220px"><label class="muted" style="font-size:12px">Chủ đề mẫu</label><div class="mt-16" style="display:flex;gap:8px;flex-wrap:wrap">
<button class="btn" id="choose-elephant">🐘 Voi</button><button class="btn" id="choose-tiger">🐯 Hổ</button></div>
<div class="mt-16 muted" style="font-size:12px">Hình mẫu/đang dùng</div><img id="ref-img" alt="Hình mẫu" style="width:200px;height:200px;object-fit:cover;border-radius:12px;border:1px solid var(--line);display:block;margin-top:6px"/></div></div></div>`;}
function initJigsaw(scope){const canvas=scope.querySelector("#jigsaw"),ctx=canvas.getContext("2d");const N=3,W=canvas.width,H=canvas.height,w=W/N,h=H/N;const pieces=Array.from({length:N*N},(_,i)=>({to:i,at:i}));const img=new Image();
function loadSrc(src){scope.querySelector("#ref-img").src=src; img.onload=()=>{pieces.forEach((p,i)=>{p.to=i;p.at=i;});shuffle(true);}; img.src=src;}
function loadAnimal(a){loadSrc(animalSVG(a));}
function draw(){ctx.clearRect(0,0,W,H); pieces.forEach(p=>{const sx=(p.to%N)*(img.width/N),sy=((p.to/N)|0)*(img.height/N);const dx=(p.at%N)*w,dy=((p.at/N)|0)*h;ctx.drawImage(img,sx,sy,img.width/N,img.height/N,dx,dy,w,h);ctx.strokeStyle="#60a5fa";ctx.lineWidth=2;ctx.strokeRect(dx,dy,w,h);});}
function shuffle(silent=false){for(let i=0;i<pieces.length;i++){const j=(Math.random()*pieces.length)|0;[pieces[i].at,pieces[j].at]=[pieces[j].at,pieces[i].at];} draw(); if(!silent)scope.querySelector("#jigsaw-msg").textContent="";}
function hit(x,y){const c=(x/w)|0,r=(y/h)|0;const idx=r*N+c;return pieces.find(p=>p.at===idx);}
let first=null;canvas.addEventListener("click",e=>{const r=canvas.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;const p=hit(x,y);if(!p)return;
 if(!first){first=p;ctx.lineWidth=4;ctx.strokeStyle="#38bdf8";const dx=(p.at%N)*w,dy=((p.at/N)|0)*h;ctx.strokeRect(dx+2,dy+2,w-4,h-4);} else {const t=first.at;first.at=p.at;p.at=t;first=null;draw();if(pieces.every(pc=>pc.at===pc.to))scope.querySelector("#jigsaw-msg").textContent="🎉 Hoàn thành!";}});
scope.querySelector("#shuffle").onclick=()=>shuffle();scope.querySelector("#choose-elephant").onclick=()=>loadAnimal("elephant");scope.querySelector("#choose-tiger").onclick=()=>loadAnimal("tiger");
scope.querySelector("#pick-file").addEventListener("change",ev=>{const f=ev.target.files&&ev.target.files[0]; if(!f)return; const rd=new FileReader(); rd.onload=()=>loadSrc(rd.result); rd.readAsDataURL(f);}); loadAnimal("elephant");}

/* Memory */
function inlineMemoryHTML(){return `<div class="q-card" style="margin-top:12px"><div class="q-title">Memory 4×4 — lật cặp giống nhau</div>
<div id="mem-grid" style="display:grid;grid-template-columns:repeat(4,86px);gap:10px;justify-content:center"></div><div class="center mt-16"><span id="mem-msg" class="muted"></span></div></div>`;}
function initMemory(scope){const icons=["🐶","🐱","🦊","🐼","🐸","🐵","🐤","🦄"];const deck=[...icons,...icons].sort(()=>Math.random()-0.5);const grid=scope.querySelector("#mem-grid");let first=null,lock=false,matched=0;
deck.forEach(ch=>{const card=document.createElement("button");card.className="btn";card.style.width="86px";card.style.height="86px";card.dataset.v=ch;card.textContent="❓";card.style.fontSize="22px";
card.addEventListener("click",()=>{if(lock||card.classList.contains("done")||card.textContent!=="❓")return;card.textContent=card.dataset.v;if(!first){first=card;}else{lock=true;setTimeout(()=>{if(first.dataset.v===card.dataset.v){first.classList.add("done");card.classList.add("done");first.style.background="rgba(34,197,94,.2)";card.style.background="rgba(34,197,94,.2)";matched+=2;if(matched===deck.length)scope.querySelector("#mem-msg").textContent="🎉 Tuyệt!";}else{first.textContent="❓";card.textContent="❓";}first=null;lock=false;},500);} });grid.appendChild(card);});}

/* Mole */
function inlineMoleHTML(){return `<div class="q-card" style="margin-top:12px"><div class="q-title">Whack-a-Mole — 30 giây</div>
<div id="mole-grid" style="display:grid;grid-template-columns:repeat(3,100px);gap:10px;justify-content:center;margin:8px 0"></div>
<div class="center"><button class="btn" id="mole-start">Bắt đầu</button><span class="muted" id="mole-info"></span></div></div>`;}
function initMole(scope){const grid=scope.querySelector("#mole-grid");const cells=Array.from({length:9},()=>{const b=document.createElement("button");b.className="btn";b.style.width="100px";b.style.height="100px";grid.appendChild(b);return b;});
let score=0,left=30,timer=null,mole=-1;function tick(){left--;scope.querySelector("#mole-info").textContent=` · Điểm: ${score} · Còn: ${left}s`;if(left<=0){clearInterval(timer);timer=null;cells.forEach(c=>c.textContent="");return;}
if(mole>=0)cells[mole].textContent="";mole=(Math.random()*cells.length)|0;cells[mole].textContent="🐹";}
cells.forEach((c,i)=>c.addEventListener("click",()=>{if(i===mole){score++;c.textContent="⭐";}}));scope.querySelector("#mole-start").onclick=()=>{if(timer)return;score=0;left=30;mole=-1;tick();timer=setInterval(tick,1000);};}

/* Reaction */
function inlineReactHTML(){return `<div class="q-card" style="margin-top:12px"><div class="q-title">Reaction Timer</div>
<div id="react-area" style="height:200px;border:2px dashed #7dd3fc;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-top:8px;"><span class="muted">Nhấn "Start", chờ đổi màu rồi bấm thật nhanh!</span></div>
<div class="center mt-16"><button class="btn" id="react-start">Start</button><span id="react-msg" class="muted"></span></div></div>`;}
function initReact(scope){const area=scope.querySelector("#react-area"),msg=scope.querySelector("#react-msg");let waiting=false,start=0,timeout=null;
scope.querySelector("#react-start").onclick=()=>{msg.textContent="";area.style.background="transparent";waiting=true;const d=800+Math.random()*1600;timeout=setTimeout(()=>{area.style.background="#22c55e55";area.style.boxShadow="0 0 0 4px #22c55e66 inset";start=performance.now();},d);};
area.onclick=()=>{if(!waiting)return;if(start===0){clearTimeout(timeout);waiting=false;msg.textContent="Sớm quá!";area.style.background="transparent";area.style.boxShadow="none";return;}const t=Math.round(performance.now()-start);msg.textContent=`⏱ ${t} ms`;waiting=false;start=0;area.style.background="transparent";area.style.boxShadow="none";};}

/* Breathing */
function inlineBreathHTML(){return `<div class="q-card" style="margin-top:12px"><div class="q-title">Breathing Pacer · 4-7-8</div>
<div class="center" style="margin-top:10px"><canvas id="breath-c" width="260" height="260" style="border-radius:50%;background:#0b1229;border:1px solid var(--line)"></canvas>
<div class="mt-16"><span id="breath-txt" class="muted">Nhấn Start</span></div><div class="mt-16" style="display:flex;gap:8px;justify-content:center"><button class="btn" id="breath-start">Start</button><button class="btn" id="breath-stop">Stop</button></div></div></div>`;}
function initBreath(scope){const c=scope.querySelector("#breath-c"),ctx=c.getContext("2d"),txt=scope.querySelector("#breath-txt");let anim=null,t0=0,phase=0;function draw(r){ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle="#111827";ctx.fillRect(0,0,c.width,c.height);ctx.beginPath();ctx.arc(c.width/2,c.height/2,r,0,Math.PI*2);ctx.fillStyle="#7c5cff77";ctx.fill();}
function step(ts){if(!t0)t0=ts;const e=(ts-t0)/1000;if(phase===0){draw(30+e/4*110);txt.textContent="Hít vào…";if(e>=4){phase=1;t0=ts;}}else if(phase===1){draw(140);txt.textContent="Giữ 7s…";if(e>=7){phase=2;t0=ts;}}else{draw(Math.max(30,140-e/8*110));txt.textContent="Thở ra…";if(e>=8){phase=0;t0=ts;}}anim=requestAnimationFrame(step);}scope.querySelector("#breath-start").onclick=()=>{cancelAnimationFrame(anim);t0=0;phase=0;anim=requestAnimationFrame(step);};scope.querySelector("#breath-stop").onclick=()=>{cancelAnimationFrame(anim);txt.textContent="Tạm dừng";};}

/* Fifteen */
function inlineFifteenHTML(){return `<div class="q-card" style="margin-top:12px"><div class="q-title">15-Puzzle (trượt số 4×4)</div>
<div id="fif-grid" style="display:grid;grid-template-columns:repeat(4,80px);gap:10px;justify-content:center;margin-top:8px"></div><div class="center mt-16"><button class="btn" id="fif-shuffle">Xáo</button> <span id="fif-msg" class="muted"></span></div></div>`;}
function initFifteen(scope){const grid=scope.querySelector("#fif-grid");let a=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];const btns=a.map(v=>{const b=document.createElement("button");b.className="btn";b.style.width="80px";b.style.height="80px";b.textContent=v?String(v):"";grid.appendChild(b);return b;});
function render(){btns.forEach((b,i)=>{const v=a[i];b.textContent=v?String(v):"";b.style.visibility=v?"visible":"hidden";});}function pos(x){return a.indexOf(x);}function swap(i,j){[a[i],a[j]]=[a[j],a[i]];render();check();}
function neigh(i){const r=(i/4)|0,c=i%4,ns=[];if(r>0)ns.push(i-4);if(r<3)ns.push(i+4);if(c>0)ns.push(i-1);if(c<3)ns.push(i+1);return ns;}
function check(){scope.querySelector("#fif-msg").textContent=(a.join(",")==="1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0")?"🎉 Đúng rồi!":"";}
btns.forEach((b,i)=>b.addEventListener("click",()=>{const z=pos(0);if(neigh(i).includes(z))swap(i,z);}));scope.querySelector("#fif-shuffle").onclick=()=>{for(let k=0;k<200;k++){const z=pos(0);const ns=neigh(z);const j=ns[(Math.random()*ns.length)|0];swap(z,j);}scope.querySelector("#fif-msg").textContent="";};render();}

/* Simon Says — màu nổi + highlight mạnh */
function inlineSimonHTML(){return `<div class="q-card" style="margin-top:12px">
  <div class="q-title">Simon Says — nhớ chuỗi màu</div>
  <div id="simon" style="display:grid;grid-template-columns:repeat(2,140px);gap:14px;justify-content:center;margin-top:8px">
    <button class="btn" data-i="0" style="height:140px;background:#ef4444;box-shadow:0 0 0 4px #ffffff22 inset;color:#fff;font-weight:700">Đỏ</button>
    <button class="btn" data-i="1" style="height:140px;background:#22c55e;box-shadow:0 0 0 4px #ffffff22 inset;color:#0b1229;font-weight:700">Lục</button>
    <button class="btn" data-i="2" style="height:140px;background:#3b82f6;box-shadow:0 0 0 4px #ffffff22 inset;color:#fff;font-weight:700">Lam</button>
    <button class="btn" data-i="3" style="height:140px;background:#eab308;box-shadow:0 0 0 4px #ffffff22 inset;color:#0b1229;font-weight:700">Vàng</button>
  </div>
  <div class="center mt-16"><button class="btn" id="simon-start">Bắt đầu</button> <span id="simon-msg" class="muted"></span></div>
</div>`;}
function initSimon(scope){const btns=[...scope.querySelectorAll("#simon [data-i]")],msg=scope.querySelector("#simon-msg");let seq=[],step=0,input=false;
function flash(i){const b=btns[i];const oldT=b.style.transform,oldS=b.style.boxShadow; b.style.transform="scale(1.15)"; b.style.boxShadow="0 0 18px 8px rgba(255,255,255,.45), 0 0 0 4px #fff inset"; setTimeout(()=>{b.style.transform=oldT; b.style.boxShadow=oldS;},300);}
function play(){input=false;let k=0;const t=setInterval(()=>{flash(seq[k++]); if(k>=seq.length){clearInterval(t);input=true;step=0;}},500);}
btns.forEach((b,i)=> b.addEventListener("click",()=>{if(!input)return;flash(i); if(i===seq[step]){step++; if(step===seq.length){msg.textContent=`Tốt! độ dài ${seq.length}`; seq.push((Math.random()*4)|0); setTimeout(play,700);} } else { msg.textContent="Sai rồi, bấm Bắt đầu để chơi lại."; input=false; }}));
scope.querySelector("#simon-start").onclick=()=>{seq=[(Math.random()*4)|0]; msg.textContent=""; play();};}

/* Typing Test — đoạn văn dài */
function inlineTypingHTML(){return `<div class="q-card" style="margin-top:12px"><div class="q-title">Typing Test — 30 giây</div>
<div id="typ-words" style="min-height:72px;background:rgba(255,255,255,.05);border:1px solid var(--line);border-radius:10px;padding:10px"></div>
<input id="typ-input" class="btn" style="width:100%;margin-top:10px;text-align:left;background:#0b1229" placeholder="Gõ ở đây..."/>
<div class="center mt-16"><button class="btn" id="typ-start">Start</button> <span id="typ-msg" class="muted"></span></div></div>`;}
function initTyping(scope){
  const corpus=("Mỗi buổi sáng chúng ta thức dậy với một cơ hội mới để bắt đầu lại "+
  "chậm rãi hít thở sâu và nhìn thế giới bằng đôi mắt bao dung "+
  "những bước chân nhỏ bé nhưng bền bỉ sẽ đưa ta đi rất xa "+
  "khi tâm trí mệt mỏi hãy tạm dừng để lắng nghe cơ thể "+
  "điềm tĩnh không phải là không có sóng gió mà là biết chèo lái qua nó ").repeat(6).trim().split(/\s+/);
  // tạo đoạn 90–120 từ
  const len = 90 + Math.floor(Math.random()*30);
  const words = Array.from({length:len},(_,i)=> corpus[(Math.random()*corpus.length)|0]);

  const zone=scope.querySelector("#typ-words"), input=scope.querySelector("#typ-input"), msg=scope.querySelector("#typ-msg"); let idx=0,left=30,timer=null,correct=0;
  function render(){ zone.innerHTML=words.map((w,i)=> i===idx?`<b style="color:#a5f3fc">${w}</b>`:w).join(" "); }
  input.addEventListener("keydown",e=>{ if(!timer) return; if(e.key===" "){ e.preventDefault(); if(input.value.trim()===words[idx]) correct++; idx=(idx+1)%words.length; input.value=""; render(); }});
  scope.querySelector("#typ-start").onclick=()=>{ if(timer) return; idx=0; left=30; correct=0; render(); input.value=""; input.focus();
    msg.textContent=""; timer=setInterval(()=>{ left--; msg.textContent=`Còn ${left}s`; if(left<=0){ clearInterval(timer); timer=null; const wpm=Math.round(correct*(60/30)); msg.textContent=`WPM ~ ${wpm}`; }},1000); };
}

/* Snake — có Start + tốc độ tăng dần */
function inlineSnakeHTML(){return `<div class="q-card" style="margin-top:12px"><div class="q-title">Snake</div>
<canvas id="snk" width="300" height="300" style="display:block;margin:8px auto;border:1px solid var(--line);background:#0b1229"></canvas>
<div class="center"><button class="btn" id="snk-start">Bắt đầu</button> <span id="snk-info" class="muted"></span></div>
<div class="center muted" style="margin-top:6px">Dùng phím mũi tên ← → ↑ ↓</div></div>`;}
function initSnake(scope){
  const c=scope.querySelector("#snk"),ctx=c.getContext("2d"),info=scope.querySelector("#snk-info"); const N=15,S=c.width/N;
  let snake,dir,food,alive,delay,timer=null,score;
  function reset(){ snake=[[7,7]]; dir=[1,0]; food=[(Math.random()*N)|0,(Math.random()*N)|0]; alive=true; delay=160; score=0; draw(); info.textContent="Điểm: 0"; }
  function draw(){ ctx.fillStyle="#0b1229"; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle="#22c55e"; snake.forEach(([x,y])=>ctx.fillRect(x*S,y*S,S-1,S-1)); ctx.fillStyle="#eab308"; ctx.fillRect(food[0]*S,food[1]*S,S-1,S-1); }
  function step(){ if(!alive){ clearInterval(timer); timer=null; info.textContent+=" · Thua!"; return; }
    const head=[snake[0][0]+dir[0], snake[0][1]+dir[1]];
    if(head[0]<0||head[0]>=N||head[1]<0||head[1]>=N|| snake.some(p=>p[0]===head[0]&&p[1]===head[1])){ alive=false; draw(); return; }
    snake.unshift(head);
    if(head[0]===food[0]&&head[1]===food[1]){ score++; info.textContent=`Điểm: ${score}`; food=[(Math.random()*N)|0,(Math.random()*N)|0]; delay=Math.max(80,delay-6); clearInterval(timer); timer=setInterval(step,delay); }
    else snake.pop();
    draw();
  }
  window.addEventListener("keydown",e=>{ if(!timer) return; if(e.key==="ArrowUp"&&dir[1]!==1)dir=[0,-1]; else if(e.key==="ArrowDown"&&dir[1]!==-1)dir=[0,1];
    else if(e.key==="ArrowLeft"&&dir[0]!==1)dir=[-1,0]; else if(e.key==="ArrowRight"&&dir[0]!==-1)dir=[1,0]; });
  scope.querySelector("#snk-start").onclick=()=>{ reset(); if(timer) clearInterval(timer); timer=setInterval(step,delay); c.focus(); };
  reset();
}

/* Breakout */
function inlineBreakoutHTML(){return `<div class="q-card" style="margin-top:12px"><div class="q-title">Brick Breaker</div>
<canvas id="brk" width="360" height="260" style="display:block;margin:8px auto;border:1px solid var(--line);background:#0b1229"></canvas>
<div class="center"><span class="muted">Dùng chuột để di chuyển vợt</span></div></div>`;}
function initBreakout(scope){const c=scope.querySelector("#brk"),ctx=c.getContext("2d");let x=180,y=140,dx=2,dy=-2,p=150,br=[];for(let r=0;r<3;r++)for(let col=0;col<7;col++)br.push({x:20+col*46,y:20+r*18,w:40,h:10,alive:true});
c.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect();p=Math.max(0,Math.min(c.width-70,e.clientX-r.left-35));});function draw(){ctx.clearRect(0,0,c.width,c.height);br.forEach(b=>{if(!b.alive)return;ctx.fillStyle="#38bdf8";ctx.fillRect(b.x,b.y,b.w,b.h);if(x>b.x&&x<b.x+b.w&&y>b.y&&y<b.y+b.h){b.alive=false;dy=-dy;}});ctx.fillStyle="#a78bfa";ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fill();ctx.fillStyle="#22d3ee";ctx.fillRect(p,c.height-16,70,8);}function tick(){x+=dx;y+=dy;if(x<6||x>c.width-6)dx=-dx;if(y<6)dy=-dy;if(y>c.height-16&&x>p&&x<p+70)dy=-Math.abs(dy);if(y>c.height+10){x=180;y=140;dx=2;dy=-2;}draw();requestAnimationFrame(tick);}draw();tick();}

/* Flappy — có Start + điểm & kỷ lục */
function inlineFlappyHTML(){return `<div class="q-card" style="margin-top:12px"><div class="q-title">Flappy Box</div>
<canvas id="flp" width="320" height="420" style="display:block;margin:8px auto;border:1px solid var(--line);background:#0b1229"></canvas>
<div class="center"><button class="btn" id="flp-start">Bắt đầu</button> <span id="flp-info" class="muted"></span></div></div>`;}
function initFlappy(scope){
  const c=scope.querySelector("#flp"),ctx=c.getContext("2d"),info=scope.querySelector("#flp-info"); let y,vy,pipes,t,score,best=0,running=false;
  function addPipe(){const gap=110,top=40+Math.random()*220;pipes.push({x:c.width,top,bottom:top+gap});}
  function draw(){ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle="#22c55e";pipes.forEach(p=>{ctx.fillRect(p.x,0,40,p.top);ctx.fillRect(p.x,p.bottom,40,c.height-p.bottom);});ctx.fillStyle="#a78bfa";ctx.fillRect(60,y,16,16);ctx.fillStyle="#fff";ctx.font="12px sans-serif";ctx.fillText(`Điểm: ${score} | Kỷ lục: ${best}`,10,14);}
  function step(){ if(!running) return; t++; if(t%90===0) addPipe(); pipes.forEach(p=>p.x-=2); vy+=0.4; y+=vy; if(y<0)y=0,vy=0; if(y>c.height-16)y=c.height-16,vy=0; pipes=pipes.filter(p=>p.x>-60); pipes.forEach(p=>{ if(p.x===60) score++; if(60<p.x+40 && 60+16>p.x && (y<p.top || y+16>p.bottom)){ running=false; best=Math.max(best,score); info.textContent=`Hết lượt · Điểm: ${score} · Kỷ lục: ${best}`; }}); draw(); requestAnimationFrame(step); }
  function start(){ y=200; vy=0; pipes=[]; t=0; score=0; running=true; info.textContent=""; addPipe(); step(); }
  window.addEventListener("keydown",()=>{ if(!running) return; vy=-6; }); c.addEventListener("mousedown",()=>{ if(!running) return; vy=-6; });
  scope.querySelector("#flp-start").onclick=()=> start(); draw();
}

/* ===== Survey render & submit ===== */
const progressBar=document.getElementById("progress-bar"),surveyForm=document.getElementById("survey-form"),resultsBox=document.getElementById("results"),pillGrid=document.getElementById("pill-grid"),safetyBox=document.getElementById("safety-box"),gameCardsResults=document.getElementById("game-cards-results");
function qCard(title,list,options,key){const wrap=document.createElement("div");wrap.className="q-card";const t=document.createElement("div");t.className="q-title";t.textContent=title;wrap.appendChild(t);
list.forEach((q,idx)=>{const row=document.createElement("div");row.className="q-row";row.dataset.key=key;row.dataset.idx=String(idx);const label=document.createElement("div");label.style.marginBottom="6px";label.textContent=`${idx+1}. ${q}`;row.appendChild(label);
const ops=document.createElement("div");ops.className="q-options";options.forEach(opt=>{const b=document.createElement("button");b.type="button";b.className="choice";b.textContent=opt.label;b.addEventListener("click",()=>{state[key][idx]=opt.v;ops.querySelectorAll(".choice").forEach(x=>x.classList.remove("active"));b.classList.add("active");row.classList.remove("invalid");updateProgress();});ops.appendChild(b);});
const clear=document.createElement("button");clear.type="button";clear.className="choice";clear.textContent="Xoá";clear.addEventListener("click",()=>{state[key][idx]=undefined;ops.querySelectorAll(".choice").forEach(x=>x.classList.remove("active"));updateProgress();});ops.appendChild(clear);row.appendChild(ops);wrap.appendChild(row);});return wrap;}
function renderSurvey(){surveyForm.innerHTML="";surveyForm.appendChild(qCard("PHQ-9 (Trầm cảm — 2 tuần qua)",PHQ9,PHQ_GAD_OPTIONS,"phq"));surveyForm.appendChild(qCard("GAD-7 (Lo âu — 2 tuần qua)",GAD7,PHQ_GAD_OPTIONS,"gad"));surveyForm.appendChild(qCard("PSS-10 (Stress — 1 tháng qua)",PSS10,PSS_OPTIONS,"pss"));updateProgress();}
function updateProgress(){const total=PHQ9.length+GAD7.length+PSS10.length;const answered=[...state.phq,...state.gad,...state.pss].filter(Number.isFinite).length;progressBar.style.width=`${Math.round((answered/total)*100)}%`;}

/* validate + results */
document.getElementById("survey-form").addEventListener("submit",e=>{
  e.preventDefault(); document.querySelectorAll(".q-row.invalid").forEach(el=>el.classList.remove("invalid")); let first=null;
  const mark=(key,len)=>{for(let i=0;i<len;i++){if(!Number.isFinite(state[key][i])){const row=surveyForm.querySelector(`.q-row[data-key="${key}"][data-idx="${i}"]`);if(row){row.classList.add("invalid");if(!first)first=row;}}}}; mark("phq",PHQ9.length); mark("gad",GAD7.length); mark("pss",PSS10.length);
  if(first){first.scrollIntoView({behavior:"smooth",block:"center"});return;}
  const phqScore=sum(state.phq), gadScore=sum(state.gad), pssScore=sum(state.pss.map((v,i)=>Number.isFinite(v)?(PSS_REVERSED_IDX.has(i)?(4-v):v):0));
  const phqC=classifyPHQ(phqScore), gadC=classifyGAD(gadScore), pssC=classifyPSS(pssScore);
  safetyBox.classList.add("hidden"); if(Number.isFinite(state.phq[8])&&state.phq[8]>0){safetyBox.classList.remove("hidden");safetyBox.innerHTML="<b>Lưu ý an toàn:</b> Bạn đã chọn điểm > 0 ở PHQ-9 câu 9. Công cụ demo này không thay cho chẩn đoán.";}
  pillGrid.innerHTML=""; const pill=(title,score,max,label,tone)=>{const w=document.createElement("div");w.className=`pill ${tone}`;w.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center"><div style="font-weight:600">${title}</div><span class="choice" style="pointer-events:none">${label}</span></div><div class="bar"><div style="width:${Math.min(100,(score/max)*100)}%"></div></div><div class="muted" style="margin-top:6px">Điểm: <b>${score}</b> / ${max}</div>`;pillGrid.appendChild(w);};
  pill("Trầm cảm (PHQ-9)",phqScore,27,phqC.l,phqC.c); pill("Lo âu (GAD-7)",gadScore,21,gadC.l,gadC.c); pill("Stress (PSS-10)",pssScore,40,pssC.l,pssC.c);
  gameCardsResults.innerHTML=""; pick(pssC.b,phqScore,gadScore).forEach(g=>{const card=document.createElement("div");card.className="card";card.style.cursor="pointer";card.innerHTML=`<img src="${g.img}" alt="${g.name}" style="width:100%;height:140px;object-fit:cover;border-radius:12px;margin-bottom:8px;border:1px solid var(--line)"/><h4>${g.name}</h4><p class="muted">${g.tags.join(", ")}</p>`;card.addEventListener("click",()=>{lastView="results";showView(`game:${g.id}`);});gameCardsResults.appendChild(card);});
  resultsBox.classList.remove("hidden"); resultsBox.scrollIntoView({behavior:"smooth",block:"start"});
});

/* ===== Boot ===== */
document.getElementById("year").textContent=new Date().getFullYear();
renderHomeGallery();
renderSurvey();
showView("home");