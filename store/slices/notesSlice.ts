import {
  addNoteToFirestore,
  deleteNoteFromFirestore,
  getAllNotes,
  updateNoteInFirestore,
} from '@/services/firestoreService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NoteType } from '../types';

interface NotesState {
  notes: NoteType[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  searchQuery: '',
  loading: false,
  error: null,
};

// Async thunks for Firebase operations
export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (userId: string) => {
    return await getAllNotes(userId);
  }
);

export const addNoteAsync = createAsyncThunk(
  'notes/addNote',
  async ({ note, userId }: { note: Omit<NoteType, 'id'>; userId: string }) => {
    const id = await addNoteToFirestore(note, userId);
    return { ...note, id } as NoteType;
  }
);

export const updateNoteAsync = createAsyncThunk(
  'notes/updateNote',
  async ({ note, userId }: { note: NoteType; userId: string }) => {
    await updateNoteInFirestore(note, userId);
    return note;
  }
);

export const deleteNoteAsync = createAsyncThunk(
  'notes/deleteNote',
  async (noteId: string) => {
    await deleteNoteFromFirestore(noteId);
    return noteId;
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch notes
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notes';
      });

    // Add note
    builder
      .addCase(addNoteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNoteAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.unshift(action.payload);
      })
      .addCase(addNoteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add note';
      });

    // Update note
    builder
      .addCase(updateNoteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNoteAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notes.findIndex(note => note.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      .addCase(updateNoteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update note';
      });

    // Delete note
    builder
      .addCase(deleteNoteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNoteAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.filter(note => note.id !== action.payload);
      })
      .addCase(deleteNoteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete note';
      });
  },
});

export const { setSearchQuery, clearError } = notesSlice.actions;
export default notesSlice.reducer;

