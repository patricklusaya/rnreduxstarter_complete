import { db } from '@/config/firebase';
import { NoteType } from '@/store/types';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    Timestamp,
    updateDoc,
    where,
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
const noteToFirestore = (note: NoteType, userId: string) => ({
  title: note.title,
  body: note.body,
  tag: note.tag,
  date: note.date,
  userId: userId,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
});

// Convert Firestore document to NoteType
const firestoreToNote = (docId: string, data: any): NoteType & { _createdAt?: any } => ({
  id: docId,
  title: data.title || '',
  body: data.body || '',
  tag: data.tag || '',
  date: convertTimestampToDate(data.date || data.createdAt),
  _createdAt: data.createdAt, // Preserve timestamp for sorting
});

// Get all notes for a specific user
export const getAllNotes = async (userId: string): Promise<NoteType[]> => {
  try {
    const notesRef = collection(db, NOTES_COLLECTION);
    // Query by userId only (no orderBy to avoid index requirement)
    const q = query(notesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    // Convert to notes and sort in memory by createdAt (descending)
    const notes = querySnapshot.docs.map((doc) =>
      firestoreToNote(doc.id, doc.data())
    );
    
    // Sort by createdAt timestamp in descending order (newest first)
    return notes.sort((a, b) => {
      // Use Firestore timestamp if available, otherwise use date string
      const timeA = a._createdAt?.toMillis?.() || a._createdAt?.seconds * 1000 || new Date(a.date).getTime();
      const timeB = b._createdAt?.toMillis?.() || b._createdAt?.seconds * 1000 || new Date(b.date).getTime();
      return timeB - timeA; // Descending order (newest first)
    }).map(({ _createdAt, ...note }) => note) as NoteType[]; // Remove _createdAt before returning
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
export const addNoteToFirestore = async (note: Omit<NoteType, 'id'>, userId: string): Promise<string> => {
  try {
    const notesRef = collection(db, NOTES_COLLECTION);
    const docRef = await addDoc(notesRef, noteToFirestore(note as NoteType, userId));
    return docRef.id;
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
};

// Update an existing note
export const updateNoteInFirestore = async (note: NoteType, userId: string): Promise<void> => {
  try {
    const noteRef = doc(db, NOTES_COLLECTION, note.id);
    await updateDoc(noteRef, {
      ...noteToFirestore(note, userId),
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

