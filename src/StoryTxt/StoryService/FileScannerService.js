/**
 * File Scanner Service
 * Scans a folder and retrieves information about all .txt files
 */

class FileScannerService {
  /**
   * Scans a folder and returns information about all .txt files
   * @param {string} folderPath - The path to the folder to scan
   * @returns {Promise<Object>} JSON object containing file information
   */
  static async scanTextFiles(folderPath) {
    try {
      // Validate folder path
      if (!folderPath || typeof folderPath !== 'string') {
        throw new Error('Invalid folder path provided');
      }

      // Ensure folder path ends with slash
      const normalizedPath = folderPath.endsWith('/') ? folderPath : folderPath + '/';

      // Get text files from the folder
      const files = await FileScannerService.getTextFilesFromFolder(normalizedPath);

      return {
        success: true,
        data: {
          folderPath: normalizedPath,
          totalFiles: files.length,
          files: files,
          scanTimestamp: new Date().toISOString()
        },
        metadata: {
          scanMethod: 'folder-scan',
          environment: 'browser'
        }
      };

    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          type: error.name,
          timestamp: new Date().toISOString()
        },
        data: null
      };
    }
  }

  /**
   * Gets text files from a folder using a predefined list or server endpoint
   * @param {string} folderPath - The folder path
   * @returns {Promise<Array>} Array of file information objects
   */
  static async getTextFilesFromFolder(folderPath) {
    // For browser environments, we'll use a predefined list or fetch from a manifest
    const knownTextFiles = [
      {
        path: `${folderPath}example.txt`,
        title: 'Example Text File',
        info: 'Sample text file for testing the TextFileReaderService'
      }
    ];

    // Try to get additional files from a manifest
    try {
      const manifestResponse = await fetch(`${folderPath}file-manifest.json`);
      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json();
        console.log('📁 Loaded manifest with', manifest.textFiles?.length || 0, 'files');
        
        // Filter out non-story files (README, documentation, etc.)
        const storyFiles = manifest.textFiles?.filter(file => {
          const fileName = file.path.toLowerCase();
          
          // Only exclude files that are clearly documentation/README
          return !fileName.includes('readme') && 
                 !fileName.includes('manifest') &&
                 !fileName.includes('license') &&
                 !fileName.includes('changelog') &&
                 !fileName.includes('contributing') &&
                 file.path.toLowerCase().endsWith('.txt');
        }) || [];
        
        return storyFiles.length > 0 ? storyFiles : knownTextFiles;
      }
    } catch (error) {
      console.warn('⚠️ Could not fetch file manifest, using default list');
    }

    return knownTextFiles;
  }

  /**
   * Gets detailed information about a specific text file
   * @param {string} filePath - Path to the text file
   * @returns {Promise<Object>} Detailed file information
   */
  static async getFileInfo(filePath) {
    try {
      if (!filePath || typeof filePath !== 'string') {
        throw new Error('Invalid file path provided');
      }

      if (!filePath.toLowerCase().endsWith('.txt')) {
        throw new Error('File must have .txt extension');
      }

      // Get file content for analysis
      const contentResponse = await fetch(filePath);
      if (!contentResponse.ok) {
        throw new Error(`Failed to access file: ${contentResponse.status} ${contentResponse.statusText}`);
      }
      
      const content = await contentResponse.text();

      // Extract title from first line or filename
      const lines = content.split('\n');
      const firstLine = lines[0].trim();
      const fileName = filePath.split('/').pop().replace('.txt', '');
      
      // Try to extract title from first line if it looks like a title
      const title = FileScannerService.extractTitle(firstLine, fileName);

      // Generate info from content analysis
      const info = FileScannerService.generateFileInfo(content, fileName);

      return {
        success: true,
        data: {
          path: filePath,
          title: title,
          info: info,
          fileName: fileName,
          fileSize: content.length,
          lineCount: lines.length,
          wordCount: content.trim().split(/\s+/).filter(word => word.length > 0).length,
          characterCount: content.length,
          firstLine: firstLine,
          content: content,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          type: error.name,
          timestamp: new Date().toISOString()
        },
        data: null
      };
    }
  }

  /**
   * Extracts a title from the first line or filename
   * @param {string} firstLine - First line of the file
   * @param {string} fileName - Name of the file without extension
   * @returns {string} Extracted title
   */
  static extractTitle(firstLine, fileName) {
    // If first line looks like a title (not too long, starts with capital, no special chars)
    if (firstLine && 
        firstLine.length < 100 && 
        firstLine.length > 0 &&
        /^[A-Z]/.test(firstLine) &&
        !firstLine.includes('http') &&
        !firstLine.includes('www')) {
      return firstLine;
    }
    
    // Otherwise use filename converted to title case
    return fileName
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Generates file information based on content analysis
   * @param {string} content - File content
   * @param {string} fileName - File name
   * @returns {string} Generated file information
   */
  static generateFileInfo(content, fileName) {
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
}

// Export the service
export default FileScannerService;

// Also export individual methods for convenience
export const { 
  scanTextFiles, 
  getFileInfo
} = FileScannerService; 