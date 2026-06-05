import React, { useState } from "react";

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

// ── ACCOUNTING DATA ────────────────────────────────────────────────
const ACCT_ROLES = {
  gm:         { id:"gm",         name:"Ahmed Salim",    title:"General Manager",    avatar:"AS", dept:null,         canApprove:true  },
  accountant: { id:"accountant", name:"Zainab Khalid",  title:"Senior Accountant",  avatar:"ZK", dept:null,         canApprove:false },
  fb_manager: { id:"fb_manager", name:"Pierre Leblanc", title:"F&B Manager",        avatar:"PL", dept:"F&B",        canApprove:false },
  operations: { id:"operations", name:"Carlos Rivera",  title:"Operations Manager", avatar:"CR", dept:"Maintenance", canApprove:false },
};

const EXPENSE_ENTRIES = [
  { id:1,  date:"Jun 01", dept:"F&B",          category:"Kitchen Produce",    description:"Seafood & fresh produce delivery",         amount:2840, status:"approved", by:"accountant", approvedBy:"gm",   rejNote:null },
  { id:2,  date:"Jun 01", dept:"F&B",          category:"Kitchen Supplies",   description:"Cooking gas — 6 cylinders",                amount:180,  status:"approved", by:"accountant", approvedBy:"gm",   rejNote:null },
  { id:3,  date:"Jun 02", dept:"F&B",          category:"Beverages",          description:"Wine & spirits restock — bar",             amount:1240, status:"approved", by:"accountant", approvedBy:"gm",   rejNote:null },
  { id:4,  date:"Jun 02", dept:"F&B",          category:"Kitchen Produce",    description:"Vegetables & dairy — local market",        amount:420,  status:"approved", by:"accountant", approvedBy:"gm",   rejNote:null },
  { id:5,  date:"Jun 03", dept:"F&B",          category:"Room Service Extra", description:"V01 Marco Rossi — late night snack tray",  amount:85,   status:"pending",  by:"accountant", approvedBy:null,   rejNote:null },
  { id:6,  date:"Jun 03", dept:"F&B",          category:"Room Service Extra", description:"V09 Hiroshi Tanaka — breakfast extension", amount:65,   status:"pending",  by:"accountant", approvedBy:null,   rejNote:null },
  { id:7,  date:"Jun 02", dept:"Utilities",    category:"Electricity",        description:"TANESCO bill — May",                       amount:1200, status:"approved", by:"accountant", approvedBy:"gm",   rejNote:null },
  { id:8,  date:"Jun 02", dept:"Maintenance",  category:"Equipment Repair",   description:"Pool pump replacement V04",                amount:380,  status:"approved", by:"operations", approvedBy:"gm",   rejNote:null },
  { id:9,  date:"Jun 03", dept:"Marketing",    category:"Digital Marketing",  description:"Instagram campaign — June",                amount:600,  status:"pending",  by:"gm",         approvedBy:null,   rejNote:null },
  { id:10, date:"Jun 03", dept:"Admin",        category:"Internet",           description:"Starlink subscription — June",             amount:150,  status:"approved", by:"accountant", approvedBy:"gm",   rejNote:null },
  { id:11, date:"Jun 03", dept:"Spa",          category:"Supplies",           description:"Treatment supplies restock",               amount:420,  status:"pending",  by:"operations", approvedBy:null,   rejNote:null },
  { id:12, date:"Jun 01", dept:"Housekeeping", category:"Laundry",            description:"Commercial laundry service — May",         amount:340,  status:"approved", by:"accountant", approvedBy:"gm",   rejNote:null },
  { id:13, date:"Jun 01", dept:"Housekeeping", category:"Amenities",          description:"Guest amenities restock — all villas",     amount:560,  status:"approved", by:"accountant", approvedBy:"gm",   rejNote:null },
  { id:14, date:"Jun 02", dept:"Grounds",      category:"Landscaping",        description:"Monthly garden maintenance contract",      amount:480,  status:"approved", by:"operations", approvedBy:"gm",   rejNote:null },
  { id:15, date:"Jun 01", dept:"HR",           category:"Staff Training",     description:"Food safety certification — 3 staff",      amount:220,  status:"rejected", by:"fb_manager", approvedBy:null,   rejNote:"Defer to July — budget constraint" },
  { id:16, date:"Jun 02", dept:"Security",     category:"Equipment",          description:"CCTV camera replacement — gate",           amount:290,  status:"approved", by:"operations", approvedBy:"gm",   rejNote:null },
  { id:17, date:"Jun 03", dept:"F&B",          category:"Kitchen Equipment",  description:"Commercial blender repair",                amount:145,  status:"approved", by:"accountant", approvedBy:"gm",   rejNote:null },
  { id:18, date:"Jun 01", dept:"Distribution", category:"OTA Commission",     description:"Booking.com — May commissions",            amount:2352, status:"approved", by:"system",     approvedBy:"auto", rejNote:null },
  { id:19, date:"Jun 01", dept:"Distribution", category:"OTA Commission",     description:"Airbnb — May commissions",                 amount:1650, status:"approved", by:"system",     approvedBy:"auto", rejNote:null },
  { id:20, date:"Jun 01", dept:"Distribution", category:"OTA Commission",     description:"Expedia — May commissions",                amount:1260, status:"approved", by:"system",     approvedBy:"auto", rejNote:null },
  { id:21, date:"Jun 03", dept:"Maintenance",  category:"Plumbing",           description:"V07 bathroom tap replacement",             amount:95,   status:"pending",  by:"operations", approvedBy:null,   rejNote:null },
  { id:22, date:"Jun 03", dept:"Admin",        category:"Office Supplies",    description:"Printer ink & stationery",                 amount:68,   status:"pending",  by:"accountant", approvedBy:null,   rejNote:null },
  { id:23, date:"Jun 02", dept:"F&B",          category:"Kitchen Produce",    description:"Spices & condiments — monthly",            amount:198,  status:"approved", by:"accountant", approvedBy:"gm",   rejNote:null },
  { id:24, date:"Jun 03", dept:"Operations",   category:"Fuel",               description:"Vehicle fuel — June allocation",           amount:320,  status:"approved", by:"operations", approvedBy:"gm",   rejNote:null },
  { id:25, date:"Jun 01", dept:"Spa",          category:"Products",           description:"Massage oils & lotions restock",           amount:380,  status:"approved", by:"operations", approvedBy:"gm",   rejNote:null },
  { id:26, date:"Jun 02", dept:"F&B",          category:"Beverages",          description:"Non-alcoholic beverages & soft drinks",    amount:210,  status:"approved", by:"accountant", approvedBy:"gm",   rejNote:null },
  { id:27, date:"Jun 03", dept:"HR",           category:"Payroll Advance",    description:"Staff advance request — Said Omar",        amount:200,  status:"pending",  by:"accountant", approvedBy:null,   rejNote:null },
  { id:28, date:"Jun 01", dept:"Housekeeping", category:"Cleaning Supplies",  description:"Industrial cleaning products — June",      amount:275,  status:"approved", by:"accountant", approvedBy:"gm",   rejNote:null },
  { id:29, date:"Jun 02", dept:"Admin",        category:"Insurance",          description:"Property insurance premium — Q2",          amount:1800, status:"approved", by:"accountant", approvedBy:"gm",   rejNote:null },
  { id:30, date:"Jun 03", dept:"Marketing",    category:"Photography",        description:"Property photo shoot — new listings",      amount:450,  status:"pending",  by:"gm",         approvedBy:null,   rejNote:null },
  { id:31, date:"Jun 02", dept:"Maintenance",  category:"Air Conditioning",   description:"AC service — V02, V05, V08",               amount:310,  status:"approved", by:"operations", approvedBy:"gm",   rejNote:null },
  { id:32, date:"Jun 03", dept:"F&B",          category:"Room Service Extra", description:"V02 Sarah & James Wu — anniversary cake",  amount:120,  status:"pending",  by:"accountant", approvedBy:null,   rejNote:null },
];
const EXPENSES = EXPENSE_ENTRIES;

const REVENUE_ENTRIES = [
  { id:1,  date:"Jun 01", category:"Villa Revenue",  description:"V01 Marco Rossi — 7 nights",              amount:9800,  ref:"HVN-2026-00041", invoiced:true  },
  { id:2,  date:"Jun 02", category:"Villa Revenue",  description:"V02 Sarah & James Wu — 7 nights",         amount:9800,  ref:"HVN-2026-00042", invoiced:true  },
  { id:3,  date:"May 30", category:"Villa Revenue",  description:"V04 Fatima Al-Rashid — 7 nights",         amount:9800,  ref:"HVN-2026-00043", invoiced:true  },
  { id:4,  date:"Jun 03", category:"Villa Revenue",  description:"V07 Lena Müller — 4 nights",              amount:5600,  ref:"HVN-2026-00044", invoiced:true  },
  { id:5,  date:"Jun 01", category:"Villa Revenue",  description:"V09 Hiroshi Tanaka — 9 nights",           amount:12600, ref:"HVN-2026-00045", invoiced:true  },
  { id:6,  date:"Jun 08", category:"Villa Revenue",  description:"V03 Charlotte Dubois — 7 nights (upcoming)", amount:9800, ref:"HVN-2026-00046", invoiced:false },
  { id:7,  date:"Jun 09", category:"Villa Revenue",  description:"V06 Ahmed Hassan — 5 nights (upcoming)",  amount:7000,  ref:"HVN-2026-00047", invoiced:false },
  { id:8,  date:"Jun 12", category:"Villa Revenue",  description:"V10 Sofia Petrova — 7 nights (upcoming)", amount:9800,  ref:"HVN-2026-00048", invoiced:false },
  { id:9,  date:"May 28", category:"Villa Revenue",  description:"V05 James Whitfield — 6 nights",          amount:6300,  ref:"HVN-2026-00039", invoiced:true  },
  { id:10, date:"May 25", category:"Villa Revenue",  description:"V08 Priya Nair — 8 nights",               amount:8400,  ref:"HVN-2026-00040", invoiced:true  },
  { id:11, date:"Jun 02", category:"Spa Revenue",    description:"Spa treatments — V01, V02, V09",          amount:1840,  ref:"SPA-JUN-03",      invoiced:true  },
  { id:12, date:"Jun 03", category:"F&B Revenue",    description:"À la carte dining — extra from full board",amount:640,  ref:"FB-JUN-03",       invoiced:true  },
  { id:13, date:"Jun 01", category:"Transport",      description:"Airport transfers × 2 + 2 excursions",    amount:630,   ref:"TRN-JUN-01",      invoiced:true  },
  { id:14, date:"Jun 03", category:"Room Service",   description:"Extra room service charges — 3 villas",   amount:270,   ref:"RS-JUN-03",       invoiced:false },
];

const PAYABLES = [
  { id:1, supplier:"Aqua Zanzibar Water Co.",    category:"Utilities",    amount:380,  dueDate:"Jun 01", status:"overdue"     },
  { id:2, supplier:"TANESCO",                    category:"Electricity",  amount:1200, dueDate:"Jun 10", status:"outstanding" },
  { id:3, supplier:"NSSF Tanzania",              category:"Payroll Tax",  amount:825,  dueDate:"Jun 05", status:"overdue"     },
  { id:4, supplier:"TRA (Tanzania Revenue)",     category:"VAT Payable",  amount:4802, dueDate:"Jun 20", status:"outstanding" },
  { id:5, supplier:"Zanzibar Spice Suppliers",   category:"F&B Cost",     amount:618,  dueDate:"Jun 08", status:"outstanding" },
  { id:6, supplier:"Island Laundry Services",    category:"Housekeeping", amount:340,  dueDate:"Jun 12", status:"outstanding" },
  { id:7, supplier:"OceanView Maintenance Ltd.", category:"Maintenance",  amount:475,  dueDate:"Jun 15", status:"outstanding" },
  { id:8, supplier:"AfriCom Media",              category:"Marketing",    amount:600,  dueDate:"Jun 18", status:"outstanding" },
  { id:9, supplier:"Google Ads (GHA)",           category:"Distribution", amount:0,    dueDate:"Jun 30", status:"prepaid"     },
];

const CHART_OF_ACCOUNTS = [
  { code:"4000", name:"Villa Revenue",           type:"revenue",   cat:"Room Revenue",         mtd:88900 },
  { code:"4100", name:"Spa Revenue",             type:"revenue",   cat:"Ancillary",             mtd:1840  },
  { code:"4200", name:"F&B Revenue",             type:"revenue",   cat:"Food & Beverage",       mtd:640   },
  { code:"4300", name:"Transport Revenue",       type:"revenue",   cat:"Ancillary",             mtd:630   },
  { code:"4400", name:"Room Service Revenue",    type:"revenue",   cat:"Room Ancillary",        mtd:270   },
  { code:"5000", name:"F&B Cost — Kitchen",      type:"expense",   cat:"Cost of Sales",         mtd:5303  },
  { code:"5050", name:"Room Service Extra Cost", type:"expense",   cat:"Cost of Sales",         mtd:270   },
  { code:"5100", name:"Payroll — Fixed Staff",   type:"expense",   cat:"Payroll",               mtd:3250  },
  { code:"5110", name:"Employer NSSF (10%)",     type:"expense",   cat:"Payroll",               mtd:325   },
  { code:"5120", name:"SDL (3.5%)",              type:"expense",   cat:"Payroll",               mtd:114   },
  { code:"5200", name:"Housekeeping Supplies",   type:"expense",   cat:"Operating",             mtd:1175  },
  { code:"5300", name:"OTA Commissions",         type:"expense",   cat:"Distribution",          mtd:5262  },
  { code:"5400", name:"Marketing & Advertising", type:"expense",   cat:"Marketing",             mtd:1050  },
  { code:"5500", name:"Maintenance & Repairs",   type:"expense",   cat:"Operating",             mtd:785   },
  { code:"5600", name:"Utilities",               type:"expense",   cat:"Operating",             mtd:1580  },
  { code:"5700", name:"Admin & General",         type:"expense",   cat:"Operating",             mtd:2018  },
  { code:"5800", name:"Spa Operating Costs",     type:"expense",   cat:"Operating",             mtd:800   },
  { code:"5900", name:"Grounds & Landscaping",   type:"expense",   cat:"Operating",             mtd:480   },
  { code:"6000", name:"Security",                type:"expense",   cat:"Operating",             mtd:290   },
  { code:"6100", name:"Operations — Fuel",       type:"expense",   cat:"Operating",             mtd:320   },
  { code:"1000", name:"Cash at Bank",            type:"asset",     cat:"Current Assets",        mtd:42600 },
  { code:"1100", name:"Accounts Receivable",     type:"asset",     cat:"Current Assets",        mtd:27200 },
  { code:"2000", name:"Accounts Payable",        type:"liability", cat:"Current Liabilities",   mtd:3813  },
  { code:"2100", name:"VAT Payable (18%)",       type:"liability", cat:"Tax Liabilities",       mtd:4802  },
  { code:"2200", name:"NSSF Payable",            type:"liability", cat:"Tax Liabilities",       mtd:825   },
];

const ROOM_SERVICE_INIT = [
  { id:1, villa:"V01", guest:"Marco Rossi",      date:"Jun 03", description:"Late night snack tray",          amount:85,  status:"pending" },
  { id:2, villa:"V02", guest:"Sarah & James Wu", date:"Jun 03", description:"Anniversary cake & sparkling",   amount:120, status:"pending" },
  { id:3, villa:"V09", guest:"Hiroshi Tanaka",   date:"Jun 03", description:"Breakfast extension — sushi set",amount:65,  status:"pending" },
];

const EXPENSE_CATEGORIES_BY_DEPT = {
  "F&B":          ["Kitchen Produce","Kitchen Supplies","Beverages","Kitchen Equipment","Room Service Extra"],
  "Housekeeping": ["Laundry","Amenities","Cleaning Supplies","Equipment"],
  "Maintenance":  ["Equipment Repair","Plumbing","Air Conditioning","General Repairs"],
  "Grounds":      ["Landscaping","Garden Supplies","Irrigation"],
  "Spa":          ["Supplies","Products","Equipment","Training"],
  "Admin":        ["Internet","Insurance","Office Supplies","Legal","Bank Charges"],
  "Marketing":    ["Digital Marketing","Photography","Print","Events"],
  "HR":           ["Staff Training","Payroll Advance","Recruitment","Welfare"],
  "Distribution": ["OTA Commission","Channel Management"],
  "Operations":   ["Fuel","Vehicle Maintenance","Equipment"],
  "Security":     ["Equipment","Personnel","Systems"],
  "Utilities":    ["Electricity","Water","Internet Infrastructure"],
};

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
  const todayArrivals = BOOKINGS.filter(b => b.checkIn === TODAY_LABEL);
  const activeBookings = BOOKINGS.filter(b => b.status === "confirmed" || b.status === "checked_in");
  const recentBookings = [...BOOKINGS].sort((a, b) => b.id - a.id).slice(0, 5);

  // Financial KPIs from accounting data
  const approvedExpenses = EXPENSE_ENTRIES.filter(e => e.status === "approved");
  const totalApproved    = approvedExpenses.reduce((s,e) => s + e.amount, 0);
  const pendingCount     = EXPENSE_ENTRIES.filter(e => e.status === "pending").length;
  const overdueCount     = PAYABLES.filter(p => p.status === "overdue").length;
  const overdueAmt       = PAYABLES.filter(p => p.status === "overdue").reduce((s,p) => s + p.amount, 0);
  const grossProfit      = MTD_REVENUE - totalApproved;
  const gpMargin         = Math.round(grossProfit / MTD_REVENUE * 100);
  const junePnl          = PNL_DATA.find(m => m.month === "Jun");
  const totalPayroll     = EMPLOYEES.reduce((s,e) => s + e.salary, 0);

  const villaStats = [
    { label:"Occupied",    val:VILLAS.filter(v=>v.status==="occupied").length,    color:"var(--ocean)"   },
    { label:"Available",   val:VILLAS.filter(v=>v.status==="available").length,   color:"var(--success)" },
    { label:"Cleaning",    val:VILLAS.filter(v=>v.status==="cleaning").length,    color:"var(--gold)"    },
    { label:"Maintenance", val:VILLAS.filter(v=>v.status==="maintenance").length, color:"var(--danger)"  },
  ];

  return (
    <div>
      {/* ── ROW 1: Operations KPIs ── */}
      <div style={{fontSize:9.5,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:10}}>Operations</div>
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

      {/* ── ROW 2: Finance KPIs ── */}
      <div style={{fontSize:9.5,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:10}}>Finance</div>
      <div className="kpi-row">
        <div className="kpi green">
          <div className="kpi-label">Gross Profit MTD</div>
          <div className="kpi-value">${fmt(grossProfit)}</div>
          <div className="kpi-sub">{gpMargin}% margin · Jun 2026</div>
        </div>
        <div className="kpi coral">
          <div className="kpi-label">Approved Expenses</div>
          <div className="kpi-value">${fmt(totalApproved)}</div>
          <div className="kpi-sub">{pendingCount} pending approval</div>
        </div>
        <div className="kpi gold">
          <div className="kpi-label">Monthly Payroll</div>
          <div className="kpi-value">${fmt(totalPayroll)}</div>
          <div className="kpi-sub">{EMPLOYEES.length} staff · incl. taxes ${fmt(Math.round(totalPayroll*0.135))}</div>
        </div>
        <div className="kpi" style={{borderLeft:overdueCount>0?"3px solid var(--danger)":""}}>
          <div className="kpi-label">Overdue Payables</div>
          <div className="kpi-value" style={{color:overdueCount>0?"var(--danger)":"var(--success)",fontSize:overdueCount>0?28:34}}>
            {overdueCount>0 ? `$${fmt(overdueAmt)}` : "None"}
          </div>
          <div className="kpi-sub">{overdueCount} supplier{overdueCount!==1?"s":""} overdue</div>
        </div>
      </div>

      {/* ── ROW 3: Distribution KPIs ── */}
      <div style={{fontSize:9.5,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:10}}>Distribution</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18,marginBottom:24}}>
        {[
          ["Total Channels",    CHANNELS.length,                                         "Active & idle",         "var(--ocean-light)"],
          ["Active Channels",   CHANNELS.filter(c=>c.status==="active").length,          "Syncing rates",         "var(--success)"    ],
          ["YTD Bookings",      CHANNELS.reduce((s,c)=>s+c.bookings,0),                  "All OTAs + direct",     "var(--ocean)"      ],
          ["Direct Booking %",  `${Math.round(CHANNELS.filter(c=>c.code==="DWB"||c.code==="GHA").reduce((s,c)=>s+c.bookings,0)/CHANNELS.reduce((s,c)=>s+c.bookings,0)*100)}%`, "Zero commission", "var(--gold)"],
        ].map(([l,v,s,c]) => (
          <div key={l} className="kpi">
            <div className="kpi-label">{l}</div>
            <div className="kpi-value" style={{color:c==="var(--ocean-light)"?"var(--ocean)":c,fontSize:28}}>{v}</div>
            <div className="kpi-sub">{s}</div>
          </div>
        ))}
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
  const [role, setRole]               = useState("gm");
  const [tab, setTab]                 = useState("overview");
  const [expenses, setExpenses]       = useState(EXPENSE_ENTRIES);
  const [payables, setPayables]       = useState(PAYABLES);
  const [roomSvc, setRoomSvc]         = useState(ROOM_SERVICE_INIT);
  const [showLogModal, setShowLogModal]   = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget]   = useState(null);
  const [rejectNote, setRejectNote]       = useState("");
  const [filterDept, setFilterDept]       = useState("all");
  const [filterStatus, setFilterStatus]   = useState("all");
  const [filterSearch, setFilterSearch]   = useState("");
  const [logForm, setLogForm] = useState({ date:TODAY_LABEL, dept:"", category:"", description:"", amount:"", supplier:"" });

  const cur        = ACCT_ROLES[role];
  const pendingAll = expenses.filter(e => e.status === "pending");
  const approved   = expenses.filter(e => e.status === "approved");
  const totalApproved = approved.reduce((s,e) => s + e.amount, 0);
  const overdue    = payables.filter(p => p.status === "overdue");
  const grossProfit = MTD_REVENUE - totalApproved;
  const gpMargin    = MTD_REVENUE > 0 ? Math.round(grossProfit / MTD_REVENUE * 100) : 0;
  const vatCollected = Math.round(MTD_REVENUE * 0.18);

  const tabDefs = [
    { id:"overview",  label:"Overview"         },
    { id:"revenue",   label:"Revenue"          },
    { id:"expenses",  label:"Expenses"         },
    { id:"approvals", label:"Approvals",   badge:pendingAll.length||null },
    { id:"payables",  label:"Payables",    badge:overdue.length||null    },
    { id:"invoices",  label:"Invoices"         },
    { id:"accounts",  label:"Chart of Accts"  },
    { id:"kitchen",   label:"Kitchen & F&B"   },
    { id:"payroll",   label:"Payroll"         },
  ];
  const tabAccess = {
    gm:         tabDefs.map(t=>t.id),
    accountant: tabDefs.map(t=>t.id),
    fb_manager: ["revenue","expenses","invoices","kitchen"],
    operations: ["expenses"],
  };
  const allowed = tabAccess[role] || [];
  const visible  = tabDefs.filter(t => allowed.includes(t.id));
  const active   = allowed.includes(tab) ? tab : allowed[0];

  const doApprove = (id) => setExpenses(p => p.map(e => e.id===id ? {...e,status:"approved",approvedBy:role} : e));
  const doApproveAll = () => setExpenses(p => p.map(e => e.status==="pending" ? {...e,status:"approved",approvedBy:role} : e));
  const doReject  = (id, note) => {
    setExpenses(p => p.map(e => e.id===id ? {...e,status:"rejected",rejNote:note} : e));
    setShowRejectModal(false); setRejectNote(""); setRejectTarget(null);
  };
  const markPaid  = (id) => setPayables(p => p.map(x => x.id===id ? {...x,status:"paid"} : x));
  const submitLog = () => {
    setExpenses(p => [...p, {
      id: p.length+1, date:logForm.date||TODAY_LABEL, dept:logForm.dept, category:logForm.category,
      description:logForm.description+(logForm.supplier?` — ${logForm.supplier}`:""),
      amount:parseFloat(logForm.amount)||0, status:"pending", by:role, approvedBy:null, rejNote:null,
    }]);
    setShowLogModal(false);
    setLogForm({ date:TODAY_LABEL, dept:"", category:"", description:"", amount:"", supplier:"" });
  };

  const filtered = expenses
    .filter(e => filterDept==="all"   || e.dept===filterDept)
    .filter(e => filterStatus==="all" || e.status===filterStatus)
    .filter(e => filterSearch===""    || e.description.toLowerCase().includes(filterSearch.toLowerCase()) || e.category.toLowerCase().includes(filterSearch.toLowerCase()));

  const iStyle = { width:"100%",padding:"8px 11px",border:"1px solid var(--border)",borderRadius:2,fontSize:12.5,background:"var(--white)",color:"var(--text)",outline:"none",fontFamily:"var(--sans)" };

  const revByCat = [...new Set(REVENUE_ENTRIES.map(r=>r.category))].map(cat=>({
    label:cat, value:REVENUE_ENTRIES.filter(r=>r.category===cat).reduce((s,r)=>s+r.amount,0),
    color:cat==="Villa Revenue"?"var(--ocean)":cat==="Spa Revenue"?"var(--gold)":cat==="F&B Revenue"?"var(--coral)":"var(--ocean-light)",
  }));
  const expByCat = Object.entries(
    approved.reduce((acc,e) => { acc[e.dept]=(acc[e.dept]||0)+e.amount; return acc; }, {})
  ).map(([label,value])=>({label,value,color:"var(--coral)"})).sort((a,b)=>b.value-a.value);

  const MiniBar = ({data}) => {
    const max = Math.max(...data.map(d=>d.value),1);
    return <div style={{display:"flex",flexDirection:"column",gap:7}}>
      {data.map(d=>(
        <div key={d.label}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
            <span className="text-muted">{d.label}</span>
            <span style={{fontWeight:600,color:d.color}}>${fmt(d.value)}</span>
          </div>
          <div style={{height:4,background:"var(--sand)",borderRadius:1}}>
            <div style={{height:4,width:`${Math.round(d.value/max*100)}%`,background:d.color,borderRadius:1,transition:"width 0.4s"}}/>
          </div>
        </div>
      ))}
    </div>;
  };

  const ApproveRejectBtns = ({e}) => e.status==="pending" ? (
    <div style={{display:"flex",gap:5}}>
      <button className="btn btn-sm" style={{background:"var(--success)",color:"#fff",fontSize:9,padding:"5px 9px"}} onClick={()=>doApprove(e.id)}>✓ Approve</button>
      <button className="btn btn-sm" style={{background:"var(--danger)",color:"#fff",fontSize:9,padding:"5px 9px"}} onClick={()=>{setRejectTarget(e);setShowRejectModal(true);}}>✕ Reject</button>
    </div>
  ) : null;

  return (
    <div>
      {/* Role switcher */}
      <div className="card mb4" style={{padding:"10px 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <span style={{fontSize:9.5,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>Viewing as</span>
          {Object.values(ACCT_ROLES).map(r => (
            <button key={r.id} className={`btn btn-sm ${role===r.id?"btn-primary":"btn-ghost"}`} onClick={()=>setRole(r.id)}>
              <span style={{width:19,height:19,borderRadius:"50%",background:role===r.id?"rgba(255,255,255,0.2)":"var(--sand)",color:role===r.id?"#fff":"var(--ocean)",fontSize:8.5,fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center",marginRight:5}}>{r.avatar}</span>
              {r.title}
            </button>
          ))}
          <span style={{marginLeft:"auto",fontSize:10.5,color:"var(--muted)"}}>
            {cur.canApprove ? "✓ Can approve expenses" : "Submit & view only"}
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-row mb6">
        <div className="kpi"><div className="kpi-label">MTD Revenue</div><div className="kpi-value">${fmt(MTD_REVENUE)}</div><div className="kpi-sub">AED {fmtAED(MTD_REVENUE)}</div></div>
        <div className="kpi coral"><div className="kpi-label">Approved Expenses</div><div className="kpi-value">${fmt(totalApproved)}</div><div className="kpi-sub">{approved.length} entries · {pendingAll.length} pending</div></div>
        <div className="kpi green"><div className="kpi-label">Gross Profit</div><div className="kpi-value">${fmt(grossProfit)}</div><div className="kpi-sub">{gpMargin}% margin · Jun 2026</div></div>
        <div className="kpi gold">
          <div className="kpi-label">Overdue Payables</div>
          <div className="kpi-value" style={{color:overdue.length>0?"var(--danger)":"var(--success)"}}>{overdue.length>0?`$${fmt(overdue.reduce((s,p)=>s+p.amount,0))}`:"None"}</div>
          <div className="kpi-sub">{overdue.length} supplier{overdue.length!==1?"s":""} overdue</div>
        </div>
      </div>

      <div className="card">
        <div className="card-hd">
          <h2>Accounting</h2>
          {(role==="accountant"||role==="gm") && <button className="btn btn-primary btn-sm" onClick={()=>setShowLogModal(true)}>+ Log Expense</button>}
        </div>
        <div className="tabs" style={{padding:"0 22px",borderBottom:"1px solid var(--border)"}}>
          {visible.map(t => (
            <div key={t.id} className={`tab ${active===t.id?"active":""}`} onClick={()=>setTab(t.id)}
              style={{display:"inline-flex",alignItems:"center",gap:5}}>
              {t.label}
              {t.badge ? <span style={{background:"var(--coral)",color:"#fff",borderRadius:8,fontSize:8,padding:"1px 5px",fontWeight:700,lineHeight:1.4}}>{t.badge}</span> : null}
            </div>
          ))}
        </div>

        {/* OVERVIEW */}
        {active==="overview" && (
          <div className="card-bd">
            <div className="grid2 mb6">
              <div><div style={{fontSize:9.5,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:12}}>Revenue by Category</div><MiniBar data={revByCat}/></div>
              <div><div style={{fontSize:9.5,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:12}}>Expenses by Department</div><MiniBar data={expByCat.slice(0,8)}/></div>
            </div>
            <div className="divider"/>
            <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
              {[["Total Revenue",`$${fmt(MTD_REVENUE)}`,"var(--ocean)"],["Approved Expenses",`$${fmt(totalApproved)}`,"var(--coral)"],["Gross Profit",`$${fmt(grossProfit)}`,"var(--success)"],["GP Margin",`${gpMargin}%`,gpMargin>35?"var(--success)":gpMargin>20?"var(--warning)":"var(--danger)"],["VAT Collected",`$${fmt(vatCollected)}`,"var(--muted)"]].map(([l,v,c])=>(
                <div key={l} style={{flex:"1 1 110px",background:"var(--sand-light)",padding:"12px 14px",borderRadius:2}}>
                  <div style={{fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>{l}</div>
                  <div style={{fontFamily:"var(--serif)",fontSize:22,fontWeight:300,color:c}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVENUE */}
        {active==="revenue" && (
          <div className="tbl-wrap"><table>
            <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Ref</th><th className="text-right">Amount</th><th>Invoice</th></tr></thead>
            <tbody>
              {REVENUE_ENTRIES.map(r=>(
                <tr key={r.id}>
                  <td className="text-muted" style={{fontSize:11.5}}>{r.date}</td>
                  <td><Badge style={{background:"rgba(58,122,92,0.1)",color:"var(--success)"}}>{r.category}</Badge></td>
                  <td style={{fontSize:12}}>{r.description}</td>
                  <td style={{fontFamily:"var(--serif)",fontSize:12.5,color:"var(--ocean)"}}>{r.ref}</td>
                  <td className="text-right" style={{fontWeight:700,color:"var(--ocean)"}}>${fmt(r.amount)}</td>
                  <td><Badge style={r.invoiced?{background:"rgba(58,122,92,0.1)",color:"var(--success)"}:{background:"rgba(184,118,42,0.1)",color:"var(--warning)"}}>{r.invoiced?"invoiced":"pending"}</Badge></td>
                </tr>
              ))}
              <tr style={{background:"var(--sand-light)",fontWeight:700}}>
                <td colSpan={4} style={{padding:"13px 14px",fontSize:10,letterSpacing:1.5,textTransform:"uppercase"}}>Total Revenue MTD</td>
                <td className="text-right" style={{fontSize:14}}>${fmt(REVENUE_ENTRIES.reduce((s,r)=>s+r.amount,0))}</td>
                <td/>
              </tr>
            </tbody>
          </table></div>
        )}

        {/* EXPENSES */}
        {active==="expenses" && (
          <div>
            <div className="filter-bar">
              <select value={filterDept} onChange={e=>setFilterDept(e.target.value)}>
                <option value="all">All Departments</option>
                {Object.keys(EXPENSE_CATEGORIES_BY_DEPT).map(d=><option key={d}>{d}</option>)}
              </select>
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <input placeholder="Search…" value={filterSearch} onChange={e=>setFilterSearch(e.target.value)} style={{minWidth:150}}/>
              <span style={{marginLeft:"auto",fontSize:11,color:"var(--muted)"}}>{filtered.length} entries</span>
            </div>
            <div className="tbl-wrap"><table>
              <thead><tr><th>Date</th><th>Dept</th><th>Category</th><th>Description</th><th>By</th><th className="text-right">Amount</th><th>Status</th>{cur.canApprove&&<th>Actions</th>}</tr></thead>
              <tbody>
                {filtered.map(e=>(
                  <tr key={e.id}>
                    <td className="text-muted" style={{fontSize:11.5}}>{e.date}</td>
                    <td><Badge style={{background:"rgba(26,58,74,0.07)",color:"var(--ocean)"}}>{e.dept}</Badge></td>
                    <td style={{fontSize:11.5}}>{e.category}</td>
                    <td>
                      <div style={{fontSize:12}}>{e.description}</div>
                      {e.rejNote&&<div style={{fontSize:10.5,color:"var(--danger)",marginTop:2}}>↩ {e.rejNote}</div>}
                    </td>
                    <td style={{fontSize:10.5,color:"var(--muted)"}}>{ACCT_ROLES[e.by]?.title??e.by}</td>
                    <td className="text-right" style={{fontWeight:600}}>${fmt(e.amount)}</td>
                    <td><Badge style={e.status==="approved"?{background:"rgba(58,122,92,0.12)",color:"var(--success)"}:e.status==="rejected"?{background:"rgba(160,48,48,0.1)",color:"var(--danger)"}:{background:"rgba(184,118,42,0.1)",color:"var(--warning)"}}>{e.status}</Badge></td>
                    {cur.canApprove&&<td><ApproveRejectBtns e={e}/></td>}
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        )}

        {/* APPROVALS */}
        {active==="approvals" && (
          pendingAll.length===0
            ? <div className="card-bd" style={{textAlign:"center",padding:"40px 0",color:"var(--muted)"}}><div style={{fontFamily:"var(--serif)",fontSize:22,marginBottom:8}}>All clear</div><div style={{fontSize:12}}>No pending expenses</div></div>
            : <div>
                <div className="filter-bar">
                  <span style={{fontSize:12,color:"var(--ocean)",fontWeight:600}}>{pendingAll.length} item{pendingAll.length!==1?"s":""} awaiting approval</span>
                  <div style={{flex:1}}/>
                  {cur.canApprove&&<button className="btn btn-primary btn-sm" onClick={doApproveAll}>✓ Approve All</button>}
                </div>
                <div className="tbl-wrap"><table>
                  <thead><tr><th>Date</th><th>Dept</th><th>Category</th><th>Description</th><th>Submitted by</th><th className="text-right">Amount</th>{cur.canApprove&&<th>Actions</th>}</tr></thead>
                  <tbody>
                    {pendingAll.map(e=>(
                      <tr key={e.id}>
                        <td className="text-muted" style={{fontSize:11.5}}>{e.date}</td>
                        <td><Badge style={{background:"rgba(26,58,74,0.07)",color:"var(--ocean)"}}>{e.dept}</Badge></td>
                        <td style={{fontSize:11.5}}>{e.category}</td>
                        <td style={{fontSize:12}}>{e.description}</td>
                        <td style={{fontSize:10.5,color:"var(--muted)"}}>{ACCT_ROLES[e.by]?.title??e.by}</td>
                        <td className="text-right" style={{fontWeight:600}}>${fmt(e.amount)}</td>
                        {cur.canApprove&&<td><ApproveRejectBtns e={e}/></td>}
                      </tr>
                    ))}
                  </tbody>
                </table></div>
              </div>
        )}

        {/* PAYABLES */}
        {active==="payables" && (
          <div className="tbl-wrap"><table>
            <thead><tr><th>Supplier</th><th>Category</th><th className="text-right">Amount</th><th>Due Date</th><th>Status</th>{cur.canApprove&&<th>Action</th>}</tr></thead>
            <tbody>
              {payables.filter(p=>p.status!=="paid").map(p=>(
                <tr key={p.id} style={p.status==="overdue"?{background:"rgba(160,48,48,0.03)"}:{}}>
                  <td style={{fontWeight:600}}>{p.supplier}</td>
                  <td className="text-muted" style={{fontSize:11.5}}>{p.category}</td>
                  <td className="text-right" style={{fontWeight:700,color:p.status==="overdue"?"var(--danger)":"var(--ocean)"}}>${fmt(p.amount)}</td>
                  <td style={{color:p.status==="overdue"?"var(--danger)":"var(--text)",fontWeight:p.status==="overdue"?700:400}}>{p.dueDate}{p.status==="overdue"?" ⚠":""}</td>
                  <td><Badge style={p.status==="overdue"?{background:"rgba(160,48,48,0.1)",color:"var(--danger)"}:p.status==="prepaid"?{background:"rgba(58,122,92,0.1)",color:"var(--success)"}:{background:"rgba(184,118,42,0.1)",color:"var(--warning)"}}>{p.status}</Badge></td>
                  {cur.canApprove&&<td>{p.status!=="prepaid"&&<button className="btn btn-ghost btn-sm" onClick={()=>markPaid(p.id)}>Mark Paid</button>}</td>}
                </tr>
              ))}
              {payables.filter(p=>p.status==="paid").length>0&&<>
                <tr style={{background:"var(--sand-light)"}}><td colSpan={cur.canApprove?6:5} style={{padding:"8px 14px",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)"}}>Paid This Period</td></tr>
                {payables.filter(p=>p.status==="paid").map(p=>(
                  <tr key={p.id} style={{opacity:0.5}}>
                    <td style={{fontWeight:500}}>{p.supplier}</td>
                    <td className="text-muted" style={{fontSize:11.5}}>{p.category}</td>
                    <td className="text-right">${fmt(p.amount)}</td>
                    <td>{p.dueDate}</td>
                    <td><Badge style={{background:"rgba(58,122,92,0.1)",color:"var(--success)"}}>paid</Badge></td>
                    {cur.canApprove&&<td/>}
                  </tr>
                ))}
              </>}
            </tbody>
          </table></div>
        )}

        {/* INVOICES */}
        {active==="invoices" && (
          <div>
            <div style={{padding:"10px 22px 0",fontSize:11,color:"var(--muted)"}}>VAT 18% · Infrastructure levy $5/pax/night · All amounts USD</div>
            <div className="tbl-wrap"><table>
              <thead><tr><th>Booking Ref</th><th>Guest</th><th>Villa</th><th>Nights</th><th className="text-right">Room Rate</th><th className="text-right">VAT 18%</th><th className="text-right">Levy</th><th className="text-right">Total</th><th>Status</th>{role==="gm"&&<th>PDF</th>}</tr></thead>
              <tbody>
                {BOOKINGS.filter(b=>b.status!=="cancelled").map(b=>{
                  const vat=Math.round(b.total*0.18); const levy=b.nights*5; const grand=b.total+vat+levy;
                  return (
                    <tr key={b.id}>
                      <td style={{fontFamily:"var(--serif)",fontSize:13.5,color:"var(--ocean)"}}>{b.ref.replace("HVN-2026-","#")}</td>
                      <td style={{fontWeight:600,fontSize:12}}>{b.guest}</td>
                      <td><Badge style={{background:"rgba(26,58,74,0.08)",color:"var(--ocean)"}}>{b.villa}</Badge></td>
                      <td style={{textAlign:"center"}}>{b.nights}</td>
                      <td className="text-right">${fmt(b.total)}</td>
                      <td className="text-right text-muted">${fmt(vat)}</td>
                      <td className="text-right text-muted">${levy}</td>
                      <td className="text-right" style={{fontWeight:700,color:"var(--ocean)"}}>${fmt(grand)}</td>
                      <td><StatusBadge status={b.status}/></td>
                      {role==="gm"&&<td><button className="btn btn-ghost btn-sm" style={{fontSize:9}}>⬇ PDF</button></td>}
                    </tr>
                  );
                })}
              </tbody>
            </table></div>
          </div>
        )}

        {/* CHART OF ACCOUNTS */}
        {active==="accounts" && (
          <div className="tbl-wrap"><table>
            <thead><tr><th>Code</th><th>Account Name</th><th>Type</th><th>Category</th><th className="text-right">MTD Balance</th></tr></thead>
            <tbody>
              {["revenue","expense","asset","liability"].map(type=>{
                const rows=CHART_OF_ACCOUNTS.filter(a=>a.type===type);
                return (
                  <React.Fragment key={type}>
                    <tr style={{background:"var(--sand-light)"}}>
                      <td colSpan={4} style={{padding:"10px 14px",fontSize:9.5,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",fontWeight:700}}>{type}</td>
                      <td className="text-right" style={{fontWeight:700,color:"var(--ocean)",padding:"10px 14px"}}>${fmt(rows.reduce((s,a)=>s+a.mtd,0))}</td>
                    </tr>
                    {rows.map(a=>(
                      <tr key={a.code}>
                        <td style={{fontFamily:"var(--serif)",fontSize:14,color:"var(--ocean)",paddingLeft:24}}>{a.code}</td>
                        <td style={{fontWeight:500}}>{a.name}</td>
                        <td><Badge style={a.type==="revenue"?{background:"rgba(58,122,92,0.1)",color:"var(--success)"}:a.type==="expense"?{background:"rgba(201,107,74,0.1)",color:"var(--coral)"}:a.type==="asset"?{background:"rgba(26,58,74,0.08)",color:"var(--ocean)"}:{background:"rgba(184,118,42,0.1)",color:"var(--warning)"}}>{a.type}</Badge></td>
                        <td className="text-muted" style={{fontSize:11.5}}>{a.cat}</td>
                        <td className="text-right" style={{fontWeight:600}}>${fmt(a.mtd)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table></div>
        )}

        {/* KITCHEN & F&B */}
        {active==="kitchen" && (
          <div>
            <div style={{padding:"12px 22px",background:"rgba(201,107,74,0.04)",borderBottom:"1px solid var(--border)",fontSize:11.5,color:"var(--muted)",lineHeight:1.7}}>
              <strong style={{color:"var(--ocean)"}}>Full Board Policy:</strong> All villa rates include full board (breakfast, lunch & dinner). Room service charges below are <em>extras beyond the included meal package</em>. The Senior Accountant is responsible for entering all kitchen & F&B expenses.
            </div>
            <div className="card-bd">
              {/* Kitchen expense summary */}
              {(()=>{
                const fbExp=expenses.filter(e=>e.dept==="F&B");
                const fbTotal=fbExp.filter(e=>e.status==="approved").reduce((s,e)=>s+e.amount,0);
                const fbPending=fbExp.filter(e=>e.status==="pending").length;
                return (
                  <div style={{marginBottom:22}}>
                    <div style={{fontSize:9.5,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:12}}>Kitchen Expenses — Jun 2026</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
                      {[["F&B Entries",fbExp.length,"var(--ocean)"],["Approved Total",`$${fmt(fbTotal)}`,"var(--coral)"],["Pending Review",fbPending,"var(--warning)"]].map(([l,v,c])=>(
                        <div key={l} style={{background:"var(--sand-light)",padding:"12px 16px",borderRadius:2}}>
                          <div style={{fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:4}}>{l}</div>
                          <div style={{fontFamily:"var(--serif)",fontSize:24,fontWeight:300,color:c}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="tbl-wrap"><table>
                      <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>By</th><th className="text-right">Amount</th><th>Status</th>{cur.canApprove&&<th>Actions</th>}</tr></thead>
                      <tbody>
                        {fbExp.map(e=>(
                          <tr key={e.id}>
                            <td className="text-muted" style={{fontSize:11.5}}>{e.date}</td>
                            <td><Badge style={{background:"rgba(201,107,74,0.1)",color:"var(--coral)"}}>{e.category}</Badge></td>
                            <td style={{fontSize:12}}>{e.description}</td>
                            <td style={{fontSize:10.5,color:"var(--muted)"}}>{ACCT_ROLES[e.by]?.title??e.by}</td>
                            <td className="text-right" style={{fontWeight:600}}>${fmt(e.amount)}</td>
                            <td><Badge style={e.status==="approved"?{background:"rgba(58,122,92,0.12)",color:"var(--success)"}:e.status==="rejected"?{background:"rgba(160,48,48,0.1)",color:"var(--danger)"}:{background:"rgba(184,118,42,0.1)",color:"var(--warning)"}}>{e.status}</Badge></td>
                            {cur.canApprove&&<td><ApproveRejectBtns e={e}/></td>}
                          </tr>
                        ))}
                      </tbody>
                    </table></div>
                  </div>
                );
              })()}

              <div className="divider"/>

              {/* Room service extras */}
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div>
                    <div style={{fontSize:9.5,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>Room Service Extra Charges</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:3}}>Additional items beyond full board — billed to guest folio</div>
                  </div>
                  {(role==="accountant"||role==="gm")&&(
                    <button className="btn btn-ghost btn-sm" onClick={()=>{
                      const inhouse=BOOKINGS.filter(b=>b.status==="checked_in");
                      if(inhouse.length>0){
                        const b=inhouse[0];
                        setRoomSvc(p=>[...p,{id:p.length+1,villa:b.villa,guest:b.guest,date:TODAY_LABEL,description:"",amount:0,status:"pending"}]);
                      }
                    }}>+ Add Charge</button>
                  )}
                </div>
                <div className="tbl-wrap"><table>
                  <thead><tr><th>Villa</th><th>Guest</th><th>Date</th><th>Description</th><th className="text-right">Amount</th><th>Status</th></tr></thead>
                  <tbody>
                    {roomSvc.map(rs=>(
                      <tr key={rs.id}>
                        <td><Badge style={{background:"rgba(26,58,74,0.08)",color:"var(--ocean)"}}>{rs.villa||"—"}</Badge></td>
                        <td style={{fontWeight:600,fontSize:12}}>{rs.guest||"—"}</td>
                        <td className="text-muted" style={{fontSize:11.5}}>{rs.date}</td>
                        <td style={{fontSize:12}}>{rs.description||<span className="text-muted">No description</span>}</td>
                        <td className="text-right" style={{fontWeight:700,color:"var(--coral)"}}>${fmt(rs.amount)}</td>
                        <td><Badge style={rs.status==="pending"?{background:"rgba(184,118,42,0.1)",color:"var(--warning)"}:{background:"rgba(58,122,92,0.1)",color:"var(--success)"}}>{rs.status}</Badge></td>
                      </tr>
                    ))}
                    <tr style={{background:"var(--sand-light)"}}>
                      <td colSpan={4} style={{fontWeight:700,padding:"11px 14px",fontSize:10,letterSpacing:1,textTransform:"uppercase"}}>Total Extra Room Service</td>
                      <td className="text-right" style={{fontWeight:700,color:"var(--coral)"}}>${fmt(roomSvc.reduce((s,r)=>s+r.amount,0))}</td>
                      <td/>
                    </tr>
                  </tbody>
                </table></div>
              </div>
            </div>
          </div>
        )}

        {/* PAYROLL (inside Accounting) */}
        {active==="payroll" && (()=>{
          const tGross=EMPLOYEES.reduce((s,e)=>s+e.salary,0);
          const tNSSF=Math.round(tGross*0.10);
          const tSDL=Math.round(tGross*0.035);
          const tCost=tGross+tNSSF+tSDL;
          return (
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,padding:"22px 22px 0"}}>
                {[["Gross Payroll",`$${fmt(tGross)}`,`${EMPLOYEES.length} staff · Jun 2026`],["Employer NSSF (10%)",`$${fmt(tNSSF)}`,"Tanzania NSSF"],["SDL (3.5%)",`$${fmt(tSDL)}`,"Skills Dev Levy"],["Total Payroll Cost",`$${fmt(tCost)}`,"Incl. all taxes"]].map(([l,v,s])=>(
                  <div key={l} style={{background:"var(--sand-light)",padding:"14px 16px",borderRadius:2}}>
                    <div style={{fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>{l}</div>
                    <div style={{fontFamily:"var(--serif)",fontSize:24,fontWeight:300,color:"var(--ocean)"}}>{v}</div>
                    <div style={{fontSize:10.5,color:"var(--muted)",marginTop:3}}>{s}</div>
                  </div>
                ))}
              </div>
              <div style={{padding:"14px 22px",display:"flex",justifyContent:"flex-end",gap:10}}>
                <button className="btn btn-ghost btn-sm">Preview Payroll</button>
                {role==="gm"&&<button className="btn btn-coral btn-sm">Run June Payroll</button>}
              </div>
              <div className="tbl-wrap"><table>
                <thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Type</th><th className="text-right">Gross (USD/mo)</th><th className="text-right">Emp. NSSF (5%)</th><th className="text-right">Net Pay</th><th>Work Permit</th></tr></thead>
                <tbody>
                  {EMPLOYEES.map(e=>{
                    const nssf=Math.round(e.salary*0.05); const net=e.salary-nssf;
                    const exp=e.permit&&new Date(e.permit)<new Date("2026-09-01");
                    return (
                      <tr key={e.id}>
                        <td style={{fontWeight:600}}>{e.name}</td>
                        <td style={{fontSize:12}}>{e.role}</td>
                        <td><Badge style={{background:"rgba(26,58,74,0.07)",color:"var(--ocean)"}}>{e.dept}</Badge></td>
                        <td><Badge style={e.type==="expat"?{background:"rgba(201,107,74,0.1)",color:"var(--coral)"}:{background:"rgba(58,122,92,0.1)",color:"var(--success)"}}>{e.type}</Badge></td>
                        <td className="text-right" style={{fontWeight:600}}>${fmt(e.salary)}</td>
                        <td className="text-right text-muted">${fmt(nssf)}</td>
                        <td className="text-right" style={{fontWeight:700,color:"var(--ocean)"}}>${fmt(net)}</td>
                        <td>{e.permit?<span style={{fontSize:11,color:exp?"var(--danger)":"var(--muted)",fontWeight:exp?700:400}}>{exp?"⚠ ":""}{e.permit}</span>:<span className="text-muted">Local</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table></div>
            </div>
          );
        })()}
      </div>

      {/* LOG EXPENSE MODAL */}
      {showLogModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(26,58,74,0.5)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500}} onClick={()=>setShowLogModal(false)}>
          <div className="card" style={{width:500,maxHeight:"88vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div className="card-hd"><h2>Log Expense</h2><button className="btn btn-ghost btn-sm" onClick={()=>setShowLogModal(false)}>✕</button></div>
            <div style={{padding:"22px 24px",display:"grid",gap:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <label style={{display:"block",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>Date</label>
                  <input type="text" value={logForm.date} onChange={e=>setLogForm(f=>({...f,date:e.target.value}))} style={iStyle}/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>Amount (USD)</label>
                  <input type="number" min={0} placeholder="0.00" value={logForm.amount} onChange={e=>setLogForm(f=>({...f,amount:e.target.value}))} style={iStyle}/>
                </div>
              </div>
              <div>
                <label style={{display:"block",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>Department</label>
                <select value={logForm.dept} onChange={e=>setLogForm(f=>({...f,dept:e.target.value,category:""}))} style={iStyle}>
                  <option value="">Select department…</option>
                  {(cur.dept?[cur.dept]:Object.keys(EXPENSE_CATEGORIES_BY_DEPT)).map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{display:"block",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>Category</label>
                <select value={logForm.category} onChange={e=>setLogForm(f=>({...f,category:e.target.value}))} style={iStyle} disabled={!logForm.dept}>
                  <option value="">Select category…</option>
                  {(EXPENSE_CATEGORIES_BY_DEPT[logForm.dept]||[]).map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{display:"block",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>Description</label>
                <input type="text" placeholder="Brief description…" value={logForm.description} onChange={e=>setLogForm(f=>({...f,description:e.target.value}))} style={iStyle}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>Supplier / Reference</label>
                <input type="text" placeholder="e.g. Zanzibar Spice Suppliers" value={logForm.supplier} onChange={e=>setLogForm(f=>({...f,supplier:e.target.value}))} style={iStyle}/>
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:4}}>
                <button className="btn btn-ghost btn-sm" onClick={()=>setShowLogModal(false)}>Cancel</button>
                <button className="btn btn-primary" disabled={!logForm.dept||!logForm.category||!logForm.description||!logForm.amount} style={{opacity:(!logForm.dept||!logForm.category||!logForm.description||!logForm.amount)?0.45:1}} onClick={submitLog}>Submit for Approval</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {showRejectModal&&rejectTarget&&(
        <div style={{position:"fixed",inset:0,background:"rgba(26,58,74,0.5)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600}} onClick={()=>{setShowRejectModal(false);setRejectNote("");setRejectTarget(null);}}>
          <div className="card" style={{width:440}} onClick={e=>e.stopPropagation()}>
            <div className="card-hd"><h2>Reject Expense</h2><button className="btn btn-ghost btn-sm" onClick={()=>{setShowRejectModal(false);setRejectNote("");}}>✕</button></div>
            <div style={{padding:"22px 24px"}}>
              <div style={{background:"var(--sand-light)",borderRadius:2,padding:"12px 14px",marginBottom:16}}>
                <div style={{fontSize:11.5,fontWeight:600,color:"var(--ocean)",marginBottom:4}}>{rejectTarget.description}</div>
                <div style={{display:"flex",gap:16,fontSize:11,color:"var(--muted)"}}>
                  <span>{rejectTarget.dept} · {rejectTarget.category}</span>
                  <span style={{fontWeight:600,color:"var(--coral)"}}>${fmt(rejectTarget.amount)}</span>
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:9.5,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>Rejection Reason (required)</label>
                <textarea rows={3} placeholder="Explain why this expense is being rejected…" value={rejectNote} onChange={e=>setRejectNote(e.target.value)} style={{...iStyle,resize:"vertical",lineHeight:1.6}}/>
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button className="btn btn-ghost btn-sm" onClick={()=>{setShowRejectModal(false);setRejectNote("");}}>Cancel</button>
                <button className="btn btn-sm" style={{background:"var(--danger)",color:"#fff",opacity:!rejectNote?0.45:1}} disabled={!rejectNote} onClick={()=>doReject(rejectTarget.id,rejectNote)}>Confirm Rejection</button>
              </div>
            </div>
          </div>
        </div>
      )}
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
