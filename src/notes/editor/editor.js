import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {encryptNote} from '../../encryption';

import './editor.css';

export const NoteEditor = ({note, onCancel, onSave, onDelete}) => {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState(false);

  const [newNote, setNewNote] = useState(note ? {...note} : {
    title: '',
    content: ''
  });
  const handleTitleChange = e => setNewNote({
    ...newNote,
    title: e.target.value
  });
  const handleContentChange = e => setNewNote({
    ...newNote,
    content: e.target.value
  });

  const handleSave = () => {
    setIsEncrypting(true);
    encryptNote(newNote)
      .then((encryptedNote) => {
        setIsEncrypting(() => false);
        onSave(encryptedNote)
      })
      .catch(err => {
        console.error(err);
        setIsEncrypting(() => false);
        setError(() => true);
      })
  };
  const handleDelete = () => onDelete();

  if(isEncrypting) {
    return 'Encryption of the note';
  }
  if(error) {
    return 'Oops an error occured during encryption';
  }

  return (
    <section className="note-editor">
      <article className="note-editor--content">
      <input
        type="text"
        className="note-editor--content--title"
        value={newNote.title}
        onChange={handleTitleChange}
        required/>
      <textarea
        className="note-editor--content--markdown"
        value={newNote.content}
        onChange={handleContentChange}
        required
        />
      </article>
      <div className="note-editor--actions">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={handleSave}>Save</button>
        {note && <button onClick={handleDelete}>Delete</button>}
      </div>
    </section>
  )
}

NoteEditor.defaultProps = {
  onCancel: () => {},
  onSave: () => {},
  onDelete: () => {},
}

NoteEditor.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }),
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
}
