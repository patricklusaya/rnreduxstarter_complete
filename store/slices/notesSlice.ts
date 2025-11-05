import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NoteType } from '../types';

interface NotesState {
  notes: NoteType[];
  searchQuery: string;
}

const initialState: NotesState = {
  notes: [
    {
      id: '1',
      title: 'Shopping List',
      body: 'Buy milk, eggs, bread, and coffee.',
      tag: 'Personal',
      date: '2024-06-09'
    },
    {
      id: '2',
      title: 'Work Tasks',
      body: 'Review pull requests and write documentation.',
      tag: 'Work',
      date: '2024-06-08'
    },
    {
      id: '3',
      title: 'Travel Plans',
      body: 'Pack bags and print tickets.',
      tag: 'Travel',
      date: '2024-06-07'
    },
    {
      id: '4',
      title: 'Birthday Reminder',
      body: 'Call Emma for birthday wishes.',
      tag: 'Reminder',
      date: '2024-06-12'
    },
  ],
  searchQuery: '',
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<NoteType>) => {
      state.notes.unshift(action.payload);
    },
    updateNote: (state, action: PayloadAction<NoteType>) => {
      const index = state.notes.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { addNote, updateNote, deleteNote, setSearchQuery } = notesSlice.actions;
export default notesSlice.reducer;

