import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Tasks from "./pages/Tasks";
import TaskBoard from "./pages/TaskBoard";
import Leave from "./pages/Leave";
import CalendarView from "./pages/CalendarView";


export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/tasks" element={<Tasks />} />
	<Route path="/taskboard" element={<TaskBoard />} />
        <Route path="/leave" element={<Leave />} />
	<Route path="/calendar" element={<CalendarView />} />
      </Routes>
    </>
  );
}
