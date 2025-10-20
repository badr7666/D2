
const Inventory = (() => {
  let supabase;
  function el(id){ return document.getElementById(id); }
  function rowHtml(item){
    const low = item.quantity <= item.min_threshold;
    return `
      <tr data-id="${item.id}">
        <td>${item.name}</td>
        <td>${item.sku || '-'}</td>
        <td>${item.category || '-'}</td>
        <td>${item.quantity} ${low ? '<span class="badge low">منخفض</span>' : ''}</td>
        <td>${Number(item.price).toFixed(2)}</td>
        <td>
          <button class="btn secondary" data-action="edit">تعديل</button>
          <button class="btn danger" data-action="delete">حذف</button>
        </td>
      </tr>`;
  }
  function showError(msg){ const n = el('notice'); n.classList.remove('ok'); n.classList.add('err'); n.textContent = msg; n.classList.remove('hidden'); }
  function showOk(msg){ const n = el('notice'); n.classList.remove('err'); n.classList.add('ok'); n.textContent = msg; n.classList.remove('hidden'); }
  async function load(){
    const { data: { user } } = await supabase.auth.getUser(); if(!user) return;
    const search = el('search').value.trim();
    let query = supabase.from('items').select('*').order('created_at', { ascending:false });
    if(search){ query = query.ilike('name', `%${search}%`); }
    const { data, error } = await query;
    if(error){ console.error(error); showError('فشل تحميل المواد'); return; }
    el('tbody').innerHTML = (data||[]).map(rowHtml).join('');
  }
  async function addOrUpdate(e){
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: Auth.sanitize(form.name.value),
      sku: Auth.sanitize(form.sku.value),
      category: Auth.sanitize(form.category.value),
      quantity: Number(form.quantity.value||0),
      min_threshold: Number(form.min_threshold.value||0),
      price: Number(form.price.value||0)
    };
    let id = form.dataset.editingId; let res;
    if(id){
      res = await supabase.from('items').update(payload).eq('id', id).select().single();
    }else{
      const { data: { user } } = await supabase.auth.getUser();
      payload.user_id = user.id;
      res = await supabase.from('items').insert(payload).select().single();
    }
    if(res.error){ console.error(res.error); showError('تعذر حفظ التغييرات'); return; }
    form.reset(); delete form.dataset.editingId; document.getElementById('submitBtn').textContent = 'إضافة';
    showOk('تم الحفظ بنجاح'); await load();
  }
  async function onTableClick(e){
    const btn = e.target.closest('button'); if(!btn) return;
    const tr = e.target.closest('tr'); const id = tr?.dataset?.id;
    if(btn.dataset.action === 'delete'){
      if(!confirm('حذف المادة؟')) return;
      const { error } = await supabase.from('items').delete().eq('id', id);
      if(error){ console.error(error); showError('تعذر الحذف'); return; }
      showOk('تم الحذف'); await load();
    }else if(btn.dataset.action === 'edit'){
      const { data, error } = await supabase.from('items').select('*').eq('id', id).single();
      if(error){ console.error(error); showError('تعذر تحميل المادة'); return; }
      const form = el('itemForm');
      form.name.value = data.name || '';
      form.sku.value = data.sku || '';
      form.category.value = data.category || '';
      form.quantity.value = data.quantity || 0;
      form.min_threshold.value = data.min_threshold || 0;
      form.price.value = data.price || 0;
      form.dataset.editingId = data.id;
      document.getElementById('submitBtn').textContent = 'تحديث';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  function init(){
    supabase = Auth.initSupabase();
    document.getElementById('itemForm').addEventListener('submit', addOrUpdate);
    document.getElementById('tbody').addEventListener('click', onTableClick);
    document.getElementById('search').addEventListener('input', () => load());
    document.getElementById('logout').addEventListener('click', Auth.logout);
  }
  return { init, load };
})();
document.addEventListener('DOMContentLoaded', async () => {
  try{
    Auth.initSupabase();
    const session = await Auth.requireSession(true);
    if(!session) return;
    Inventory.init(); await Inventory.load();
  }catch(e){ console.error(e); const n = document.getElementById('notice'); if(n){ n.textContent = 'حدث خطأ غير متوقع'; n.classList.remove('hidden'); } }
});
