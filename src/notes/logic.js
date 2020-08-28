import {useState} from 'react';
import {initialNotes} from './initialNotes';

export const useNotes = () => {
  const [notes, setNotes] = useState(initialNotes);
  const modifyOrCreateNote = (newNote) => {
    const newNotes = newNote.id === undefined
      ? [
          ...notes,
          {
            ...newNote,
            id: notes[notes.length - 1].id + 1
          }
        ]
      : notes.map(note => note.id === newNote.id ? newNote : note);

    setNotes(newNotes);
    return newNotes;
  }

  const deleteNote = id => {
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    return newNotes;
  }

  return {
    notes,
    modifyOrCreateNote,
    deleteNote
  }
}
