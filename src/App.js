import React, {useState}  from 'react';
import './App.css';

import {useNotes, NoteList, NoteViewer, NoteEditor} from './notes';

const modeComponentMapper = {
  view: NoteViewer,
  edit: NoteEditor
}

export const App = () => {
  const {notes, modifyOrCreateNote, deleteNote} = useNotes();
  const [mode, setMode] = useState('view');
  const [selectedNote, setSelectedNote] = useState(notes[0]);

  const handleCancelEditNote = () => {
    if(!selectedNote) {
      setSelectedNote(() => notes[0]);
    }
    setMode(() => 'view');
  }
  const handleAddNewNote = () => {
    setMode(() => 'edit')
    setSelectedNote(() => undefined);
  }
  const handleSaveNote = newNote => {
    const newNotes = modifyOrCreateNote(newNote);
    setMode(() => 'view');
    setSelectedNote(() => newNotes[0]);
  }
  const handleDeleteNote = () => {
    const newNotes = deleteNote(selectedNote.id);
    setMode(() => 'view');
    setSelectedNote(() => newNotes[0]);
  }


  const SecondPanelComponent = modeComponentMapper[mode];
  return (
    <>
      <header className="navbar">
        <h1>Proton Note</h1>
        <button
          disabled={mode === 'edit'}
          onClick={handleAddNewNote}
        >
          + New Note
        </button>
      </header>
      <main className="main-content">
        <NoteList
          notes={notes}
          disabled={mode === 'edit'}
          onNoteSelection={setSelectedNote}
          />
        <SecondPanelComponent
          note={selectedNote}
          onEdit={() => setMode('edit')}
          onCancel={handleCancelEditNote}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          />
      </main>
    </>
  );
}
