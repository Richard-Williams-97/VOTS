import React from 'react';
import { Link } from 'react-router';
import logo from "../Images/VOTSlogo.png"

const Header = () => {
    return (
        <div className="header">
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img style={{ width: '30px', height: '30px', marginRight: '10px', imageRendering: 'pixelated' }} src={logo} alt="VOTS Logo" className="header-logo" />
                <h1 className="header-title">VOTS</h1>
            </header>
            <nav>
                <Link to="/" className="header-link">Home</Link>
                <Link to="/stories" className="header-link">Stories</Link>
                <Link to="/games" className="header-link">Games</Link>
            </nav>
        </div>
    );
};

export default Header;