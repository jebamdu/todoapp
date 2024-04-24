
import './App.css';
import Login from './login';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Routes, Route } from "react-router-dom";
import NoPage from './components/NoPage'
import Home from './components/Home';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path='*' element={<NoPage />} />

      </Routes>
    </div>
  );
}

export default App;