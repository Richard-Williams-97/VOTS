/**
 * Text File Reader Service
 * Reads .txt files and returns their contents in JSON format
 */

class TextFileReaderService {
  /**
   * Reads a text file from the specified path and returns its contents in JSON format
   * @param {string} filePath - The path to the .txt file
   * @returns {Promise<Object>} JSON object containing file contents and metadata
   */
  static async readTextFile(filePath) {
    try {
      // Validate file path
      if (!filePath || typeof filePath !== 'string') {
        throw new Error('Invalid file path provided');
      }

      // Check if file has .txt extension
      if (!filePath.toLowerCase().endsWith('.txt')) {
        throw new Error('File must have .txt extension');
      }

      // Fetch the file content
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }

      // Read the text content
      const textContent = await response.text();

      // Create JSON response with metadata
      const jsonResponse = {
        success: true,
        data: {
          content: textContent,
          filePath: filePath,
          fileName: filePath.split('/').pop(),
          fileSize: textContent.length,
          lineCount: textContent.split('\n').length,
          wordCount: textContent.trim().split(/\s+/).filter(word => word.length > 0).length,
          characterCount: textContent.length,
          timestamp: new Date().toISOString()
        },
        metadata: {
          encoding: 'UTF-8',
          mimeType: 'text/plain',
          lastModified: response.headers.get('last-modified') || null
        }
      };

      return jsonResponse;

    } catch (error) {
      // Return error response in JSON format
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
   * Reads multiple text files and returns their contents in JSON format
   * @param {string[]} filePaths - Array of file paths to read
   * @returns {Promise<Object>} JSON object containing all file contents
   */
  static async readMultipleTextFiles(filePaths) {
    try {
      if (!Array.isArray(filePaths)) {
        throw new Error('filePaths must be an array');
      }

      const results = await Promise.allSettled(
        filePaths.map(filePath => this.readTextFile(filePath))
      );

      const successfulReads = [];
      const failedReads = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          successfulReads.push(result.value);
        } else {
          failedReads.push({
            filePath: filePaths[index],
            error: result.status === 'rejected' ? result.reason.message : result.value.error.message
          });
        }
      });

      return {
        success: true,
        data: {
          successfulReads,
          failedReads,
          totalFiles: filePaths.length,
          successfulCount: successfulReads.length,
          failedCount: failedReads.length
        },
        timestamp: new Date().toISOString()
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
   * Reads a text file and returns content with specific formatting options
   * @param {string} filePath - The path to the .txt file
   * @param {Object} options - Formatting options
   * @param {boolean} options.removeEmptyLines - Remove empty lines from content
   * @param {boolean} options.trimWhitespace - Trim whitespace from each line
   * @param {string} options.lineSeparator - Custom line separator (default: '\n')
   * @returns {Promise<Object>} JSON object with formatted content
   */
  static async readTextFileWithFormatting(filePath, options = {}) {
    try {
      const defaultOptions = {
        removeEmptyLines: false,
        trimWhitespace: false,
        lineSeparator: '\n'
      };

      const formatOptions = { ...defaultOptions, ...options };

      // Read the file first
      const fileResult = await this.readTextFile(filePath);
      
      if (!fileResult.success) {
        return fileResult;
      }

      let content = fileResult.data.content;

      // Apply formatting options
      if (formatOptions.trimWhitespace) {
        content = content.trim();
      }

      let lines = content.split(formatOptions.lineSeparator);

      if (formatOptions.removeEmptyLines) {
        lines = lines.filter(line => line.trim().length > 0);
      }

      if (formatOptions.trimWhitespace) {
        lines = lines.map(line => line.trim());
      }

      const formattedContent = lines.join(formatOptions.lineSeparator);

      return {
        success: true,
        data: {
          ...fileResult.data,
          content: formattedContent,
          originalContent: fileResult.data.content,
          formattingApplied: formatOptions,
          formattedLineCount: lines.length
        },
        metadata: fileResult.metadata
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
export default TextFileReaderService;

// Also export individual methods for convenience
export const { readTextFile, readMultipleTextFiles, readTextFileWithFormatting } = TextFileReaderService;
