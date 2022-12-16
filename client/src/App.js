import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import AddBook from "./pages/AddBook";
import Home from "./pages/Home";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/add-book" element={<AddBook></AddBook>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
