const express = require("express");
const cors    = require("cors");
const crypto  = require("crypto");
const fs      = require("fs");
const path    = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "data.json");

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    }
  } catch (e) {}
  return { users: [], incidents: [], nextUserId: 1, nextIncidentId: 1 };
}

function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

let db = loadData();
console.log("✅ Database ready — data.json");

function hashPassword(pw) { return crypto.createHash("sha256").update(pw).digest("hex"); }
function makeInitials(name) { return name.trim().split(" ").map(w=>w[0].toUpperCase()).join("").slice(0,2); }
function now() { return new Date().toISOString().replace("T"," ").slice(0,19); }
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

// ── AUTH ──
app.post("/api/auth/register", (req,res) => {
  const {name,phone,email,role,password} = req.body;
  if (!name)     return res.status(400).json({success:false,message:"Full name is required"});
  if (!phone)    return res.status(400).json({success:false,message:"Phone number is required"});
  if (!email)    return res.status(400).json({success:false,message:"Email is required"});
  if (!isValidEmail(email)) return res.status(400).json({success:false,message:"Invalid email address"});
  if (!password||password.length<6) return res.status(400).json({success:false,message:"Password must be at least 6 characters"});
  if (!["citizen","police","emergency"].includes(role)) return res.status(400).json({success:false,message:"Invalid role"});
  const emailLower = email.trim().toLowerCase();
  if (db.users.find(u=>u.email===emailLower)) return res.status(409).json({success:false,message:"An account with this email already exists"});
  const user = {id:db.nextUserId++,name:name.trim(),initials:makeInitials(name),phone:phone.trim(),email:emailLower,role,password:hashPassword(password),joined_at:now()};
  db.users.push(user);
  saveData();
  const {password:_,...safeUser} = user;
  return res.status(201).json({success:true,message:"Account created successfully",data:safeUser});
});

app.post("/api/auth/login", (req,res) => {
  const {email,password} = req.body;
  if (!email||!password) return res.status(400).json({success:false,message:"Email and password are required"});
  const user = db.users.find(u=>u.email===email.trim().toLowerCase()&&u.password===hashPassword(password));
  if (!user) return res.status(401).json({success:false,message:"Incorrect email or password"});
  const {password:_,...safeUser} = user;
  return res.json({success:true,message:"Login successful",data:safeUser});
});

app.get("/api/users", (req,res) => {
  return res.json({success:true,data:db.users.map(({password,...u})=>u)});
});

// ── INCIDENTS ──
app.get("/api/incidents", (req,res) => {
  const {status,priority,reporter_id,type} = req.query;
  let results = [...db.incidents].reverse();
  if (status)      results = results.filter(i=>i.status===status);
  if (priority)    results = results.filter(i=>i.priority===priority);
  if (reporter_id) results = results.filter(i=>i.reporter_id===parseInt(reporter_id));
  if (type)        results = results.filter(i=>i.type===type);
  return res.json({success:true,data:results});
});

app.get("/api/incidents/:id", (req,res) => {
  const inc = db.incidents.find(i=>i.id===parseInt(req.params.id));
  if (!inc) return res.status(404).json({success:false,message:"Incident not found"});
  return res.json({success:true,data:inc});
});

app.post("/api/incidents", (req,res) => {
  const {type,description,location,priority,reporter_id,reporter_name} = req.body;
  if (!type)        return res.status(400).json({success:false,message:"Incident type is required"});
  if (!description) return res.status(400).json({success:false,message:"Description is required"});
  if (!location)    return res.status(400).json({success:false,message:"Location is required"});
  if (!reporter_id) return res.status(400).json({success:false,message:"reporter_id is required"});
  const safePriority = ["High","Medium","Low"].includes(priority)?priority:"Medium";
  const timestamp = now();
  const incident = {id:db.nextIncidentId++,type,description,location,priority:safePriority,status:"Pending",reporter_id:parseInt(reporter_id),reporter_name:reporter_name||"Anonymous",notes:"",created_at:timestamp,updated_at:timestamp};
  db.incidents.push(incident);
  saveData();
  return res.status(201).json({success:true,message:"Incident reported successfully",data:incident});
});

app.put("/api/incidents/:id", (req,res) => {
  const {status,notes} = req.body;
  const inc = db.incidents.find(i=>i.id===parseInt(req.params.id));
  if (!inc) return res.status(404).json({success:false,message:"Incident not found"});
  if (status&&!["Pending","In Progress","Resolved"].includes(status)) return res.status(400).json({success:false,message:"Invalid status"});
  if (status) inc.status=status;
  if (notes!==undefined) inc.notes=notes;
  inc.updated_at=now();
  saveData();
  return res.json({success:true,message:"Incident updated",data:inc});
});

app.delete("/api/incidents/:id", (req,res) => {
  const idx = db.incidents.findIndex(i=>i.id===parseInt(req.params.id));
  if (idx===-1) return res.status(404).json({success:false,message:"Incident not found"});
  db.incidents.splice(idx,1);
  saveData();
  return res.json({success:true,message:"Incident deleted"});
});

// ── STATS ──
app.get("/api/stats", (req,res) => {
  const i = db.incidents;
  return res.json({success:true,data:{total:i.length,pending:i.filter(x=>x.status==="Pending").length,in_progress:i.filter(x=>x.status==="In Progress").length,resolved:i.filter(x=>x.status==="Resolved").length,high_priority:i.filter(x=>x.priority==="High"&&x.status!=="Resolved").length,accidents:i.filter(x=>x.type==="Accident").length,total_users:db.users.length}});
});

app.get("/api/health", (req,res) => {
  res.json({success:true,message:"OK",data:{status:"running",app:"TrafficWatch RW",version:"1.0"}});
});

// ── ORIGINAL ROUTES ──
app.get("/reports", (req,res) => res.json([...db.incidents].reverse()));
app.post("/reports", (req,res) => {
  const {type,description,location} = req.body;
  const t=now();
  const inc={id:db.nextIncidentId++,type:type||"Other",description:description||"",location:location||"Unknown",priority:"Medium",status:"Pending",reporter_id:0,reporter_name:"Anonymous",notes:"",created_at:t,updated_at:t};
  db.incidents.push(inc);
  saveData();
  res.json({message:"Report submitted successfully",report:inc});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚦 TrafficWatch RW backend running on http://localhost:${PORT}`);
  console.log("   GET  /api/health");
  console.log("   POST /api/auth/register");
  console.log("   POST /api/auth/login");
  console.log("   GET  /api/incidents");
  console.log("   POST /api/incidents");
  console.log("   PUT  /api/incidents/:id");
  console.log("   GET  /api/stats");
});