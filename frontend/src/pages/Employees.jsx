import { useEffect, useState } from "react";
import {
  fetchEmployees,
  fetchTasks,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
  });
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [editing, setEditing] = useState(null);
  const [openProfile, setOpenProfile] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setEmployees(await fetchEmployees());
    setTasks(await fetchTasks());
  };

  const workload = (id) => {
    const total = tasks.filter(t => t.assignedEmployee?._id === id).length;
    return total;
  };

  const workloadColor = (n) => {
    if (n >= 6) return "#ff4d4d";  // High load - Red
    if (n >= 3) return "#ffbd44";  // Medium - Yellow
    return "#4cd964";             // Low - Green
  };

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) &&
    (department === "All" || e.department === department)
  );

  const submit = async () => {
    if (editing) {
      await updateEmployee(editing, form);
    } else {
      await createEmployee(form);
    }
    setForm({ name:"",email:"",role:"",department:"" });
    setEditing(null);
    loadData();
  };

  const del = async (id) => {
    if (window.confirm("Delete employee?")) {
      await deleteEmployee(id);
      loadData();
    }
  };

  return (
    <div style={{padding:"30px"}}>
      <h1>Employees</h1>

      {/* Filters */}
      <div style={{display:"flex",gap:"15px",marginBottom:"15px"}}>
        <input
          placeholder="Search employee..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <select value={department} onChange={e=>setDepartment(e.target.value)}>
          <option>All</option>
          {[...new Set(employees.map(e=>e.department))].map(d=>(
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Form */}
      <div style={box}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input placeholder="Role" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}/>
        <input placeholder="Department" value={form.department} onChange={e=>setForm({...form,department:e.target.value})}/>
        <button onClick={submit}>{editing?"Update":"Add"}</button>
      </div>

      <table border="1" cellPadding="10" style={{marginTop:"20px",width:"100%"}}>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Dept</th><th>Workload</th><th>Actions</th></tr></thead>
        <tbody>
        {filtered.map(e=>(
          <tr key={e._id}>
            <td onClick={()=>setOpenProfile(e)} style={{cursor:"pointer",color:"#0066ff"}}>{e.name}</td>
            <td>{e.email}</td>
            <td>{e.role}</td>
            <td>{e.department}</td>
            <td><b style={{color:workloadColor(workload(e._id))}}>{workload(e._id)}</b></td>
            <td>
              <button onClick={()=>{setEditing(e._id);setForm(e)}}>Edit</button>
              <button onClick={()=>del(e._id)}>Delete</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      {/* Profile Modal */}
      {openProfile && (
        <div style={modalBg} onClick={()=>setOpenProfile(null)}>
          <div style={modal} onClick={e=>e.stopPropagation()}>
            <h2>{openProfile.name}</h2>
            <p><b>Email:</b> {openProfile.email}</p>
            <p><b>Role:</b> {openProfile.role}</p>
            <p><b>Department:</b> {openProfile.department}</p>

            <h3>Assigned Tasks</h3>
            <ul>
              {tasks.filter(t=>t.assignedEmployee?._id===openProfile._id)
                 .map(t=> <li key={t._id}>{t.title}</li>)}
            </ul>

            <button onClick={()=>setOpenProfile(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const box = {display:"flex",gap:"10px",marginBottom:"15px"};
const modalBg={position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.6)",display:"flex",justifyContent:"center",alignItems:"center"};
const modal={background:"#fff",padding:"30px",borderRadius:"10px",width:"400px"};
