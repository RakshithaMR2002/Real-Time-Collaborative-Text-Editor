import { useRef, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";

interface EditorProps {
  username: string;
  language: string;
  theme: string;
  onError?: (error: Error) => void;
  isDebugging?: boolean;
  onLineCountChange?: (count: number) => void;
}

const CodeEditor = ({ username, language, theme, onError, isDebugging, onLineCountChange }: EditorProps) => {
  const editorRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');
    
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Update line count
    const model = editor.getModel();
    const lineCount = model.getLineCount();
    onLineCountChange?.(lineCount);

    // Listen for content changes
    model.onDidChangeContent(() => {
      onLineCountChange?.(model.getLineCount());
      
      // Emit changes to other users
      const content = model.getValue();
      socketRef.current?.emit('codeChange', {
        content,
        username,
        language
      });
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!value) return;
    
    // Handle debugging
    if (isDebugging) {
      try {
        // Basic syntax validation
        if (language === 'javascript') {
          new Function(value);
        }
      } catch (error) {
        console.error('Syntax Error:', error);
      }
    }
  };

  return (
    <Editor
      height="100%"
      defaultLanguage={language.toLowerCase()}
      language={language.toLowerCase()}
      theme={theme === 'light' ? 'light' : 'vs-dark'}
      options={{
        minimap: { enabled: true },
        fontSize: 14,
        lineNumbers: 'off', // We're using custom line numbers
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        renderLineHighlight: 'all',
        highlightActiveIndentGuide: true,
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
        }
      }}
      onMount={handleEditorDidMount}
      onChange={handleEditorChange}
      onError={onError}
    />
  );
};

export default CodeEditor;

import React, { useState, useEffect } from 'react';

interface EditorProps {
  username: string;
  language: string;
  theme: string;
  onError?: (error: Error) => void;
  isDebugging?: boolean;
  onLineCountChange?: (count: number) => void;
}

const Editor: React.FC<EditorProps> = ({ 
  language, 
  theme, 
  onLineCountChange 
}) => {
  const [content, setContent] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    const lineCount = newContent.split('\n').length;
    onLineCountChange?.(lineCount);
  };

  return (
    <textarea
      value={content}
      onChange={handleChange}
      className="w-full h-full resize-none outline-none p-4 font-mono"
      style={{
        backgroundColor: theme === 'light' ? '#ffffff' : '#1e1e1e',
        color: theme === 'light' ? '#000000' : '#ffffff',
        lineHeight: '24px',
        fontSize: '14px',
      }}
      spellCheck={false}
      placeholder={`Write your ${language} code here...`}
    />
  );
};

export default Editor;