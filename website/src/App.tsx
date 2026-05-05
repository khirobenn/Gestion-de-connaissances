import Chat from "./components/Chat";
import AuthPage from "./components/Signin";
import "./App.css";
import { useState } from "react";

function App() {
  const [access, setAccess] = useState(false)

  return (
    <div className="App">
      { access && <Chat setAccess={setAccess}/>}
      { !access && <AuthPage setAccess={setAccess}/>}
    </div>
  );
}

export default App;
