import { useEffect } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteNoteAsync, fetchNotes, setSearchQuery } from '@/store/slices/notesSlice';
import { NoteType } from '@/store/types';
import { router } from 'expo-router';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { notes, searchQuery, loading, error } = useAppSelector((state) => state.notes);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotes(user.uid));
    }
  }, [dispatch, user]);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.body.toLowerCase().includes(searchQuery.toLowerCase())
  );


  // Render item for FlatList
  const renderNote = ({ item }: { item:   NoteType }) => (
    <ThemedView
      style={styles.noteContainer}
    >
      <TouchableOpacity
      
      onPress={() => {
        router.push(`/${item.id}` as any);
      }}

      onLongPress={() => {

        Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', onPress: () => dispatch(deleteNoteAsync(item.id)) },
        ]);


      }}
      
      
      >
      
      <ThemedText type="title" style={{ marginBottom: 6 }}>{item.title}</ThemedText>
      <ThemedText numberOfLines={2} style={{ marginBottom: 10 }}>{item.body}</ThemedText>
      <ThemedText style={{ fontSize: 13, color: '#9BA1A6' }}>
        #{item.tag} • {item.date}
      </ThemedText>
      </TouchableOpacity>

    </ThemedView>
  );

  return (
    <ThemedView  style={ styles.container }>
      <ThemedView style={styles.titleContainer}>
        <ThemedView style={styles.searchContainer}>
         
          <ThemedText style={{ fontSize: 18, marginRight: 8, color: '#9BA1A6' }}></ThemedText>
          <TextInput
            placeholder="Search notes..."
            placeholderTextColor="#666"
            style={{
              flex: 1,
              fontSize: 16,
              color: '#fff',
              paddingVertical: 4,
              backgroundColor: 'transparent',
            }}
            
            onChangeText={(text) => dispatch(setSearchQuery(text))}
            value={searchQuery}


          />
        </ThemedView>
    
      </ThemedView>
    
      {loading && notes.length === 0 ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#b494f0" />
          <ThemedText style={{ marginTop: 10, color: '#9BA1A6' }}>Loading notes...</ThemedText>
        </ThemedView>
      ) : error ? (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={{ color: '#ff6b6b' }}>{error}</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={filteredNotes}
          renderItem={renderNote}
          keyExtractor={item => item.id}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          ListEmptyComponent={
            <ThemedView style={styles.emptyContainer}>
              <ThemedText style={{ color: '#9BA1A6', textAlign: 'center' }}>
                No notes found. Create your first note!
              </ThemedText>
            </ThemedView>
          }
        />
      )}
  
    </ThemedView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151718',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: '10%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 10,
    alignSelf: 'stretch',
    width: '90%',
 
   
  },
  list: {
    marginVertical: 12,
  },
  noteContainer: {
    backgroundColor: '#1f1f1f',
    margin: 10,
    padding: 16,
    borderRadius: 12,
    alignSelf: 'stretch',
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
});
