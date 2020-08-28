import React from 'react';
import {shallow} from 'component-test-utils-react';

import {NoteEditor} from './';
import {encryptNote} from '../../encryption';

jest.mock('../../encryption', () => {
  return {
    encryptNote: jest.fn()
  };
})

describe('NoteEditor', () => {
  const consoleError = console.error;
  beforeEach(() => {
    console.error = jest.fn();
    encryptNote.mockImplementation(data => {
      return {
        then: cb => {
          cb(data)
          return {catch: () => {}}
        }
      }
    });
  })

  afterEach(() => {
    console.error = consoleError;
  })

  it('should display empty fields when creating a note', () => {
    const cmp = shallow(<NoteEditor/>);
    expect(cmp.querySelector('input').props.value).toBe('');
    expect(cmp.querySelector('textarea').props.value).toBe('');
  });

  it('should initialize forms with note value when editing existing note', () => {
    const cmp = shallow(<NoteEditor note={{id: 3, title: 'title', content: 'content'}}/>);
    expect(cmp.querySelector('input').props.value).toBe('title');
    expect(cmp.querySelector('textarea').props.value).toBe('content');
  })

  it('should dispatch onSave with modified note value when clicking on save button', () => {
    const handleSave = jest.fn();
    const cmp = shallow(<NoteEditor note={{id: 3, title: 'title', content: 'content'}} onSave={handleSave}/>);
    cmp.querySelector('input').props.onChange({target: {value: 'title modifed'}});
    cmp.querySelector('textarea').props.onChange({target: {value: 'content modifed'}});
    cmp.querySelectors('button')[1].dispatchEvent('click');

    expect(handleSave).toHaveBeenCalledWith({
      id: 3,
      title: 'title modifed',
      content: 'content modifed'
    })
  });

  it('should dispatch onSave with created note value when clicking on save button', () => {
    const handleSave = jest.fn();
    const cmp = shallow(<NoteEditor onSave={handleSave}/>);
    cmp.querySelector('input').props.onChange({target: {value: 'title created'}});
    cmp.querySelector('textarea').props.onChange({target: {value: 'content created'}});
    cmp.querySelectors('button')[1].dispatchEvent('click');

    expect(handleSave).toHaveBeenCalledWith({
      title: 'title created',
      content: 'content created'
    })
  });

  it('should dispatch onCancel when clicking on cancel button', () => {
    const handleCancel = jest.fn();
    const cmp = shallow(<NoteEditor onCancel={handleCancel}/>);
    cmp.querySelectors('button')[0].dispatchEvent('click');

    expect(handleCancel).toHaveBeenCalled();
  });

  it('should dispatch onDelete when clicking on delete button', () => {
    const handleDelete = jest.fn();
    const cmp = shallow(<NoteEditor note={{id: 3, title: 'title', content: 'content'}} onDelete={handleDelete}/>);
    cmp.querySelectors('button')[2].dispatchEvent('click');

    expect(handleDelete).toHaveBeenCalled();
  });

  it('should not show delete button when creating a new note', () => {
    const cmp = shallow(<NoteEditor/>);
    expect(cmp.querySelectors('button')[2]).toBe(undefined);
  });

  it('should display a message when encrypt note', () => {
    encryptNote.mockImplementation(data => Promise.resolve(data));
    const cmp = shallow(<NoteEditor />);
    cmp.querySelector('input').props.onChange({target: {value: 'title created'}});
    cmp.querySelector('textarea').props.onChange({target: {value: 'content created'}});
    cmp.querySelectors('button')[1].dispatchEvent('click');

    expect(cmp.html()).toContain('Encryption of the note');
  });

  it('should display a message when encrypt failed', () => {
    encryptNote.mockImplementation(data => ({
      then: () => {
        return {catch: cb => {
          cb(new Error('oops encryption failed'))
        }}
      }
    }));
    const cmp = shallow(<NoteEditor />);
    cmp.querySelector('input').props.onChange({target: {value: 'title created'}});
    cmp.querySelector('textarea').props.onChange({target: {value: 'content created'}});
    cmp.querySelectors('button')[1].dispatchEvent('click');
    expect(cmp.html()).toContain('Oops an error occured during encryption');
  });

  it('should display a message in console when encrypt failed', () => {
    encryptNote.mockImplementation(data => ({
      then: () => {
        return {catch: cb => {
          cb(new Error('oops encryption failed'))
        }}
      }
    }));

    const cmp = shallow(<NoteEditor />);
    cmp.querySelector('input').props.onChange({target: {value: 'title created'}});
    cmp.querySelector('textarea').props.onChange({target: {value: 'content created'}});
    cmp.querySelectors('button')[1].dispatchEvent('click');

    expect(console.error).toHaveBeenCalled();
  });
});
