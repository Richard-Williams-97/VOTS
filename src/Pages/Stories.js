import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scanTextFiles, getFileInfo } from '../StoryTxt/StoryService/FileScannerService.js';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Scan for text files in the StoryTxt folder
      const scanResult = await scanTextFiles('./src/StoryTxt/');
      
      if (scanResult.success) {
        // Get detailed information for each file
        const detailedStories = await Promise.all(
          scanResult.data.files.map(async (file) => {
            const fileInfo = await getFileInfo(file.path);
            return fileInfo.success ? fileInfo.data : null;
          })
        );
        
        // Filter out any failed file reads
        const validStories = detailedStories.filter(story => story !== null);
        setStories(validStories);
      } else {
        setError(scanResult.error.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (story) => {
    // Navigate to individual story route
    const storyTitle = story.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
    navigate(`/story/${storyTitle}`);
  };

  

  return (
    <div className="stories-container">
      <div className="stories-page-heading">
        <h1>Stories</h1>
      </div>
      <div className="stories-grid">
        {stories.map((story, index) => (
          <div 
            key={index} 
            className="story-terminal"
            onClick={() => handleStoryClick(story)}
          >
            <div className="terminal-header">
              <span className="file-path">/{story.fileName}.txt</span>
              <span className="file-size">{story.fileSize} bytes</span>
            </div>
            <div className="terminal-content">
              <div className="story-title">{story.title}</div>
              <div className="story-stats">
                <span className="stat">LINES: {story.lineCount}</span>
                <span className="stat">WORDS: {story.wordCount}</span>
              </div>
              <div className="story-preview">
                {story.firstLine.length > 80 
                  ? `${story.firstLine.substring(0, 80)}...` 
                  : story.firstLine}
              </div>
            </div>
            <div className="terminal-footer">
              <span className="access-code">ACCESS_READ</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories; 