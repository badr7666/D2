
// يعتمد على supabase-js v2 (CDN)
let supabaseClient;
function initSupabase(){
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.APP_CONFIG || {};
  if(!SUPABASE_URL || !SUPABASE_ANON_KEY){
    throw new Error('الرجاء إعداد config.js بقيم Supabase');
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  return supabaseClient;
}
function sanitize(s){ return String(s).replace(/[<>]/g, ''); }
async function requireSession(redirectToLogin = true){
  const { data: { session } } = await supabaseClient.auth.getSession();
  if(!session && redirectToLogin){
    window.location.href = 'login.html?next=' + encodeURIComponent(location.pathname);
    return null;
  }
  return session;
}
async function logout(){ await supabaseClient.auth.signOut(); window.location.href = 'login.html'; }
window.Auth = { initSupabase, requireSession, logout, sanitize };
