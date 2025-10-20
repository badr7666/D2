
async function injectVersion(){
  try{
    const res = await fetch('metadata.json');
    const meta = await res.json();
    const v = meta.version || '0.0.0';
    const appName = meta.name || 'App';
    const year = new Date().getFullYear();
    const metaTag = document.createElement('meta');
    metaTag.name = 'x-app-version';
    metaTag.content = v;
    document.head.appendChild(metaTag);
    const f = document.querySelector('.footer .version');
    if(f) f.textContent = `${appName} v${v} — © ${year}`;
  }catch(e){ console.error('Version inject failed', e); }
}
document.addEventListener('DOMContentLoaded', injectVersion);
