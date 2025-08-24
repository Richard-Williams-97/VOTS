import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
  
          <div className={"footer-Spacer"}>
            <span style={{paddingRight: "5px"}}>●</span>
            <span>SYSTEM ONLINE</span>
          </div>

          <div className="flat-text">
            <span style={{paddingRight: "5px"}}>© {new Date().getFullYear()} Verse of the Sun</span>
            <span style={{paddingRight: "5px"}}>|</span>
            <span style={{paddingRight: "5px"}}>All Rights Reserved</span>
            <span style={{paddingRight: "5px"}}>|</span>
            <span>Version 1.0.0</span>
          </div>
        
    </footer>
  );
};

export default Footer; 