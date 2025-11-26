const API = import.meta.env.https://prowork-hub.onrender.com;

export default function Leaves() {

  const getLeaves = async () => {
    const res = await fetch(`${API}/api/leaves`);
    console.log(await res.json());
  };

  return <h1>Leave Requests Connected to Backend ✔</h1>;
}
