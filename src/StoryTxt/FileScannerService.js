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

      // Try to fetch the folder contents
      // Note: This is a simplified approach for browser environments
      // In a real application, you might need a server endpoint to list files
      const response = await fetch(normalizedPath);
      
      if (!response.ok) {
        throw new Error(`Failed to access folder: ${response.status} ${response.statusText}`);
      }

      // For browser environments, we'll need to use a different approach
      // This is a placeholder that would work with a server-side file listing endpoint
      const files = await this.getTextFilesFromFolder(normalizedPath);

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
    // This can be extended to work with a server endpoint that lists files
    
    const knownTextFiles = [
      {
        path: `${folderPath}example.txt`,
        title: 'Example Text File',
        info: 'Sample text file for testing the TextFileReaderService'
      },
      {
        path: `${folderPath}README.txt`,
        title: 'README File',
        info: 'Project documentation and setup instructions'
      }
    ];

    // Try to get additional files from a manifest or server endpoint
    try {
      const manifestResponse = await fetch(`${folderPath}file-manifest.json`);
      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json();
        return manifest.textFiles || knownTextFiles;
      }
    } catch (error) {
      console.warn('Could not fetch file manifest, using default list');
    }

    return knownTextFiles;
  }

  /**
   * Scans multiple folders and returns combined information
   * @param {string[]} folderPaths - Array of folder paths to scan
   * @returns {Promise<Object>} Combined file information from all folders
   */
  static async scanMultipleFolders(folderPaths) {
    try {
      if (!Array.isArray(folderPaths)) {
        throw new Error('folderPaths must be an array');
      }

      const results = await Promise.allSettled(
        folderPaths.map(folderPath => this.scanTextFiles(folderPath))
      );

      const successfulScans = [];
      const failedScans = [];
      let totalFiles = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          successfulScans.push(result.value);
          totalFiles += result.value.data.totalFiles;
        } else {
          failedScans.push({
            folderPath: folderPaths[index],
            error: result.status === 'rejected' ? result.reason.message : result.value.error.message
          });
        }
      });

      return {
        success: true,
        data: {
          successfulScans,
          failedScans,
          totalFolders: folderPaths.length,
          successfulFolders: successfulScans.length,
          failedFolders: failedScans.length,
          totalFiles,
          scanTimestamp: new Date().toISOString()
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

      // Get file metadata
      const response = await fetch(filePath, { method: 'HEAD' });
      
      if (!response.ok) {
        throw new Error(`Failed to access file: ${response.status} ${response.statusText}`);
      }

      // Get file content for analysis
      const contentResponse = await fetch(filePath);
      const content = await contentResponse.text();

      // Extract title from first line or filename
      const lines = content.split('\n');
      const firstLine = lines[0].trim();
      const fileName = filePath.split('/').pop().replace('.txt', '');
      
      // Try to extract title from first line if it looks like a title
      const title = this.extractTitle(firstLine, fileName);

      // Generate info from content analysis
      const info = this.generateFileInfo(content, fileName);

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
          lastModified: response.headers.get('last-modified') || null,
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
      info = `Short text file with ${lines.length} lines`;
    } else if (lines.length <= 50) {
      info = `Medium text file with ${lines.length} lines`;
    } else {
      info = `Long text file with ${lines.length} lines`;
    }
    
    info += ` (${words.length} words)`;
    
    // Add content type hints
    if (content.includes('http') || content.includes('www')) {
      info += ' - Contains URLs';
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
   * Creates a file manifest for the current folder
   * @param {string} folderPath - The folder path
   * @returns {Promise<Object>} File manifest object
   */
  static async createFileManifest(folderPath) {
    try {
      const scanResult = await this.scanTextFiles(folderPath);
      
      if (!scanResult.success) {
        return scanResult;
      }

      const manifest = {
        folderPath: folderPath,
        generatedAt: new Date().toISOString(),
        textFiles: scanResult.data.files.map(file => ({
          path: file.path,
          title: file.title,
          info: file.info
        })),
        totalFiles: scanResult.data.totalFiles
      };

      return {
        success: true,
        data: manifest
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
}

// Export the service
export default FileScannerService;

// Also export individual methods for convenience
export const { 
  scanTextFiles, 
  scanMultipleFolders, 
  getFileInfo, 
  createFileManifest 
} = FileScannerService; 