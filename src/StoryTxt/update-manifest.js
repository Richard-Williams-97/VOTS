/**
 * Manifest Update Utility
 * Scans the StoryTxt directory and updates file-manifest.json
 * Run this script when you add new story files
 */

import fs from 'fs';
import path from 'path';

class ManifestUpdater {
  constructor() {
    this.storyDir = './src/StoryTxt/';
    this.manifestPath = './src/StoryTxt/file-manifest.json';
  }

  /**
   * Scans directory for .txt files and updates manifest
   */
  async updateManifest() {
    try {
      console.log('🔍 Scanning StoryTxt directory...');
      
      // Get all .txt files in the directory
      const textFiles = await this.scanDirectory();
      
      // Create manifest data
      const manifest = {
        folderPath: this.storyDir,
        generatedAt: new Date().toISOString(),
        textFiles: textFiles,
        totalFiles: textFiles.length,
        scanMethod: 'auto-updated',
        version: '1.1.0'
      };

      // Write updated manifest
      await this.writeManifest(manifest);
      
      console.log(`✅ Manifest updated successfully! Found ${textFiles.length} text files.`);
      console.log('📁 Files found:');
      textFiles.forEach(file => {
        console.log(`   - ${file.title} (${file.path})`);
      });
      
    } catch (error) {
      console.error('❌ Error updating manifest:', error.message);
    }
  }

  /**
   * Scans directory for .txt files
   */
  async scanDirectory() {
    const files = [];
    
    try {
      const items = fs.readdirSync(this.storyDir);
      
      for (const item of items) {
        const itemPath = path.join(this.storyDir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isFile() && item.toLowerCase().endsWith('.txt')) {
          // Read first line for title
          const content = fs.readFileSync(itemPath, 'utf8');
          const firstLine = content.split('\n')[0].trim();
          
          // Skip non-story files
          if (this.isStoryFile(item, firstLine, content)) {
            // Generate file info
            const fileInfo = {
              path: `${this.storyDir}${item}`,
              title: this.extractTitle(firstLine, item.replace('.txt', '')),
              info: this.generateFileInfo(content, item)
            };
            
            files.push(fileInfo);
          }
        }
      }
      
    } catch (error) {
      console.warn('⚠️ Could not read directory, using fallback method');
      // Fallback to known story files only
      files.push(
        {
          path: `${this.storyDir}example.txt`,
          title: 'Example Text File',
          info: 'Sample text file for testing the TextFileReaderService with multiple lines and features demonstration'
        }
      );
    }
    
    return files;
  }

  /**
   * Determines if a file is actually a story (not README, documentation, etc.)
   */
  isStoryFile(fileName, firstLine, content) {
    const fileNameLower = fileName.toLowerCase();
    const firstLineLower = firstLine.toLowerCase();
    
    // Only exclude files that are clearly documentation/README
    if (fileNameLower.includes('readme') || 
        fileNameLower.includes('manifest') ||
        fileNameLower.includes('license') ||
        fileNameLower.includes('changelog') ||
        fileNameLower.includes('contributing')) {
      return false;
    }
    
    // Check if content looks like a story (has multiple lines, not just metadata)
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      // Very short files are probably not stories
      return false;
    }
    
    return true;
  }

  /**
   * Extracts title from first line or filename
   */
  extractTitle(firstLine, fileName) {
    if (firstLine && 
        firstLine.length < 100 && 
        firstLine.length > 0 &&
        /^[A-Z]/.test(firstLine) &&
        !firstLine.includes('http') &&
        !firstLine.includes('www')) {
      return firstLine;
    }
    
    return fileName
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Generates file information based on content
   */
  generateFileInfo(content, fileName) {
    const lines = content.split('\n');
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    
    let info = '';
    
    if (lines.length <= 1) {
      info = 'Single line text file';
    } else if (lines.length <= 10) {
      info = `Short story with ${lines.length} lines`;
    } else if (lines.length <= 50) {
      info = `Medium story with ${lines.length} lines`;
    } else {
      info = `Long story with ${lines.length} lines`;
    }
    
    info += ` (${words.length} words)`;
    
    // Add content type hints
    if (content.includes('http') || content.includes('www')) {
      info += ' - Contains links';
    }
    if (content.includes('@')) {
      info += ' - Contains email addresses';
    }
    if (content.match(/\d{4}-\d{2}-\d{2}/)) {
      info += ' - Contains dates';
    }
    
    return info;
  }

  /**
   * Writes manifest to file
   */
  async writeManifest(manifest) {
    try {
      const manifestContent = JSON.stringify(manifest, null, 2);
      fs.writeFileSync(this.manifestPath, manifestContent, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write manifest: ${error.message}`);
    }
  }
}

// Export for use in other scripts
export default ManifestUpdater;

// If run directly, update the manifest
if (import.meta.url === `file://${process.argv[1]}`) {
  const updater = new ManifestUpdater();
  updater.updateManifest();
}
