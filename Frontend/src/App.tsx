import { Router } from "./pages/Router";
import "./App.css";
import { Navbar } from "./components/layout/Navbar";

function App() {
  return (
    <div className="App w-full h-full p-0 m-0 bg-trk-white overflow-x-hidden">
      <Navbar />
      <Router />
      {/*footer*/}
    </div>
  );
}

export default App;
