import React from "react";

export default function NotificationPanel({ tasks, open, setOpen }) {

  const overdue = tasks.filter(t => new Date(t.dueDate) < new Date());
  const today = tasks.filter(t => t.dueDate?.substring(0,10) === new Date().toISOString().substring(0,10));
  const high = tasks.filter(t => t.priority === "High");

  return (
    <div style={{
      position:"fixed",
      top:0,
      right: open ? 0 : "-300px",
      width:"300px",
      height:"100vh",
      background:"#fff",
      boxShadow:"-5px 0 15px rgba(0,0,0,0.2)",
      transition:"0.4s",
      padding:"20px",
      zIndex:999
    }}>

      <h2 style={{marginBottom:"15px"}}>🔔 Notifications</h2>
      <button onClick={()=>setOpen(false)} style={{
        background:"#e63946",color:"#fff",padding:"5px 10px",
        borderRadius:"6px",border:"none",cursor:"pointer"
      }}>Close</button>

      <hr style={{margin:"15px 0"}}/>

      <h3>🔥 Overdue</h3>
      {overdue.length===0? <p>None</p>: overdue.map(t=><p>• {t.title}</p>)}

      <h3>🟨 Due Today</h3>
      {today.length===0? <p>None</p>: today.map(t=><p>• {t.title}</p>)}

      <h3>🟥 High Priority</h3>
      {high.length===0? <p>None</p>: high.map(t=><p>• {t.title}</p>)}

    </div>
  );
}
