import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppSelector } from '@/store/hooks';

export default function NoteDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const notes = useAppSelector((state) => state.notes.notes);
  
  // Find the note with the matching id
  const note = notes.find(n => n.id === id);

  if (!note) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.errorText}>
          Note not found
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {note.title}
          </ThemedText>
          <View style={styles.metaContainer}>
            <View style={styles.tagContainer}>
              <ThemedText style={styles.tagText}>
                #{note.tag}
              </ThemedText>
            </View>
            <ThemedText style={styles.dateText}>
              {note.date}
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.bodyContainer}>
          <ThemedText style={styles.body}>
            {note.body}
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#151718',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#151718',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ECEDEE',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tagContainer: {
    backgroundColor: '#232323',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9BA1A6',
  },
  dateText: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  bodyContainer: {
    marginTop: 8,
  },
  body: {
    fontSize: 18,
    lineHeight: 28,
    color: '#ECEDEE',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#ECEDEE',
  },
});

