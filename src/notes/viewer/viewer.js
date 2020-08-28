import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import showdown from 'showdown';

import './viewer.css';
import {decrypt} from '../../encryption';

const converter = new showdown.Converter();

export const NoteViewer = ({note, onEdit}) => {
  const [decryptedNote, setDecryptedNote] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    if(!note) {
      return;
    }

    setDecryptedNote();
    decrypt(note)
      .then((n) => {
        setDecryptedNote(n);
      })
      .catch(err => {
        setError(true);
        console.error(err);
      });
  }, [note, setDecryptedNote, setError])

  if(!note) {
    return '';
  }

  if(error) {
    return 'Decryption failed :\'(';
  }

  if(!decryptedNote) {
    return 'Decryption...';
  }

  return (
    <section className="note-viewer">
      <article className="note-viewer--content">
      <h2 className="note-viewer--content--title">{decryptedNote.title}</h2>
      <div className="note-viewer--content--markdown" dangerouslySetInnerHTML={{__html: converter.makeHtml(decryptedNote.content)}} />
      </article>
      <div className="note-viewer--actions">
        <button onClick={onEdit}>Edit</button>
      </div>
    </section>
  )
}

NoteViewer.defaultProps = {
  note: null
}

NoteViewer.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }),
  onEdit: PropTypes.func.isRequired
}
