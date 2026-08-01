import "./App.css";
import Navbar from "./components/Navbar";
import CropForm from "./components/CropForm";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <CropForm />
      </main>
    </div>
  );
}

export default App;