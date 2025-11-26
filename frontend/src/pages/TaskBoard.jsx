import React, { useEffect, useState } from "react";
import { fetchTasks, updateTask } from "../services/api";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");                 // 🔍 NEW
  const [priorityFilter, setPriorityFilter] = useState("All"); // 🏷 NEW

  useEffect(() => { load(); }, []);
  const load = () => fetchTasks().then(setTasks);

  const moveTask = async (id, status) => {
    await updateTask(id, { status });
    load();
  };

  /* ========= COLUMN STRUCTURE ========== */
  const Column = ({ title, status, color }) => (
    <div style={{ ...col, borderTop: `5px solid ${color}` }}>
      <h3 style={{ color, marginBottom: "12px" }}>{title}</h3>

      {tasks
        .filter(t => t.status === status)
        .filter(t => priorityFilter === "All" || t.priority === priorityFilter)
        .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
        .map(t => (
          <div
            key={t._id}
            draggable
            onDragEnd={() => moveTask(t._id, status)}
            style={{
              ...card,
              borderLeft:`6px solid ${
                t.priority==="High" ? "#e74c3c" :
                t.priority==="Medium" ? "#f1c40f" : "#2ecc71"
              }`
            }}
          >
            <b>{t.title}</b>
            <p style={{fontSize:"12px"}}>{t.description}</p>

            {/* 🔥 Due Date Warning */}
            <span style={{
              fontSize:"11px",
              fontWeight:"bold",
              color:new Date(t.dueDate)<new Date()?"red":"#2c3e50"
            }}>
              Due: {t.dueDate?.substring(0,10)}
            </span>

            {/* ⚡ Quick Move Buttons */}
            <div style={{marginTop:"6px",display:"flex",gap:"6px"}}>
              <button onClick={()=>moveTask(t._id,"To Do")}       style={btn}>To Do</button>
              <button onClick={()=>moveTask(t._id,"In Progress")} style={btn}>Progress</button>
              <button onClick={()=>moveTask(t._id,"Done")}        style={btn}>Done</button>
            </div>

            <small style={{
              display:"block",marginTop:"6px",
              color:t.priority==="High"?"#e74c3c":t.priority==="Medium"?"#e67e22":"#27ae60",
              fontWeight:"bold"
            }}>
              Priority: {t.priority}
            </small>
          </div>
        ))}
    </div>
  );

  /* ============ RENDER UI ============== */
  return (
    <>
      {/* 🔍 SEARCH + FILTER BAR */}
      <div style={{padding:"15px 40px",display:"flex",gap:"15px",alignItems:"center"}}>
        
        <input 
          placeholder="Search task name..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          style={{padding:"8px",width:"250px",borderRadius:"6px",border:"1px solid #ccc"}}
        />

        <select 
          value={priorityFilter} 
          onChange={e=>setPriorityFilter(e.target.value)}
          style={{padding:"8px",borderRadius:"6px",border:"1px solid #ccc"}}
        >
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {/* MAIN BOARD */}
      <div style={board}>
        <Column title="📌 To Do"        status="To Do"        color="#ff7e39"/>
        <Column title="⚙ In Progress" status="In Progress"  color="#2e86de"/>
        <Column title="✅ Done"       status="Done"         color="#27ae60"/>
      </div>
    </>
  );
}

/* ⚡ Styling */
const board = {display:"flex",gap:"25px",padding:"30px",background:"#f6f8ff",minHeight:"90vh"};
const col   = {flex:1,padding:"20px",background:"#fff",borderRadius:"12px",boxShadow:"0 0 10px #d9d9d9"};
const card  = {background:"#eaf3ff",padding:"12px",marginBottom:"12px",borderRadius:"10px",cursor:"grab"};
const btn   = {background:"#3498db",color:"#fff",padding:"4px 8px",border:"none",borderRadius:"6px",fontSize:"11px",cursor:"pointer"};
