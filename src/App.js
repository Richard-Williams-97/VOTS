import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import Header from './Components/Header';
import Home from './Pages/Home';
import Stories from './Pages/Stories';
import Story from './Pages/Story';
import Games from './Pages/Games';
import './App.css';
import Footer from './Components/Footer';
import blackhole from './Images/blackhole.svg';

function BlackholeOverlay({ show }) {
  if (!show) return null;
  return (
    <div className="blackhole-overlay">
      <img src={blackhole} alt="Blackhole" className="blackhole-img" />
    </div>
  );
}

function AppRoutesWithTransition() {
  const location = useLocation();
  const [showBlackhole, setShowBlackhole] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Fade out current content
    setOpacity(0);
    
    // Show blackhole overlay
    setShowBlackhole(true);
    
    // After blackhole disappears, start fading content back in
    const blackholeTimer = setTimeout(() => {
      setShowBlackhole(false);
      // Start fade in after blackhole is gone
      setTimeout(() => {
        setOpacity(1);
      }, 100); // Small delay to ensure blackhole is fully gone
    }, 1000);
    
    return () => {
      clearTimeout(blackholeTimer);
    };
  }, [location]);

  return (
    <>
      <BlackholeOverlay show={showBlackhole} />
      <div className="App" style={{ opacity, transition: 'opacity 0.5s ease-in-out' }}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/story/:title" element={<Story />} />
          <Route path="/games" element={<Games />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <div className="main-container">
        <AppRoutesWithTransition />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
