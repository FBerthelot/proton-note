import React from 'react';
import {shallow} from 'component-test-utils-react';

import {NoteList} from './';

describe('NoteList', () => {
  let notes;

  beforeEach(() => {
      notes = [
        {
          id: 1,
          title: 'My first note',
          content: `
            #title

            > test of markdown
          `
        },
        {
          id: 2,
          title: 'My second note',
          content: `
            hello world
          `
        }
      ];
  });

  it('should display whole list of notes', () => {
    const html = shallow(<NoteList notes={notes} onNoteSelection={jest.fn()}/>).html();
    notes.forEach(note => {
      expect(html).toContain(note.title);
    });
  });

  it('should disptach onNoteSelection when click on a element of the list', () => {
    const handleNoteSelection = jest.fn();
    const cmp = shallow(<NoteList notes={notes} onNoteSelection={handleNoteSelection}/>);
    expect(handleNoteSelection).not.toHaveBeenCalled();
    cmp.querySelector('button').dispatchEvent('click');
    expect(handleNoteSelection).toHaveBeenCalledWith(notes[0]);
  })

  it('should not disptach onNoteSelection when list is disabled', () => {
    const handleNoteSelection = jest.fn();
    const cmp = shallow(<NoteList notes={notes} disabled onNoteSelection={handleNoteSelection}/>);
    const buttons = cmp.querySelectors('button');
    buttons.forEach(button => {
      expect(button.props.disabled).toBe(true);
    });
  })

  it('should no throw an error when there is no note', () => {
    shallow(<NoteList notes={[]} onNoteSelection={jest.fn()}/>).html();
  });
});
