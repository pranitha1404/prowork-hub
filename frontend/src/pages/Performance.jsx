import { useEffect, useMemo, useState } from "react";
import { fetchTasks, fetchEmployees } from "../services/api";

export default function Performance() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [taskData, empData] = await Promise.all([
          fetchTasks(),
          fetchEmployees(),
        ]);
        setTasks(taskData || []);
        setEmployees(empData || []);
      } catch (err) {
        console.error("Error loading performance data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // helpers
  const parseDate = (raw) => {
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  };

  const now = new Date();

  const tasksWithDate = useMemo(
    () =>
      tasks.map((t) => ({
        ...t,
        _date: parseDate(t.dueDate || t.due || t.deadline),
      })),
    [tasks]
  );

  const totalTasks = tasksWithDate.length;

  const completedTasks = tasksWithDate.filter((t) =>
    (t.status || "").toLowerCase().includes("done")
  );

  const overdueTasks = tasksWithDate.filter(
    (t) =>
      t._date &&
      t._date < now &&
      !(t.status || "").toLowerCase().includes("done")
  );

  const completionRate = totalTasks
    ? Math.round((completedTasks.length / totalTasks) * 100)
    : 0;

  const tasksByEmployee = useMemo(() => {
    const map = new Map();

    tasksWithDate.forEach((t) => {
      const empObj = t.assignedEmployee;
      let empId = null;
      let empName = "Unassigned";

      if (typeof empObj === "string") {
        empId = empObj;
        const found = employees.find((e) => e._id === empObj);
        if (found) empName = found.name;
      } else if (empObj && typeof empObj === "object") {
        empId = empObj._id || empObj.id || null;
        empName = empObj.name || empName;
      }

      const key = empId || empName; // fall back to name
      if (!map.has(key)) {
        map.set(key, {
          id: empId,
          name: empName,
          total: 0,
          completed: 0,
        });
      }
      const entry = map.get(key);
      entry.total += 1;
      if ((t.status || "").toLowerCase().includes("done")) {
        entry.completed += 1;
      }
    });

    return Array.from(map.values());
  }, [tasksWithDate, employees]);

  const leaderboard = useMemo(
    () =>
      tasksByEmployee
        .filter((e) => e.total > 0)
        .map((e) => ({
          ...e,
          rate: Math.round((e.completed / e.total) * 100),
        }))
        .sort((a, b) => b.completed - a.completed),
    [tasksByEmployee]
  );

  const avgTasksPerEmployee =
    employees.length > 0 ? (totalTasks / employees.length).toFixed(1) : 0;

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h1>Performance & Leaderboard</h1>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Performance & Leaderboard</h1>

      {/* Top metrics */}
      <div style={statsRow}>
        <div style={statCard}>
          <h3>Total Tasks</h3>
          <p style={bigNumber}>{totalTasks}</p>
        </div>
        <div style={statCard}>
          <h3>Completed Tasks</h3>
          <p style={bigNumber}>{completedTasks.length}</p>
        </div>
        <div style={statCard}>
          <h3>Completion Rate</h3>
          <p style={bigNumber}>{completionRate}%</p>
        </div>
        <div style={statCard}>
          <h3>Overdue Tasks</h3>
          <p
            style={{
              ...bigNumber,
              color: overdueTasks.length ? "red" : "green",
            }}
          >
            {overdueTasks.length}
          </p>
        </div>
        <div style={statCard}>
          <h3>Avg Tasks / Employee</h3>
          <p style={bigNumber}>{avgTasksPerEmployee}</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div style={leaderCard}>
        <h2 style={{ marginTop: 0 }}>Top Performers</h2>
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Rank</th>
              <th>Employee</th>
              <th>Completed</th>
              <th>Total</th>
              <th>Completion %</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((e, idx) => (
              <tr key={e.id || e.name}>
                <td>
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                </td>
                <td>{e.name}</td>
                <td>{e.completed}</td>
                <td>{e.total}</td>
                <td>{e.rate}%</td>
              </tr>
            ))}
            {leaderboard.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No tasks assigned to employees yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <p style={{ fontSize: "12px", marginTop: "10px" }}>
          * Rank is based on number of completed tasks. Completion % is
          completed / total.
        </p>
      </div>
    </div>
  );
}

// styles
const statsRow = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const statCard = {
  flex: "1 1 180px",
  background: "#fff",
  padding: "12px 16px",
  borderRadius: "10px",
  boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
};

const bigNumber = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "4px 0 0 0",
};

const leaderCard = {
  background: "#fff",
  padding: "16px",
  borderRadius: "10px",
  boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
};
