import React, { useEffect, useState } from "react";
import { fetchEmployees, fetchTasks } from "../services/api";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchEmployees().then(setEmployees);
    fetchTasks().then(setTasks);
  }, []);

  const statusCount = {
    todo: tasks.filter(t => t.status === "To Do").length,
    progress: tasks.filter(t => t.status === "In Progress").length,
    done: tasks.filter(t => t.status === "Done").length
  };

  const pieData = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        data: [statusCount.todo, statusCount.progress, statusCount.done],
        backgroundColor: ["#ff914d", "#4b7bec", "#20bf6b"]
      }
    ]
  };

  const barData = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        label: "Task Counts",
        data: [statusCount.todo, statusCount.progress, statusCount.done],
        backgroundColor: ["#ff914d", "#4b7bec", "#20bf6b"]
      }
    ]
  };

  return (
    <div style={{
      padding: "30px",
      background: "linear-gradient(to bottom right, #eef2ff, #f8fcff)",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif"
    }}>

      <h1 style={{ marginBottom: "25px", fontSize: "28px", fontWeight: "bold" }}>📊 Dashboard</h1>

      {/* STAT CARDS */}
      <div style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
        <div style={card}><h3>Total Employees</h3><p style={count}>{employees.length}</p></div>
        <div style={card}><h3>Total Tasks</h3><p style={count}>{tasks.length}</p></div>
        <div style={card}><h3>Completed %</h3><p style={count}>
          {tasks.length ? Math.round((statusCount.done/tasks.length)*100)+"%" : "0%"}
        </p></div>
      </div>

      {/* CHARTS */}
      <div style={{ marginTop: "40px", display: "flex", gap: "40px", flexWrap: "wrap" }}>
        <div style={chartBox}><h3>Task Status Overview</h3><Pie data={pieData}/></div>
        <div style={chartBox}><h3>Task Distribution</h3><Bar data={barData}/></div>
      </div>
    </div>
  );
}

const card = {
  width: "220px",
  padding: "18px",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  fontSize: "15px"
};

const count = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "8px",
  color: "#333"
};

const chartBox = {
  background:"#fff",
  borderRadius:"15px",
  padding:"20px",
  width:"450px",
  boxShadow:"0 3px 10px rgba(0,0,0,0.1)"
};
