import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { fetchTasks } from "../services/api";

export default function CalendarView() {
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(new Date());
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);

  // ✅ FIX: compare only date (no time zone issues)
  const onChangeDate = (d) => {
    setDate(d);
    const selectedDay = d.toDateString();
    const tasksForDay = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate).toDateString() === selectedDay
    );
    setSelectedTasks(tasksForDay);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>📅 Task Calendar</h2>

      <Calendar onChange={onChangeDate} value={date} />

      <div
        style={{
          marginTop: "25px",
          padding: "15px",
          background: "#fff",
          maxWidth: "400px",
          borderRadius: "10px",
          boxShadow: "0 0 10px #ccc",
        }}
      >
        <h3>Tasks on {date.toDateString()}</h3>

        {selectedTasks.length === 0 && <p>No tasks here.</p>}

        {selectedTasks.map((t) => (
          <div
            key={t._id}
            style={{
              marginTop: "10px",
              padding: "8px",
              background: "#f3faff",
              borderLeft: `5px solid ${
                t.priority === "High"
                  ? "#e74c3c"
                  : t.priority === "Medium"
                  ? "#f1c40f"
                  : "#2ecc71"
              }`,
              borderRadius: "6px",
            }}
          >
            <b>{t.title}</b>
            <p style={{ margin: 0, fontSize: 13 }}>{t.description}</p>
            <small style={{ color: "#555" }}>
              Priority: {t.priority || "Not set"}
            </small>
            <br />
            <small style={{ color: "#777" }}>
              Due: {t.dueDate?.substring(0, 10)}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
