import React from 'react';
import {shallow} from 'component-test-utils-react';

import {App} from './App';
import {initialNotes} from './notes/initialNotes';

jest.mock('./notes/initialNotes', () => {
  return {
    initialNotes: [
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
    ]
  }
});


describe('App', () => {
  it('should display view mode by default', () => {
    const cmp = shallow(<App/>);
    expect(cmp.html()).toContain('NoteViewer');
  });

  it('should display the first note by default', () => {
    const cmp = shallow(<App/>);
    expect(cmp.querySelector('NoteViewer').props.note).toBe(initialNotes[0]);
  });

  it('should display edit mode when clicking on edit', () => {
    const cmp = shallow(<App/>);
    cmp.querySelector('NoteViewer').dispatchEvent('edit');
    expect(cmp.html()).toContain('NoteEditor');
  });

  it('should not allow to select note when on edit mode', () => {
    const cmp = shallow(<App/>);
    cmp.querySelector('NoteViewer').dispatchEvent('edit');
    expect(cmp.querySelector('NoteList').props.disabled).toBe(true);
  });

  it('should not allow to click on new note when on edit mode', () => {
    const cmp = shallow(<App/>);
    cmp.querySelector('.navbar button').dispatchEvent('click');
    expect(cmp.querySelector('.navbar button').props.disabled).toBe(true);
  });

  it('should allow to select note when on view mode', () => {
    const cmp = shallow(<App/>);
    expect(cmp.querySelector('NoteList').props.disabled).toBe(false);
  });

  it('should display edit mode when clicking on new note', () => {
    const cmp = shallow(<App/>);
    cmp.querySelector('.navbar button').dispatchEvent('click');
    expect(cmp.html()).toContain('NoteEditor');
  });

  it('should display the second note when click on the second note in the list', () => {
    const cmp = shallow(<App/>);
    cmp.querySelector('NoteList').props.onNoteSelection(initialNotes[1]);
    expect(cmp.querySelector('NoteViewer').props.note).toBe(initialNotes[1]);
  })

  it('should display view mode when delete one note', () => {
    const cmp = shallow(<App/>);
    cmp.querySelector('NoteList').props.onNoteSelection(initialNotes[1]);
    cmp.querySelector('NoteViewer').dispatchEvent('edit');
    cmp.querySelector('NoteEditor').dispatchEvent('delete');
    expect(cmp.html()).toContain('NoteViewer');
  });

  it('should display the first remaining note when delete one note', () => {
    const cmp = shallow(<App/>);
    cmp.querySelector('NoteViewer').dispatchEvent('edit');
    cmp.querySelector('NoteEditor').dispatchEvent('delete');
    expect(cmp.querySelector('NoteViewer').props.note).toEqual(initialNotes[1]);
  });

  it('should delete the second note when click on second note in the list then clicking delete button', () => {
    const cmp = shallow(<App/>);
    cmp.querySelector('NoteList').props.onNoteSelection(initialNotes[1]);
    cmp.querySelector('NoteViewer').dispatchEvent('edit');
    cmp.querySelector('NoteEditor').dispatchEvent('delete');
    expect(cmp.querySelector('NoteList').props.notes).toEqual([initialNotes[0]]);
  });

  it('should not throw error when there is no notes', () => {
    const cmp = shallow(<App/>, {blackList: true});
    cmp.querySelector('NoteViewer').dispatchEvent('edit');
    cmp.querySelector('NoteEditor').dispatchEvent('delete');
    cmp.querySelector('NoteViewer').dispatchEvent('edit');
    cmp.querySelector('NoteEditor').dispatchEvent('delete');
  });

  it('should back to the view mode when click on cancel in edit mode', () => {
    const cmp = shallow(<App/>);
    cmp.querySelector('NoteList').props.onNoteSelection(initialNotes[1]);
    cmp.querySelector('NoteViewer').dispatchEvent('edit');
    cmp.querySelector('NoteEditor').dispatchEvent('cancel');
    expect(cmp.html()).toContain('NoteViewer');
  });

  it('should display first note when cancel creating new note', () => {
    const cmp = shallow(<App/>);
    cmp.querySelector('.navbar button').dispatchEvent('click');
    cmp.querySelector('NoteEditor').dispatchEvent('cancel');
    expect(cmp.html()).toContain('NoteViewer');
  });
});
