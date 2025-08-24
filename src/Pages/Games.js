import React from 'react';

const Games = () => {
  const gameProjects = [
  ];

  return (
    <div className="stories-container">
      <div className="stories-page-heading">
        <h1>Games Terminal</h1>
      </div>
        {gameProjects.length > 0 ? (
          <div className="stories-grid">
          {gameProjects.map((game, index) => (
            <div 
              key={game.id} 
              className="story-terminal"
            >
              <div className="terminal-header">
                <span className="file-path">/{game.fileName}.game</span>
                <span className="file-size">{game.fileSize}</span>
              </div>
              <div className="terminal-content">
                <div className="story-title">{game.title}</div>
                <div className="story-stats">
                  <span className="stat">STATUS: {game.status}</span>
                  <span className="stat">TYPE: ACTION</span>
                </div>
                <div className="story-preview">
                  {game.description}
                </div>
              </div>
              <div className="terminal-footer">
                <span className="access-code">ACCESS_DEV</span>
              </div>
            </div>
          ))}
        </div>

        ) : (
          <div style={{padding: "50px"}}>
          <div className="">
            <div className="terminal-content">
              <div className="story-title">GAMES IN PROGRESS</div>
              <div className="story-preview">
                The Verse of the Sun gaming experiences are currently under development. 
                I am crafting the immersive interactive adventures that will bring the 
                dark and thrilling universe to life through gameplay.
              </div>
            </div>
          </div>
          </div>
        )}
    </div>
  );
};

export default Games; 