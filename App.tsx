import React, { useState, useEffect } from "react";
import Editor from "./components/editor";

interface EditorProps {
  username: string;
  language: string;
  theme: string;
  onError?: (error: Error) => void;
  isDebugging?: boolean;
  onLineCountChange?: (count: number) => void;
}

// Update the LineNumbers component
const LineNumbers = ({ count }: { count: number }) => (
  <div 
    className="select-none py-4 text-right font-mono text-sm"
    style={{ 
      backgroundColor: '#1e1e1e', // Dark background
      color: '#858585', // Muted text color
      minWidth: '3.5rem',
      paddingRight: '0.75rem',
      position: 'sticky',
      left: 0
    }}
  >
    {Array.from({ length: Math.max(count, 1) }, (_, i) => (
      <div 
        key={i + 1} 
        className="hover:text-white cursor-pointer leading-6"
        style={{ height: '24px' }}
      >
        {i + 1}
      </div>
    ))}
  </div>
);

const App = () => {
  const [user, setUser] = useState<string>("");
  const [formData, setFormData] = useState<string>("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("light");
  const [isDebugging, setIsDebugging] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [lineCount, setLineCount] = useState(1);

  // Add theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Add form validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.trim()) {
      alert("Please enter your name");
      return;
    }
    setUser(`${formData.trim()}-${Math.round(Math.random() * 1000)}`);
  };

  if (user === "") {
    return (
      <div className="fixed w-full flex justify-center items-center h-screen top-0 left-0" style={{ backgroundColor: 'var(--background-color)' }}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-4 w-96 p-8 rounded-xl"
          style={{
            backgroundColor: 'var(--editor-bg)',
            boxShadow: '0 4px 6px -1px var(--shadow-color)',
            border: '2px solid var(--border-color)'
          }}
        >
          <label
            htmlFor="username"
            className="text-xl font-semibold"
            style={{ color: 'var(--text-color)' }}
          >
            Enter your name:
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="p-3 rounded-lg outline-none"
            style={{
              backgroundColor: 'var(--toolbar-bg)',
              color: 'var(--text-color)',
              border: '2px solid var(--border-color)'
            }}
            value={formData}
            onChange={(e) => setFormData(e.target.value)}
          />
          <p style={{ color: 'var(--text-color)' }}>
            Enter your name to start collaborating in a room.
          </p>
          <div className="flex justify-end">
            <button
              type="submit"
              className="p-2 px-6 rounded-lg transition-colors duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white'
              }}
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Add error boundary for Editor
  // Modify error handler to return JSX
  const handleEditorError = (error: Error) => {
    console.error('Editor Error:', error);
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg border border-red-200">
        <p className="font-semibold">Error loading editor</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  };

  const handleSaveCode = async () => {
    try {
      // Implement save functionality
      const savedId = Math.random().toString(36).substring(7);
      setShareLink(`${window.location.origin}/share/${savedId}`);
    } catch (error) {
      console.error('Failed to save code:', error);
    }
  };

  const handleDebugToggle = () => {
    setIsDebugging(!isDebugging);
  };

  // Update the editor container styling
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white">
      <div className="h-screen flex flex-col">
        <nav className="px-4 py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>
                <span className="text-3xl">⌨️</span> CodeCollab
              </h1>
              <div className="flex items-center gap-2 px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--toolbar-bg)' }}>
                <span className="text-sm opacity-75">File:</span>
                <span className="text-sm font-mono">main.{language}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-lg transition-colors duration-200"
                style={{ backgroundColor: 'var(--toolbar-bg)' }}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <div className="flex items-center gap-2 px-3 py-1 rounded-md" style={{ backgroundColor: 'var(--toolbar-bg)' }}>
                <span>👤</span>
                {user}
              </div>
            </div>
          </div>
        </nav>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 p-4 border-r bg-[#252526] border-[#3e3e42]">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 rounded-lg mb-4"
              style={{ backgroundColor: 'var(--editor-bg)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="typescript">TypeScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
            </select>
            <div className="space-y-3">
              <button
                onClick={handleSaveCode}
                className="w-full flex items-center gap-2 p-2 rounded hover:opacity-80"
                style={{ backgroundColor: 'var(--editor-bg)' }}
              >
                <span>💾</span> Save & Share
              </button>
              
              <button
                onClick={handleDebugToggle}
                className="w-full flex items-center gap-2 p-2 rounded hover:opacity-80"
                style={{ 
                  backgroundColor: isDebugging ? 'var(--primary-color)' : 'var(--editor-bg)',
                  color: isDebugging ? 'white' : 'inherit'
                }}
              >
                <span>🐛</span> Debug Mode
              </button>

              {shareLink && (
                <div className="p-2 rounded text-sm" style={{ backgroundColor: 'var(--editor-bg)' }}>
                  <p className="mb-1 opacity-75">Share Link:</p>
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="w-full p-1 rounded text-xs"
                    style={{ backgroundColor: 'var(--toolbar-bg)' }}
                    onClick={(e) => e.currentTarget.select()}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex">
            <div className="flex-1 flex overflow-hidden">
              <LineNumbers count={lineCount} />
              <div 
                className="flex-1 overflow-auto"
                style={{ 
                  backgroundColor: '#1e1e1e',
                  fontFamily: 'Consolas, Monaco, monospace'
                }}
              >
                <ErrorBoundary fallback={handleEditorError}>
                  <Editor 
                    username={user} 
                    language={language} 
                    theme="vs-dark"
                    onError={handleEditorError}
                    isDebugging={isDebugging}
                    onLineCountChange={setLineCount}
                  />
                </ErrorBoundary>
              </div>
            </div>
            
            {isDebugging && (
              <div className="w-64 border-l p-4 overflow-y-auto bg-[#252526] border-[#3e3e42]">
                <h3 className="font-semibold mb-3">Debug Console</h3>
                <div className="space-y-2 text-sm">
                  <div>No breakpoints set</div>
                  <div>Click line numbers to add breakpoints</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-2 text-sm flex justify-between items-center border-t bg-[#252526] border-[#3e3e42] text-[#858585]"
          style={{ backgroundColor: 'var(--toolbar-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-4">
            <span>{language.toUpperCase()}</span>
            <span>UTF-8</span>
            {isDebugging && <span className="text-green-500">●</span>}
          </div>
          <div className="flex items-center gap-4">
            <span>Ln 1, Col 1</span>
            <span>Spaces: 2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add ErrorBoundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: (error: Error) => React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback: (error: Error) => React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error);
    }
    return this.props.children;
  }
}

export default App;
