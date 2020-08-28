import {useNotes} from './logic';

import {initialNotes} from './initialNotes';

import {setState} from 'react';

jest.mock('./initialNotes', () => {
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

jest.mock('react', () => {
  const setState = jest.fn()
  return {
    useState: jest.fn(initialData => [initialData, setState]),
    setState
  }
})

describe('useNotes', () => {
  beforeEach(() => {
    setState.mockReset();
  });


  it('should return initialNotes', () => {
    expect(useNotes().notes).toEqual(initialNotes);
  });

  describe('deleteNote', () => {
    useNotes().deleteNote(1);
    expect(setState).toHaveBeenCalledWith([
      initialNotes[1]
    ]);
  });


  describe('modifyOrCreateNote', () => {
    it('should create a new note with a unique ID', () => {
      useNotes().modifyOrCreateNote({
        title: 'new',
        content: 'note'
      });
      expect(setState).toHaveBeenCalledWith([
        initialNotes[0],
        initialNotes[1],
        {
          id: 3,
          title: 'new',
          content: 'note'
        }
      ])
    });

    it('should only modify the note with when note already have an id', () => {
      useNotes().modifyOrCreateNote({
        id: 1,
        title: 'new',
        content: 'note'
      });
      expect(setState).toHaveBeenCalledWith([
        {
          id: 1,
          title: 'new',
          content: 'note'
        },
        initialNotes[1]
      ])
    });
  });
});
