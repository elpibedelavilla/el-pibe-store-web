const apps = [
  {name:'EDTVOD', slug:'edtvod', image:'edtvod.png'},
  {name:'ES-P2P', slug:'esp2p', image:'esp2p.png'},
  {name:'Fénix', slug:'fenix', image:'fenix.png'},
  {name:'Ibero VU', slug:'iberovu', image:'iberovu.png'},
  {name:'IBO Ibérica', slug:'iboiberica', image:'iboiberica.png'},
  {name:'iBOX', slug:'ibox', image:'ibox.png'},
  {name:'IPVanish', slug:'ipvanish', image:'ipvanish.png'},
  {name:'Media VOD', slug:'mediavod', image:'mediavod.png'},
  {name:'Neweden', slug:'newe1', image:'newe1.png'},
  {name:'El Pibe Stream', slug:'elpibestream', image:'elpibestream.jpg'},
  {name:'Surfshark', slug:'surfshark', image:'surfshark.jpg'},
  {name:'V8', slug:'v8', image:'v8.png'},
  {name:'VU Player', slug:'vuplayer', image:'vuplayer.png'},
  {name:'Dino', slug:'dino', image:'dino.png'}
];
const grid=document.getElementById('appsGrid');
apps.forEach((app,i)=>{
  const a=document.createElement('a');
  a.className='app-card'; a.href=`https://dl.epdlv72.com/${app.slug}`; a.tabIndex=0;
  a.innerHTML=`<img src="assets/${app.image}" alt="${app.name}"><div class="app-name">${app.name}<span class="download">DESCARGAR</span></div>`;
  grid.appendChild(a);
});
const cards=[...document.querySelectorAll('.app-card')];
let current=0;
function focusCard(i){current=Math.max(0,Math.min(cards.length-1,i));cards[current].focus({preventScroll:true});cards[current].scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'});}
function columns(){const style=getComputedStyle(grid);return style.gridTemplateColumns.split(' ').length||4;}
document.addEventListener('keydown',e=>{
  const c=columns(); let next=current;
  if(e.key==='ArrowRight') next=Math.min(current+1,cards.length-1);
  else if(e.key==='ArrowLeft') next=Math.max(current-1,0);
  else if(e.key==='ArrowDown') next=Math.min(current+c,cards.length-1);
  else if(e.key==='ArrowUp') next=Math.max(current-c,0);
  else if(e.key==='Enter'||e.key===' ') { e.preventDefault(); cards[current].click(); return; }
  else return;
  e.preventDefault(); focusCard(next);
});
cards.forEach((card,i)=>card.addEventListener('focus',()=>current=i));
window.addEventListener('load',()=>focusCard(0));
