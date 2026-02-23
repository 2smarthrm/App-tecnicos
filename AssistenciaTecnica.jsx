import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════
   CONSTANTS & INITIAL DATA
═══════════════════════════════════════════════ */
const COLORS = [
  "linear-gradient(135deg,#0052CC,#0074FF)",
  "linear-gradient(135deg,#00C98D,#0074FF)",
  "linear-gradient(135deg,#7C5CE8,#0074FF)",
  "linear-gradient(135deg,#FF6B6B,#FF9F43)",
  "linear-gradient(135deg,#00C98D,#7C5CE8)",
  "linear-gradient(135deg,#FF9F43,#FF6B6B)",
];

const INITIAL_TECHNICIANS = [
  { id: 1, name: "João Silva", role: "Técnico Sénior" },
  { id: 2, name: "Ana Ferreira", role: "Técnica de Campo" },
  { id: 3, name: "Carlos Matos", role: "Técnico Especialista" },
];

const INITIAL_SUBMISSIONS = [
  { id: 1, techId: 1, techName: "João Silva",   empresa: "Tech SA",     cliente: "Rui Costa",   dataAss: "2026-02-10", r1:5,r2:4,r3:5,r4:5,r5:4, nps:9,  comentario: "Excelente serviço, muito profissional e rápido a resolver." },
  { id: 2, techId: 1, techName: "João Silva",   empresa: "Lda Digital", cliente: "Carla Neves", dataAss: "2026-02-15", r1:4,r2:5,r3:4,r4:5,r5:5, nps:10, comentario: "Muito satisfeita. Resolveu o problema de imediato e com simpatia." },
  { id: 3, techId: 2, techName: "Ana Ferreira", empresa: "Omega Corp",  cliente: "Tiago Lima",  dataAss: "2026-02-12", r1:3,r2:4,r3:3,r4:4,r5:3, nps:7,  comentario: "Serviço razoável, mas poderia ter sido mais rápido." },
  { id: 4, techId: 3, techName: "Carlos Matos", empresa: "Alpha SA",    cliente: "Sofia Dias",  dataAss: "2026-02-18", r1:5,r2:5,r3:5,r4:5,r5:5, nps:10, comentario: "Impecável em todos os aspetos! Totalmente recomendo." },
  { id: 5, techId: 2, techName: "Ana Ferreira", empresa: "Beta Lda",    cliente: "Pedro Gomes", dataAss: "2026-02-20", r1:4,r2:3,r3:4,r4:4,r5:4, nps:8,  comentario: "" },
  { id: 6, techId: 3, techName: "Carlos Matos", empresa: "Gamma SA",    cliente: "Inês Ramos",  dataAss: "2026-02-21", r1:5,r2:5,r3:4,r4:5,r5:5, nps:9,  comentario: "Excelente técnico, explica de forma clara e acessível." },
];

const RATING_LABELS = ["Tempo de atendimento", "Clareza técnica", "Soluções apresentadas", "Profissionalismo", "Satisfação geral"];
const RATING_KEYS   = ["r1", "r2", "r3", "r4", "r5"];
const RATING_QUESTIONS = [
  "1. Tempo de atendimento dentro de um prazo adequado",
  "2. Clareza na explicação técnica",
  "3. Soluções ou alternativas apresentadas",
  "4. Profissionalismo e educação",
  "5. Satisfação geral com o serviço prestado",
];

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const techColor = (i) => COLORS[i % COLORS.length];

const techStats = (techId, submissions) => {
  const subs = submissions.filter((s) => s.techId === techId);
  if (!subs.length) return { avg: "—", count: 0 };
  const avg = subs.reduce((a, s) => a + (s.r1 + s.r2 + s.r3 + s.r4 + s.r5) / 5, 0) / subs.length;
  return { avg: avg.toFixed(1), count: subs.length };
};

/* ═══════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════ */
const Icon = {
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  Sun:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Users:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  Chart:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Chat: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  Link: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  Trash:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Copy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>,
  Check:() => <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" width="38" height="38"><polyline points="20 6 9 17 4 12"/></svg>,
  User: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Cal:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Wpp:  () => <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.094 22l4.933-1.294A9.954 9.954 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>,
};

/* ═══════════════════════════════════════════════
   STYLES (injected once)
═══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400&display=swap');

.at-root { font-family: 'Montserrat', sans-serif; min-height: 100vh; transition: background .22s, color .22s; }
.at-root * { box-sizing: border-box; margin: 0; padding: 0; }

/* DARK */
.at-root.dark { background:#0B0D12; color:#E8EAF2; }
.at-root.dark .surface  { background:#13151C; border-color:#252836; }
.at-root.dark .surface2 { background:#1A1D27; }
.at-root.dark .surface3 { background:#21253A; }
.at-root.dark .border   { border-color:#252836; }
.at-root.dark .text2    { color:#9299B8; }
.at-root.dark .text3    { color:#555D7A; }

/* LIGHT */
.at-root.light { background:#F0F2F7; color:#1A1D2E; }
.at-root.light .surface  { background:#FFFFFF; border-color:#DDE1EE; }
.at-root.light .surface2 { background:#F5F7FA; }
.at-root.light .surface3 { background:#EBEEf5; }
.at-root.light .border   { border-color:#DDE1EE; }
.at-root.light .text2    { color:#5A6080; }
.at-root.light .text3    { color:#9BA3C0; }

/* TOPNAV */
.at-nav {
  position:sticky; top:0; z-index:50; display:flex; align-items:center; gap:0;
  padding:0 24px; height:58px; border-bottom:1px solid;
  box-shadow:0 2px 16px rgba(0,0,0,.15);
  transition: background .22s, border-color .22s;
}
.at-logo { font-weight:800; font-size:15px; letter-spacing:.5px; display:flex; align-items:center; gap:10px; }
.at-logo-dot { width:8px; height:8px; border-radius:50%; background:#0074FF; display:inline-block; box-shadow:0 0 8px #0074FF; }
.at-tabs { display:flex; gap:2px; margin-left:32px; border-radius:10px; padding:4px; border:1px solid; }
.at-tab {
  padding:6px 16px; border-radius:7px; font-family:'Montserrat',sans-serif;
  font-size:13px; font-weight:600; border:none; background:transparent;
  cursor:pointer; transition:all .18s; display:flex; align-items:center; gap:7px;
}
.at-tab.active { background:#0074FF; color:#fff; box-shadow:0 2px 10px rgba(0,116,255,.4); }
.at-nav-right { margin-left:auto; display:flex; align-items:center; gap:10px; }
.at-theme-btn {
  width:36px; height:36px; border-radius:10px; border:1px solid;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:all .2s; background:transparent;
}

/* BUTTONS */
.btn {
  display:inline-flex; align-items:center; gap:7px; padding:9px 16px;
  border-radius:9px; font-family:'Montserrat',sans-serif; font-weight:600;
  font-size:13px; cursor:pointer; border:none; transition:all .18s; white-space:nowrap;
}
.btn-sm { padding:7px 12px; font-size:12px; border-radius:8px; }
.btn-full { width:100%; justify-content:center; }
.btn-primary { background:#0074FF; color:#fff; }
.btn-primary:hover { background:#0061d6; box-shadow:0 4px 14px rgba(0,116,255,.35); }
.btn-ghost { background:transparent; border:1px solid; }
.btn-danger { background:transparent; color:#FF4757; border:1px solid rgba(255,71,87,.3); }
.btn-danger:hover { background:rgba(255,71,87,.1); border-color:#FF4757; }
.btn-wpp { background:#25D366; color:#fff; }
.btn-wpp:hover { background:#1fb855; }

/* OVERLAY */
.overlay {
  position:fixed; inset:0; background:rgba(0,0,0,.65);
  backdrop-filter:blur(4px); display:flex; align-items:center;
  justify-content:center; z-index:200; padding:20px;
  animation: fadeIn .15s ease;
}
.modal {
  border-radius:20px; width:100%; max-width:480px; padding:28px;
  animation:popIn .28s cubic-bezier(.34,1.56,.64,1);
  box-shadow:0 24px 60px rgba(0,0,0,.4); border:1px solid;
}
@keyframes popIn { from{opacity:0;transform:scale(.93) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes iconPop { from{opacity:0;transform:scale(.4) rotate(-10deg)} to{opacity:1;transform:scale(1) rotate(0)} }

/* FORMS */
.at-field { display:flex; flex-direction:column; gap:6px; }
.at-field label { font-size:11.5px; font-weight:600; text-transform:uppercase; letter-spacing:.6px; }
.at-input {
  border-radius:9px; padding:10px 14px; font-family:'Montserrat',sans-serif;
  font-size:13.5px; font-weight:400; outline:none; border:1px solid;
  transition:border-color .18s, box-shadow .18s; width:100%;
}
.at-input:focus { border-color:#0074FF; box-shadow:0 0 0 3px rgba(0,116,255,.12); }
.at-input[readonly] { opacity:.6; cursor:not-allowed; }
textarea.at-input { resize:vertical; }

/* TECH CARD */
.tech-card {
  border:1px solid; border-radius:14px; padding:18px 20px;
  display:flex; align-items:center; gap:14px;
  transition:border-color .2s, transform .2s, box-shadow .2s;
}
.tech-card:hover { border-color:#0074FF; transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.2); }
.tech-avatar { width:46px; height:46px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; color:#fff; flex-shrink:0; }
.tech-avatar-sm { width:38px; height:38px; border-radius:10px; font-size:13px; }

/* STAR RATINGS */
.star {
  width:32px; height:32px; border-radius:8px; border:1px solid;
  font-size:12px; font-weight:700; cursor:pointer; transition:all .14s;
  display:flex; align-items:center; justify-content:center; flex-shrink:0; background:transparent;
}
.star.on { background:#0074FF; border-color:#0074FF; color:#fff; box-shadow:0 0 0 3px rgba(0,116,255,.2); }

/* NPS */
.nps-btn {
  width:38px; height:38px; border-radius:9px; border:1px solid;
  font-size:12.5px; font-weight:700; cursor:pointer; transition:all .14s;
  font-family:'Montserrat',sans-serif; background:transparent;
}
.nps-btn:hover { background:rgba(0,116,255,.15); border-color:#0074FF; color:#0074FF; }
.nps-btn.on { background:#0074FF; border-color:#0074FF; color:#fff; box-shadow:0 0 0 3px rgba(0,116,255,.2); }

/* BAR */
.bar-wrap { flex:1; height:6px; border-radius:99px; overflow:hidden; }
.bar-fill { height:100%; border-radius:99px; background:#0074FF; transition:width 1.1s cubic-bezier(.23,1,.32,1); }

/* FORM HERO */
.form-hero {
  border-radius:20px; padding:32px; margin-bottom:24px;
  position:relative; overflow:hidden;
  background:linear-gradient(135deg,#0052CC 0%,#0074FF 45%,#00AAFF 80%,#00C8FF 100%);
}
.form-hero::before {
  content:''; position:absolute; inset:0;
  background:radial-gradient(ellipse at 85% 15%,rgba(255,255,255,.18) 0%,transparent 55%);
  pointer-events:none;
}

/* KPI */
.kpi-card { border:1px solid; border-radius:14px; padding:20px; position:relative; overflow:hidden; }
.kpi-card::after { content:''; position:absolute; top:0; left:0; width:100%; height:3px; background:#0074FF; }

/* SECTION TITLE */
.sec-title {
  font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase;
  margin-bottom:16px; display:flex; align-items:center; gap:8px;
}
.sec-title::before { content:''; width:3px; height:14px; background:#0074FF; border-radius:2px; display:inline-block; }

/* MISC */
.badge { padding:3px 10px; border-radius:99px; font-size:11px; font-weight:700; background:rgba(0,116,255,.12); color:#0074FF; }
.badge-green { background:rgba(0,201,141,.12); color:#00C98D; }
.chip { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,.2); border:1px solid rgba(255,255,255,.25); border-radius:99px; padding:5px 14px; font-size:12.5px; color:#fff; font-weight:600; backdrop-filter:blur(4px); }
.danger-icon { width:52px; height:52px; border-radius:14px; background:rgba(255,71,87,.1); border:1px solid rgba(255,71,87,.25); display:flex; align-items:center; justify-content:center; margin-bottom:14px; color:#FF4757; }
.success-icon { width:80px; height:80px; border-radius:24px; background:linear-gradient(135deg,#00C98D,#00e8b0); display:flex; align-items:center; justify-content:center; margin:0 auto 24px; box-shadow:0 16px 40px rgba(0,201,141,.35); animation:iconPop .6s cubic-bezier(.34,1.56,.64,1); }
.nps-dot { width:7px; height:7px; border-radius:50%; background:#00C98D; display:inline-block; }
.link-box { border-radius:9px; padding:12px 14px; font-size:11.5px; word-break:break-all; line-height:1.6; font-family:monospace; margin-bottom:18px; border:1px solid; }

.submit-btn { width:100%; padding:15px; background:linear-gradient(135deg,#0052CC,#0074FF 50%,#00AAFF); color:#fff; border:none; border-radius:12px; font-family:'Montserrat',sans-serif; font-size:15px; font-weight:800; cursor:pointer; letter-spacing:.3px; transition:opacity .2s,transform .2s,box-shadow .2s; }
.submit-btn:hover { opacity:.92; transform:translateY(-1px); box-shadow:0 8px 24px rgba(0,116,255,.4); }

.comment-card { border:1px solid; border-radius:14px; padding:20px; transition:border-color .2s; margin-bottom:12px; }
.comment-card:hover { border-color:#0074FF; }
.comment-quote { font-size:13.5px; line-height:1.65; font-style:italic; font-weight:400; border-left:3px solid #0074FF; padding-left:12px; margin-bottom:8px; }

.add-bar { border:1px dashed; border-radius:14px; padding:16px 18px; display:flex; gap:10px; align-items:flex-end; transition:border-color .2s; }
.add-bar:hover { border-color:#0074FF; }

.filter-sel { border-radius:9px; padding:9px 14px; font-family:'Montserrat',sans-serif; font-size:13px; font-weight:500; outline:none; cursor:pointer; border:1px solid; transition:border-color .18s; background:transparent; }
.filter-sel:focus { border-color:#0074FF; }

.screen-wrap { animation:fadeUp .35s ease; }
`;

/* ═══════════════════════════════════════════════
   STYLE INJECTION
═══════════════════════════════════════════════ */
function useGlobalStyle(css) {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
}

/* ═══════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════ */
function Modal({ open, onClose, children, theme }) {
  if (!open) return null;
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal surface ${theme}`}>{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: MANAGER
═══════════════════════════════════════════════ */
function ManagerTab({ technicians, submissions, onGenLink, onDelete, onAdd, theme }) {
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd(newName.trim(), newRole.trim() || "Técnico");
    setNewName(""); setNewRole("");
  };

  const t2 = theme === "dark" ? "#9299B8" : "#5A6080";
  const t3 = theme === "dark" ? "#555D7A" : "#9BA3C0";
  const bg2 = theme === "dark" ? "#1A1D27" : "#F5F7FA";
  const border = theme === "dark" ? "#252836" : "#DDE1EE";

  return (
    <div className="screen-wrap" style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px 80px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px,4vw,30px)", fontWeight: 800, letterSpacing: "-.5px" }}>Gestão de Técnicos</h1>
        <p style={{ fontSize: 13.5, color: t2, marginTop: 5, fontWeight: 400 }}>Gere links personalizados de avaliação para cada técnico</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {technicians.map((t, i) => {
          const st = techStats(t.id, submissions);
          return (
            <div className="tech-card surface" key={t.id}>
              <div className="tech-avatar" style={{ background: techColor(i) }}>{initials(t.name)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                <div style={{ color: t2, fontSize: 12.5, fontWeight: 400, marginTop: 2 }}>{t.role}</div>
              </div>
              <div style={{ display: "flex", gap: 20, marginRight: 8 }}>
                {[{ val: st.avg, lbl: "Média" }, { val: st.count, lbl: "Respostas" }].map(({ val, lbl }) => (
                  <div key={lbl} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#0074FF" }}>{val}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: t3, textTransform: "uppercase", letterSpacing: ".5px" }}>{lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button className="btn btn-primary btn-sm" onClick={() => onGenLink(t.id)}>
                  <Icon.Link /> Gerar Link
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(t.id)} title="Remover">
                  <Icon.Trash />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="add-bar" style={{ borderColor: border, background: "transparent" }}>
        <div className="at-field" style={{ flex: 1 }}>
          <label style={{ color: t2 }}>Nome do técnico</label>
          <input className="at-input" style={{ background: bg2, borderColor: border, color: "inherit" }}
            value={newName} onChange={(e) => setNewName(e.target.value)}
            placeholder="Ex: João Silva"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
        </div>
        <div className="at-field" style={{ flex: 1 }}>
          <label style={{ color: t2 }}>Função</label>
          <input className="at-input" style={{ background: bg2, borderColor: border, color: "inherit" }}
            value={newRole} onChange={(e) => setNewRole(e.target.value)}
            placeholder="Ex: Técnico Sénior"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
        </div>
        <button className="btn btn-primary" onClick={handleAdd} style={{ marginTop: 22, flexShrink: 0 }}>
          <Icon.Plus /> Adicionar
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: DASHBOARD
═══════════════════════════════════════════════ */
function DashboardTab({ technicians, submissions, theme }) {
  const t2 = theme === "dark" ? "#9299B8" : "#5A6080";
  const t3 = theme === "dark" ? "#555D7A" : "#9BA3C0";
  const bg3 = theme === "dark" ? "#21253A" : "#EBEEf5";
  const border = theme === "dark" ? "#252836" : "#DDE1EE";

  const total = submissions.length;
  const allAvg = total ? (submissions.reduce((a, s) => a + (s.r1+s.r2+s.r3+s.r4+s.r5)/5, 0) / total).toFixed(1) : "—";
  const npsAll = submissions.filter((s) => s.nps != null);
  const npsAvg = npsAll.length ? (npsAll.reduce((a, s) => a + s.nps, 0) / npsAll.length).toFixed(1) : "—";
  const withC  = submissions.filter((s) => s.comentario?.trim()).length;

  const kpis = [
    { val: total, label: "Avaliações totais" },
    { val: allAvg, label: "Média global", sub: "sobre 5 critérios" },
    { val: npsAvg, label: "NPS médio", sub: "escala 0–10" },
    { val: withC, label: "Com comentário" },
    { val: technicians.length, label: "Técnicos ativos" },
  ];

  return (
    <div className="screen-wrap" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 80px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px,4vw,30px)", fontWeight: 800, letterSpacing: "-.5px" }}>Dashboard</h1>
        <p style={{ fontSize: 13.5, color: t2, marginTop: 5, fontWeight: 400 }}>Métricas e desempenho por técnico</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 28 }}>
        {kpis.map(({ val, label, sub }) => (
          <div className="kpi-card surface" key={label}>
            <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1 }}>{val}</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: t3, marginTop: 4 }}>{label}</div>
            {sub && <div style={{ fontSize: 12, color: t2, marginTop: 2, fontWeight: 400 }}>{sub}</div>}
          </div>
        ))}
      </div>

      <div className="sec-title">Desempenho por Técnico</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }}>
        {technicians.map((t, i) => {
          const subs = submissions.filter((s) => s.techId === t.id);
          if (!subs.length) return (
            <div className="surface" key={t.id} style={{ border: `1px solid ${border}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                <div className="tech-avatar tech-avatar-sm" style={{ background: techColor(i) }}>{initials(t.name)}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 11.5, color: t2, fontWeight: 400 }}>Sem avaliações ainda</div>
                </div>
              </div>
            </div>
          );

          const avg = (k) => (subs.reduce((a, s) => a + s[k], 0) / subs.length).toFixed(1);
          const overall = (RATING_KEYS.reduce((a, k) => a + +avg(k), 0) / 5).toFixed(1);
          const npsS = subs.filter((s) => s.nps != null);
          const nps = npsS.length ? (npsS.reduce((a, s) => a + s.nps, 0) / npsS.length).toFixed(1) : "—";

          return (
            <div className="surface" key={t.id} style={{ border: `1px solid ${border}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 12 }}>
                <div className="tech-avatar tech-avatar-sm" style={{ background: techColor(i) }}>{initials(t.name)}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 11.5, color: t2, fontWeight: 400 }}>{subs.length} avaliação{subs.length > 1 ? "ões" : ""} · {t.role}</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 26, fontWeight: 900, color: "#0074FF" }}>{overall}</div>
              </div>
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                {RATING_KEYS.map((k, j) => {
                  const v = +avg(k);
                  return (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: t2, width: 160, flexShrink: 0, lineHeight: 1.3 }}>{RATING_LABELS[j]}</div>
                      <div className="bar-wrap" style={{ background: bg3 }}>
                        <div className="bar-fill" style={{ width: `${(v / 5 * 100).toFixed(0)}%` }} />
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, width: 24, textAlign: "right", flexShrink: 0 }}>{v}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ padding: "12px 20px", borderTop: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: t2 }}>
                  <span className="nps-dot" /> NPS médio: <strong>{nps}</strong>
                </div>
                <div style={{ fontSize: 11, color: t3, fontWeight: 600 }}>/5 critérios</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: COMMENTS
═══════════════════════════════════════════════ */
function CommentsTab({ technicians, submissions, theme }) {
  const [filterTech, setFilterTech] = useState("");
  const [filterSort, setFilterSort] = useState("new");

  const t2 = theme === "dark" ? "#9299B8" : "#5A6080";
  const t3 = theme === "dark" ? "#555D7A" : "#9BA3C0";
  const border = theme === "dark" ? "#252836" : "#DDE1EE";
  const bg = theme === "dark" ? "#13151C" : "#FFFFFF";

  let list = [...submissions];
  if (filterTech) list = list.filter((s) => String(s.techId) === filterTech);
  list.sort((a, b) => {
    if (filterSort === "new") return b.id - a.id;
    if (filterSort === "old") return a.id - b.id;
    const aA = (a.r1+a.r2+a.r3+a.r4+a.r5)/5, bA = (b.r1+b.r2+b.r3+b.r4+b.r5)/5;
    return filterSort === "high" ? bA - aA : aA - bA;
  });

  const selStyle = { background: bg, borderColor: border, color: "inherit" };

  return (
    <div className="screen-wrap" style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px 80px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px,4vw,30px)", fontWeight: 800, letterSpacing: "-.5px" }}>Comentários</h1>
        <p style={{ fontSize: 13.5, color: t2, marginTop: 5, fontWeight: 400 }}>Feedback individual dos clientes por avaliação</p>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <select className="filter-sel" style={selStyle} value={filterTech} onChange={(e) => setFilterTech(e.target.value)}>
          <option value="">Todos os técnicos</option>
          {technicians.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select className="filter-sel" style={selStyle} value={filterSort} onChange={(e) => setFilterSort(e.target.value)}>
          <option value="new">Mais recentes</option>
          <option value="old">Mais antigos</option>
          <option value="high">Melhor avaliação</option>
          <option value="low">Pior avaliação</option>
        </select>
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: t3 }}>
          <Icon.Chat /><br /><br />Nenhum comentário encontrado
        </div>
      ) : list.map((s) => {
        const avg = ((s.r1+s.r2+s.r3+s.r4+s.r5)/5).toFixed(1);
        return (
          <div className="comment-card surface" key={s.id}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{s.empresa}</div>
                <div style={{ fontSize: 12.5, color: t2, fontWeight: 400, marginTop: 2 }}>{s.cliente}</div>
                <div style={{ fontSize: 11.5, color: t3, marginTop: 2, fontWeight: 400 }}>{s.dataAss}</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <span className="badge badge-green">{s.techName}</span>
                <span className="badge">★ {avg}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {RATING_KEYS.map((k, i) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: t2, fontWeight: 500 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0074FF", display: "inline-block", flexShrink: 0 }} />
                  {RATING_LABELS[i]}: <strong>{s[k]}</strong>
                </div>
              ))}
            </div>
            {s.comentario?.trim()
              ? <div className="comment-quote">"{s.comentario}"</div>
              : <div style={{ fontSize: 12.5, color: t3, fontStyle: "italic", fontWeight: 400, marginBottom: 8 }}>Sem comentário adicional</div>
            }
            {s.nps != null && <div style={{ fontSize: 12, color: t2, fontWeight: 600 }}>NPS: <strong>{s.nps}/10</strong></div>}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FORM SCREEN
═══════════════════════════════════════════════ */
function FormScreen({ techName, date, onSubmit, theme }) {
  const [ratings, setRatings] = useState({});
  const [nps, setNps] = useState(null);
  const [empresa, setEmpresa] = useState("");
  const [cliente, setCliente] = useState("");
  const [dataAss, setDataAss] = useState(new Date().toISOString().split("T")[0]);
  const [comentario, setComentario] = useState("");

  const t2 = theme === "dark" ? "#9299B8" : "#5A6080";
  const t3 = theme === "dark" ? "#555D7A" : "#9BA3C0";
  const bg = theme === "dark" ? "#13151C" : "#FFFFFF";
  const bg2 = theme === "dark" ? "#1A1D27" : "#F5F7FA";
  const border = theme === "dark" ? "#252836" : "#DDE1EE";

  const handleSubmit = (e) => {
    e.preventDefault();
    for (const k of RATING_KEYS) {
      if (!ratings[k]) { alert("Por favor preencha todas as avaliações de 1 a 5."); return; }
    }
    onSubmit({ techName, empresa, cliente, dataAss, ...ratings, nps, comentario });
  };

  const inputStyle = { background: bg2, borderColor: border, color: "inherit" };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 80px" }}>
      {/* Hero */}
      <div className="form-hero" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,.8)", marginBottom: 10, position: "relative", zIndex: 1 }}>
          Assistência Técnica
        </div>
        <h1 style={{ fontSize: "clamp(22px,5vw,30px)", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 8, position: "relative", zIndex: 1 }}>
          Formulário de<br />Satisfação
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,.8)", fontWeight: 400, fontStyle: "italic", marginBottom: 18, position: "relative", zIndex: 1 }}>
          A sua opinião ajuda-nos a melhorar continuamente.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, position: "relative", zIndex: 1 }}>
          <span className="chip"><Icon.User /> Técnico: <strong>{techName}</strong></span>
          <span className="chip"><Icon.Cal /> <strong>{date}</strong></span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Client info */}
        <div className="surface" style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 22, marginBottom: 14 }}>
          <div className="sec-title">Dados do Cliente</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div className="at-field">
              <label style={{ color: t2 }}>Empresa</label>
              <input className="at-input" style={inputStyle} value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Nome da empresa" required />
            </div>
            <div className="at-field">
              <label style={{ color: t2 }}>Nome do Cliente</label>
              <input className="at-input" style={inputStyle} value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="O seu nome" required />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="at-field">
              <label style={{ color: t2 }}>Data da Assistência</label>
              <input className="at-input" type="date" style={inputStyle} value={dataAss} onChange={(e) => setDataAss(e.target.value)} required />
            </div>
            <div className="at-field">
              <label style={{ color: t2 }}>Técnico</label>
              <input className="at-input" style={{ ...inputStyle, opacity: .6, cursor: "not-allowed", background: theme === "dark" ? "#21253A" : "#EBEEf5" }} value={techName} readOnly />
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div className="surface" style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 22, marginBottom: 14 }}>
          <div className="sec-title">Avaliação do Serviço (1 = Insatisfeito | 5 = Muito Satisfeito)</div>
          {RATING_QUESTIONS.map((q, qi) => {
            const key = RATING_KEYS[qi];
            return (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: qi < 4 ? `1px solid ${border}` : "none" }}>
                <div style={{ fontSize: 13, fontWeight: 500, flex: 1, lineHeight: 1.4 }}>{q}</div>
                <div style={{ display: "flex", gap: 5 }}>
                  {[1,2,3,4,5].map((v) => (
                    <button
                      key={v} type="button"
                      className={`star${ratings[key] >= v ? " on" : ""}`}
                      style={{ borderColor: border, color: ratings[key] >= v ? "#fff" : t3 }}
                      onClick={() => setRatings((r) => ({ ...r, [key]: v }))}
                    >{v}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Comment */}
        <div className="surface" style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 22, marginBottom: 14 }}>
          <div className="sec-title">
            Comentário Adicional <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 11, color: t3 }}>(opcional)</span>
          </div>
          <div className="at-field">
            <textarea className="at-input" style={{ ...inputStyle, minHeight: 100 }} value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Partilhe sugestões ou observações…" />
          </div>
        </div>

        {/* NPS */}
        <div className="surface" style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 22, marginBottom: 14 }}>
          <div className="sec-title">Recomendação</div>
          <p style={{ fontSize: 13, color: t2, fontWeight: 400, marginBottom: 4 }}>Qual a probabilidade de recomendar os nossos serviços?</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", margin: "14px 0 6px" }}>
            {[0,1,2,3,4,5,6,7,8,9,10].map((v) => (
              <button
                key={v} type="button"
                className={`nps-btn${nps === v ? " on" : ""}`}
                style={{ borderColor: border, color: nps === v ? "#fff" : t2 }}
                onClick={() => setNps(v)}
              >{v}</button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: t3, fontWeight: 500 }}>
            <span>Nada provável</span><span>Muito provável</span>
          </div>
        </div>

        <button type="submit" className="submit-btn">Submeter Avaliação →</button>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LINK MODAL
═══════════════════════════════════════════════ */
function LinkModal({ tech, theme, onClose }) {
  const [copied, setCopied] = useState(false);
  const today = new Date().toLocaleDateString("pt-PT");
  const link = `${window.location.origin}${window.location.pathname}?tecnico=${encodeURIComponent(tech.name)}&data=${encodeURIComponent(today)}`;

  const t2 = theme === "dark" ? "#9299B8" : "#5A6080";
  const bg2 = theme === "dark" ? "#1A1D27" : "#F5F7FA";
  const border = theme === "dark" ? "#252836" : "#DDE1EE";

  const copyLink = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareWpp = () => {
    const msg = encodeURIComponent(`Olá! 👋\n\nA sua assistência técnica com *${tech.name}* foi concluída.\n\nPor favor, dedique 2 minutos a avaliar o nosso serviço:\n\n${link}\n\nObrigado pela confiança! 🙏`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const shareEmail = () => {
    const subj = encodeURIComponent("Formulário de Satisfação — Assistência Técnica");
    const body = encodeURIComponent(`Exmo(a) Cliente,\n\nEsperamos que tenha ficado satisfeito/a com o serviço técnico prestado por ${tech.name}.\n\nPor favor avalie a nossa assistência:\n\n${link}\n\nObrigado!\n\nEquipa de Assistência Técnica`);
    window.open(`mailto:?subject=${subj}&body=${body}`);
  };

  return (
    <Modal open={true} onClose={onClose} theme={theme}>
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Link para {tech.name}</h3>
      <div style={{ fontSize: 13.5, color: t2, marginBottom: 20, lineHeight: 1.5, fontWeight: 400 }}>
        Gerado em {today} — envie ao cliente após a assistência
      </div>
      <div className="link-box" style={{ background: bg2, borderColor: border, color: t2 }}>{link}</div>
      <div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginBottom: 10 }}>
        <button className="btn btn-wpp btn-sm" onClick={shareWpp} style={{ flex: 1, justifyContent: "center" }}><Icon.Wpp /> WhatsApp</button>
        <button className="btn btn-ghost btn-sm" onClick={shareEmail} style={{ flex: 1, justifyContent: "center", borderColor: border, color: "inherit" }}><Icon.Mail /> Email</button>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button className="btn btn-primary btn-sm" onClick={copyLink} style={{ flex: 1, justifyContent: "center" }}>
          <Icon.Copy /> {copied ? "✓ Copiado!" : "Copiar link"}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ flex: 1, justifyContent: "center", borderColor: border, color: "inherit" }}>Fechar</button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════
   DELETE MODAL
═══════════════════════════════════════════════ */
function DeleteModal({ tech, theme, onConfirm, onClose }) {
  const t2 = theme === "dark" ? "#9299B8" : "#5A6080";
  const border = theme === "dark" ? "#252836" : "#DDE1EE";

  return (
    <Modal open={true} onClose={onClose} theme={theme}>
      <div className="danger-icon"><Icon.Trash /></div>
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Remover técnico?</h3>
      <div style={{ fontSize: 13.5, color: t2, marginBottom: 20, lineHeight: 1.55, fontWeight: 400 }}>
        Tem a certeza que quer remover <strong>{tech.name}</strong>?<br />
        Esta ação não pode ser desfeita. As avaliações já registadas serão mantidas no histórico.
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-danger" onClick={onConfirm} style={{ flex: 1, justifyContent: "center" }}>
          <Icon.Trash /> Sim, remover
        </button>
        <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1, justifyContent: "center", borderColor: border, color: "inherit" }}>Cancelar</button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════
   SUCCESS SCREEN
═══════════════════════════════════════════════ */
function SuccessScreen({ theme }) {
  const t2 = theme === "dark" ? "#9299B8" : "#5A6080";
  return (
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "100px 24px", textAlign: "center", animation: "fadeUp .35s ease" }}>
      <div className="success-icon"><Icon.Check /></div>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Obrigado pela<br />sua avaliação!</h1>
      <p style={{ color: t2, fontSize: 14.5, lineHeight: 1.65, fontWeight: 400 }}>
        A sua opinião é fundamental para continuarmos a melhorar o serviço prestado.<br /><br />
        Agradecemos sinceramente o seu tempo e confiança!
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════ */
export default function App() {
  useGlobalStyle(CSS);

  const [theme, setTheme]           = useState("dark");
  const [tab, setTab]               = useState("manager");
  const [technicians, setTechs]     = useState(INITIAL_TECHNICIANS);
  const [submissions, setSubs]      = useState(INITIAL_SUBMISSIONS);
  const [nextTechId, setNextTechId] = useState(4);
  const [nextSubId, setNextSubId]   = useState(7);

  // Form mode (URL params)
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const urlTech = params.get("tecnico");
  const urlDate = params.get("data");
  const isFormMode = !!(urlTech && urlDate);

  const [formDone, setFormDone] = useState(false);

  // Modals
  const [linkTech, setLinkTech]     = useState(null);
  const [deleteTech, setDeleteTech] = useState(null);

  const toggleTheme = () => setTheme((t) => t === "dark" ? "light" : "dark");

  const addTech = (name, role) => {
    setTechs((prev) => [...prev, { id: nextTechId, name, role }]);
    setNextTechId((n) => n + 1);
  };

  const removeTech = (id) => {
    setTechs((prev) => prev.filter((t) => t.id !== id));
    setDeleteTech(null);
  };

  const handleFormSubmit = (data) => {
    const tech = technicians.find((t) => t.name === data.techName);
    setSubs((prev) => [...prev, { id: nextSubId, techId: tech?.id || 0, ...data }]);
    setNextSubId((n) => n + 1);
    setFormDone(true);
  };

  // Style vars
  const surface  = theme === "dark" ? "#13151C" : "#FFFFFF";
  const border   = theme === "dark" ? "#252836" : "#DDE1EE";
  const text2    = theme === "dark" ? "#9299B8" : "#5A6080";
  const bg3      = theme === "dark" ? "#21253A" : "#EBEEf5";

  const tabDef = [
    { id: "manager",   label: "Técnicos",    Icon: Icon.Users },
    { id: "dashboard", label: "Dashboard",   Icon: Icon.Chart },
    { id: "comments",  label: "Comentários", Icon: Icon.Chat  },
  ];

  /* ── FORM MODE ── */
  if (isFormMode) {
    return (
      <div className={`at-root ${theme}`}>
        {formDone
          ? <SuccessScreen theme={theme} />
          : <FormScreen techName={urlTech} date={urlDate} onSubmit={handleFormSubmit} theme={theme} />
        }
      </div>
    );
  }

  /* ── MANAGER MODE ── */
  return (
    <div className={`at-root ${theme}`}>
      {/* Modals */}
      {linkTech && <LinkModal tech={linkTech} theme={theme} onClose={() => setLinkTech(null)} />}
      {deleteTech && (
        <DeleteModal
          tech={deleteTech} theme={theme}
          onConfirm={() => { removeTech(deleteTech.id); setDeleteTech(null); }}
          onClose={() => setDeleteTech(null)}
        />
      )}

      {/* Nav */}
      <nav className="at-nav surface" style={{ background: surface, borderColor: border }}>
        <div className="at-logo">
          <span className="at-logo-dot" />
          AT Satisfação
        </div>
        <div className="at-tabs surface2" style={{ background: theme === "dark" ? "#1A1D27" : "#F5F7FA", borderColor: border }}>
          {tabDef.map(({ id, label, Icon: Ic }) => (
            <button
              key={id}
              className={`at-tab${tab === id ? " active" : ""}`}
              style={tab !== id ? { color: text2 } : {}}
              onClick={() => setTab(id)}
            >
              <Ic /> {label}
            </button>
          ))}
        </div>
        <div className="at-nav-right">
          <button className="at-theme-btn" style={{ borderColor: border, color: text2 }} onClick={toggleTheme} title="Mudar tema">
            {theme === "dark" ? <Icon.Moon /> : <Icon.Sun />}
          </button>
        </div>
      </nav>

      {/* Screens */}
      {tab === "manager" && (
        <ManagerTab
          technicians={technicians}
          submissions={submissions}
          onGenLink={(id) => setLinkTech(technicians.find((t) => t.id === id))}
          onDelete={(id) => setDeleteTech(technicians.find((t) => t.id === id))}
          onAdd={addTech}
          theme={theme}
        />
      )}
      {tab === "dashboard" && <DashboardTab technicians={technicians} submissions={submissions} theme={theme} />}
      {tab === "comments" && <CommentsTab technicians={technicians} submissions={submissions} theme={theme} />}
    </div>
  );
}
