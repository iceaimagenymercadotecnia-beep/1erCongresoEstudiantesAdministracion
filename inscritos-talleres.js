(()=>{
const styles=document.createElement('style');styles.textContent=`
.roster-open{border-color:#d90060!important;color:#b90051!important;font-weight:800!important}
.roster-open:hover{background:#fce5ee!important}
#roster-dialog{width:min(850px,calc(100vw - 28px));max-height:min(86vh,850px);border:0;border-radius:20px;padding:0;box-shadow:0 30px 100px #0005;color:#18151b;background:#fff}
#roster-dialog::backdrop{background:rgba(12,9,20,.72);backdrop-filter:blur(3px)}
.roster-top{background:linear-gradient(115deg,#17141c,#3c1028);color:white;padding:28px 32px 24px;border-top:7px solid #ed0064;position:relative}
.roster-eyebrow{font-size:12px;letter-spacing:.14em;color:#ff8ab9;font-weight:900;text-transform:uppercase}
.roster-top h2{font-size:clamp(23px,3vw,32px);line-height:1.17;margin:10px 36px 15px 0;color:#fff}
.roster-facts{display:flex;flex-wrap:wrap;gap:8px}.roster-facts span{background:#ffffff18;border:1px solid #ffffff35;border-radius:100px;padding:7px 12px;font-size:13px;font-weight:700}
.roster-close{position:absolute;right:19px;top:17px;border:0;background:#ffffff25;color:white;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:25px;line-height:1}
.roster-body{padding:24px 32px 32px}.roster-controls{display:flex;align-items:center;gap:14px;justify-content:space-between;flex-wrap:wrap;margin-bottom:17px}.roster-count{font-weight:900;color:#d00058}.roster-search{width:min(350px,100%);padding:12px 15px;border:1px solid #d4ccd1;border-radius:10px;font:inherit}
.roster-names{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;max-height:45vh;overflow:auto;padding-right:5px;list-style:none;margin:0;padding-left:0}
.roster-names li{display:flex;gap:11px;align-items:flex-start;background:#f7f5f7;border:1px solid #ebe6e9;border-radius:10px;padding:11px 13px;font-size:14px;line-height:1.35;overflow-wrap:anywhere}
.roster-names li b{color:#d4005b;font-size:12px;min-width:22px}.roster-empty{color:#6a6066;padding:16px 0}
@media(max-width:600px){.roster-top{padding:23px 19px}.roster-body{padding:18px}.roster-names{grid-template-columns:1fr}.roster-search{width:100%}}
`;document.head.appendChild(styles);
const dlg=document.createElement('dialog');dlg.id='roster-dialog';dlg.setAttribute('aria-label','Estudiantes inscritos en el taller');document.body.appendChild(dlg);
let rosters={},data={};
Promise.all([fetch('data/inscritos.json?v=27oct').then(r=>r.json()),fetch('data/evento.json?v=inscritos-27oct').then(r=>r.json())]).then(([r,d])=>{rosters=r;data=Object.fromEntries(d.actividades.map(a=>[a.id,a]));}).catch(()=>{});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function show(id){const a=data[id],names=rosters[id];if(!a||!names){alert('La lista de inscritos todavía no está disponible.');return;}
const day=a.fecha==='2026-10-29'?'Jueves 29 de octubre':'Viernes 30 de octubre';
dlg.innerHTML=`<div class="roster-top"><button type="button" class="roster-close" aria-label="Cerrar">×</button><div class="roster-eyebrow">1er Congreso · Talleres</div><h2>${esc(a.titulo)}</h2><div class="roster-facts"><span>${esc(day)}</span><span>${esc(a.horario)}</span><span>${esc(a.lugar)}</span></div></div><div class="roster-body"><div class="roster-controls"><span class="roster-count">${names.length} estudiantes inscritos</span><input class="roster-search" type="search" placeholder="Busca tu nombre..." aria-label="Buscar estudiante"></div><ol class="roster-names"></ol><div class="roster-empty" hidden>No encontramos coincidencias.</div></div>`;
const list=dlg.querySelector('.roster-names'),empty=dlg.querySelector('.roster-empty');
function draw(q=''){const found=names.map((name,i)=>({name,i})).filter(x=>clean(x.name).includes(clean(q)));list.innerHTML=found.map(({name,i})=>`<li><b>${String(i+1).padStart(2,'0')}</b><span>${esc(name)}</span></li>`).join('');empty.hidden=found.length>0;}
dlg.querySelector('.roster-search').addEventListener('input',e=>draw(e.target.value));dlg.querySelector('.roster-close').onclick=()=>dlg.close();draw();dlg.showModal();}
document.addEventListener('click',e=>{const b=e.target.closest('[data-roster]');if(b)show(b.dataset.roster);});
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});
})();