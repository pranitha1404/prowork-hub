import { useEffect, useState } from "react";
import {
  fetchTasks,
  fetchEmployees,
  createTask,
  updateTask,
  deleteTask,
} from "../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [sideTask, setSideTask] = useState(null);

  const [form, setForm] = useState({
    title: "", description: "", status:"To Do",
    priority:"Medium", dueDate:"", assignedEmployee:"", comments:[]
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setTasks(await fetchTasks());
    setEmployees(await fetchEmployees());
  };

  const save = async () => {
    if (sideTask) {
      await updateTask(sideTask._id, form);
    } else {
      await createTask(form);
    }
    load();
    reset();
  };

  const reset = ()=>{ setForm({title:"",description:"",status:"To Do",priority:"Medium",dueDate:"",assignedEmployee:"",comments:[]}); setSideTask(null); };

  const badge = s => ({color:"#fff",padding:"3px 6px",borderRadius:"8px",background:s==="Done"?"#22c55e":s==="In Progress"?"#3b82f6":"#f97316"});
  const prBadge = p => ({padding:"3px 6px",borderRadius:"8px",background:p==="High"?"#fee2e2":p==="Medium"?"#fef3c7":"#dcfce7",color:p==="High"?"#991b1b":p==="Medium"?"#854d0e":"#166534"});

  const addComment = (txt)=>{
    const updated=[...(form.comments||[]), {msg:txt,time:new Date().toLocaleString()}];
    setForm({...form,comments:updated});
  };

  return (
    <div style={{padding:"30px"}}>
      <h1>Tasks</h1>

      {/* CREATE / EDIT */}
      <div style={{display:"flex",gap:"12px",marginBottom:"20px"}}>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
        <input placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
        <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
          <option>To Do</option><option>In Progress</option><option>Done</option>
        </select>
        <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
        <input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/>
        <select value={form.assignedEmployee} onChange={e=>setForm({...form,assignedEmployee:e.target.value})}>
          <option>Select employee</option>
          {employees.map(e=> <option key={e._id} value={e._id}>{e.name}</option>)}
        </select>
        <button onClick={save}>{sideTask?"Update":"Add"}</button>
      </div>

      {/* TABLE */}
      <table border="1" cellPadding="10" width="100%">
      <thead><tr><th>Title</th><th>Status</th><th>Priority</th><th>Due</th><th>Employee</th><th>Comments</th><th>Actions</th></tr></thead>
      <tbody>
      {tasks.map(t=>(
        <tr key={t._id}>
          <td onClick={()=>{ setSideTask(t); setForm(t); }} style={{cursor:"pointer",color:"blue"}}>{t.title}</td>
          <td><span style={badge(t.status)}>{t.status}</span></td>
          <td><span style={prBadge(t.priority)}>{t.priority}</span></td>
          <td style={{color:new Date(t.dueDate)<new Date()?"red":""}}>
            {t.dueDate? t.dueDate.slice(0,10):"-"}
          </td>
          <td>{t.assignedEmployee?.name||"None"}</td>
          <td>{t.comments?.length||0}</td>
          <td>
            <button onClick={()=>{setSideTask(t);setForm(t);}}>Open</button>
            <button onClick={()=>deleteTask(t._id).then(load)}>Delete</button>
          </td>
        </tr>
      ))}
      </tbody>
      </table>

      {/* SIDE COMMENT PANEL */}
      {sideTask && (
        <div style={side}>
          <h2>{sideTask.title}</h2>
          <h4>Comments</h4>
          <div style={{height:"200px",overflow:"auto",border:"1px solid #ddd",padding:"10px"}}>
            {form.comments?.map((c,i)=>(
              <p key={i}><b>{c.time}</b> — {c.msg}</p>
            ))}
          </div>

          <input placeholder="Add comment..." onKeyDown={e=>e.key==="Enter"&&addComment(e.target.value)}/>
          <button onClick={()=>setSideTask(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

const side={position:"fixed",top:0,right:0,width:"300px",height:"100%",background:"#fff",
padding:"20px",boxShadow:"-3px 0px 12px rgba(0,0,0,0.2)"};
