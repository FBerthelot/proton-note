import React from 'react';
import {shallow} from 'component-test-utils-react';

import {NoteViewer} from './';
import {decrypt} from '../../encryption';

jest.mock('../../encryption', () => {
  return {
    decrypt: jest.fn()
  };
})

describe('NoteViewer', () => {
  let note;
  const consoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
    note = {
      id: 1,
      title: 'My first note',
      content: `# hello, markdown!`
    };

    decrypt.mockImplementation(data => ({
      then: cb => {
        cb(data);
        return {catch: () => {}}
      }
    }));
  });

  afterEach(() => {
    console.error = consoleError;
  })

  it('should display the title note', () => {
    const handleEdit = jest.fn();
    const cmp = shallow(<NoteViewer note={note} onEdit={handleEdit}/>);
    cmp.setProps({
      note,
      onEdit: handleEdit
    })
    expect(cmp.html()).toContain(note.title);
  });

  it('should disptach onEdit when click on the edit button', () => {
    const handleEdit = jest.fn();
    const cmp = shallow(<NoteViewer note={note} onEdit={handleEdit}/>);
    cmp.setProps({
      note,
      onEdit: handleEdit
    })
    expect(handleEdit).not.toHaveBeenCalled();
    cmp.querySelector('button').dispatchEvent('click');
    expect(handleEdit).toHaveBeenCalled();
  })

  it('should display markdown content as html', () => {
    const handleEdit = jest.fn();
    const cmp = shallow(<NoteViewer note={note} onEdit={jest.fn()}/>);
    cmp.setProps({
      note,
      onEdit: handleEdit
    })
    expect(cmp.querySelector('.note-viewer--content--markdown').props.dangerouslySetInnerHTML).toEqual({
      __html: `<h1 id="hellomarkdown">hello, markdown!</h1>`
    });
  });

  it('should no throw an error when there is no note', () => {
    shallow(<NoteViewer onEdit={jest.fn()}/>).html();
  });

  it('should display a message when decrypt note', () => {
    decrypt.mockImplementation(data => Promise.resolve(data));
    const cmp = shallow(<NoteViewer note={note} onEdit={jest.fn()}/>);
    expect(cmp.html()).toContain('Decryption...');
  });

  it('should display a message when decrypt failed', () => {
    const handleEdit = jest.fn();
    decrypt.mockImplementation(data => ({
      then: () => {
        return {catch: cb => {
          cb(new Error('Decryption failed :\'('))
        }}
      }
    }));
    const cmp = shallow(<NoteViewer note={note} onEdit={jest.fn()}/>);
    cmp.setProps({
      note,
      onEdit: handleEdit
    })
    expect(cmp.html()).toContain('Decryption failed :\'(');
  });

  it('should display a message in console when encrypt failed', () => {
    decrypt.mockImplementation(data => ({
      then: () => {
        return {catch: cb => {
          cb(new Error('Decryption failed :\'('))
        }}
      }
    }));

    shallow(<NoteViewer note={note} onEdit={jest.fn()}/>);

    expect(console.error).toHaveBeenCalled();
  });
});
