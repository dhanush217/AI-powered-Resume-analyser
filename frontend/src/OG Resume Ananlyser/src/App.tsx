import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import AnalysisPage from './components/AnalysisPage';
import Home from './components/Home';
import About from './components/About';

function App() {
  return (
    <Router>
      <div className="bg-gray-50 transition-all">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<AnalysisPage />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
