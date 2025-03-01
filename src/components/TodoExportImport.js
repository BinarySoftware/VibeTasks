import React, { useRef } from 'react';
import './TodoExportImport.css';

function TodoExportImport({ exportTodos, importTodos }) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="todo-export-import">
      <button 
        className="export-button"
        onClick={exportTodos}
      >
        Export Tasks
      </button>
      <button 
        className="import-button"
        onClick={handleImportClick}
      >
        Import Tasks
      </button>
      <input
        type="file"
        ref={fileInputRef}
        className="import-input"
        accept=".json"
        onChange={importTodos}
      />
    </div>
  );
}

export default TodoExportImport; 