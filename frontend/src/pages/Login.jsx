import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [msg,setMsg] = useState("");

  const submit = async()=> {
    try{
      const res = await axios.post("http://localhost:5000/api/auth/login",{email,password});
      localStorage.setItem("token",res.data.token);
      setMsg("Login Successful 🎉 Redirecting...");
      setTimeout(()=> window.location.href="/",1000); 
    }catch(err){
      setMsg("Login Failed ❌ Check credentials");
    }
  };

  return(
    <div style={{textAlign:"center",marginTop:"90px"}}>
      <h1>🔐 ProWork Login</h1>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}
      style={{padding:"10px",margin:"10px",width:"250px"}}/><br/>

      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}
      style={{padding:"10px",margin:"10px",width:"250px"}}/><br/>

      <button onClick={submit} style={{padding:"10px 30px",background:"blue",color:"#fff"}}>
        Login
      </button>

      <p style={{color:"red",marginTop:"15px"}}>{msg}</p>
    </div>
  );
}
