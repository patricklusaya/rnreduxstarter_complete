import { Alert, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteNote, setSearchQuery } from '@/store/slices/notesSlice';
import { NoteType } from '@/store/types';
import { router } from 'expo-router';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { notes, searchQuery } = useAppSelector((state) => state.notes);

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
          { text: 'Delete', onPress: () => dispatch(deleteNote(item.id)) },
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
    
      <FlatList
        data={filteredNotes}
        renderItem={renderNote}
        keyExtractor={item => item.id}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />
  
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
  
});
