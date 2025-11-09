import { db } from '@/config/firebase';
import { NoteType } from '@/store/types';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    updateDoc,
} from 'firebase/firestore';

const NOTES_COLLECTION = 'notes';

// Convert Firestore timestamp to date string
const convertTimestampToDate = (timestamp: any): string => {
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString().split('T')[0];
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString().split('T')[0];
  }
  return timestamp || new Date().toISOString().split('T')[0];
};

// Convert NoteType to Firestore document
const noteToFirestore = (note: NoteType) => ({
  title: note.title,
  body: note.body,
  tag: note.tag,
  date: note.date,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
});

// Convert Firestore document to NoteType
const firestoreToNote = (docId: string, data: any): NoteType => ({
  id: docId,
  title: data.title || '',
  body: data.body || '',
  tag: data.tag || '',
  date: convertTimestampToDate(data.date || data.createdAt),
});

// Get all notes
export const getAllNotes = async (): Promise<NoteType[]> => {
  try {
    const notesRef = collection(db, NOTES_COLLECTION);
    const q = query(notesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) =>
      firestoreToNote(doc.id, doc.data())
    );
  } catch (error) {
    console.error('Error getting notes:', error);
    throw error;
  }
};

// Get a single note by ID
export const getNoteById = async (noteId: string): Promise<NoteType | null> => {
  try {
    const noteRef = doc(db, NOTES_COLLECTION, noteId);
    const noteSnap = await getDoc(noteRef);
    
    if (noteSnap.exists()) {
      return firestoreToNote(noteSnap.id, noteSnap.data());
    }
    return null;
  } catch (error) {
    console.error('Error getting note:', error);
    throw error;
  }
};

// Add a new note
export const addNoteToFirestore = async (note: Omit<NoteType, 'id'>): Promise<string> => {
  try {
    const notesRef = collection(db, NOTES_COLLECTION);
    const docRef = await addDoc(notesRef, noteToFirestore(note as NoteType));
    return docRef.id;
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
};

// Update an existing note
export const updateNoteInFirestore = async (note: NoteType): Promise<void> => {
  try {
    const noteRef = doc(db, NOTES_COLLECTION, note.id);
    await updateDoc(noteRef, {
      ...noteToFirestore(note),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

// Delete a note
export const deleteNoteFromFirestore = async (noteId: string): Promise<void> => {
  try {
    const noteRef = doc(db, NOTES_COLLECTION, noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

