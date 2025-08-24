import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scanTextFiles, getFileInfo } from '../StoryTxt/StoryService/FileScannerService.js';

const Story = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStory();
  }, [title]);

  const loadStory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Scan for text files in the StoryTxt folder
      const scanResult = await scanTextFiles('./src/StoryTxt/');
      
      if (scanResult.success) {
        // Find the story that matches the title parameter
        const storyData = await Promise.all(
          scanResult.data.files.map(async (file) => {
            const fileInfo = await getFileInfo(file.path);
            return fileInfo.success ? fileInfo.data : null;
          })
        );
        
        // Filter out any failed file reads and find matching story
        const validStories = storyData.filter(story => story !== null);
        const matchingStory = validStories.find(story => {
          const storyTitle = story.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
          return storyTitle === title;
        });
        
        if (matchingStory) {
          setStory(matchingStory);
        } else {
          setError('Story not found');
        }
      } else {
        setError(scanResult.error.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToStories = () => {
    navigate('/stories');
  };

  return (
    <div className="story-container">
      <div className="story-header">
        <button onClick={handleBackToStories} className="back-button">
          ← BACK TO STORIES
        </button>
        <div className="story-title-section">
          <h1 className="story-title">{story.title}</h1>
          <div className="story-file-info">
            <div className="metadata-line">{story.fileSize} bytes</div>
            <div className="metadata-line">LINES: {story.lineCount}</div>
            <div className="metadata-line">WORDS: {story.wordCount}</div>
            <div className="metadata-line">CHARACTERS: {story.characterCount}</div>
          </div>
        </div>
      </div>
      
 
      
      <div className="story-text">
        {story.content.split('\n').map((line, index) => (
          <div key={index} className="text-line">{line}</div>
        ))}
      </div>
    </div>
  );
};

export default Story;
