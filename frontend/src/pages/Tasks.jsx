const API = import.meta.env.https://prowork-hub.onrender.com;

export default function Tasks() {

  const getTasks = async () => {
    const res = await fetch(`${API}/api/tasks`);
    console.log(await res.json());
  };

  return <h1>Tasks Connected to Backend ✔</h1>;
}
