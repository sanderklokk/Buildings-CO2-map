import { Router } from "./pages/Router";
import "./App.css";
import { Navbar } from "./components/layout/Navbar";

function App() {
  return (
    <div className="App w-screen h-screen p-0 m-0 bg-trk-white">
      <Navbar />
      <Router />
      {/*footer*/}
    </div>
  );
}

export default App;
