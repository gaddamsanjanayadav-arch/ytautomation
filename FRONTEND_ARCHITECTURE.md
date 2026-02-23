# 🎨 Frontend Architecture Guide

## Overview

The frontend is a **React + Vite + Tailwind CSS** application that provides an intuitive UI for creating mixtape videos. It follows component-based architecture with centralized API communication.

---

## Directory Structure

```
frontend/
├── src/
│   ├── main.jsx                       # React entry point
│   ├── index.css                      # Tailwind directives
│   ├── App.css                        # App-level styles
│   ├── App.jsx                        # Main app component
│   ├── services/
│   │   └── api.js                     # HTTP client (Axios)
│   ├── components/                    # React components (7 total)
│   │   ├── HeroSection.jsx            # Landing section
│   │   ├── StepIndicator.jsx          # Progress tracker (1-4)
│   │   ├── UploadPanel.jsx            # Drag-drop upload
│   │   ├── TracklistPreview.jsx       # Selected songs list
│   │   ├── GenerateButton.jsx         # Action button
│   │   ├── DescriptionSection.jsx     # Output display
│   │   └── UploadProgressIndicator.jsx# Progress modal
│   └── assets/                        # Images, logos (optional)
│
├── public/                            # Static files
├── index.html                         # HTML entry point
├── vite.config.js                    # Vite configuration
├── tailwind.config.js                # Tailwind theme
├── postcss.config.js                 # PostCSS config
├── eslint.config.js                  # ESLint rules
├── package.json                      # Dependencies
└── package-lock.json                 # Lock file
```

---

## Core Files Explained

### 1. `main.jsx` - React Entry Point

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Purpose**: Bootstrap React application
**Renders**: App component into `#root` div in index.html

---

### 2. `index.html` - HTML Structure

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>YouTube Mixtape - Create Professional Music Videos</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Purpose**: HTML container
**Key**: `<div id="root">` - React mounts here

---

### 3. `App.jsx` - Main Component

**Responsibilities**:
- Manage overall application state
- Orchestrate all 7 child components
- Handle API communication
- Track progress through 4 steps
- Manage dark mode toggle

**State Variables**:
```javascript
const [currentStep, setCurrentStep] = useState(1)    // Step 1-4
const [selectedFiles, setSelectedFiles] = useState([])
const [isLoading, setIsLoading] = useState(false)
const [uploadProgress, setUploadProgress] = useState(0)
const [showProgress, setShowProgress] = useState(false)
const [generatedDescription, setGeneratedDescription] = useState('')
const [videoPath, setVideoPath] = useState('')
const [errorMessage, setErrorMessage] = useState('')
const [darkMode, setDarkMode] = useState(false)
```

**Key Functions**:
- `handleFilesSelected()` - Accept files from UploadPanel
- `handleGenerateClick()` - Call backend API
- `handleRemoveFile()` - Remove from selection
- `toggleDarkMode()` - Switch theme

**Component Tree**:
```
App
├─ HeroSection
├─ StepIndicator
├─ UploadPanel
├─ TracklistPreview
├─ GenerateButton
├─ DescriptionSection
└─ UploadProgressIndicator
```

---

### 4. `services/api.js` - HTTP Client

**Purpose**: Centralized Axios wrapper for backend communication

**Key Functions**:

#### `generateVideo(songs, onProgressUpdate)`
```javascript
const formData = new FormData()
songs.forEach(file => formData.append('files', file))

return axiosInstance.post('/generate', formData, {
  onUploadProgress: (event) => {
    const progress = Math.round((event.loaded * 100) / event.total)
    onProgressUpdate(progress)
  }
})
```

**What it does**:
- Takes array of File objects
- Creates FormData with all files
- Sends to `POST /generate`
- Reports progress in real-time

#### `downloadVideo(videoPath)`
```javascript
window.open(`${API_BASE_URL}${videoPath}`)
```

**What it does**:
- Opens download link in new tab
- Browser automatically downloads MP4

#### `healthCheck()`
```javascript
return axiosInstance.get('/health')
```

**What it does**:
- Verifies backend is running
- Called on app load

---

## Component Details

### 1. HeroSection.jsx

**Purpose**: Landing section with visual appeal

**Features**:
- Full-screen gradient background
- Animated blob shapes
- Feature highlights
- Call-to-action messaging

**Key Props**: None (renders static content)

**Styling**:
- Gradient: blue (100) → cyan (200)
- Animated blobs with Tailwind animations
- Responsive typography

---

### 2. StepIndicator.jsx

**Purpose**: Show progress through 4-step workflow

**Flow**:
```
Step 1: Upload Files
  ↓
Step 2: Review & Generate  
  ↓
Step 3: View Description
  ↓
Step 4: Download Video
```

**Key Props**:
```javascript
<StepIndicator currentStep={currentStep} />
```

**Visual**:
- Circles for each step
- Checkmarks for completed
- Connecting lines
- Dynamic coloring

---

### 3. UploadPanel.jsx

**Purpose**: Drag-drop file upload interface

**Features**:
- Drag-and-drop zone (click to upload)
- File validation (audio only)
- Visual feedback (hover state)
- Remove button for each file

**Key Props**:
```javascript
<UploadPanel 
  onFilesSelected={handleFilesSelected}
  selectedFiles={selectedFiles}
  onRemoveFile={handleRemoveFile}
/>
```

**Validation**:
```javascript
const audioMimes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4']
// Only accept audio files
```

---

### 4. TracklistPreview.jsx

**Purpose**: Display selected songs in numbered list

**Features**:
- Scrollable container
- File metadata display
- Count badge
- Clean typography

**Key Props**:
```javascript
<TracklistPreview selectedFiles={selectedFiles} />
```

**Display Format**:
```
1. Song_Name_1.mp3 (3.5 MB)
2. Song_Name_2.mp3 (4.2 MB)
3. Song_Name_3.mp3 (2.8 MB)
```

---

### 5. GenerateButton.jsx

**Purpose**: Action button to start video generation

**Features**:
- Gradient styling
- Loading spinner animation
- Disabled state when no files
- Pulse animation on hover

**Key Props**:
```javascript
<GenerateButton
  isLoading={isLoading}
  hasFiles={selectedFiles.length > 0}
  onClick={handleGenerateClick}
/>
```

**States**:
- **Ready**: Blue gradient, clickable
- **Loading**: Spinner animation
- **Disabled**: Gray, no files selected

---

### 6. DescriptionSection.jsx

**Purpose**: Display generated YouTube description

**Features**:
- Read-only textarea
- Copy-to-clipboard button
- Download button
- Formatted text display

**Key Props**:
```javascript
<DescriptionSection
  description={generatedDescription}
  videoPath={videoPath}
/>
```

**Functionality**:
- Show at Step 3
- Copy text to clipboard
- Trigger video download on button click

---

### 7. UploadProgressIndicator.jsx

**Purpose**: Modal showing upload & processing progress

**Features**:
- Overlay modal
- Animated progress bar
- Percentage display
- Bouncing animation

**Key Props**:
```javascript
<UploadProgressIndicator
  show={showProgress}
  progress={uploadProgress}
/>
```

**Progress Stages**:
- 0-20%: Uploading files
- 20-50%: Audio processing
- 50-90%: Video encoding
- 90-100%: Finalizing

---

## Data Flow

### Complete User Interaction Flow

```
┌─────────────────────────────────────────────────┐
│  User opens app (Step 1)                        │
│  Sees HeroSection + UploadPanel                 │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────▼──────────┐
        │ User drags files   │
        │ onFilesSelected()  │
        │ Updates state      │
        └─────────┬──────────┘
                  │
        ┌─────────▼──────────────────────┐
        │ StepIndicator updates to 1     │
        │ TracklistPreview shows files   │
        │ GenerateButton becomes active  │
        └─────────┬──────────────────────┘
                  │
        ┌─────────▼──────────┐
        │ User clicks button │
        │ Modal shows        │
        │ Progress = 0       │
        └─────────┬──────────┘
                  │
        ┌─────────▼────────────────────────┐
        │ api.generateVideo() called       │
        │ - FormData created               │
        │ - POST /generate sent            │
        │ - onProgressUpdate callback      │
        │ - Progress bar updates (0-95%)   │
        └─────────┬────────────────────────┘
                  │
        ┌─────────▼──────────────────────┐
        │ Backend processing complete    │
        │ Progress = 100%                │
        │ Modal closes                   │
        │ StepIndicator → Step 3         │
        └─────────┬──────────────────────┘
                  │
        ┌─────────▼─────────────────────────────┐
        │ DescriptionSection shows:             │
        │ - Generated description               │
        │ - Copy button                         │
        │ - Download button                     │
        └─────────┬─────────────────────────────┘
                  │
        ┌─────────▼──────────┐
        │  User downloads    │
        │  Video downloaded  │
        │  Step 4 complete   │
        └────────────────────┘
```

---

## State Management

### State Variables Summary

| Variable | Type | Purpose |
|----------|------|---------|
| `currentStep` | number (1-4) | Track workflow progress |
| `selectedFiles` | array | Uploaded audio files |
| `isLoading` | boolean | Set during API call |
| `uploadProgress` | number (0-100) | Progress bar percentage |
| `showProgress` | boolean | Show/hide modal |
| `generatedDescription` | string | YouTube description |
| `videoPath` | string | Download URL |
| `errorMessage` | string | Error display |
| `darkMode` | boolean | Theme toggle |

### State Updates

```javascript
// On file upload
setSelectedFiles([...files])
setCurrentStep(1)

// On generate click
setShowProgress(true)
setCurrentStep(2)
setUploadProgress(0)

// On progress update (callback)
setUploadProgress(newProgress)

// On API success
setCurrentStep(3)
setGeneratedDescription(response.description)
setVideoPath(response.video_path)

// On download
// User downloads video (Step 4)
```

---

## Styling with Tailwind CSS

### Configuration

**tailwind.config.js**:
```javascript
export default {
  content: ["./src/**/*.{jsx,js}"],
  darkMode: "class",
  theme: {
    colors: {
      primary: { 100: "#0ea5e9", 200: "#06b6d4" },
      dark: { 1: "#1a1a2e", 2: "#16213e", 3: "#0f3460" },
      // ... more colors
    },
    extend: {
      keyframes: {
        "fade-in": { /* animation */ },
        "slide-up": { /* animation */ },
      },
    },
  },
}
```

### Utility Classes Used

**Layout**:
- `flex`, `grid` - Flexbox/Grid layout
- `w-full`, `h-screen` - Sizing
- `p-8`, `m-4` - Spacing

**Colors**:
- `bg-gradient` - Gradient backgrounds
- `text-white`, `text-gray-900` - Text colors
- `dark:bg-dark-1` - Dark mode

**Effects**:
- `rounded-lg`, `rounded-full` - Border radius
- `shadow-lg` - Shadows
- `hover:scale-105` - Interactive effects
- `transition` - Smooth animations

---

## Component Communication

### Props Flow

```
App (state holder)
│
├─ HeroSection (no props needed)
│
├─ StepIndicator
│  └─ Props: currentStep
│
├─ UploadPanel
│  └─ Props: onFilesSelected, selectedFiles, onRemoveFile
│  └─ Emits: handleFilesSelected(files)
│
├─ TracklistPreview
│  └─ Props: selectedFiles
│
├─ GenerateButton
│  └─ Props: isLoading, hasFiles, onClick
│  └─ Emits: handleGenerateClick()
│
├─ DescriptionSection
│  └─ Props: description, videoPath
│
└─ UploadProgressIndicator
   └─ Props: show, progress
```

### Data Flow Direction

All state in **App.jsx** (single source of truth)
Components pass data down via props
Components emit events via callbacks

---

## API Integration

### Request Flow

```javascript
// In App.jsx handleGenerateClick()
const response = await api.generateVideo(selectedFiles, (progress) => {
  setUploadProgress(progress)
})

// Sets state from response
setGeneratedDescription(response.description)
setVideoPath(response.video_path)
```

### Error Handling

```javascript
try {
  const response = await api.generateVideo(...)
  // Handle success
} catch (error) {
  setErrorMessage(error.message)
  console.error(error)
}
```

---

## Dark Mode

### Implementation

**Toggle Function**:
```javascript
const toggleDarkMode = () => {
  setDarkMode(!darkMode)
  localStorage.setItem('darkMode', JSON.stringify(!darkMode))
}
```

**HTML Update**:
```javascript
<html className={darkMode ? 'dark' : ''}>
```

**Tailwind Classes**:
```jsx
<div className="bg-white dark:bg-dark-1">
  {/* Light mode: white, Dark mode: dark-1 */}
</div>
```

**Persistence**:
- Saved to localStorage
- Restored on app load

---

## Performance Optimizations

### Code Splitting

Components imported normally (Vite handles)

### Memoization

Consider for complex components:
```javascript
export default React.memo(TracklistPreview)
```

### Event Handling

Debounce file drag events (already optimized)

---

## Build & Deployment

### Development

```bash
npm run dev
# Starts on http://localhost:5173
# Hot Module Replacement (HMR) enabled
```

### Production Build

```bash
npm run build
# Outputs to dist/
```

### Preview Build

```bash
npm run preview
# Test production build locally
```

---

## File Size Analysis

| File | Size | Purpose |
|------|------|---------|
| App.jsx | ~3kb | Main orchestrator |
| api.js | ~2kb | HTTP client |
| Components/* | ~8kb | 7 components |
| index.css | ~50 bytes | Directives only |
| Total JS | ~20kb | Minified |

---

## Browser Compatibility

**Supported**:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements**:
- ES6+ support
- Fetch API
- FormData API
- Window.open() for downloads

---

## Debugging

### React DevTools

Install browser extension to inspect component tree

### Console Logging

```javascript
console.log('Files selected:', selectedFiles)
console.log('Progress:', uploadProgress)
console.log('API Response:', response)
```

### Network Tab

Monitor API requests in DevTools Network tab

---

## Common Issues & Solutions

### Issue: Files not uploading
**Solution**: Check `api.js` createFormData function
```javascript
const formData = new FormData()
files.forEach(file => formData.append('files', file))
```

### Issue: Progress bar stuck at 95%
**Solution**: Backend response delay - wait for completion

### Issue: Dark mode not persisting
**Solution**: Check localStorage in DevTools
```javascript
localStorage.setItem('darkMode', JSON.stringify(isDark))
```

---

## Extension Ideas

### Add Features
- Drag to reorder tracks
- Preview audio with waveform
- Upload history
- Custom artist name input
- Multiple cover art options

### UI Improvements
- Loading skeleton screens
- Toast notifications
- Keyboard shortcuts
- Accessibility (ARIA labels)

---

## Quick Reference

| Component | File | Lines | Purpose |
|-----------|------|-------|---------|
| Main App | App.jsx | ~200 | State & orchestration |
| API Client | api.js | ~80 | HTTP wrapper |
| Hero | HeroSection.jsx | ~60 | Landing section |
| Steps | StepIndicator.jsx | ~80 | Progress tracker |
| Upload | UploadPanel.jsx | ~100 | Drag-drop |
| List | TracklistPreview.jsx | ~60 | File display |
| Button | GenerateButton.jsx | ~70 | Action |
| Output | DescriptionSection.jsx | ~80 | Results |
| Modal | UploadProgressIndicator.jsx | ~90 | Progress |

---

## Next Steps

- Check [README.md](README.md) for overall project info
- Check [BACKEND_ARCHITECTURE.md](../BACKEND_ARCHITECTURE.md) for backend details
- Check each component file for implementation details

**Questions?** Check JSDoc comments in component files!
