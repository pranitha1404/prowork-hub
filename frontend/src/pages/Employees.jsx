const API = import.meta.env.https://prowork-hub.onrender.com;

export default function Employees() {

  // FETCH EMPLOYEES
  const getEmployees = async () => {
    const res = await fetch(`${API}/api/employees`);
    const data = await res.json();
    console.log(data);
  };

  // ADD EMPLOYEE EXAMPLE (use this in your form button)
  const addEmployee = async () => {
    await fetch(`${API}/api/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Employee",
        role: "Developer"
      })
    });
  };

  return <h1>Employees Page Connected to Backend 🚀</h1>;
}
