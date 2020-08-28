import React from 'react';
import PropTypes from 'prop-types';
import './list.css';

export const NoteList = ({notes, disabled, onNoteSelection}) => {
  const handleNoteSelection = note => () => onNoteSelection(note)
  return (
    <section className="note-list">
      <ul>
        {notes.map((note) => {
          return (
            <li className="note-list--item" key={note.id}>
              <button
                disabled={disabled}
                className="note-list--item--button"
                onClick={handleNoteSelection(note)}
              >
                {note.title}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

NoteList.defaultProps = {
  disabled: false
}

NoteList.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  })).isRequired,
  disabled: PropTypes.bool,
  onNoteSelection: PropTypes.func.isRequired
}
