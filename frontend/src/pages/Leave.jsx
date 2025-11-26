import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({
    name: "",
    from: "",
    to: "",
    reason: "",
    status: "Pending"
  });

  // Fetch Leave Records from Backend
  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    const res = await axios.get("http://localhost:5000/api/leaves");
    setLeaves(res.data);
  };

  // Submit Leave Request
  const submitLeave = async () => {
    if(!form.name || !form.from || !form.to || !form.reason){
      return alert("All fields required!");
    }

    await axios.post("http://localhost:5000/api/leaves", form);
    alert("Leave Request Submitted");
    setForm({name:"",from:"",to:"",reason:"",status:"Pending"});
    loadLeaves();
  };

  // Approve / Reject Leave
  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/leaves/${id}`, { status });
    loadLeaves();
  };

  return (
    <div style={{padding:"30px"}}>
      <h1 style={{ fontSize:"30px", fontWeight:"bold"}}>Leave Management</h1>

      {/* Leave Apply Form */}
      <div style={{
        display:"flex",gap:"15px",marginTop:"20px",
        padding:"20px",background:"#fff",borderRadius:"10px",
        width:"85%"
      }}>
        <input placeholder="Employee Name" value={form.name}
        onChange={e=>setForm({...form,name:e.target.value})}
        />

        <input type="date" value={form.from}
        onChange={e=>setForm({...form,from:e.target.value})}
        />

        <input type="date" value={form.to}
        onChange={e=>setForm({...form,to:e.target.value})}
        />

        <input placeholder="Reason" value={form.reason}
        onChange={e=>setForm({...form,reason:e.target.value})}
        style={{width:"200px"}}
        />

        <button style={{background:"blue",color:"#fff",padding:"7px 12px"}}
        onClick={submitLeave}>Apply</button>
      </div>

      {/* Leave List */}
      <table style={{marginTop:"30px",width:"85%",background:"#fff",borderRadius:"10px"}}>
        <thead>
          <tr>
            <th>Name</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(l=>(
            <tr key={l._id}>
              <td>{l.name}</td>
              <td>{l.from}</td>
              <td>{l.to}</td>
              <td>{l.reason}</td>
              <td style={{fontWeight:"bold",color:l.status==="Approved"?"green": l.status==="Rejected"?"red":"orange"}}>
                {l.status}
              </td>
              <td>
                <button onClick={()=>updateStatus(l._id,"Approved")} style={{marginRight:10}}>Approve</button>
                <button onClick={()=>updateStatus(l._id,"Rejected")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
