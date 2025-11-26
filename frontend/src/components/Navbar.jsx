import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchTasks } from "../services/api";
import NotificationPanel from "./NotificationPanel"; // 🔔 ADDED

export default function Navbar() {
  const [alertCount, setAlertCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);   // 🔥 NEW
  const [tasks, setTasks] = useState([]);              // 🔥 NEW
  const route = useLocation();

  useEffect(() => {
    fetchTasks().then(data => {
      setTasks(data);
      const overdue = data.filter(t => t.dueDate && new Date(t.dueDate) < new Date());
      setAlertCount(overdue.length);
    });
  }, []);

  return (
    <>
      <nav style={{
        padding:"15px 30px",
        background: darkMode ? "#111" : "#0F1C2E",
        color:"#fff", display:"flex",
        justifyContent:"space-between", alignItems:"center"
      }}>

        <h2>ProWork Hub</h2>

        <div style={{display:"flex",gap:"25px",alignItems:"center"}}>
          <Nav to="/" path={route.pathname}>Dashboard</Nav>
          <Nav to="/employees" path={route.pathname}>Employees</Nav>
          <Nav to="/tasks" path={route.pathname}>Tasks</Nav>
          <Nav to="/taskboard" path={route.pathname}>Task Board</Nav>
	  <Nav to="/calendar" path={route.pathname}>Calendar</Nav>

          {/* 🔔 OPEN PANEL */}
          <div style={{position:"relative",cursor:"pointer"}} onClick={()=>setPanelOpen(true)}>
            🔔
            {alertCount > 0 && (
              <span style={{
                position:"absolute",top:"-8px",right:"-10px",
                background:"red",color:"#fff",borderRadius:"50%",
                padding:"3px 6px",fontSize:"11px"
              }}>{alertCount}</span>
            )}
          </div>

          {/* 🌙 LIGHT/ DARK */}
          <button onClick={()=>setDarkMode(!darkMode)}
            style={{background:"white",color:"#000",
            padding:"5px 10px",borderRadius:"6px",fontWeight:"bold"}}>
            {darkMode ? "☀" : "🌙"}
          </button>
        </div>
      </nav>

      {/* 🔥 NOTIFICATION SIDEBAR OPEN FROM RIGHT */}
      <NotificationPanel tasks={tasks} open={panelOpen} setOpen={setPanelOpen}/>
    </>
  );
}

/* NAV LINK */
function Nav({children,to,path}) {
  return (
    <Link to={to} style={{
      textDecoration:"none",
      color:"#fff",
      borderBottom: path===to ? "2px solid #fff" : "none"
    }}>{children}</Link>
  );
}
