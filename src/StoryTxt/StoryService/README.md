# Text File Services

A comprehensive set of services for working with .txt files, including reading file contents and scanning folders for file information.

## Services Overview

### TextFileReaderService
Reads .txt files and returns their contents in JSON format with metadata and error handling.

### FileScannerService
Scans folders and retrieves information about all .txt files including path, title, and metadata.

## Features

- ✅ Read single .txt files with full metadata
- ✅ Read multiple .txt files simultaneously
- ✅ Content formatting options (remove empty lines, trim whitespace)
- ✅ Comprehensive error handling
- ✅ File validation (extension checking, path validation)
- ✅ Rich metadata collection (file size, line count, word count, character count)
- ✅ Promise-based async operations
- ✅ React hook support

## Installation

The services are already included in your project:
- `src/StoryTxt/StoryService/StoryReader.js` - TextFileReaderService
- `src/StoryTxt/StoryService/FileScannerService.js` - FileScannerService

## Basic Usage

### Import the Services

```javascript
// TextFileReaderService
import TextFileReaderService, { 
  readTextFile, 
  readMultipleTextFiles, 
  readTextFileWithFormatting 
} from './StoryReader.js';

// FileScannerService
import FileScannerService, { 
  scanTextFiles, 
  scanMultipleFolders, 
  getFileInfo, 
  createFileManifest 
} from './FileScannerService.js';
```

### Read a Single Text File

```javascript
const result = await TextFileReaderService.readTextFile('./path/to/file.txt');

if (result.success) {
  console.log('Content:', result.data.content);
  console.log('Line count:', result.data.lineCount);
  console.log('Word count:', result.data.wordCount);
} else {
  console.error('Error:', result.error.message);
}
```

### Read Multiple Text Files

```javascript
const filePaths = ['./file1.txt', './file2.txt', './file3.txt'];
const result = await readMultipleTextFiles(filePaths);

if (result.success) {
  console.log('Successful reads:', result.data.successfulCount);
  console.log('Failed reads:', result.data.failedCount);
  result.data.successfulReads.forEach(file => {
    console.log(`${file.data.fileName}: ${file.data.lineCount} lines`);
  });
}
```

### Read with Formatting Options

```javascript
const result = await readTextFileWithFormatting('./file.txt', {
  removeEmptyLines: true,
  trimWhitespace: true,
  lineSeparator: '\n'
});

if (result.success) {
  console.log('Formatted content:', result.data.content);
  console.log('Original lines:', result.data.lineCount);
  console.log('Formatted lines:', result.data.formattedLineCount);
}
```

### Scan a Folder for Text Files

```javascript
const result = await FileScannerService.scanTextFiles('./src/StoryTxt/');

if (result.success) {
  console.log('Total files found:', result.data.totalFiles);
  result.data.files.forEach(file => {
    console.log(`${file.title}: ${file.info}`);
    console.log(`Path: ${file.path}`);
  });
} else {
  console.error('Error:', result.error.message);
}
```

### Get Detailed File Information

```javascript
const result = await getFileInfo('./src/StoryTxt/example.txt');

if (result.success) {
  console.log('Title:', result.data.title);
  console.log('Info:', result.data.info);
  console.log('Line count:', result.data.lineCount);
  console.log('Word count:', result.data.wordCount);
  console.log('File size:', result.data.fileSize, 'characters');
} else {
  console.error('Error:', result.error.message);
}
```

### Scan Multiple Folders

```javascript
const folders = ['./src/StoryTxt/', './src/StoryTxt/StoryService/'];
const result = await scanMultipleFolders(folders);

if (result.success) {
  console.log('Total folders scanned:', result.data.totalFolders);
  console.log('Total files found:', result.data.totalFiles);
  console.log('Successful scans:', result.data.successfulFolders);
  console.log('Failed scans:', result.data.failedFolders);
}
```

## API Reference

### `readTextFile(filePath)`

Reads a single .txt file and returns its contents in JSON format.

**Parameters:**
- `filePath` (string): Path to the .txt file

**Returns:** Promise<Object>
```javascript
{
  success: boolean,
  data: {
    content: string,
    filePath: string,
    fileName: string,
    fileSize: number,
    lineCount: number,
    wordCount: number,
    characterCount: number,
    timestamp: string
  },
  metadata: {
    encoding: string,
    mimeType: string,
    lastModified: string | null
  }
}
```

### `readMultipleTextFiles(filePaths)`

Reads multiple .txt files and returns their contents.

**Parameters:**
- `filePaths` (string[]): Array of file paths

**Returns:** Promise<Object>
```javascript
{
  success: boolean,
  data: {
    successfulReads: Array<Object>,
    failedReads: Array<Object>,
    totalFiles: number,
    successfulCount: number,
    failedCount: number
  },
  timestamp: string
}
```

### `readTextFileWithFormatting(filePath, options)`

Reads a .txt file with formatting options.

**Parameters:**
- `filePath` (string): Path to the .txt file
- `options` (Object): Formatting options
  - `removeEmptyLines` (boolean): Remove empty lines
  - `trimWhitespace` (boolean): Trim whitespace from lines
  - `lineSeparator` (string): Custom line separator

**Returns:** Promise<Object> (same as readTextFile with additional formatting data)

### `scanTextFiles(folderPath)`

Scans a folder and returns information about all .txt files.

**Parameters:**
- `folderPath` (string): Path to the folder to scan

**Returns:** Promise<Object>
```javascript
{
  success: boolean,
  data: {
    folderPath: string,
    totalFiles: number,
    files: Array<{
      path: string,
      title: string,
      info: string
    }>,
    scanTimestamp: string
  },
  metadata: {
    scanMethod: string,
    environment: string
  }
}
```

### `getFileInfo(filePath)`

Gets detailed information about a specific text file.

**Parameters:**
- `filePath` (string): Path to the text file

**Returns:** Promise<Object>
```javascript
{
  success: boolean,
  data: {
    path: string,
    title: string,
    info: string,
    fileName: string,
    fileSize: number,
    lineCount: number,
    wordCount: number,
    characterCount: number,
    firstLine: string,
    lastModified: string | null,
    timestamp: string
  }
}
```

### `scanMultipleFolders(folderPaths)`

Scans multiple folders and returns combined information.

**Parameters:**
- `folderPaths` (string[]): Array of folder paths

**Returns:** Promise<Object>
```javascript
{
  success: boolean,
  data: {
    successfulScans: Array<Object>,
    failedScans: Array<Object>,
    totalFolders: number,
    successfulFolders: number,
    failedFolders: number,
    totalFiles: number,
    scanTimestamp: string
  }
}
```

### `createFileManifest(folderPath)`

Creates a file manifest for the specified folder.

**Parameters:**
- `folderPath` (string): Path to the folder

**Returns:** Promise<Object>
```javascript
{
  success: boolean,
  data: {
    folderPath: string,
    generatedAt: string,
    textFiles: Array<Object>,
    totalFiles: number
  }
}
```

## React Hook Usage

```javascript
import { useTextFileReader } from './usage-example.js';

function MyComponent() {
  const { fileContent, loading, error, loadTextFile } = useTextFileReader();

  useEffect(() => {
    loadTextFile('./src/StoryTxt/example.txt');
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!fileContent) return <div>No content</div>;

  return (
    <div>
      <h2>{fileContent.fileName}</h2>
      <p>Lines: {fileContent.lineCount}</p>
      <p>Words: {fileContent.wordCount}</p>
      <pre>{fileContent.content}</pre>
    </div>
  );
}
```

### FileScannerService Hook

```javascript
import { useFileScanner } from './scanner-usage-example.js';

function FileListComponent({ folderPath }) {
  const { scanResults, loading, error, scanFolder } = useFileScanner();

  useEffect(() => {
    if (folderPath) {
      scanFolder(folderPath);
    }
  }, [folderPath]);

  if (loading) return <div>Scanning folder...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!scanResults) return <div>No scan results</div>;

  return (
    <div className="file-list">
      <h3>Files in {scanResults.folderPath}</h3>
      <p>Total files: {scanResults.totalFiles}</p>
      
      <div className="files">
        {scanResults.files.map((file, index) => (
          <div key={index} className="file-item">
            <h4>{file.title}</h4>
            <p>{file.info}</p>
            <small>Path: {file.path}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Error Handling

The service provides comprehensive error handling:

```javascript
const result = await readTextFile('./invalid-file.txt');

if (!result.success) {
  console.error('Error type:', result.error.type);
  console.error('Error message:', result.error.message);
  console.error('Timestamp:', result.error.timestamp);
}
```

Common error scenarios:
- File not found
- Invalid file path
- Non-.txt file extension
- Network errors
- File access permissions

## File Requirements

- Files must have `.txt` extension
- Files must be accessible via HTTP/HTTPS (for browser environments)
- Files should be UTF-8 encoded

## Examples

See the following files for comprehensive usage examples:
- `usage-example.js` - TextFileReaderService examples
- `scanner-usage-example.js` - FileScannerService examples

You can run these examples in the browser console to test the services.

## Browser Compatibility

This service works in all modern browsers that support:
- ES6+ (async/await, Promise)
- Fetch API
- ES6 modules

## License

This service is part of your project and follows the same license terms. 