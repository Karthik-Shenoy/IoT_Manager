import './App.css'
import NavBar from './Components/NavBar/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import DashBoard from './Pages/DashBoard/DashBoard';
import Auth from './Pages/AuthPage/Auth';
import ProfilePage from './Pages/Profile/ProfilePage';
import { createContext, useContext, useEffect, useState } from 'react';

interface ContextType {
  userUID: string,
  webSocket: WebSocket | null,
  setUserUID: (userUID: string) => void,
  setWebSocket: (webSocket: WebSocket | null) => void
};
export const UserContext = createContext<ContextType>({
  userUID: "",
  webSocket: null,
  setUserUID: () => { },
  setWebSocket: () => { },
});
function App() {
  const [userUID, setUserUID] = useState("");
  let [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    if (userUID !== "") {
      webSocket = new WebSocket("ws://localhost:3001");
      webSocket.onopen = () => {
        console.log("connection Established");
      }

      setWebSocket(webSocket);
    }

    return (() => {
      if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        console.log("connection closed!")
        webSocket.close(3777, "switched to other component");
      }
    })

  }, [userUID])
  return (
    <>
      <UserContext.Provider value={{
        userUID,
        webSocket,
        setUserUID,
        setWebSocket,
      }}>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App
