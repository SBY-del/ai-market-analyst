import { useState } from "react";

// ── MOCK TODAY (aligned with data) ─────────────────────────────────
const TODAY_LABEL   = "Jun 03";          // matches booking checkIn strings
const TODAY_DISPLAY = "3 Jun 2026";
const TODAY_MONTH   = "Jun";             // used to filter MTD

// ── MOCK DATA ──────────────────────────────────────────────────────
const VILLAS = [
  { id:1,  no:"V01", name:"Villa 01", status:"occupied",     guest:"Marco Rossi",      checkIn:"2026-06-01", checkOut:"2026-06-08", season:"high",     rate:1400 },
  { id:2,  no:"V02", name:"Villa 02", status:"occupied",     guest:"Sarah & James Wu", checkIn:"2026-06-02", checkOut:"2026-06-09", season:"high",     rate:1400 },
  { id:3,  no:"V03", name:"Villa 03", status:"available",    guest:null,               checkIn:null,         checkOut:null,         season:null,       rate:null  },
  { id:4,  no:"V04", name:"Villa 04", status:"occupied",     guest:"Fatima Al-Rashid", checkIn:"2026-05-30", checkOut:"2026-06-06", season:"high",     rate:1400 },
  { id:5,  no:"V05", name:"Villa 05", status:"cleaning",     guest:null,               checkIn:null,         checkOut:null,         season:null,       rate:null  },
  { id:6,  no:"V06", name:"Villa 06", status:"available",    guest:null,               checkIn:null,         checkOut:null,         season:null,       rate:null  },
  { id:7,  no:"V07", name:"Villa 07", status:"occupied",     guest:"Lena Müller",      checkIn:"2026-06-03", checkOut:"2026-06-07", season:"high",     rate:1400 },
  { id:8,  no:"V08", name:"Villa 08", status:"maintenance",  guest:null,               checkIn:null,         checkOut:null,         season:null,       rate:null  },
  { id:9,  no:"V09", name:"Villa 09", status:"occupied",     guest:"Hiroshi Tanaka",   checkIn:"2026-06-01", checkOut:"2026-06-10", season:"high",     rate:1400 },
  { id:10, no:"V10", name:"Villa 10", status:"available",    guest:null,               checkIn:null,         checkOut:null,         season:null,       rate:null  },
];

const BOOKINGS = [
  { id:1,  ref:"HVN-2026-00041", guest:"Marco Rossi",       villa:"V01", checkIn:"Jun 01", checkOut:"Jun 08", nights:7,  channel:"Direct",      season:"high",     rate:1400, total:9800,  status:"checked_in",  nationality:"Italian"     },
  { id:2,  ref:"HVN-2026-00042", guest:"Sarah & James Wu",  villa:"V02", checkIn:"Jun 02", checkOut:"Jun 09", nights:7,  channel:"Booking.com", season:"high",     rate:1400, total:9800,  status:"checked_in",  nationality:"Singaporean" },
  { id:3,  ref:"HVN-2026-00043", guest:"Fatima Al-Rashid",  villa:"V04", checkIn:"May 30", checkOut:"Jun 06", nights:7,  channel:"Airbnb",      season:"high",     rate:1400, total:9800,  status:"checked_in",  nationality:"UAE"         },
  { id:4,  ref:"HVN-2026-00044", guest:"Lena Müller",       villa:"V07", checkIn:"Jun 03", checkOut:"Jun 07", nights:4,  channel:"M&M Smith",   season:"high",     rate:1400, total:5600,  status:"checked_in",  nationality:"German"      },
  { id:5,  ref:"HVN-2026-00045", guest:"Hiroshi Tanaka",    villa:"V09", checkIn:"Jun 01", checkOut:"Jun 10", nights:9,  channel:"Direct",      season:"high",     rate:1400, total:12600, status:"checked_in",  nationality:"Japanese"    },
  { id:6,  ref:"HVN-2026-00046", guest:"Charlotte Dubois",  villa:"V03", checkIn:"Jun 08", checkOut:"Jun 15", nights:7,  channel:"Direct",      season:"high",     rate:1400, total:9800,  status:"confirmed",   nationality:"French"      },
  { id:7,  ref:"HVN-2026-00047", guest:"Ahmed Hassan",      villa:"V06", checkIn:"Jun 09", checkOut:"Jun 14", nights:5,  channel:"Expedia",     season:"high",     rate:1400, total:7000,  status:"confirmed",   nationality:"Egyptian"    },
  { id:8,  ref:"HVN-2026-00048", guest:"Sofia Petrova",     villa:"V10", checkIn:"Jun 12", checkOut:"Jun 19", nights:7,  channel:"Airbnb",      season:"high",     rate:1400, total:9800,  status:"confirmed",   nationality:"Russian"     },
  { id:9,  ref:"HVN-2026-00039", guest:"James Whitfield",   villa:"V05", checkIn:"May 28", checkOut:"Jun 03", nights:6,  channel:"Direct",      season:"shoulder", rate:1050, total:6300,  status:"checked_out", nationality:"British"     },
  { id:10, ref:"HVN-2026-00040", guest:"Priya Nair",        villa:"V08", checkIn:"May 25", checkOut:"Jun 02", nights:8,  channel:"Booking.com", season:"shoulder", rate:1050, total:8400,  status:"checked_out", nationality:"Indian"      },
];

const EMPLOYEES = [
  { id:1, name:"Ahmed Salim",    role:"General Manager",    dept:"Management",    salary:800, type:"local", permit:null         },
  { id:2, name:"Fatuma Juma",    role:"Front Desk Manager", dept:"Front Office",  salary:350, type:"local", permit:null         },
  { id:3, name:"Pierre Leblanc", role:"Executive Chef",     dept:"F&B",           salary:600, type:"expat", permit:"2026-11-15" },
  { id:4, name:"Zainab Omar",    role:"Head Housekeeper",   dept:"Housekeeping",  salary:300, type:"local", permit:null         },
  { id:5, name:"Carlos Rivera",  role:"Spa Manager",        dept:"Spa & Wellness",salary:500, type:"expat", permit:"2026-08-20" },
  { id:6, name:"Mwanajuma Said", role:"Sous Chef",          dept:"F&B",           salary:280, type:"local", permit:null         },
  { id:7, name:"Rashid Hamad",   role:"Head Gardener",      dept:"Grounds",       salary:220, type:"local", permit:null         },
  { id:8, name:"Anna Fischer",   role:"Guest Relations",    dept:"Front Office",  salary:400, type:"expat", permit:"2027-03-01" },
];

const CHANNELS = [
  { id:1, name:"Booking.com",      code:"BDC", commission:15, status:"active", lastSync:"2 min ago",  bookings:18 },
  { id:2, name:"Airbnb Luxe",      code:"ABB", commission:15, status:"active", lastSync:"5 min ago",  bookings:11 },
  { id:3, name:"Expedia",          code:"EXP", commission:18, status:"active", lastSync:"12 min ago", bookings:7  },
  { id:4, name:"Mr & Mrs Smith",   code:"MMS", commission:12, status:"active", lastSync:"1 hr ago",   bookings:14 },
  { id:5, name:"Agoda",            code:"AGO", commission:16, status:"idle",   lastSync:"3 hr ago",   bookings:4  },
  { id:6, name:"Direct Website",   code:"DWB", commission:0,  status:"active", lastSync:"Live",       bookings:22 },
  { id:7, name:"Google Hotel Ads", code:"GHA", commission:0,  status:"active", lastSync:"Live",       bookings:9  },
  { id:8, name:"i-Escape",         code:"IES", commission:12, status:"idle",   lastSync:"6 hr ago",   bookings:3  },
  { id:9, name:"TripAdvisor",      code:"TRA", commission:15, status:"active", lastSync:"30 min ago", bookings:6  },
];

// ── TRANSPORT DATA ─────────────────────────────────────────────────
const AIRPORT_KM = 45; // Zanzibar International Airport ↔ Resort

const TRIP_CATALOG = [
  { id:"stone_town",    name:"Stone Town",            km:46, duration:"4 hrs",    desc:"UNESCO World Heritage old town & spice market"      },
  { id:"spice_farm",    name:"Spice Farm Tour",       km:32, duration:"3 hrs",    desc:"Traditional plantation with local guide"            },
  { id:"dolphins",      name:"Dolphin Tour",           km:82, duration:"6 hrs",    desc:"Kizimkazi – swimming with wild dolphins"            },
  { id:"jozani",        name:"Jozani Forest",          km:44, duration:"3 hrs",    desc:"Red colobus monkeys & mangrove boardwalk"          },
  { id:"nungwi",        name:"Nungwi Beach Day",       km:64, duration:"Full day", desc:"North coast pristine beach & dhow sunset"          },
  { id:"prison_island", name:"Prison Island",          km:24, duration:"4 hrs",    desc:"Giant tortoises & historic fort ruins"             },
  { id:"mnemba",        name:"Mnemba Snorkel",         km:55, duration:"Full day", desc:"Coral reef snorkelling off Mnemba Atoll"           },
  { id:"village",       name:"Local Village Visit",    km:18, duration:"2 hrs",    desc:"Community tourism – authentic cultural experience" },
];

// Airport transfers scheduled for today
const TRANSFERS = [
  { id:1, bookingId:4, type:"arrival",   guest:"Lena Müller",    villa:"V07", flightNo:"LH 591", flightTime:"15:30", km:AIRPORT_KM, vehicle:"Land Cruiser",  driver:"Hassan Juma",  status:"scheduled", date:TODAY_LABEL },
  { id:2, bookingId:9, type:"departure", guest:"James Whitfield", villa:"V05", flightNo:"KQ 102", flightTime:"10:00", km:AIRPORT_KM, vehicle:"Resort Minibus", driver:"Ali Mohamed",  status:"completed", date:TODAY_LABEL },
];

// Private trip requests (in-house guests)
const PRIVATE_TRIPS_INIT = [
  { id:1, bookingId:1, guest:"Marco Rossi",      villa:"V01", tripId:"stone_town",    pax:1, date:"Jun 04", time:"09:00", vehicle:"Land Cruiser",  driver:"Said Omar",   status:"confirmed" },
  { id:2, bookingId:5, guest:"Hiroshi Tanaka",   villa:"V09", tripId:"dolphins",       pax:2, date:"Jun 05", time:"07:00", vehicle:"Land Cruiser",  driver:"Hassan Juma", status:"confirmed" },
  { id:3, bookingId:3, guest:"Fatima Al-Rashid", villa:"V04", tripId:"prison_island",  pax:3, date:"Jun 04", time:"10:00", vehicle:"Resort Minibus",driver:"Ali Mohamed", status:"pending"   },
  { id:4, bookingId:2, guest:"Sarah & James Wu", villa:"V02", tripId:"spice_farm",     pax:2, date:"Jun 06", time:"08:30", vehicle:"Land Cruiser",  driver:"Said Omar",   status:"confirmed" },
];

const EXPENSES = [
  { id:1, date:"Jun 01", category:"F&B Cost",    description:"Seafood & produce delivery",     amount:2840, status:"approved" },
  { id:2, date:"Jun 02", category:"Utilities",   description:"Electricity bill — May",         amount:1200, status:"approved" },
  { id:3, date:"Jun 02", category:"Maintenance", description:"Pool pump replacement V04",      amount:380,  status:"approved" },
  { id:4, date:"Jun 03", category:"Marketing",   description:"Instagram campaign — June",      amount:600,  status:"pending"  },
  { id:5, date:"Jun 03", category:"Admin",       description:"Starlink internet subscription", amount:150,  status:"approved" },
  { id:6, date:"Jun 03", category:"Spa",         description:"Treatment supplies restock",     amount:420,  status:"pending"  },
];

const PNL_DATA = [
  { month:"Jan", revenue:134400, expenses:68200, ebitda:66200 },
  { month:"Feb", revenue:128800, expenses:65400, ebitda:63400 },
  { month:"Mar", revenue:94500,  expenses:58700, ebitda:35800 },
  { month:"Apr", revenue:54000,  expenses:52100, ebitda:1900  },
  { month:"May", revenue:63000,  expenses:54300, ebitda:8700  },
  { month:"Jun", revenue:88900,  expenses:57200, ebitda:31700 },
  { month:"Jul", revenue:0,      expenses:0,     ebitda:0     },
];

// ── HELPERS ────────────────────────────────────────────────────────
const fmt    = (n) => n?.toLocaleString("en-US", { minimumFractionDigits: 0 });
const fmtAED = (usd) => fmt(Math.round(usd * 3.6725));

/** Bookings whose stay touches the current month (MTD). */
const mtdBookings = BOOKINGS.filter(
  (b) => b.status !== "cancelled" &&
         (b.checkIn.startsWith(TODAY_MONTH) || b.checkOut.startsWith(TODAY_MONTH))
);
const MTD_REVENUE = mtdBookings.reduce((s, b) => s + b.total, 0); // $88,900

/** Channel mix percentages computed from CHANNELS data. */
function buildChannelMix() {
  const total  = CHANNELS.reduce((s, c) => s + c.bookings, 0);
  const direct = CHANNELS.filter(c => c.code === "DWB" || c.code === "GHA").reduce((s,c)=>s+c.bookings,0);
  const bdc    = CHANNELS.find(c => c.code === "BDC")?.bookings ?? 0;
  const mms    = CHANNELS.find(c => c.code === "MMS")?.bookings ?? 0;
  const abb    = CHANNELS.find(c => c.code === "ABB")?.bookings ?? 0;
  const other  = total - direct - bdc - mms - abb;
  const pct    = (n) => `${Math.round(n / total * 100)}%`;
  return [
    { name:"Direct + Google", pct:pct(direct), color:"var(--ocean)",       val:direct },
    { name:"Booking.com",     pct:pct(bdc),    color:"var(--ocean-light)", val:bdc    },
    { name:"M&M Smith",       pct:pct(mms),    color:"var(--gold)",        val:mms    },
    { name:"Airbnb Luxe",     pct:pct(abb),    color:"var(--coral)",       val:abb    },
    { name:"Other",           pct:pct(other),  color:"var(--muted)",       val:other  },
  ];
}
const CHANNEL_MIX = buildChannelMix();

const statusColor = {
  occupied:    { bg:"rgba(26,58,74,0.1)",    text:"#1a3a4a", dot:"#1a3a4a" },
  available:   { bg:"rgba(58,122,92,0.1)",   text:"#3a7a5c", dot:"#3a7a5c" },
  cleaning:    { bg:"rgba(184,149,106,0.15)",text:"#b8956a", dot:"#b8956a" },
  maintenance: { bg:"rgba(160,48,48,0.1)",   text:"#a03030", dot:"#a03030" },
};
const bookingStatusStyle = {
  checked_in:  { bg:"rgba(26,58,74,0.1)",    text:"#1a3a4a" },
  confirmed:   { bg:"rgba(58,122,92,0.12)",  text:"#3a7a5c" },
  checked_out: { bg:"rgba(184,149,106,0.15)",text:"#b8956a" },
  cancelled:   { bg:"rgba(160,48,48,0.1)",   text:"#a03030" },
};
const seasonStyle = {
  peak:     { bg:"rgba(201,107,74,0.12)", text:"#c96b4a" },
  high:     { bg:"rgba(26,58,74,0.08)",   text:"#1a3a4a" },
  shoulder: { bg:"rgba(184,149,106,0.15)",text:"#b8956a" },
  green:    { bg:"rgba(58,122,92,0.1)",   text:"#3a7a5c" },
};

// ── CSS ─────────────────────────────────────────────────────────────
const gStyles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

* { box-sizing:border-box; margin:0; padding:0; }
body { font-family:'Montserrat', sans-serif; }

:root {
  --sand:#e8ddd0; --sand-light:#f5f0ea; --sand-mid:#ede5d8;
  --ocean:#1a3a4a; --ocean-mid:#2d5a72; --ocean-light:#4a8fa8;
  --coral:#c96b4a; --gold:#b8956a; --gold-light:#d4b48a;
  --white:#fafaf8; --text:#1a2630; --muted:#6b7f8a;
  --success:#3a7a5c; --warning:#b8762a; --danger:#a03030;
  --border:rgba(26,58,74,0.12);
  --shadow:0 2px 20px rgba(26,58,74,0.07);
  --shadow-lg:0 8px 40px rgba(26,58,74,0.12);
  --serif:'Cormorant Garamond', Georgia, serif;
  --sans:'Montserrat', sans-serif;
}

.hvn-app { display:flex; height:100vh; background:var(--sand-light); overflow:hidden; font-size:13px; color:var(--text); line-height:1.6; }

/* SIDEBAR */
.sidebar { width:230px; min-width:230px; background:var(--ocean); display:flex; flex-direction:column; overflow-y:auto; }
.sb-logo { padding:28px 22px 22px; border-bottom:1px solid rgba(255,255,255,0.08); }
.sb-hvn  { font-family:var(--serif); font-size:30px; font-weight:300; letter-spacing:7px; color:var(--sand); }
.sb-sub  { font-size:8.5px; letter-spacing:2.5px; text-transform:uppercase; color:rgba(232,221,208,0.45); margin-top:3px; }
.sb-nav  { padding:14px 0; flex:1; }
.sb-section { padding:12px 22px 5px; font-size:8.5px; letter-spacing:2px; text-transform:uppercase; color:rgba(232,221,208,0.3); }
.sb-item { display:flex; align-items:center; gap:11px; padding:11px 22px; color:rgba(232,221,208,0.6); cursor:pointer; transition:all 0.15s; font-size:11.5px; font-weight:500; letter-spacing:0.3px; border-left:3px solid transparent; user-select:none; }
.sb-item:hover { color:var(--sand); background:rgba(255,255,255,0.04); }
.sb-item.active { color:var(--sand); background:rgba(255,255,255,0.08); border-left-color:var(--gold); }
.sb-icon { font-size:15px; width:18px; text-align:center; opacity:0.9; }
.sb-footer { padding:18px 22px; border-top:1px solid rgba(255,255,255,0.08); font-size:10.5px; color:rgba(232,221,208,0.4); line-height:1.8; }

/* MAIN */
.main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
.topbar { background:var(--white); padding:0 28px; height:62px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border); flex-shrink:0; box-shadow:0 1px 0 var(--border); }
.topbar-title { font-family:var(--serif); font-size:22px; font-weight:400; color:var(--ocean); }
.topbar-right { display:flex; align-items:center; gap:14px; }
.live-dot { width:7px; height:7px; border-radius:50%; background:#3a7a5c; animation:pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
.user-badge { display:flex; align-items:center; gap:9px; padding:7px 14px; background:var(--sand-light); font-size:11.5px; cursor:pointer; border-radius:2px; color:var(--ocean); font-weight:500; }
.user-avatar { width:28px; height:28px; border-radius:50%; background:var(--ocean); color:var(--sand); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:600; }
.content { flex:1; overflow-y:auto; padding:28px; }

/* CARDS */
.card { background:var(--white); border:1px solid var(--border); box-shadow:var(--shadow); border-radius:2px; }
.card-hd { padding:18px 22px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
.card-hd h2 { font-family:var(--serif); font-size:19px; font-weight:400; color:var(--ocean); }
.card-bd { padding:22px; }

/* KPI */
.kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; margin-bottom:24px; }
.kpi { background:var(--white); border:1px solid var(--border); padding:22px 20px; position:relative; overflow:hidden; border-radius:2px; box-shadow:var(--shadow); }
.kpi::after { content:''; position:absolute; bottom:0; left:0; right:0; height:3px; background:var(--ocean-light); }
.kpi.coral::after { background:var(--coral); }
.kpi.gold::after  { background:var(--gold); }
.kpi.green::after { background:var(--success); }
.kpi-label { font-size:9.5px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:9px; }
.kpi-value { font-family:var(--serif); font-size:34px; font-weight:300; color:var(--ocean); line-height:1; }
.kpi-sub   { font-size:10.5px; color:var(--muted); margin-top:5px; }

/* TABLE */
.tbl-wrap { overflow-x:auto; }
table { width:100%; border-collapse:collapse; }
thead th { padding:11px 14px; text-align:left; font-size:9.5px; letter-spacing:1.8px; text-transform:uppercase; color:var(--muted); background:var(--sand-light); border-bottom:1px solid var(--border); font-weight:600; }
tbody td { padding:13px 14px; border-bottom:1px solid rgba(26,58,74,0.05); vertical-align:middle; }
tbody tr:hover { background:rgba(74,143,168,0.025); }
tbody tr:last-child td { border-bottom:none; }

/* BADGE */
.badge { display:inline-flex; align-items:center; padding:2.5px 9px; font-size:9.5px; font-weight:600; letter-spacing:1px; text-transform:uppercase; border-radius:2px; }

/* VILLA GRID */
.villa-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; }
.villa-card { border:1px solid var(--border); padding:16px; cursor:pointer; transition:all 0.2s; position:relative; background:var(--white); border-radius:2px; }
.villa-card:hover { box-shadow:var(--shadow-lg); transform:translateY(-1px); }
.villa-no     { font-family:var(--serif); font-size:26px; font-weight:300; color:var(--ocean); }
.villa-slabel { font-size:9.5px; letter-spacing:1.5px; text-transform:uppercase; margin-top:2px; }
.villa-guest  { font-size:11.5px; margin-top:7px; font-weight:500; }
.villa-dates  { font-size:10.5px; color:var(--muted); margin-top:2px; }
.villa-dot    { position:absolute; top:13px; right:13px; width:7px; height:7px; border-radius:50%; }

/* CHANNEL GRID */
.ch-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.ch-card { border:1px solid var(--border); padding:18px; background:var(--white); border-radius:2px; }
.ch-name { font-weight:600; color:var(--ocean); font-size:13.5px; }
.ch-meta { font-size:9.5px; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-top:1px; }
.ch-row  { display:flex; align-items:center; justify-content:space-between; margin-top:12px; font-size:11.5px; }

/* BTN */
.btn { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border:none; cursor:pointer; font-family:var(--sans); font-size:10.5px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; transition:all 0.18s; border-radius:2px; }
.btn-primary { background:var(--ocean); color:var(--white); }
.btn-primary:hover { background:var(--ocean-mid); }
.btn-coral   { background:var(--coral); color:#fff; }
.btn-ghost   { background:transparent; border:1px solid var(--border); color:var(--muted); }
.btn-ghost:hover { border-color:var(--ocean); color:var(--ocean); }
.btn-sm { padding:6px 12px; font-size:9.5px; }

/* TABS */
.tabs { display:flex; border-bottom:1px solid var(--border); margin-bottom:22px; }
.tab  { padding:11px 18px; cursor:pointer; font-size:10.5px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:var(--muted); border-bottom:2px solid transparent; transition:all 0.15s; margin-bottom:-1px; }
.tab:hover  { color:var(--ocean); }
.tab.active { color:var(--ocean); border-bottom-color:var(--gold); }

/* MISC */
.grid2 { display:grid; grid-template-columns:1fr 1fr; gap:22px; }
.grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:18px; }
.mb4 { margin-bottom:16px; }
.mb6 { margin-bottom:24px; }
.text-muted   { color:var(--muted); }
.text-right   { text-align:right; }
.text-bold    { font-weight:700; }
.text-success { color:var(--success); }
.text-danger  { color:var(--danger); }
.text-ocean   { color:var(--ocean); }
.divider { height:1px; background:var(--border); margin:18px 0; }
.filter-bar { display:flex; gap:10px; align-items:center; padding:14px 22px; background:var(--sand-light); border-bottom:1px solid var(--border); flex-wrap:wrap; }
.filter-bar input, .filter-bar select { width:auto; padding:7px 11px; border:1px solid var(--border); background:var(--white); font-size:12px; border-radius:2px; color:var(--text); outline:none; }
.arrivals-item { display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--border); font-size:12px; }
.arrivals-item:last-child { border-bottom:none; }
.arr-name { font-weight:600; color:var(--ocean); }
.arr-meta { font-size:10.5px; color:var(--muted); margin-top:1px; }
`;

// ── SHARED COMPONENTS ───────────────────────────────────────────────
function Badge({ children, style }) {
  return <span className="badge" style={style}>{children}</span>;
}

function StatusBadge({ status }) {
  const s = bookingStatusStyle[status] || {};
  return <Badge style={{ background:s.bg, color:s.text }}>{status?.replace("_", " ")}</Badge>;
}

function SeasonBadge({ season }) {
  if (!season) return null;
  const s = seasonStyle[season] || {};
  return <Badge style={{ background:s.bg, color:s.text }}>{season}</Badge>;
}

// ── PAGE: DASHBOARD ────────────────────────────────────────────────
function Dashboard() {
  const occupied      = VILLAS.filter(v => v.status === "occupied").length;
  const occupancyPct  = Math.round(occupied / VILLAS.length * 100);

  // Arrivals for today — derived from TODAY_LABEL constant, not a hardcoded string
  const todayArrivals = BOOKINGS.filter(b => b.checkIn === TODAY_LABEL);

  // Active bookings: confirmed + currently checked in
  const activeBookings = BOOKINGS.filter(
    b => b.status === "confirmed" || b.status === "checked_in"
  );

  // Recent 5 bookings — sorted newest first by id
  const recentBookings = [...BOOKINGS]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  const villaStats = [
    { label:"Occupied",    val:VILLAS.filter(v=>v.status==="occupied").length,    color:"var(--ocean)"   },
    { label:"Available",   val:VILLAS.filter(v=>v.status==="available").length,   color:"var(--success)" },
    { label:"Cleaning",    val:VILLAS.filter(v=>v.status==="cleaning").length,    color:"var(--gold)"    },
    { label:"Maintenance", val:VILLAS.filter(v=>v.status==="maintenance").length, color:"var(--danger)"  },
  ];

  return (
    <div>
      {/* ── KPI ROW ── */}
      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-label">Occupancy Today</div>
          <div className="kpi-value">{occupied}/{VILLAS.length}</div>
          <div className="kpi-sub">{occupancyPct}% · High Season · {TODAY_DISPLAY}</div>
        </div>

        <div className="kpi coral">
          <div className="kpi-label">MTD Revenue</div>
          <div className="kpi-value">${fmt(MTD_REVENUE)}</div>
          <div className="kpi-sub">AED {fmtAED(MTD_REVENUE)}</div>
        </div>

        <div className="kpi gold">
          <div className="kpi-label">Arrivals Today</div>
          <div className="kpi-value">{todayArrivals.length}</div>
          <div className="kpi-sub">{TODAY_DISPLAY}</div>
        </div>

        <div className="kpi green">
          <div className="kpi-label">Active Bookings</div>
          <div className="kpi-value">{activeBookings.length}</div>
          <div className="kpi-sub">
            {BOOKINGS.filter(b=>b.status==="checked_in").length} in-house ·{" "}
            {BOOKINGS.filter(b=>b.status==="confirmed").length} confirmed
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid2">

        {/* Recent Reservations — sorted newest first */}
        <div className="card">
          <div className="card-hd">
            <h2>Recent Reservations</h2>
            <span className="text-muted" style={{fontSize:11}}>Latest 5</span>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ref</th><th>Guest</th><th>Villa</th><th>Nights</th><th>Total</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id}>
                    <td style={{fontFamily:"var(--serif)",fontSize:14,color:"var(--ocean)"}}>
                      {b.ref.replace("HVN-2026-","#")}
                    </td>
                    <td>
                      <div style={{fontWeight:600,fontSize:12}}>{b.guest}</div>
                      <div className="text-muted" style={{fontSize:10.5}}>{b.nationality}</div>
                    </td>
                    <td><Badge style={{background:"rgba(26,58,74,0.08)",color:"var(--ocean)"}}>{b.villa}</Badge></td>
                    <td>{b.nights}n</td>
                    <td style={{fontWeight:600}}>${fmt(b.total)}</td>
                    <td><StatusBadge status={b.status}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Villa Snapshot — computed from VILLAS data */}
          <div className="card mb4">
            <div className="card-hd"><h2>Villa Snapshot</h2></div>
            <div className="card-bd" style={{display:"flex",gap:18,flexWrap:"wrap"}}>
              {villaStats.map(s => (
                <div key={s.label}
                  style={{flex:"1 1 40%",padding:"14px 16px",background:"var(--sand-light)",borderRadius:2,textAlign:"center"}}>
                  <div style={{fontFamily:"var(--serif)",fontSize:32,fontWeight:300,color:s.color,lineHeight:1}}>{s.val}</div>
                  <div style={{fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginTop:4}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Mix — computed from CHANNELS data */}
          <div className="card">
            <div className="card-hd">
              <h2>Channel Mix</h2>
              <span className="text-muted" style={{fontSize:11}}>
                {CHANNELS.reduce((s,c)=>s+c.bookings,0)} total bookings
              </span>
            </div>
            <div className="card-bd">
              {CHANNEL_MIX.map(({ name, pct, color }) => (
                <div key={name} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11.5,marginBottom:4}}>
                    <span>{name}</span>
                    <span style={{fontWeight:600,color}}>{pct}</span>
                  </div>
                  <div style={{height:5,background:"var(--sand)",borderRadius:1}}>
                    <div style={{height:5,width:pct,background:color,borderRadius:1,transition:"width 0.5s"}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PAGE: VILLA STATUS ─────────────────────────────────────────────
function VillaStatus() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div className="villa-grid mb6">
        {VILLAS.map(v => {
          const sc = statusColor[v.status];
          return (
            <div key={v.id} className={`villa-card ${v.status}`}
              onClick={() => setSelected(v)}
              style={{ borderColor: sc.bg.replace("0.1","0.35").replace("0.15","0.4") }}>
              <div className="villa-dot" style={{background:sc.dot}}/>
              <div className="villa-no">{v.no}</div>
              <div className="villa-slabel" style={{color:sc.text}}>{v.status}</div>
              {v.guest   && <div className="villa-guest">{v.guest}</div>}
              {v.checkIn && <div className="villa-dates">{v.checkIn?.slice(5)} → {v.checkOut?.slice(5)}</div>}
              {v.rate    && <div style={{marginTop:6,fontSize:10.5,fontWeight:600,color:"var(--ocean)"}}>${fmt(v.rate)}/night · {v.season}</div>}
            </div>
          );
        })}
      </div>

      {selected && (
        <div
          style={{position:"fixed",inset:0,background:"rgba(26,58,74,0.45)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500}}
          onClick={() => setSelected(null)}
        >
          <div className="card" style={{width:420,padding:"28px 32px"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
              <div>
                <div style={{fontFamily:"var(--serif)",fontSize:36,fontWeight:300,color:"var(--ocean)",lineHeight:1}}>{selected.no}</div>
                <div style={{fontSize:9.5,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginTop:3}}>{selected.name}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={()=>setSelected(null)}>✕</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {[
                ["Status",        <Badge style={{background:statusColor[selected.status].bg, color:statusColor[selected.status].text}}>{selected.status}</Badge>],
                ["Season",        selected.season   ? <SeasonBadge season={selected.season}/> : "—"],
                ["Current Guest", selected.guest    || "—"],
                ["Rate",          selected.rate     ? `$${fmt(selected.rate)}/night` : "—"],
                ["Check-in",      selected.checkIn  || "—"],
                ["Check-out",     selected.checkOut || "—"],
              ].map(([label, val]) => (
                <div key={label} style={{background:"var(--sand-light)",padding:"12px 14px",borderRadius:2}}>
                  <div style={{fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>{label}</div>
                  <div style={{fontSize:12.5,fontWeight:500}}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PAGE: BOOKINGS ─────────────────────────────────────────────────
function Bookings() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = BOOKINGS
    .filter(b => filter === "all" || b.status === filter)
    .filter(b =>
      b.guest.toLowerCase().includes(search.toLowerCase()) ||
      b.ref.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div>
      <div className="card">
        <div className="filter-bar">
          <select value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="checked_in">Checked In</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_out">Checked Out</option>
          </select>
          <input
            placeholder="Search guest or ref…"
            style={{minWidth:180}}
            value={search}
            onChange={e=>setSearch(e.target.value)}
          />
          <input type="month" defaultValue="2026-06"/>
          <div style={{flex:1}}/>
          <button className="btn btn-primary btn-sm">+ New Booking</button>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Ref</th><th>Guest</th><th>Villa</th><th>Check-in</th><th>Check-out</th>
                <th>Nights</th><th>Channel</th><th>Season</th><th>Rate/N</th><th>Total</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} style={{textAlign:"center",padding:"32px 0",color:"var(--muted)"}}>No bookings found</td>
                </tr>
              ) : filtered.map(b => (
                <tr key={b.id}>
                  <td style={{fontFamily:"var(--serif)",fontSize:13.5,color:"var(--ocean)",fontWeight:500}}>
                    {b.ref.replace("HVN-2026-","#")}
                  </td>
                  <td>
                    <div style={{fontWeight:600,fontSize:12}}>{b.guest}</div>
                    <div className="text-muted" style={{fontSize:10.5}}>{b.nationality}</div>
                  </td>
                  <td><Badge style={{background:"rgba(26,58,74,0.08)",color:"var(--ocean)"}}>{b.villa}</Badge></td>
                  <td style={{fontSize:12}}>{b.checkIn}</td>
                  <td style={{fontSize:12}}>{b.checkOut}</td>
                  <td style={{textAlign:"center"}}>{b.nights}</td>
                  <td style={{fontSize:11.5,color:"var(--muted)"}}>{b.channel}</td>
                  <td><SeasonBadge season={b.season}/></td>
                  <td style={{fontVariantNumeric:"tabular-nums"}}>${fmt(b.rate)}</td>
                  <td style={{fontWeight:700,color:"var(--ocean)"}}>${fmt(b.total)}</td>
                  <td><StatusBadge status={b.status}/></td>
                  <td>
                    {b.status==="confirmed"  && <button className="btn btn-primary btn-sm">Check-in</button>}
                    {b.status==="checked_in" && <button className="btn btn-sm" style={{background:"var(--gold)",color:"#fff",fontSize:9.5,padding:"6px 12px"}}>Check-out</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── PAGE: ARRIVALS & DEPARTURES ────────────────────────────────────
const VEHICLES = ["Land Cruiser", "Resort Minibus", "Luxury Sedan"];
const DRIVERS  = ["Hassan Juma", "Ali Mohamed", "Said Omar", "Rashid Hamad"];

function TransferTypeBadge({ type }) {
  const styles = {
    arrival:     { bg:"rgba(58,122,92,0.12)",   text:"var(--success)", label:"Arrival Transfer"   },
    departure:   { bg:"rgba(201,107,74,0.12)",  text:"var(--coral)",   label:"Departure Transfer" },
    private_trip:{ bg:"rgba(26,58,74,0.08)",    text:"var(--ocean)",   label:"Private Trip"       },
  };
  const s = styles[type] || styles.arrival;
  return <Badge style={{background:s.bg, color:s.text}}>{s.label}</Badge>;
}

function Arrivals() {
  const arrivals   = BOOKINGS.filter(b => b.checkIn  === TODAY_LABEL && b.status === "confirmed");
  const departures = BOOKINGS.filter(b => b.checkOut === TODAY_LABEL && b.status === "checked_in");
  const inhouse    = BOOKINGS.filter(b => b.status   === "checked_in");

  // Fuel rate — editable per day; drives all charge calculations
  const [fuelRate, setFuelRate]       = useState(2.80);   // USD per km
  const [editingRate, setEditingRate] = useState(false);
  const [rateInput, setRateInput]     = useState("2.80");

  // Private trips state
  const [privateTrips, setPrivateTrips] = useState(PRIVATE_TRIPS_INIT);
  const [showArrangeModal, setShowArrangeModal] = useState(false);
  const [tripForm, setTripForm] = useState({
    bookingId: "", tripId: "", date: "", time: "09:00", pax: 1, vehicle: VEHICLES[0], driver: DRIVERS[0], notes: "",
  });

  const saveFuelRate = () => {
    const v = parseFloat(rateInput);
    if (!isNaN(v) && v > 0) setFuelRate(parseFloat(v.toFixed(2)));
    setEditingRate(false);
  };

  const tripCharge = (km) => Math.round(km * fuelRate);

  // Transport revenue today = transfers + private trips today
  const todayTransportRevenue =
    TRANSFERS.reduce((s, t) => s + tripCharge(t.km), 0) +
    privateTrips.filter(p => p.date === TODAY_LABEL).reduce((s, p) => {
      const trip = TRIP_CATALOG.find(t => t.id === p.tripId);
      return s + (trip ? tripCharge(trip.km) : 0);
    }, 0);

  const submitTripForm = () => {
    const trip = TRIP_CATALOG.find(t => t.id === tripForm.tripId);
    const booking = BOOKINGS.find(b => b.id === parseInt(tripForm.bookingId));
    if (!trip || !booking) return;
    setPrivateTrips(prev => [...prev, {
      id: prev.length + 1,
      bookingId: parseInt(tripForm.bookingId),
      guest: booking.guest,
      villa: booking.villa,
      tripId: tripForm.tripId,
      pax: tripForm.pax,
      date: tripForm.date || TODAY_LABEL,
      time: tripForm.time,
      vehicle: tripForm.vehicle,
      driver: tripForm.driver,
      status: "pending",
    }]);
    setShowArrangeModal(false);
    setTripForm({ bookingId:"", tripId:"", date:"", time:"09:00", pax:1, vehicle:VEHICLES[0], driver:DRIVERS[0], notes:"" });
  };

  const transferForBooking = (bookingId) => TRANSFERS.find(t => t.bookingId === bookingId);

  const inputStyle = {
    width:"100%", padding:"8px 11px", border:"1px solid var(--border)", borderRadius:2,
    fontSize:12.5, background:"var(--white)", color:"var(--text)", outline:"none", fontFamily:"var(--sans)",
  };

  return (
    <div>
      {/* ── KPI ROW ── */}
      <div style={{display:"flex",gap:12,marginBottom:22}}>
        {[
          ["Arrivals Today",      arrivals.length,           "var(--success)"],
          ["Departures Today",    departures.length,         "var(--coral)"  ],
          ["In-House",            inhouse.length,            "var(--ocean)"  ],
          ["Transport Rev Today", `$${fmt(todayTransportRevenue)}`, "var(--gold)"],
        ].map(([l,v,c]) => (
          <div key={l} className="kpi" style={{flex:1}}>
            <div className="kpi-label">{l}</div>
            <div className="kpi-value" style={{color:c,fontSize:l==="Transport Rev Today"?26:34}}>{v}</div>
            <div className="kpi-sub">{TODAY_DISPLAY}</div>
          </div>
        ))}
      </div>

      {/* ── FUEL RATE BAR ── */}
      <div className="card mb4" style={{padding:"14px 22px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{fontSize:9.5,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>Fuel Rate · {TODAY_DISPLAY}</div>
            {editingRate ? (
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:"var(--muted)",fontSize:13}}>$</span>
                <input
                  type="number" step="0.05" min="0.5" value={rateInput}
                  onChange={e => setRateInput(e.target.value)}
                  style={{...inputStyle, width:90, padding:"5px 8px"}}
                  autoFocus
                />
                <span style={{color:"var(--muted)",fontSize:12}}>/km</span>
                <button className="btn btn-primary btn-sm" onClick={saveFuelRate}>Save</button>
                <button className="btn btn-ghost btn-sm" onClick={()=>setEditingRate(false)}>Cancel</button>
              </div>
            ) : (
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontFamily:"var(--serif)",fontSize:26,fontWeight:300,color:"var(--ocean)"}}>${fuelRate.toFixed(2)}</span>
                <span style={{color:"var(--muted)",fontSize:12}}>/km · incl. driver & vehicle</span>
                <button className="btn btn-ghost btn-sm" onClick={()=>{setEditingRate(true);setRateInput(fuelRate.toFixed(2));}}>Edit Rate</button>
              </div>
            )}
          </div>
          <div style={{fontSize:11,color:"var(--muted)"}}>
            Airport transfer ({AIRPORT_KM} km) → <strong style={{color:"var(--ocean)"}}>
              ${tripCharge(AIRPORT_KM)} per run</strong>
          </div>
        </div>
      </div>

      {/* ── TODAY'S AIRPORT TRANSFERS ── */}
      <div className="card mb6">
        <div className="card-hd">
          <h2>🚐 Airport Transfers — Today</h2>
          <span className="text-muted" style={{fontSize:11}}>{AIRPORT_KM} km each way · Rate ${fuelRate.toFixed(2)}/km</span>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Type</th><th>Guest</th><th>Villa</th><th>Flight</th>
                <th>Time</th><th>Vehicle</th><th>Driver</th>
                <th className="text-right">km</th>
                <th className="text-right">Charge (USD)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {TRANSFERS.filter(t => t.date === TODAY_LABEL).map(t => (
                <tr key={t.id}>
                  <td><TransferTypeBadge type={t.type}/></td>
                  <td style={{fontWeight:600}}>{t.guest}</td>
                  <td><Badge style={{background:"rgba(26,58,74,0.08)",color:"var(--ocean)"}}>{t.villa}</Badge></td>
                  <td style={{fontFamily:"var(--serif)",fontSize:13.5,color:"var(--ocean)"}}>{t.flightNo}</td>
                  <td style={{fontWeight:500}}>{t.flightTime}</td>
                  <td className="text-muted" style={{fontSize:11.5}}>{t.vehicle}</td>
                  <td className="text-muted" style={{fontSize:11.5}}>{t.driver}</td>
                  <td className="text-right" style={{color:"var(--muted)"}}>{t.km}</td>
                  <td className="text-right" style={{fontWeight:700,color:"var(--ocean)"}}>${fmt(tripCharge(t.km))}</td>
                  <td>
                    <Badge style={t.status==="completed"
                      ? {background:"rgba(58,122,92,0.12)",color:"var(--success)"}
                      : {background:"rgba(26,58,74,0.08)",color:"var(--ocean)"}}>
                      {t.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ARRIVALS & DEPARTURES DETAIL ── */}
      <div className="grid2 mb6">
        <div className="card">
          <div className="card-hd"><h2>✈ Arrivals</h2></div>
          <div className="card-bd">
            {arrivals.length === 0
              ? <p className="text-muted" style={{fontSize:12,textAlign:"center",padding:"16px 0"}}>No arrivals today</p>
              : arrivals.map(a => {
                const transfer = transferForBooking(a.id);
                return (
                  <div key={a.id} className="arrivals-item" style={{flexDirection:"column",alignItems:"stretch",gap:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div className="arr-name">{a.guest}</div>
                        <div className="arr-meta">{a.nationality} · {a.channel} · {a.nights} nights</div>
                        {transfer && (
                          <div className="arr-meta" style={{marginTop:4,color:"var(--ocean-light)"}}>
                            ✈ {transfer.flightNo} arrives {transfer.flightTime} · {transfer.vehicle} · {transfer.driver}
                          </div>
                        )}
                      </div>
                      <div style={{textAlign:"right"}}>
                        <Badge style={{background:"rgba(26,58,74,0.08)",color:"var(--ocean)",marginBottom:6,display:"block"}}>{a.villa}</Badge>
                        <button className="btn btn-primary btn-sm">Check In</button>
                      </div>
                    </div>
                    {transfer && (
                      <div style={{background:"var(--sand-light)",borderRadius:2,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11.5}}>
                        <span className="text-muted">Airport → Resort · {transfer.km} km</span>
                        <span style={{fontWeight:700,color:"var(--ocean)"}}>Transfer: ${fmt(tripCharge(transfer.km))}</span>
                      </div>
                    )}
                  </div>
                );
              })
            }
          </div>
        </div>

        <div className="card">
          <div className="card-hd"><h2>🛫 Departures</h2></div>
          <div className="card-bd">
            {departures.length === 0
              ? <p className="text-muted" style={{fontSize:12,textAlign:"center",padding:"16px 0"}}>No departures today</p>
              : departures.map(d => {
                const transfer = transferForBooking(d.id);
                return (
                  <div key={d.id} className="arrivals-item" style={{flexDirection:"column",alignItems:"stretch",gap:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div className="arr-name">{d.guest}</div>
                        <div className="arr-meta">{d.channel} · {d.nights} nights</div>
                        {transfer && (
                          <div className="arr-meta" style={{marginTop:4,color:"var(--ocean-light)"}}>
                            ✈ {transfer.flightNo} departs {transfer.flightTime} · {transfer.vehicle} · {transfer.driver}
                          </div>
                        )}
                      </div>
                      <div style={{textAlign:"right"}}>
                        <Badge style={{background:"rgba(26,58,74,0.08)",color:"var(--ocean)",marginBottom:6,display:"block"}}>{d.villa}</Badge>
                        <button className="btn btn-sm" style={{background:"var(--gold)",color:"#fff",fontSize:9.5,padding:"6px 12px"}}>Check Out</button>
                      </div>
                    </div>
                    {transfer && (
                      <div style={{background:"var(--sand-light)",borderRadius:2,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11.5}}>
                        <span className="text-muted">Resort → Airport · {transfer.km} km</span>
                        <span style={{fontWeight:700,color:"var(--ocean)"}}>Transfer: ${fmt(tripCharge(transfer.km))}</span>
                      </div>
                    )}
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>

      {/* ── PRIVATE TRIPS ── */}
      <div className="card mb6">
        <div className="card-hd">
          <h2>🗺 Private Trips</h2>
          <button className="btn btn-primary btn-sm" onClick={()=>setShowArrangeModal(true)}>+ Arrange Trip</button>
        </div>
        {privateTrips.length === 0 ? (
          <div className="card-bd" style={{textAlign:"center",color:"var(--muted)",padding:"32px 0"}}>No private trips scheduled</div>
        ) : (
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Guest</th><th>Villa</th><th>Trip</th><th>Date</th><th>Time</th>
                  <th>Pax</th><th>Vehicle</th><th>Driver</th>
                  <th className="text-right">km</th>
                  <th className="text-right">Charge (USD)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {privateTrips.map(pt => {
                  const trip = TRIP_CATALOG.find(t => t.id === pt.tripId);
                  return (
                    <tr key={pt.id}>
                      <td style={{fontWeight:600}}>{pt.guest}</td>
                      <td><Badge style={{background:"rgba(26,58,74,0.08)",color:"var(--ocean)"}}>{pt.villa}</Badge></td>
                      <td>
                        <div style={{fontWeight:500,fontSize:12}}>{trip?.name ?? pt.tripId}</div>
                        <div className="text-muted" style={{fontSize:10.5}}>{trip?.duration}</div>
                      </td>
                      <td style={{fontFamily:"var(--serif)",fontSize:13,color:"var(--ocean)"}}>{pt.date}</td>
                      <td>{pt.time}</td>
                      <td style={{textAlign:"center"}}>{pt.pax}</td>
                      <td className="text-muted" style={{fontSize:11.5}}>{pt.vehicle}</td>
                      <td className="text-muted" style={{fontSize:11.5}}>{pt.driver}</td>
                      <td className="text-right" style={{color:"var(--muted)"}}>{trip?.km ?? "—"}</td>
                      <td className="text-right" style={{fontWeight:700,color:"var(--ocean)"}}>
                        {trip ? `$${fmt(tripCharge(trip.km))}` : "—"}
                      </td>
                      <td>
                        <Badge style={
                          pt.status==="confirmed" ? {background:"rgba(58,122,92,0.12)",color:"var(--success)"}
                          : pt.status==="completed" ? {background:"rgba(184,149,106,0.15)",color:"var(--gold)"}
                          : {background:"rgba(184,118,42,0.12)",color:"var(--warning)"}
                        }>{pt.status}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Trip Catalog reference */}
        <div style={{padding:"16px 22px",borderTop:"1px solid var(--border)",background:"var(--sand-light)"}}>
          <div style={{fontSize:9.5,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:10}}>Available Excursions · Rate ${fuelRate.toFixed(2)}/km</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {TRIP_CATALOG.map(t => (
              <div key={t.id} style={{background:"var(--white)",border:"1px solid var(--border)",borderRadius:2,padding:"7px 12px",fontSize:11.5}}>
                <span style={{fontWeight:600,color:"var(--ocean)"}}>{t.name}</span>
                <span className="text-muted"> · {t.km} km · </span>
                <span style={{fontWeight:600,color:"var(--coral)"}}>${tripCharge(t.km)}</span>
                <span className="text-muted"> · {t.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── IN-HOUSE GUESTS ── */}
      <div className="card">
        <div className="card-hd">
          <h2>In-House Guests</h2>
          <span className="text-muted" style={{fontSize:11}}>{inhouse.length} villas occupied</span>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr><th>Villa</th><th>Guest</th><th>Nationality</th><th>Check-in</th><th>Check-out</th><th>Nights</th><th>Channel</th><th>Trips</th></tr>
            </thead>
            <tbody>
              {inhouse.map(b => {
                const guestTrips = privateTrips.filter(p => p.bookingId === b.id).length;
                return (
                  <tr key={b.id}>
                    <td><Badge style={{background:"rgba(26,58,74,0.08)",color:"var(--ocean)"}}>{b.villa}</Badge></td>
                    <td style={{fontWeight:600}}>{b.guest}</td>
                    <td className="text-muted">{b.nationality}</td>
                    <td>{b.checkIn}</td>
                    <td>{b.checkOut}</td>
                    <td>{b.nights}</td>
                    <td className="text-muted" style={{fontSize:11.5}}>{b.channel}</td>
                    <td>
                      {guestTrips > 0
                        ? <Badge style={{background:"rgba(26,58,74,0.08)",color:"var(--ocean)"}}>{guestTrips} trip{guestTrips>1?"s":""}</Badge>
                        : <button className="btn btn-ghost btn-sm" onClick={()=>{setTripForm(f=>({...f,bookingId:String(b.id)}));setShowArrangeModal(true);}}>+ Trip</button>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ARRANGE PRIVATE TRIP MODAL ── */}
      {showArrangeModal && (
        <div
          style={{position:"fixed",inset:0,background:"rgba(26,58,74,0.5)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500}}
          onClick={()=>setShowArrangeModal(false)}
        >
          <div className="card" style={{width:560,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div className="card-hd">
              <div>
                <h2>Arrange Private Trip</h2>
                <div style={{fontSize:10.5,color:"var(--muted)",marginTop:2}}>Rate: ${fuelRate.toFixed(2)}/km · {TODAY_DISPLAY}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={()=>setShowArrangeModal(false)}>✕</button>
            </div>

            <div style={{padding:"22px 24px",display:"grid",gap:16}}>

              {/* Guest selector */}
              <div>
                <label style={{display:"block",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>In-House Guest</label>
                <select value={tripForm.bookingId} onChange={e=>setTripForm(f=>({...f,bookingId:e.target.value}))} style={inputStyle}>
                  <option value="">Select guest…</option>
                  {inhouse.map(b => (
                    <option key={b.id} value={b.id}>{b.guest} — {b.villa}</option>
                  ))}
                </select>
              </div>

              {/* Trip selector */}
              <div>
                <label style={{display:"block",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>Excursion</label>
                <select value={tripForm.tripId} onChange={e=>setTripForm(f=>({...f,tripId:e.target.value}))} style={inputStyle}>
                  <option value="">Select excursion…</option>
                  {TRIP_CATALOG.map(t => (
                    <option key={t.id} value={t.id}>{t.name} — {t.km} km — ${tripCharge(t.km)} — {t.duration}</option>
                  ))}
                </select>
                {tripForm.tripId && (
                  <div style={{marginTop:6,fontSize:11,color:"var(--muted)"}}>
                    {TRIP_CATALOG.find(t=>t.id===tripForm.tripId)?.desc}
                  </div>
                )}
              </div>

              {/* Date + Time */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <label style={{display:"block",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>Date</label>
                  <input type="text" placeholder="e.g. Jun 04" value={tripForm.date} onChange={e=>setTripForm(f=>({...f,date:e.target.value}))} style={inputStyle}/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>Departure Time</label>
                  <input type="time" value={tripForm.time} onChange={e=>setTripForm(f=>({...f,time:e.target.value}))} style={inputStyle}/>
                </div>
              </div>

              {/* Pax + Vehicle + Driver */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                <div>
                  <label style={{display:"block",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>Pax</label>
                  <input type="number" min={1} max={10} value={tripForm.pax} onChange={e=>setTripForm(f=>({...f,pax:parseInt(e.target.value)||1}))} style={inputStyle}/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>Vehicle</label>
                  <select value={tripForm.vehicle} onChange={e=>setTripForm(f=>({...f,vehicle:e.target.value}))} style={inputStyle}>
                    {VEHICLES.map(v=><option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display:"block",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>Driver</label>
                  <select value={tripForm.driver} onChange={e=>setTripForm(f=>({...f,driver:e.target.value}))} style={inputStyle}>
                    {DRIVERS.map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Charge preview */}
              {tripForm.tripId && (
                <div style={{background:"rgba(26,58,74,0.05)",border:"1px solid var(--border)",borderRadius:2,padding:"14px 18px"}}>
                  {(() => {
                    const trip = TRIP_CATALOG.find(t=>t.id===tripForm.tripId);
                    return (
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:3}}>Charge Preview</div>
                          <div style={{fontSize:12,color:"var(--muted)"}}>
                            {trip.km} km × ${fuelRate.toFixed(2)}/km
                          </div>
                        </div>
                        <div style={{fontFamily:"var(--serif)",fontSize:28,fontWeight:300,color:"var(--ocean)"}}>
                          ${fmt(tripCharge(trip.km))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Notes */}
              <div>
                <label style={{display:"block",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>Special Notes</label>
                <textarea
                  rows={2} placeholder="Any special requests, dietary needs, mobility requirements…"
                  value={tripForm.notes} onChange={e=>setTripForm(f=>({...f,notes:e.target.value}))}
                  style={{...inputStyle, resize:"vertical", lineHeight:1.6}}
                />
              </div>

              {/* Actions */}
              <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:4}}>
                <button className="btn btn-ghost btn-sm" onClick={()=>setShowArrangeModal(false)}>Cancel</button>
                <button
                  className="btn btn-primary"
                  onClick={submitTripForm}
                  disabled={!tripForm.bookingId || !tripForm.tripId}
                  style={{opacity:(!tripForm.bookingId||!tripForm.tripId)?0.45:1}}
                >
                  Confirm Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PAGE: ACCOUNTING ───────────────────────────────────────────────
function Accounting() {
  const [tab, setTab] = useState("expenses");
  const totalExpenses = EXPENSES.reduce((s,e) => s + e.amount, 0);

  // Source June figures from PNL_DATA for cross-page consistency
  const junePnl      = PNL_DATA.find(m => m.month === "Jun");
  const vatCollected = Math.round(MTD_REVENUE * 0.18);

  return (
    <div>
      <div className="kpi-row mb6">
        {[
          ["MTD Revenue",   `$${fmt(MTD_REVENUE)}`,        `AED ${fmtAED(MTD_REVENUE)}`,                              "var(--ocean-light)"],
          ["MTD Expenses",  `$${fmt(junePnl.expenses)}`,   "All categories",                                           "var(--coral)"     ],
          ["Gross Profit",  `$${fmt(junePnl.ebitda)}`,     `${Math.round(junePnl.ebitda/junePnl.revenue*100)}% margin`,"var(--success)"   ],
          ["VAT Collected", `$${fmt(vatCollected)}`,       "18% on invoices",                                          "var(--gold)"      ],
        ].map(([l,v,s,c]) => (
          <div key={l} className="kpi">
            <div className="kpi-label">{l}</div>
            <div className="kpi-value" style={{color:c==="var(--ocean-light)"?"var(--ocean)":c}}>{v}</div>
            <div className="kpi-sub">{s}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-hd">
          <h2>Accounting</h2>
          <button className="btn btn-primary btn-sm">+ Log Expense</button>
        </div>
        <div className="tabs" style={{padding:"0 22px",borderBottom:"1px solid var(--border)"}}>
          {["expenses","invoices","chart of accounts"].map(t => (
            <div key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{t}</div>
          ))}
        </div>

        {tab === "expenses" && (
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr><th>Date</th><th>Category</th><th>Description</th><th className="text-right">Amount (USD)</th><th>Status</th></tr>
              </thead>
              <tbody>
                {EXPENSES.map(e => (
                  <tr key={e.id}>
                    <td className="text-muted" style={{fontSize:11.5}}>{e.date}</td>
                    <td><Badge style={{background:"rgba(26,58,74,0.07)",color:"var(--ocean)"}}>{e.category}</Badge></td>
                    <td>{e.description}</td>
                    <td className="text-right" style={{fontWeight:600}}>${fmt(e.amount)}</td>
                    <td>
                      <Badge style={e.status==="approved"
                        ? {background:"rgba(58,122,92,0.12)",color:"var(--success)"}
                        : {background:"rgba(184,118,42,0.12)",color:"var(--warning)"}}>
                        {e.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                <tr style={{background:"var(--sand-light)"}}>
                  <td colSpan={3} style={{fontWeight:700,padding:"13px 14px",letterSpacing:1,fontSize:10,textTransform:"uppercase"}}>Total</td>
                  <td className="text-right" style={{fontWeight:700,fontSize:14}}>${fmt(totalExpenses)}</td>
                  <td/>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {tab === "invoices" && (
          <div className="card-bd">
            <div style={{textAlign:"center",padding:"32px 0",color:"var(--muted)"}}>
              <div style={{fontFamily:"var(--serif)",fontSize:20,fontWeight:300,marginBottom:8}}>Invoice Generator</div>
              <div style={{fontSize:12,marginBottom:18}}>Select a booking to generate a VAT invoice (18% VAT + $5/pax/night infrastructure levy)</div>
              <button className="btn btn-primary">Generate Invoice from Booking</button>
            </div>
          </div>
        )}

        {tab === "chart of accounts" && (
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Code</th><th>Account Name</th><th>Type</th><th>Category</th></tr></thead>
              <tbody>
                {[
                  ["4000","Villa Revenue",         "revenue",   "Room Revenue"     ],
                  ["4100","Spa Revenue",            "revenue",   "Ancillary"        ],
                  ["5000","Food Cost",              "expense",   "F&B Cost"         ],
                  ["5100","Payroll — Fixed Staff",  "expense",   "Payroll"          ],
                  ["5110","GM Revenue Share (3%)",  "expense",   "Payroll"          ],
                  ["5120","Employer NSSF (10%)",    "expense",   "Payroll"          ],
                  ["5300","Marketing & OTA",        "expense",   "Marketing"        ],
                  ["5700","OTA Commissions",         "expense",   "Distribution"    ],
                  ["1000","Cash",                   "asset",     "Current Assets"   ],
                  ["2100","VAT Payable",             "liability", "Tax Liabilities" ],
                ].map(([code,name,type,cat]) => (
                  <tr key={code}>
                    <td style={{fontFamily:"var(--serif)",fontSize:14,color:"var(--ocean)"}}>{code}</td>
                    <td style={{fontWeight:500}}>{name}</td>
                    <td>
                      <Badge style={
                        type==="revenue"   ? {background:"rgba(58,122,92,0.1)",color:"var(--success)"} :
                        type==="expense"   ? {background:"rgba(201,107,74,0.1)",color:"var(--coral)"} :
                                            {background:"rgba(26,58,74,0.08)",color:"var(--ocean)"}
                      }>{type}</Badge>
                    </td>
                    <td className="text-muted" style={{fontSize:11.5}}>{cat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── PAGE: PAYROLL ──────────────────────────────────────────────────
function Payroll() {
  const totalGross = EMPLOYEES.reduce((s,e) => s + e.salary, 0);
  const totalNSSF  = Math.round(totalGross * 0.10);
  const totalSDL   = Math.round(totalGross * 0.035);
  const totalCost  = totalGross + totalNSSF + totalSDL;

  return (
    <div>
      <div className="kpi-row mb6">
        {[
          ["Gross Payroll",       `$${fmt(totalGross)}`, `${EMPLOYEES.length} staff listed · Jun 2026`],
          ["Employer NSSF (10%)", `$${fmt(totalNSSF)}`,  "Tanzania NSSF"  ],
          ["SDL (3.5%)",          `$${fmt(totalSDL)}`,   "Skills Dev Levy"],
          ["Total Payroll Cost",  `$${fmt(totalCost)}`,  "Incl. all taxes"],
        ].map(([l,v,s]) => (
          <div key={l} className="kpi">
            <div className="kpi-label">{l}</div>
            <div className="kpi-value">{v}</div>
            <div className="kpi-sub">{s}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-hd">
          <h2>Employees & Payroll</h2>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-ghost btn-sm">Preview Payroll</button>
            <button className="btn btn-coral btn-sm">Run June Payroll</button>
          </div>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Role</th><th>Department</th><th>Type</th>
                <th className="text-right">Gross (USD/mo)</th>
                <th className="text-right">Employee NSSF (5%)</th>
                <th className="text-right">Net Pay</th>
                <th>Work Permit</th>
              </tr>
            </thead>
            <tbody>
              {EMPLOYEES.map(e => {
                const nssf = Math.round(e.salary * 0.05);
                const net  = e.salary - nssf;
                const expiringSoon = e.permit && new Date(e.permit) < new Date("2026-09-01");
                return (
                  <tr key={e.id}>
                    <td style={{fontWeight:600}}>{e.name}</td>
                    <td style={{fontSize:12}}>{e.role}</td>
                    <td><Badge style={{background:"rgba(26,58,74,0.07)",color:"var(--ocean)"}}>{e.dept}</Badge></td>
                    <td>
                      <Badge style={e.type==="expat"
                        ? {background:"rgba(201,107,74,0.1)",color:"var(--coral)"}
                        : {background:"rgba(58,122,92,0.1)",color:"var(--success)"}}>
                        {e.type}
                      </Badge>
                    </td>
                    <td className="text-right" style={{fontWeight:600}}>${fmt(e.salary)}</td>
                    <td className="text-right text-muted">${fmt(nssf)}</td>
                    <td className="text-right" style={{fontWeight:700,color:"var(--ocean)"}}>${fmt(net)}</td>
                    <td>
                      {e.permit
                        ? <span style={{fontSize:11,color:expiringSoon?"var(--danger)":"var(--muted)",fontWeight:expiringSoon?700:400}}>
                            {expiringSoon ? "⚠ " : ""}{e.permit}
                          </span>
                        : <span className="text-muted">Local</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── PAGE: P&L ──────────────────────────────────────────────────────
function PnL() {
  const activeMonths = PNL_DATA.filter(m => m.revenue > 0);
  const maxRev       = Math.max(...activeMonths.map(m => m.revenue));
  const ytdRevenue   = activeMonths.reduce((s,m) => s+m.revenue, 0);
  const ytdExpenses  = activeMonths.reduce((s,m) => s+m.expenses, 0);
  const ytdEbitda    = activeMonths.reduce((s,m) => s+m.ebitda, 0);
  const ytdMargin    = Math.round(ytdEbitda / ytdRevenue * 100);

  return (
    <div>
      <div className="card">
        <div className="card-hd">
          <h2>Profit & Loss — 2026</h2>
          <span className="text-muted" style={{fontSize:11}}>USD · High Season underway</span>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th className="text-right">Revenue</th>
                <th className="text-right">Expenses</th>
                <th className="text-right">EBITDA</th>
                <th className="text-right">Margin</th>
                <th style={{width:200}}>Revenue Bar</th>
              </tr>
            </thead>
            <tbody>
              {activeMonths.map(m => {
                const margin = Math.round(m.ebitda / m.revenue * 100);
                return (
                  <tr key={m.month}>
                    <td style={{fontFamily:"var(--serif)",fontSize:15,fontWeight:400,color:"var(--ocean)"}}>{m.month}</td>
                    <td className="text-right" style={{fontWeight:600}}>${fmt(m.revenue)}</td>
                    <td className="text-right text-muted">${fmt(m.expenses)}</td>
                    <td className="text-right" style={{fontWeight:700,color:m.ebitda>0?"var(--success)":"var(--danger)"}}>${fmt(m.ebitda)}</td>
                    <td className="text-right">
                      <span style={{color:margin>30?"var(--success)":margin>0?"var(--warning)":"var(--danger)",fontWeight:600}}>{margin}%</span>
                    </td>
                    <td style={{padding:"8px 14px"}}>
                      <div style={{height:6,background:"var(--sand)",borderRadius:1}}>
                        <div style={{height:6,width:`${Math.round(m.revenue/maxRev*100)}%`,background:"var(--ocean-light)",borderRadius:1}}/>
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr style={{background:"var(--sand-light)",fontWeight:700}}>
                <td style={{padding:"13px 14px",fontSize:10,letterSpacing:1.5,textTransform:"uppercase"}}>YTD Total</td>
                <td className="text-right">${fmt(ytdRevenue)}</td>
                <td className="text-right">${fmt(ytdExpenses)}</td>
                <td className="text-right" style={{color:"var(--success)"}}>${fmt(ytdEbitda)}</td>
                <td className="text-right" style={{color:"var(--success)"}}>{ytdMargin}%</td>
                <td/>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── PAGE: CHANNELS ─────────────────────────────────────────────────
function Channels() {
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <div style={{fontSize:11,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:4}}>Current Rate</div>
          <div style={{fontFamily:"var(--serif)",fontSize:32,color:"var(--ocean)",fontWeight:300}}>
            $1,400 <span style={{fontSize:18,color:"var(--muted)"}}>/ night · High Season</span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleSync} disabled={syncing}>
          {syncing ? "⟳ Syncing..." : "⇄ Push Rates to All Channels"}
        </button>
      </div>

      <div className="ch-grid mb6">
        {CHANNELS.map(ch => (
          <div key={ch.id} className="ch-card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div className="ch-name">{ch.name}</div>
                <div className="ch-meta">{ch.code}</div>
              </div>
              <Badge style={ch.status==="active"
                ? {background:"rgba(58,122,92,0.12)",color:"var(--success)"}
                : {background:"rgba(107,127,138,0.1)",color:"var(--muted)"}}>
                {ch.status}
              </Badge>
            </div>
            <div className="divider" style={{margin:"12px 0"}}/>
            <div className="ch-row">
              <span className="text-muted">Commission</span>
              <span style={{fontWeight:600,color:ch.commission===0?"var(--success)":"var(--ocean)"}}>
                {ch.commission}%{ch.commission===0?" (Direct)":""}
              </span>
            </div>
            <div className="ch-row">
              <span className="text-muted">2026 Bookings</span>
              <span style={{fontWeight:600}}>{ch.bookings}</span>
            </div>
            <div className="ch-row">
              <span className="text-muted">Last sync</span>
              <span style={{fontSize:11.5}}>
                {syncing && ch.status==="active" ? "Syncing…" : ch.lastSync}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PAGE: CHANNEL ACCOUNTS ─────────────────────────────────────────
const ACCOUNT_CONFIGS = [
  {
    id:1, code:"BDC", name:"Booking.com", logo:"🏨",
    fields:[
      { key:"propertyId",  label:"Property ID",    placeholder:"e.g. 1234567",       type:"text"     },
      { key:"apiKey",      label:"API Key",         placeholder:"••••••••••••••••",   type:"password" },
      { key:"apiSecret",   label:"API Secret",      placeholder:"••••••••••••••••",   type:"password" },
      { key:"xmlUsername", label:"XML Username",    placeholder:"partner_username",    type:"text"     },
    ],
    connected:true,
    notes:"Connectivity via Booking.com Connectivity API v2. Rates & availability push supported.",
  },
  {
    id:2, code:"ABB", name:"Airbnb Luxe", logo:"🏡",
    fields:[
      { key:"clientId",    label:"Client ID",      placeholder:"e.g. abc123def456",  type:"text"     },
      { key:"clientSecret",label:"Client Secret",  placeholder:"••••••••••••••••",   type:"password" },
      { key:"listingId",   label:"Listing ID",     placeholder:"e.g. 12345678",      type:"text"     },
    ],
    connected:true,
    notes:"OAuth 2.0 integration via Airbnb API for Hosts. Pricing & calendar sync enabled.",
  },
  {
    id:3, code:"EXP", name:"Expedia", logo:"✈",
    fields:[
      { key:"hotelId",     label:"Hotel ID (EAN)", placeholder:"e.g. 1234567",       type:"text"     },
      { key:"apiKey",      label:"API Key",         placeholder:"••••••••••••••••",   type:"password" },
      { key:"apiSecret",   label:"API Secret",      placeholder:"••••••••••••••••",   type:"password" },
    ],
    connected:true,
    notes:"EAN / Expedia Partner Central. Rate & availability push via EQC API.",
  },
  {
    id:4, code:"MMS", name:"Mr & Mrs Smith", logo:"💍",
    fields:[
      { key:"propertyCode",label:"Property Code",  placeholder:"e.g. HVN-ZNZ-01",   type:"text"     },
      { key:"apiKey",      label:"API Key",         placeholder:"••••••••••••••••",   type:"password" },
    ],
    connected:true,
    notes:"Manual rate submission via MMS Partner Portal. Auto-sync via webhook on rate change.",
  },
  {
    id:5, code:"AGO", name:"Agoda", logo:"🌏",
    fields:[
      { key:"hotelId",     label:"Hotel ID",        placeholder:"e.g. 7654321",      type:"text"     },
      { key:"apiKey",      label:"API Key",          placeholder:"••••••••••••••••",  type:"password" },
    ],
    connected:false,
    notes:"Agoda YCS (Your Channel Settings). Currently idle — credentials pending.",
  },
  {
    id:6, code:"IES", name:"i-Escape", logo:"🏝",
    fields:[
      { key:"propertyRef", label:"Property Ref",    placeholder:"e.g. ie-hvn-001",   type:"text"     },
      { key:"apiToken",    label:"API Token",        placeholder:"••••••••••••••••",  type:"password" },
    ],
    connected:false,
    notes:"i-Escape boutique portal. Manual approval required for rate changes.",
  },
  {
    id:7, code:"GHA", name:"Google Hotel Ads", logo:"🔍",
    fields:[
      { key:"hotelCenterId",  label:"Hotel Center ID",   placeholder:"e.g. 123-456-7890", type:"text" },
      { key:"accountId",      label:"Google Ads Account", placeholder:"e.g. 987-654-3210", type:"text" },
      { key:"feedId",         label:"Price Feed ID",      placeholder:"e.g. hvn_feed_01",  type:"text" },
    ],
    connected:true,
    notes:"Commission-free via Google Hotel Ads. Prices served from live rate feed.",
  },
  {
    id:8, code:"TRA", name:"TripAdvisor", logo:"🦉",
    fields:[
      { key:"locationId",  label:"Location ID",     placeholder:"e.g. g2345678",      type:"text"     },
      { key:"apiKey",      label:"API Key",          placeholder:"••••••••••••••••",   type:"password" },
    ],
    connected:true,
    notes:"TripAdvisor Connect API. Reviews pull + rate display enabled.",
  },
];

function ChannelAccounts() {
  const [selected, setSelected]   = useState(null);
  const [formVals, setFormVals]   = useState({});
  const [saved, setSaved]         = useState({});
  const [testing, setTesting]     = useState(false);
  const [testResult, setTestResult] = useState(null);

  const openAccount = (acct) => {
    setSelected(acct);
    setFormVals({});
    setTestResult(null);
  };

  const handleChange = (key, val) => setFormVals(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    setSaved(s => ({ ...s, [selected.id]: true }));
    setTestResult(null);
    setTimeout(() => setSaved(s => ({ ...s, [selected.id]: false })), 2000);
  };

  const handleTest = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult(selected.connected ? "success" : "error");
    }, 1800);
  };

  return (
    <div>
      <div style={{marginBottom:22,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <div style={{fontFamily:"var(--serif)",fontSize:13,color:"var(--muted)",letterSpacing:1,textTransform:"uppercase"}}>
            Configure API credentials for each distribution channel
          </div>
        </div>
        <div style={{display:"flex",gap:8,fontSize:11,color:"var(--muted)",alignItems:"center"}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:"var(--success)",display:"inline-block"}}/>
          {ACCOUNT_CONFIGS.filter(a=>a.connected).length} connected
          <span style={{width:8,height:8,borderRadius:"50%",background:"rgba(107,127,138,0.4)",display:"inline-block",marginLeft:8}}/>
          {ACCOUNT_CONFIGS.filter(a=>!a.connected).length} pending
        </div>
      </div>

      {/* Account cards grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        {ACCOUNT_CONFIGS.map(acct => (
          <div key={acct.id}
            className="card"
            onClick={() => openAccount(acct)}
            style={{padding:"18px 20px",cursor:"pointer",transition:"all 0.18s",borderLeft:`3px solid ${acct.connected?"var(--success)":"var(--border)"}`}}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="var(--shadow-lg)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="var(--shadow)"}
          >
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{fontSize:24}}>{acct.logo}</div>
              <Badge style={acct.connected
                ? {background:"rgba(58,122,92,0.12)",color:"var(--success)"}
                : {background:"rgba(107,127,138,0.1)",color:"var(--muted)"}}>
                {acct.connected ? "connected" : "pending"}
              </Badge>
            </div>
            <div style={{fontWeight:600,color:"var(--ocean)",fontSize:13}}>{acct.name}</div>
            <div style={{fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginTop:2}}>{acct.code}</div>
            <div style={{marginTop:10,fontSize:10.5,color:"var(--muted)"}}>
              {acct.fields.length} credential field{acct.fields.length!==1?"s":""}
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {selected && (
        <div
          style={{position:"fixed",inset:0,background:"rgba(26,58,74,0.45)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500}}
          onClick={() => { setSelected(null); setTestResult(null); }}
        >
          <div className="card" style={{width:520,maxHeight:"85vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            {/* Header */}
            <div className="card-hd" style={{gap:14}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:26}}>{selected.logo}</span>
                <div>
                  <div style={{fontFamily:"var(--serif)",fontSize:20,fontWeight:400,color:"var(--ocean)",lineHeight:1.1}}>{selected.name}</div>
                  <div style={{fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginTop:3}}>{selected.code} Account Configuration</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={()=>setSelected(null)}>✕</button>
            </div>

            <div style={{padding:"22px 24px"}}>
              {/* Status row */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,padding:"12px 16px",background:"var(--sand-light)",borderRadius:2}}>
                <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:selected.connected?"var(--success)":"var(--muted)"}}/>
                  <span style={{fontWeight:600,color:selected.connected?"var(--success)":"var(--muted)"}}>
                    {selected.connected ? "Connected & Active" : "Not Connected — Setup Required"}
                  </span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={handleTest} disabled={testing}>
                  {testing ? "Testing…" : "Test Connection"}
                </button>
              </div>

              {testResult && (
                <div style={{
                  marginBottom:16,padding:"10px 14px",borderRadius:2,fontSize:12,fontWeight:500,
                  background:testResult==="success"?"rgba(58,122,92,0.1)":"rgba(160,48,48,0.08)",
                  color:testResult==="success"?"var(--success)":"var(--danger)",
                  border:`1px solid ${testResult==="success"?"rgba(58,122,92,0.25)":"rgba(160,48,48,0.2)"}`,
                }}>
                  {testResult==="success"
                    ? "✓ Connection successful — API credentials verified"
                    : "✗ Connection failed — check credentials and try again"}
                </div>
              )}

              {/* Credential fields */}
              <div style={{display:"grid",gap:14,marginBottom:20}}>
                {selected.fields.map(f => (
                  <div key={f.key}>
                    <label style={{display:"block",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={formVals[f.key] ?? ""}
                      onChange={e => handleChange(f.key, e.target.value)}
                      style={{width:"100%",padding:"9px 12px",border:"1px solid var(--border)",borderRadius:2,fontSize:12.5,background:"var(--white)",color:"var(--text)",outline:"none",fontFamily:"var(--sans)"}}
                      onFocus={e=>e.target.style.borderColor="var(--ocean-light)"}
                      onBlur={e=>e.target.style.borderColor="var(--border)"}
                    />
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div style={{padding:"12px 14px",background:"rgba(74,143,168,0.06)",border:"1px solid rgba(74,143,168,0.15)",borderRadius:2,fontSize:11.5,color:"var(--muted)",marginBottom:20,lineHeight:1.7}}>
                ℹ {selected.notes}
              </div>

              {/* Actions */}
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button className="btn btn-ghost btn-sm" onClick={()=>setSelected(null)}>Cancel</button>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  style={saved[selected.id]?{background:"var(--success)"}:{}}
                >
                  {saved[selected.id] ? "✓ Saved" : "Save Credentials"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── NAV CONFIG ─────────────────────────────────────────────────────
const NAV = [
  { section:"Operations" },
  { id:"dashboard",  label:"Dashboard",       icon:"◈" },
  { id:"villas",     label:"Villa Status",    icon:"⌂" },
  { id:"bookings",   label:"Bookings",        icon:"📋" },
  { id:"arrivals",   label:"Arrivals & Deps", icon:"✈" },
  { section:"Finance" },
  { id:"accounting", label:"Accounting",      icon:"₿" },
  { id:"pnl",        label:"P & L",           icon:"📈" },
  { id:"payroll",    label:"Payroll",         icon:"👥" },
  { section:"Distribution" },
  { id:"channels",   label:"Channel Manager", icon:"🔗" },
  { id:"accounts",   label:"Engine Accounts", icon:"⚙" },
];

const PAGE_TITLES = {
  dashboard:  "Dashboard",
  villas:     "Villa Status",
  bookings:   "Reservations",
  arrivals:   "Arrivals & Departures",
  accounting: "Accounting",
  pnl:        "Profit & Loss",
  payroll:    "Payroll",
  channels:   "Channel Manager",
  accounts:   "Booking Engine Accounts",
};

// ── APP ────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard":  return <Dashboard />;
      case "villas":     return <VillaStatus />;
      case "bookings":   return <Bookings />;
      case "arrivals":   return <Arrivals />;
      case "accounting": return <Accounting />;
      case "pnl":        return <PnL />;
      case "payroll":    return <Payroll />;
      case "channels":   return <Channels />;
      case "accounts":   return <ChannelAccounts />;
      default:           return <Dashboard />;
    }
  };

  return (
    <>
      <style>{gStyles}</style>
      <div className="hvn-app">
        <aside className="sidebar">
          <div className="sb-logo">
            <div className="sb-hvn">HVN</div>
            <div className="sb-sub">Haven Resort · Zanzibar</div>
          </div>
          <nav className="sb-nav">
            {NAV.map((item, i) =>
              item.section ? (
                <div key={i} className="sb-section">{item.section}</div>
              ) : (
                <div key={item.id} className={`sb-item ${page===item.id?"active":""}`} onClick={()=>setPage(item.id)}>
                  <span className="sb-icon">{item.icon}</span>
                  {item.label}
                </div>
              )
            )}
          </nav>
          <div className="sb-footer">
            <div>HVN Haven Resort</div>
            <div>Zanzibar, Tanzania</div>
            <div style={{marginTop:6,color:"rgba(232,221,208,0.6)"}}>High Season · Jun 2026</div>
            <div style={{marginTop:2,color:"rgba(232,221,208,0.4)"}}>v1.0.0</div>
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <h1 className="topbar-title">{PAGE_TITLES[page]}</h1>
            <div className="topbar-right">
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11.5,color:"var(--muted)"}}>
                <div className="live-dot"/>
                System Online
              </div>
              <div className="user-badge">
                <div className="user-avatar">A</div>
                <div>
                  <div style={{fontSize:12,fontWeight:600,lineHeight:1.2}}>Admin</div>
                  <div style={{fontSize:10,color:"var(--muted)"}}>General Manager</div>
                </div>
              </div>
            </div>
          </header>
          <div className="content">
            {renderPage()}
          </div>
        </main>
      </div>
    </>
  );
}
