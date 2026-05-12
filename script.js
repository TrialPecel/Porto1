// === MANIFESTS (images cannot be auto-listed from browser) ===
const MANIFEST = {
  design: [
    'design-1.jpg','design-2.jpg','design-3.jpg','design-4.jpg','design-5.jpg',
    'Poster-SatriaUtama-006.png'
  ],
  photography: ['photo-1.jpg','photo-2.jpg','photo-3.jpg'],
  lkmm: ['lkmm-1.jpg','lkmm-2.jpg'],
  videos: [
    { src:'ImageSource/video/YTDown_YouTube_Rasa-Mienya-Gimana-Ya-Review-Makanan_Media_pzW-yZU2BKA_001_1080p.mp4', title:'Rasa Mienya Gimana Ya?', sub:'Food Review · Long form', type:'yt' },
    { src:'ImageSource/video/YTDown_YouTube_Review-Makanan-Makanan-Kore-Instan-Rasan_Media_p66It5xi1W4_001_1080p.mp4', title:'Korean Instant Food Review', sub:'Food Review · Long form', type:'yt' },
    { src:'ImageSource/video/YTDown_YouTube_Review-Street-Food-Di-Jalan-Diponegoro-S_Media_E4vWa_LdbZ4_001_1080p.mp4', title:'Street Food · Diponegoro', sub:'Food Review · Long form', type:'yt' },
    { src:'ImageSource/video/lv_0_20260427151742.mp4', title:'Short Clip · Vol. 01', sub:'Short-form content', type:'sc' },
    { src:'ImageSource/video/lv_0_20260427153640.mp4', title:'Short Clip · Vol. 02', sub:'Short-form content', type:'sc' },
    { src:'ImageSource/video/lv_0_20260427154452.mp4', title:'Short Clip · Vol. 03', sub:'Short-form content', type:'sc' },
  ]
};

// === RENDER GALLERIES ===
function card(path, label){
  const c = document.createElement('div');
  c.className = 'card reveal';
  c.innerHTML = `<img src="${path}" alt="${label}" loading="lazy"/><div class="overlay"><span>${label}</span></div>`;
  c.addEventListener('click', () => openLightbox({type:'image', src:path}));
  return c;
}
function renderGrid(sel, folder, files){
  const el = document.querySelector(sel); if(!el) return;
  files.forEach((f,i) => {
    const name = f.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ');
    const node = card(`ImageSource/${folder}/${f}`, name);
    node.style.transitionDelay = `${(i%6)*60}ms`;
    el.appendChild(node);
  });
}
renderGrid('#designGrid','design',MANIFEST.design);
renderGrid('#photoGrid','photography',MANIFEST.photography);
renderGrid('#lkmmGrid','lkmm',MANIFEST.lkmm);

// === VIDEO GRID ===
const vg = document.getElementById('videoGrid');
if(vg){
  MANIFEST.videos.forEach((v,i)=>{
    const c = document.createElement('div');
    c.className = 'vcard reveal';
    c.style.transitionDelay = `${(i%6)*60}ms`;
    c.innerHTML = `
      <div class="thumb">
        <span class="vbadge ${v.type==='yt'?'yt':'sc'}">${v.type==='yt'?'YouTube':'Short Clip'}</span>
        <video muted playsinline preload="metadata" src="${v.src}#t=0.5"></video>
        <div class="play"></div>
      </div>
      <div class="meta"><h5>${v.title}</h5><p>${v.sub}</p></div>`;
    c.addEventListener('click',()=>openLightbox({type:'video',src:v.src}));
    vg.appendChild(c);
  });
}

// === LIGHTBOX ===
const lb = document.getElementById('lightbox');
const lbContent = document.getElementById('lbContent');
function openLightbox({type,src}){
  lbContent.innerHTML = type==='video'
    ? `<video src="${src}" controls autoplay playsinline></video>`
    : `<img src="${src}" alt=""/>`;
  lb.classList.add('open');
  lb.setAttribute('aria-hidden','false');
}
function closeLightbox(){
  lb.classList.remove('open'); lb.setAttribute('aria-hidden','true');
  lbContent.innerHTML = '';
}
document.getElementById('lbClose').addEventListener('click',closeLightbox);
lb.addEventListener('click', e => { if(e.target===lb) closeLightbox(); });
document.addEventListener('keydown', e => { if(e.key==='Escape') closeLightbox(); });

// === REVEAL + BBOX ===
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('in');
      if(e.target.classList.contains('bbox')) e.target.classList.add('drawn');
      io.unobserve(e.target);
    }
  });
},{ threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

// Add corner handles to bbox elements
document.querySelectorAll('.bbox').forEach(b => {
  ['tl','tr','bl','br'].forEach(p => {
    const s = document.createElement('span');
    s.className = 'h '+p; b.appendChild(s);
  });
});

document.querySelectorAll('.reveal, .bbox').forEach(el => io.observe(el));

// === NAV SCROLL STATE + ACTIVE ===
const nav = document.getElementById('nav');
const sections = ['design','videography','photography'].map(id => document.getElementById(id));
const tabs = document.querySelectorAll('.nav-tabs a');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  let active = '';
  sections.forEach(s => {
    if(!s) return;
    const r = s.getBoundingClientRect();
    if(r.top <= 120 && r.bottom > 120) active = s.id;
  });
  tabs.forEach(t => t.classList.toggle('active', t.getAttribute('href') === '#'+active));
});

// === MOBILE MENU ===
const ham = document.getElementById('hamburger');
const ov = document.getElementById('mobileOverlay');
ham.addEventListener('click',()=>ov.classList.add('open'));
document.getElementById('overlayClose').addEventListener('click',()=>ov.classList.remove('open'));
ov.querySelectorAll('a').forEach(a => a.addEventListener('click',()=>ov.classList.remove('open')));

// === CURSOR ===
const cursor = document.getElementById('cursor');
if(window.matchMedia('(pointer:fine)').matches){
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX+'px';
    cursor.style.top = e.clientY+'px';
  });
  document.addEventListener('mouseover', e => {
    if(e.target.closest('a, button, .card, .vcard, [data-hover]')) cursor.classList.add('big');
  });
  document.addEventListener('mouseout', e => {
    if(e.target.closest('a, button, .card, .vcard, [data-hover]')) cursor.classList.remove('big');
  });
} else {
  cursor.style.display = 'none';
}
