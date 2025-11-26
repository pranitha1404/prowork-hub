import { useEffect, useMemo, useState } from "react";
import { fetchTasks } from "../services/api";

export default function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(() => new Date().getFullYear());

  // load tasks from backend
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data || []);
      } catch (err) {
        console.error("Error loading tasks for calendar:", err);
      }
    };
    load();
  }, []);

  // helper: extract a JS Date from task (handles different field names)
  const getTaskDate = (task) => {
    const raw = task.dueDate || task.due || task.deadline;
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  };

  // tasks with a valid due date
  const datedTasks = useMemo(
    () =>
      tasks
        .map((t) => ({ ...t, _date: getTaskDate(t) }))
        .filter((t) => t._date),
    [tasks]
  );

  const today = new Date();

  // next upcoming task (after or equal to today)
  const nextTask = useMemo(() => {
    const upcoming = datedTasks
      .filter((t) => t._date >= startOfDay(today))
      .sort((a, b) => a._date - b._date);
    return upcoming[0] || null;
  }, [datedTasks]);

  // overdue tasks
  const overdueCount = useMemo(
    () => datedTasks.filter((t) => t._date < startOfDay(today)).length,
    [datedTasks]
  );

  // tasks grouped by YYYY-MM-DD
  const tasksByDay = useMemo(() => {
    const map = {};
    datedTasks.forEach((t) => {
      const key = formatDateKey(t._date);
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [datedTasks]);

  const currentMonthName = new Date(year, month).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun

  const goPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "20px" }}>Calendar</h1>

      {/* Top summary cards */}
      <div style={summaryRow}>
        <div style={card}>
          <h3>Upcoming task</h3>
          {nextTask ? (
            <>
              <p style={{ fontWeight: "bold", margin: "5px 0" }}>
                {nextTask.title}
              </p>
              <p style={{ margin: 0 }}>
                Due:{" "}
                {nextTask._date.toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              {nextTask.assignedEmployee && (
                <p style={{ margin: 0 }}>
                  Assignee: {nextTask.assignedEmployee.name || nextTask.assignedEmployee}
                </p>
              )}
              {nextTask.status && (
                <p style={{ margin: 0 }}>Status: {nextTask.status}</p>
              )}
            </>
          ) : (
            <p style={{ marginTop: "8px" }}>No upcoming tasks 🎉</p>
          )}
        </div>

        <div style={card}>
          <h3>Task stats</h3>
          <p style={{ margin: 0 }}>Total tasks: {tasks.length}</p>
          <p style={{ margin: 0 }}>With due date: {datedTasks.length}</p>
          <p style={{ margin: 0, color: overdueCount ? "red" : "green" }}>
            Overdue: {overdueCount}
          </p>
        </div>
      </div>

      {/* Calendar grid */}
      <div style={calendarContainer}>
        <div style={calendarHeader}>
          <button onClick={goPrevMonth} style={navBtn}>
            ◀
          </button>
          <span>{currentMonthName}</span>
          <button onClick={goNextMonth} style={navBtn}>
            ▶
          </button>
        </div>

        <div style={weekHeader}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} style={weekDay}>
              {d}
            </div>
          ))}
        </div>

        <div style={grid}>
          {/* empty cells before 1st */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} style={dayCell} />
          ))}

          {/* days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const cellDate = new Date(year, month, dayNum);
            const key = formatDateKey(cellDate);
            const dayTasks = tasksByDay[key] || [];

            const isToday = isSameDay(cellDate, today);

            return (
              <div
                key={key}
                style={{
                  ...dayCell,
                  border: isToday ? "2px solid #007bff" : "1px solid #eee",
                  backgroundColor: dayTasks.length ? "#f7fbff" : "#fff",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  {dayNum}
                </div>
                {dayTasks.slice(0, 3).map((t) => (
                  <div key={t._id} style={taskPill(getStatusColor(t.status))}>
                    {t.title.length > 12
                      ? t.title.slice(0, 11) + "…"
                      : t.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div style={{ fontSize: "10px", marginTop: "2px" }}>
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming list */}
      <div style={{ marginTop: "30px" }}>
        <h2>Upcoming tasks timeline</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {datedTasks
            .slice()
            .sort((a, b) => a._date - b._date)
            .map((t) => (
              <li key={t._id} style={timelineItem}>
                <span style={{ minWidth: "120px", display: "inline-block" }}>
                  {t._date.toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span style={{ fontWeight: "bold", marginRight: "10px" }}>
                  {t.title}
                </span>
                {t.assignedEmployee && (
                  <span style={{ marginRight: "10px" }}>
                    👤 {t.assignedEmployee.name || t.assignedEmployee}
                  </span>
                )}
                {t.status && (
                  <span
                    style={{
                      padding: "2px 6px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      backgroundColor: getStatusColor(t.status),
                      color: "#fff",
                    }}
                  >
                    {t.status}
                  </span>
                )}
              </li>
            ))}
          {datedTasks.length === 0 && (
            <li>No tasks with due dates yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

// helpers

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getStatusColor(status = "") {
  const s = status.toLowerCase();
  if (s.includes("done") || s.includes("completed")) return "#28a745";
  if (s.includes("progress")) return "#007bff";
  if (s.includes("todo") || s.includes("to do")) return "#fd7e14";
  if (s.includes("blocked")) return "#dc3545";
  return "#6c757d";
}

// styles
const summaryRow = {
  display: "flex",
  gap: "20px",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const card = {
  flex: "1 1 260px",
  background: "#fff",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const calendarContainer = {
  marginTop: "10px",
  background: "#fff",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const calendarHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
  fontWeight: "bold",
};

const navBtn = {
  border: "none",
  background: "#f0f0f0",
  borderRadius: "50%",
  width: "28px",
  height: "28px",
  cursor: "pointer",
};

const weekHeader = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  textAlign: "center",
  marginBottom: "4px",
  fontSize: "12px",
  fontWeight: "bold",
};

const weekDay = { padding: "4px 0" };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "2px",
};

const dayCell = {
  minHeight: "70px",
  padding: "4px",
  fontSize: "12px",
  borderRadius: "6px",
  boxSizing: "border-box",
};

const taskPill = (bg) => ({
  fontSize: "10px",
  padding: "2px 4px",
  borderRadius: "10px",
  marginBottom: "2px",
  backgroundColor: bg,
  color: "#fff",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const timelineItem = {
  padding: "6px 0",
  borderBottom: "1px solid #eee",
  fontSize: "13px",
};
