import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Nav from "./Nav/Nav";
import Register from "./Register/Register";
import Signin from "./Signin/Signin";
import Dashboard from "./DashBoard/Dashboard";
import Onboard from "./Onboard/Onboard";
import SetlistForm from "./SetlistForm/SetlistForm";
import MusicianHub from "./MusicianView/MusicianView";
import Members from "./Members/Members"; 
const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
  const [route, setRoute] = useState('Signin');
  const [usrname, setUsrname] = useState('');
  const [userId, setUserId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [belongsToGroup, setBelongsToGroup] = useState('');
  const [role, setUserRole] = useState('');
  const [editingSetlist, setEditingSetlist] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("appTheme") || "slate-dark");

  useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("appTheme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.removeItem(`token`);
  }, []);

  const registerUser = async (usrname, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        usrname: usrname,
        password: password
      });

      alert(response.data.msg);
      setRoute("Signin");

    } catch (err) {
      const backendError = err.response?.data?.error || "Registration failed";
      alert(backendError);
    }
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await axios.post("http://localhost:5000/logout", {}, {
          headers: { "Authorization": `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.log("Session already expired on server");
    } finally {
      localStorage.removeItem("token");
      setRoute("Signin");
    }
  }

  const getUserProfile = async () => {
    const token = localStorage.getItem("token");
    
    if (token) {
      try {
        // Changed to GET to match REST best practices
        const response = await axios.get(`${API_URL}/profile`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        setUsrname(response.data.usrname);
        setUserId(response.data.userId);
        setBelongsToGroup(response.data.belongsToGroup);
        setGroupId(response.data.groupId);
        setGroupName(response.data.groupName);
        setUserRole(response.data.role);
        
      } catch (err) {
        console.log("Error getting profile details");
      }
    }
  }

  const signinUser = async (usrname, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        usrname: usrname,
        password: password
      });

      localStorage.setItem("token", response.data.token);
      alert(response.data.msg);

      await getUserProfile(); 
      setRoute("home");

    } catch (err) {
      const backendError = err.response?.data?.error || "Signin Failed";
      alert(backendError);
    }
  }

  const cancelForm = () => {
    setEditingSetlist(null);
    setRoute('home');
  }

  return (
    <div>
      {route !== "Signin" && route !== "Register" && route !== "create-group" && route !== "join-group" && (
        <Nav
          currentRoute={route}
          onRouteChange={setRoute}
          role={role}
          handleLogout={handleLogout}
          usrname={usrname}
          theme={theme}
          setTheme={setTheme}
          belongsToGroup={belongsToGroup}
        />
      )}
      {route === "Register" ? (
        <Register
          registerUser={registerUser}
          onRouteChange={setRoute}
        />
      ) : route === "Signin" ? (
        <Signin
          signinUser={signinUser}
          onRouteChange={setRoute}
        />
      ) : route === "home" ? (
        <Dashboard
          url={API_URL}
          handleLogout={handleLogout}
          groupName={groupName}
          groupId={groupId}
          usrname={usrname}
          userId={userId}
          belongsToGroup={belongsToGroup}
          role={role}
          onRouteChange={setRoute}
          existingSetlist={editingSetlist}
          setEditingSetlist={setEditingSetlist}
        />
      ) : (route === "create-group" || route === "join-group") ? (
        <Onboard 
          url={API_URL}
          route={route}
          onRouteChange={setRoute}
          refreshProfile={getUserProfile}
        />
      ) : route === "setlist-form" ? (
        <SetlistForm 
            existingSetlist={editingSetlist}
            
            onCancel={cancelForm}
            onSave={async (formData) => {
              try {
                  const token = localStorage.getItem("token");
                  if (!editingSetlist) {
                      await axios.post(`${API_URL}/admin/setlists`, formData, {
                          headers: { "Authorization": `Bearer ${token}` }
                      });
                      alert("Setlist Created Successfully!");
                  }
                  if (editingSetlist) {
                      await axios.put(`${API_URL}/admin/setlists/${editingSetlist._id}`, formData, {
                        headers: { "Authorization": `Bearer ${token}` }
                      });
                      alert("Setlist Updated Successfully!");
                  }
                  
                  setEditingSetlist(null);
                  setRoute('home'); 
                  
              } catch (err) {
                  const backendError = err.response?.data?.error || "Error saving setlist";
                  alert(backendError);
              }
            }}
        />
      ) : route === "musician-view" ? (
        <MusicianHub url={API_URL}/>
      ) : route === "members" ? (
            <Members userId={userId} role={role} url={API_URL}/>
          ) : <div>Error Fetching Page</div>}
    </div>
  );
}

export default App;