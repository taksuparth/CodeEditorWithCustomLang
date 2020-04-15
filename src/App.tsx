//lib
import React, { useState, useCallback, useMemo } from 'react';
import CodeMirror from './CodeMirror';
import codeMirror from 'codemirror';

//codeMirror addons
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/material.css';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';

//styles
import './styles.css';
import 'codemirror/lib/codemirror.css';


const App = () => {
  const [code, setCode] = useState<string>('// Code');
  
  const updateCode = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const codeMirrorOptions = useMemo(() => ({
    readOnly: false,
    lineNumbers: true,
    mode: 'javascript',
    theme: 'material',
    autoCloseBrackets: true,
    matchBrackets: true,
    foldGutter: true,
    extraKeys: {
      "Ctrl-Space": "autocomplete",
      "Cmd-Space": "autocomplete",
    },
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    tabSize: 2,
    indentWithTabs: true,
  }), []);

  return (
    <div>
      <span>Hello Sir!</span>
      <p>
        Start editing to see some magic happen :)
      </p>
      <CodeMirror value={code} onChange={updateCode} options={codeMirrorOptions} autoFocus />
    </div>
  );
}

export default App;