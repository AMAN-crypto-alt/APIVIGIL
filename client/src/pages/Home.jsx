import { useState, useEffect, useRef } from "react";

/* ─── TOKENS ─────────────────────────────────────────────────── */
const BG   = "#080809";
const CARD = "#0e0e10";
const CARD2= "#111113";
const BOR  = "rgba(255,255,255,0.07)";
const BOR2 = "rgba(255,255,255,0.04)";
const MUT  = "#64748b";
const SL   = "#94a3b8";
const SL2  = "#cbd5e1";
const W    = "#ffffff";
const VIO  = "#7c3aed";
const VIOD = "#6d28d9";
const VIOL = "#a78bfa";
const VIO2 = "rgba(124,58,237,0.15)";

/* ─── COUNTER ────────────────────────────────────────────────── */
function Counter({ end, suffix = "" }) {
  const [v, setV] = useState(0);
  const el = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let cur = 0;
      const step = end / 60;
      const iv = setInterval(() => {
        cur += step;
        if (cur >= end) { setV(end); clearInterval(iv); }
        else setV(Math.floor(cur));
      }, 16);
    }, { threshold: 0.3 });
    if (el.current) obs.observe(el.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={el}>{v.toLocaleString()}{suffix}</span>;
}

/* ─── SPARKLINE ──────────────────────────────────────────────── */
function Spark({ color, pts, h = 38 }) {
  return (
    <svg width="100%" height={h} viewBox={`0 0 120 ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} 120,${h}`} fill={`url(#g${color.replace("#","")})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── DASHBOARD MOCKUP ───────────────────────────────────────── */
function Mockup() {
  const cb = { background: CARD2, border: `1px solid ${BOR2}`, borderRadius: 10, padding: "10px 12px" };
  return (
    <div style={{ background: "#09090b", border: "1px solid rgba(124,58,237,0.35)", borderRadius: 16, overflow: "hidden", boxShadow: "0 0 80px rgba(124,58,237,0.22), 0 0 0 1px rgba(124,58,237,0.08)", position: "relative" }}>

      {/* glow inside */}
      <div style={{ position:"absolute", top:-80, right:-80, width:300, height:300, background:"radial-gradient(circle,rgba(124,58,237,0.18),transparent 65%)", pointerEvents:"none" }}/>

      {/* top bar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px", borderBottom:`1px solid ${BOR2}`, background:"rgba(255,255,255,0.015)" }}>
        <div style={{ display:"flex", gap:6 }}>
          {["#ef4444","#f59e0b","#22c55e"].map(c=><div key={c} style={{width:9,height:9,borderRadius:999,background:c}}/>)}
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:9, color:MUT, background:"rgba(255,255,255,0.04)", border:`1px solid ${BOR2}`, borderRadius:5, padding:"2px 8px" }}>⏱ Last 1 hour</span>
          <span style={{ fontSize:9, fontWeight:700, color:W, background:VIO, borderRadius:5, padding:"2px 9px" }}>+ Add Service</span>
        </div>
      </div>

      <div style={{ padding:14, display:"flex", flexDirection:"column", gap:10 }}>

        {/* overview title */}
        <div>
          <div style={{ fontSize:14, fontWeight:900, color:W }}>Overview</div>
          <div style={{ fontSize:9, color:MUT }}>Real-time observability and AI-powered failure prediction</div>
        </div>

        {/* stat row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:7 }}>
          {[
            { l:"Total Services",  v:"8",      d:"▲ 2",      up:true },
            { l:"Total Requests",  v:"125.7K", d:"▲ 15.3%",  up:true },
            { l:"Error Rate",      v:"2.48%",  d:"▼ 0.6%",   up:false },
            { l:"Avg. Latency",    v:"243ms",  d:"▼ 18ms",   up:false },
            { l:"Incidents",       v:"3",      d:"▼ 1",      up:false },
          ].map((s,i)=>(
            <div key={i} style={cb}>
              <div style={{ fontSize:8, color:MUT, marginBottom:3 }}>{s.l}</div>
              <div style={{ fontSize:15, fontWeight:900, color:W, lineHeight:1 }}>{s.v}</div>
              <div style={{ fontSize:7, color:s.up?"#34d399":"#f87171", marginTop:2 }}>{s.d} vs 24h</div>
            </div>
          ))}
        </div>

        {/* chart grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 155px", gap:7 }}>
          <div style={cb}>
            <div style={{ fontSize:9, fontWeight:700, color:W, marginBottom:4 }}>Request Volume <span style={{color:MUT,fontWeight:400}}>ⓘ</span></div>
            <Spark color="#a855f7" pts="0,34 13,30 26,27 39,29 52,22 65,18 78,15 91,12 104,8 120,5"/>
          </div>
          <div style={cb}>
            <div style={{ fontSize:9, fontWeight:700, color:W, marginBottom:4 }}>Error Rate (%) <span style={{color:MUT,fontWeight:400}}>ⓘ</span></div>
            <Spark color="#ef4444" pts="0,32 13,30 26,26 39,28 52,22 65,19 78,24 91,16 104,12 120,10"/>
          </div>
          <div style={cb}>
            <div style={{ fontSize:9, fontWeight:700, color:W, marginBottom:7 }}>Top Services by Error Rate</div>
            {[{s:"Payment Service",r:4.35,p:87},{s:"Auth Service",r:3.21,p:64},{s:"Order Service",r:2.15,p:43},{s:"Inventory Svc",r:1.25,p:25},{s:"Notification",r:0.65,p:13}].map((x,i)=>(
              <div key={i} style={{ marginBottom:5 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                  <span style={{ fontSize:7, color:SL }}>{x.s}</span>
                  <span style={{ fontSize:7, fontWeight:700, color:W }}>{x.r}%</span>
                </div>
                <div style={{ height:3, borderRadius:99, background:"rgba(255,255,255,0.06)" }}>
                  <div style={{ width:`${x.p}%`, height:"100%", borderRadius:99, background:"linear-gradient(90deg,#ef4444,#f97316)" }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* bottom row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 115px 155px", gap:7 }}>
          <div style={cb}>
            <div style={{ fontSize:9, fontWeight:700, color:W, marginBottom:4 }}>Average Latency (ms) <span style={{color:MUT,fontWeight:400}}>ⓘ</span></div>
            <Spark color="#f59e0b" pts="0,33 13,30 26,26 39,24 52,20 65,23 78,17 91,13 104,10 120,7"/>
          </div>
          <div style={cb}>
            <div style={{ fontSize:9, fontWeight:700, color:W, marginBottom:6 }}>Service Health</div>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <svg width="44" height="44" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7"/>
                <circle cx="22" cy="22" r="16" fill="none" stroke="#22c55e" strokeWidth="7" strokeDasharray="63 37" strokeDashoffset="25" strokeLinecap="butt"/>
                <circle cx="22" cy="22" r="16" fill="none" stroke="#f59e0b" strokeWidth="7" strokeDasharray="25 75" strokeDashoffset="-38" strokeLinecap="butt"/>
                <circle cx="22" cy="22" r="16" fill="none" stroke="#ef4444" strokeWidth="7" strokeDasharray="12 88" strokeDashoffset="-63" strokeLinecap="butt"/>
                <text x="22" y="25" textAnchor="middle" fill={W} fontSize="9" fontWeight="900">8</text>
              </svg>
              <div style={{ fontSize:7, color:SL, lineHeight:2 }}>
                <div><span style={{color:"#22c55e"}}>●</span> 5 (62.5%)</div>
                <div><span style={{color:"#f59e0b"}}>●</span> 2 (25%)</div>
                <div><span style={{color:"#ef4444"}}>●</span> 1 (12.5%)</div>
              </div>
            </div>
          </div>
          <div style={{ ...cb, border:"1px solid rgba(239,68,68,0.25)", background:"rgba(239,68,68,0.05)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:9, fontWeight:700, color:W }}>AI Failure Prediction</span>
              <span style={{ fontSize:7, color:VIOL }}>View all</span>
            </div>
            <div style={{ fontSize:8, color:MUT, marginBottom:2 }}>Payment Service</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ fontSize:26, fontWeight:900, color:W, lineHeight:1 }}>78%</div>
              <span style={{ fontSize:7, fontWeight:700, background:"rgba(239,68,68,0.18)", color:"#f87171", border:"1px solid rgba(239,68,68,0.28)", borderRadius:999, padding:"2px 7px" }}>High Risk</span>
            </div>
            <div style={{ fontSize:7, color:MUT, marginTop:2 }}>Failure Probability</div>
            <div style={{ marginTop:6, height:3, borderRadius:99, background:"rgba(255,255,255,0.07)" }}>
              <div style={{ width:"78%", height:"100%", borderRadius:99, background:"linear-gradient(90deg,#ef4444,#f97316,#fbbf24)", boxShadow:"0 0 8px rgba(239,68,68,0.5)" }}/>
            </div>
            <div style={{ fontSize:7, color:MUT, marginTop:5 }}>Estimated Failure Time</div>
            <div style={{ fontSize:10, fontWeight:900, color:W }}>15 – 25 min</div>
            <Spark color="#ef4444" pts="0,28 20,24 40,20 60,14 80,9 100,5 120,2" h={28}/>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── FEATURES DATA ──────────────────────────────────────────── */
const FEATS = [
  { emoji:"📈", color:"#7c3aed", bg:"rgba(124,58,237,0.12)", bo:"rgba(124,58,237,0.22)", title:"Real-time Monitoring",    desc:"Monitor APIs, services, and infrastructure in real-time with beautiful dashboards and live metrics." },
  { emoji:"🧠", color:"#a855f7", bg:"rgba(168,85,247,0.12)",  bo:"rgba(168,85,247,0.22)",  title:"AI Failure Prediction",  desc:"Machine learning models analyze patterns and predict failures before they impact your users." },
  { emoji:"🔔", color:"#ec4899", bg:"rgba(236,72,153,0.12)",  bo:"rgba(236,72,153,0.22)",  title:"Smart Alerts",           desc:"Get instant alerts via email, Slack, or webhooks when issues are detected or predicted." },
  { emoji:"🎯", color:"#22d3ee", bg:"rgba(34,211,238,0.12)",  bo:"rgba(34,211,238,0.22)",  title:"Root Cause Analysis",    desc:"AI-powered insights help you identify the root cause of issues in seconds, not hours." },
  { emoji:"📊", color:"#3b82f6", bg:"rgba(59,130,246,0.12)",  bo:"rgba(59,130,246,0.22)",  title:"Advanced Analytics",     desc:"Deep dive into performance trends, error patterns, and service health with advanced analytics." },
  { emoji:"⚡", color:"#f59e0b", bg:"rgba(245,158,11,0.12)",  bo:"rgba(245,158,11,0.22)",  title:"Real-time Updates",      desc:"Powered by WebSockets for instant updates without refreshing the dashboard." },
];

/* ─── SERVICES DATA ──────────────────────────────────────────── */
const SVCS = [
  { emoji:"💳", name:"Payment Service",   sub:"High error rate detected",  badge:"CRITICAL", bc:"#ef4444", bb:"rgba(239,68,68,0.15)" },
  { emoji:"📊", name:"Auth Service",      sub:"Response time increased",   badge:"WARNING",  bc:"#f59e0b", bb:"rgba(245,158,11,0.15)" },
  { emoji:"📈", name:"Inventory Service", sub:"All systems operational",   badge:"HEALTHY",  bc:"#22c55e", bb:"rgba(34,197,94,0.15)" },
];

/* ─── LOGOS DATA ─────────────────────────────────────────────── */
const LOGOS = [
  {e:"🏢",n:"Acme Corp"},{e:"🚀",n:"TechStart"},{e:"💻",n:"DevHub"},
  {e:"☁️",n:"CloudScale"},{e:"📊",n:"DataFlow"},{e:"👁",n:"InnoVision"},
];

/* ─── FOOTER DATA ────────────────────────────────────────────── */
const FOOT = {
  Product:   ["Features","Pricing","Integrations","Changelog"],
  Resources: ["Documentation","API Reference","Guides","Blog"],
  Company:   ["About Us","Careers","Contact","Privacy Policy"],
  Support:   ["Help Center","Community","Status","Report an Issue"],
};

/* ══════════════════ HOME PAGE ════════════════════════════════ */
export default function Home() {
  const [scrolled, setScrolled]   = useState(false);
  const [subEmail, setSubEmail]   = useState("");
  const [hoverNav, setHoverNav]   = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (p) => { window.location.href = p; };

  /* ── button presets ── */
  const PRI = {
    display:"inline-flex", alignItems:"center", gap:8,
    background:VIO, border:"none", borderRadius:10,
    padding:"13px 28px", color:W, fontSize:15, fontWeight:700,
    cursor:"pointer", boxShadow:"0 0 28px rgba(124,58,237,0.45)",
    transition:"all 0.2s", letterSpacing:"-0.1px",
  };
  const GHOST = {
    display:"inline-flex", alignItems:"center", gap:8,
    background:"transparent", border:`1px solid ${BOR}`,
    borderRadius:10, padding:"12px 24px", color:W,
    fontSize:15, fontWeight:600, cursor:"pointer", transition:"all 0.2s",
  };

  return (
    <div style={{ background:BG, color:W, minHeight:"100vh", fontFamily:"'Inter',system-ui,sans-serif", overflowX:"hidden" }}>

      {/* ════════ NAVBAR ════════════════════════════════════════════ */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 52px", height:62,
        background: scrolled ? "rgba(8,8,9,0.94)" : "rgba(8,8,9,0.4)",
        backdropFilter:"blur(22px)",
        borderBottom: scrolled ? `1px solid ${BOR}` : "1px solid transparent",
        transition:"all 0.3s",
      }}>

        {/* logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={()=>go("/home")}>
          <div style={{ width:33, height:33, borderRadius:8, background:"linear-gradient(135deg,#7c3aed,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, boxShadow:"0 0 16px rgba(124,58,237,0.5)" }}>⚡</div>
          <div>
            <div style={{ fontSize:13, fontWeight:900, color:W, lineHeight:1 }}>API Failure</div>
            <div style={{ fontSize:10, color:VIOL, fontWeight:600, marginTop:2 }}>Predictor</div>
          </div>
        </div>

        {/* links */}
        <div style={{ display:"flex", alignItems:"center", gap:34 }}>
          {["Features","How it Works","Pricing","Docs","Resources"].map(l=>(
            <a key={l} href="#" style={{ fontSize:14, color: hoverNav===l ? W : SL, textDecoration:"none", transition:"color 0.15s" }}
              onMouseEnter={()=>setHoverNav(l)} onMouseLeave={()=>setHoverNav(null)}>
              {l}{l==="Resources" ? " ▾" : ""}
            </a>
          ))}
        </div>

        {/* cta */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={()=>go("/login")}
            style={{ background:"transparent", border:`1px solid ${BOR}`, borderRadius:9, padding:"8px 20px", color:W, fontSize:14, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.18)"}
            onMouseLeave={e=>e.currentTarget.style.borderColor=BOR}>
            Log In
          </button>
          <button onClick={()=>go("/register")}
            style={{ background:VIO, border:"none", borderRadius:9, padding:"8px 20px", color:W, fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:"0 0 18px rgba(124,58,237,0.4)", transition:"all 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background=VIOD}
            onMouseLeave={e=>e.currentTarget.style.background=VIO}>
            Sign Up
          </button>
        </div>
      </nav>

      {/* ════════ HERO ═══════════════════════════════════════════════ */}
      <section style={{ paddingTop:110, paddingBottom:90, position:"relative", overflow:"hidden" }}>

        {/* bg glows */}
        <div style={{ position:"absolute", top:-180, left:"50%", transform:"translateX(-50%)", width:1000, height:650, background:"radial-gradient(ellipse,rgba(124,58,237,0.16) 0%,transparent 65%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:60, left:"3%", width:380, height:380, background:"radial-gradient(circle,rgba(124,58,237,0.09),transparent 65%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:30, right:"3%", width:340, height:340, background:"radial-gradient(circle,rgba(34,211,238,0.06),transparent 65%)", pointerEvents:"none" }}/>

        <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 52px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1.05fr", gap:64, alignItems:"center" }}>

            {/* left */}
            <div>
              {/* badge */}
              <div style={{ display:"inline-flex", alignItems:"center", gap:7, border:"1px solid rgba(124,58,237,0.32)", borderRadius:999, padding:"6px 15px", background:"rgba(124,58,237,0.1)", marginBottom:28 }}>
                <span style={{ fontSize:13 }}>⚡</span>
                <span style={{ fontSize:12, fontWeight:600, color:VIOL }}>AI-Powered Observability</span>
              </div>

              {/* headline */}
              <h1 style={{ fontSize:58, fontWeight:900, lineHeight:1.08, letterSpacing:"-1.8px", marginBottom:22, color:W }}>
                Predict API Failures<br/>
                Before{" "}
                <span style={{ color:VIOL }}>They Happen</span>
              </h1>

              {/* sub */}
              <p style={{ fontSize:18, color:SL, lineHeight:1.75, marginBottom:36, maxWidth:470 }}>
                Real-time monitoring, smart alerts, and AI-driven predictions to keep your systems healthy and your users happy.
              </p>

              {/* CTAs */}
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:52, flexWrap:"wrap" }}>
                <button style={PRI} onClick={()=>go("/register")}
                  onMouseEnter={e=>{e.currentTarget.style.background=VIOD;e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=VIO;e.currentTarget.style.transform="none";}}>
                  Get Started Free →
                </button>
                <button style={GHOST} onClick={()=>go("/login")}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <span style={{ fontSize:15 }}>▶</span> Watch Demo
                </button>
              </div>

              {/* stats */}
              <div style={{ display:"flex", gap:36, flexWrap:"wrap" }}>
                {[
                  { icon:"🛡️", end:99.9, suf:"%",  label:"Uptime Monitored" },
                  { icon:"📊", end:1,    suf:"M+", label:"Requests Analyzed" },
                  { icon:"🔗", end:50,   suf:"+",  label:"Services Monitored" },
                  { icon:"🤖", raw:"24/7",          label:"AI Predictions" },
                ].map((s,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:9 }}>
                    <span style={{ fontSize:20, marginTop:2 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize:22, fontWeight:900, color:W, lineHeight:1 }}>
                        {s.raw ?? <Counter end={s.end} suffix={s.suf}/>}
                      </div>
                      <div style={{ fontSize:11, color:MUT, marginTop:3 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* right: mockup */}
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute", inset:-2, background:"linear-gradient(135deg,rgba(124,58,237,0.5),rgba(34,211,238,0.2),rgba(124,58,237,0.4))", borderRadius:18, filter:"blur(1px)", zIndex:0 }}/>
              <div style={{ position:"relative", zIndex:1 }}><Mockup/></div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════ FEATURES ══════════════════════════════════════════ */}
      <section style={{ padding:"100px 0", position:"relative" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:800, height:500, background:"radial-gradient(ellipse,rgba(124,58,237,0.07),transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 52px" }}>

          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ fontSize:11, fontWeight:700, color:VIOL, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:14 }}>FEATURES</div>
            <h2 style={{ fontSize:44, fontWeight:900, letterSpacing:"-1px", lineHeight:1.15, color:W }}>
              Everything you need for<br/>
              <span style={{ color:VIOL }}>intelligent</span> observability
            </h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {FEATS.map((f,i)=>(
              <div key={i}
                style={{ background:CARD, border:`1px solid ${BOR}`, borderRadius:16, padding:"28px 26px", transition:"all 0.25s", cursor:"default" }}
                onMouseEnter={e=>{ e.currentTarget.style.border=`1px solid ${f.bo}`; e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow="0 20px 48px rgba(0,0,0,0.5)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.border=`1px solid ${BOR}`;  e.currentTarget.style.transform="none";             e.currentTarget.style.boxShadow="none"; }}>
                <div style={{ width:52, height:52, borderRadius:14, background:f.bg, border:`1px solid ${f.bo}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:20 }}>
                  {f.emoji}
                </div>
                <h3 style={{ fontSize:18, fontWeight:800, color:W, marginBottom:10, letterSpacing:"-0.2px" }}>{f.title}</h3>
                <p style={{ fontSize:14, color:SL, lineHeight:1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ AI SECTION ════════════════════════════════════════ */}
      <section style={{ padding:"100px 0", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 25% 50%,rgba(124,58,237,0.1),transparent 60%)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 52px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>

            {/* left: service cards + orb */}
            <div style={{ position:"relative" }}>
              {/* orbit rings */}
              {[280,380].map((sz,i)=>(
                <div key={i} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:sz, height:sz, border:"1px solid rgba(124,58,237,0.15)", borderRadius:999, pointerEvents:"none" }}/>
              ))}
              {/* dots on ring */}
              {[{t:-140,l:"calc(50% - 5px)"},{t:"calc(50% - 5px)",l:-5},{t:"calc(50% - 5px)",r:-5}].map((pos,i)=>(
                <div key={i} style={{ position:"absolute", width:10, height:10, borderRadius:999, background:VIO, boxShadow:"0 0 10px rgba(124,58,237,0.8)", ...pos, pointerEvents:"none" }}/>
              ))}

              {/* orb */}
              <div style={{ display:"flex", justifyContent:"center", marginBottom:32, position:"relative", zIndex:1 }}>
                <div style={{ width:96, height:96, borderRadius:999, background:"linear-gradient(135deg,#7c3aed,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, boxShadow:"0 0 60px rgba(124,58,237,0.65), 0 0 120px rgba(124,58,237,0.2)" }}>⚡</div>
              </div>

              {/* service cards */}
              <div style={{ display:"flex", flexDirection:"column", gap:12, position:"relative", zIndex:1 }}>
                {SVCS.map((s,i)=>(
                  <div key={i}
                    style={{ background:CARD, border:`1px solid ${BOR}`, borderRadius:14, padding:"16px 20px", display:"flex", alignItems:"center", gap:14, transition:"all 0.2s" }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor=s.bc+"66"; e.currentTarget.style.transform="translateX(8px)"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor=BOR;        e.currentTarget.style.transform="none"; }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:s.bb, border:`1px solid ${s.bc}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                      {s.emoji}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:W }}>{s.name}</div>
                      <div style={{ fontSize:12, color:MUT, marginTop:2 }}>{s.sub}</div>
                    </div>
                    <span style={{ background:s.bb, color:s.bc, border:`1px solid ${s.bc}50`, borderRadius:999, padding:"4px 13px", fontSize:11, fontWeight:700, letterSpacing:"0.06em", flexShrink:0 }}>
                      {s.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* right: copy */}
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:VIOL, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:18 }}>AI-Powered Intelligence</div>
              <h2 style={{ fontSize:42, fontWeight:900, lineHeight:1.15, letterSpacing:"-1px", marginBottom:20, color:W }}>
                Smarter monitoring.<br/>
                Predictive insights.<br/>
                <span style={{ color:VIOL }}>Better reliability.</span>
              </h2>
              <p style={{ fontSize:16, color:SL, lineHeight:1.8, marginBottom:30 }}>
                Our AI continuously learns from your system behavior to deliver accurate predictions and reduce downtime.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:36 }}>
                {["Predict issues before they occur","Reduce MTTR with AI insights","Improve system reliability","Save time and engineering resources"].map((t,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:20, height:20, borderRadius:999, background:"rgba(124,58,237,0.2)", border:"1px solid rgba(124,58,237,0.4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ fontSize:11, color:VIOL }}>✓</span>
                    </div>
                    <span style={{ fontSize:15, color:SL }}>{t}</span>
                  </div>
                ))}
              </div>
              <button style={PRI} onClick={()=>go("/register")}
                onMouseEnter={e=>{ e.currentTarget.style.background=VIOD; e.currentTarget.style.transform="translateY(-2px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background=VIO;  e.currentTarget.style.transform="none"; }}>
                Start Monitoring Free →
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ════════ TRUST LOGOS ═══════════════════════════════════════ */}
      <section style={{ borderTop:`1px solid ${BOR}`, borderBottom:`1px solid ${BOR}`, padding:"44px 0" }}>
        <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 52px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:20 }}>
          <span style={{ fontSize:13, color:MUT }}>Trusted by developers and businesses</span>
          {LOGOS.map((l,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}
              onMouseEnter={e=>{ Array.from(e.currentTarget.children).forEach(c=>c.style&&(c.style.color=W)); }}
              onMouseLeave={e=>{ Array.from(e.currentTarget.children).forEach(c=>c.style&&(c.style.color=SL)); }}>
              <div style={{ width:26, height:26, borderRadius:7, background:"rgba(255,255,255,0.06)", border:`1px solid ${BOR}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>{l.e}</div>
              <span style={{ fontSize:14, fontWeight:600, color:SL, transition:"color 0.15s" }}>{l.n}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ CTA BANNER ════════════════════════════════════════ */}
      <section style={{ padding:"80px 0" }}>
        <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 52px" }}>
          <div style={{
            background:"linear-gradient(135deg,rgba(124,58,237,0.2),rgba(79,70,229,0.12) 50%,rgba(34,211,238,0.07))",
            border:"1px solid rgba(124,58,237,0.28)", borderRadius:20,
            padding:"52px 56px", display:"flex", alignItems:"center",
            justifyContent:"space-between", gap:36, position:"relative", overflow:"hidden",
            boxShadow:"0 0 80px rgba(124,58,237,0.1)",
          }}>
            <div style={{ position:"absolute", top:-80, left:-80, width:300, height:300, background:"radial-gradient(circle,rgba(124,58,237,0.25),transparent 65%)", pointerEvents:"none" }}/>
            <div style={{ display:"flex", alignItems:"center", gap:22, position:"relative", zIndex:1 }}>
              <span style={{ fontSize:52 }}>🚀</span>
              <div>
                <h3 style={{ fontSize:26, fontWeight:900, color:W, letterSpacing:"-0.5px", marginBottom:8 }}>Ready to prevent failures before they happen?</h3>
                <p style={{ fontSize:15, color:SL }}>Join thousands of teams using AI to keep their systems healthy.</p>
              </div>
            </div>
            <div style={{ display:"flex", gap:12, flexShrink:0, position:"relative", zIndex:1 }}>
              <button style={PRI} onClick={()=>go("/register")}
                onMouseEnter={e=>e.currentTarget.style.background=VIOD}
                onMouseLeave={e=>e.currentTarget.style.background=VIO}>
                Get Started Free
              </button>
              <button style={GHOST} onClick={()=>go("/login")}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════════════════════════════════════════ */}
      <footer style={{ borderTop:`1px solid ${BOR}`, padding:"60px 0 32px" }}>
        <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 52px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1.5fr repeat(4,1fr) 1.4fr", gap:36, marginBottom:52 }}>

            {/* brand */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, cursor:"pointer" }} onClick={()=>go("/home")}>
                <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#7c3aed,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, boxShadow:"0 0 14px rgba(124,58,237,0.4)" }}>⚡</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:900, color:W, lineHeight:1 }}>API Failure</div>
                  <div style={{ fontSize:10, color:VIOL, fontWeight:600, marginTop:2 }}>Predictor</div>
                </div>
              </div>
              <p style={{ fontSize:13, color:MUT, lineHeight:1.75, marginBottom:18, maxWidth:200 }}>AI-powered observability and failure prediction for modern applications.</p>
              <div style={{ display:"flex", gap:9 }}>
                {["🐙","🐦","💼","➕"].map((ic,i)=>(
                  <div key={i} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${BOR}`, background:"rgba(255,255,255,0.03)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, cursor:"pointer", transition:"background 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}
                    onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}>
                    {ic}
                  </div>
                ))}
              </div>
            </div>

            {/* link columns */}
            {Object.entries(FOOT).map(([heading,links])=>(
              <div key={heading}>
                <h4 style={{ fontSize:13, fontWeight:700, color:W, marginBottom:16 }}>{heading}</h4>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {links.map(l=>(
                    <a key={l} href="#" style={{ fontSize:13, color:MUT, textDecoration:"none", transition:"color 0.15s" }}
                      onMouseEnter={e=>e.target.style.color=W}
                      onMouseLeave={e=>e.target.style.color=MUT}>
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}

            {/* newsletter */}
            <div>
              <h4 style={{ fontSize:13, fontWeight:700, color:W, marginBottom:8 }}>Stay updated</h4>
              <p style={{ fontSize:13, color:MUT, lineHeight:1.7, marginBottom:14 }}>Get the latest insights and updates delivered to your inbox.</p>
              <div style={{ display:"flex", gap:7 }}>
                <input type="email" placeholder="Enter your email" value={subEmail} onChange={e=>setSubEmail(e.target.value)}
                  style={{ flex:1, background:"rgba(255,255,255,0.05)", border:`1px solid ${BOR}`, borderRadius:9, padding:"9px 12px", color:W, fontSize:13, outline:"none", minWidth:0 }}
                  onFocus={e=>e.target.style.borderColor="rgba(124,58,237,0.5)"}
                  onBlur={e=>e.target.style.borderColor=BOR}/>
                <button style={{ background:VIO, border:"none", borderRadius:9, padding:"9px 15px", color:W, fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}
                  onMouseEnter={e=>e.currentTarget.style.background=VIOD}
                  onMouseLeave={e=>e.currentTarget.style.background=VIO}>
                  Subscribe
                </button>
              </div>
            </div>

          </div>

          {/* bottom bar */}
          <div style={{ borderTop:`1px solid ${BOR}`, paddingTop:24, textAlign:"center" }}>
            <p style={{ fontSize:13, color:MUT }}>© 2024 API Failure Predictor. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}