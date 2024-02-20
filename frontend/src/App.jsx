import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from './Components/Register/RegisterPage';
import LoginPage from './Components/Login/LoginPage';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import RoomPage from './Components/RoomPage';
import { useEffect, useState } from 'react';


function App() {
  const [isLogged, setIsLogged] = useState(false);

  const isUserLogged = () => {
    return localStorage.getItem("token") != null;
  }
  
  useEffect(() => {
    setIsLogged(isUserLogged());
  }, []);
  

  return (
    <>
      <BrowserRouter>
        <NavBar/>
          <Routes>
            <Route path="register" element={<RegisterPage />} />
            <Route index path="login" element={<LoginPage setIsLogged={setIsLogged}/>} />
            <Route path="/" element={<Home isConnected={isLogged} />} />
            <Route path="room/:roomId" element={<RoomPage isLogged={isLogged}/>} />
            
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
