import { useState } from "react";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";





function App() {
  
  const [loggedin, setLoggedin] = useState(false)

  return (
  <>
      <BrowserRouter>
        {
          loggedin ? <Dashboard setLoggedin={setLoggedin} /> : <SignIn setLoggedin={setLoggedin} />  
        } 
    </BrowserRouter>
  </>
  );
}

export default App;
