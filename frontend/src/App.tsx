import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CallbackPage from "./components/CallbackPage";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/callback" element={<CallbackPage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
