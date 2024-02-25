import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from './Components/Register/RegisterPage';
import LoginPage from './Components/Login/LoginPage';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import RoomPage from './Components/Room/RoomPage';
import RegisterPageAdmin from './Components/RegisterAdmin/RegisterPageAdmin';
import HistoryPage from "./Components/History/HistoryPage.jsx";
import { useEffect, useState } from 'react';
import { accountService } from "../src/services/account.service";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [reload, setReload] = useState(false);
  

  const isUserLogged = () => {
    return localStorage.getItem("token") != null;
  }


  useEffect(() => {
    setIsLogged(isUserLogged());
  }, []);
  

  return (
    <>
      <BrowserRouter>
        <NavBar isLogged={isLogged}/>
        <Routes>
          <Route path="register" element={<RegisterPage />} />
          <Route path="registerAdmin" element={<RegisterPageAdmin />} />
          <Route index path="login" element={<LoginPage setIsLogged={setIsLogged}/>} />
          <Route path="/" element={<Home isConnected={isLogged} isAdmin={isAdmin} />} />
          <Route path="room/:roomId" element={<RoomPage isLogged={isLogged}/>} />
          <Route path="history" element={<HistoryPage isLogged={isLogged} user={user}/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
