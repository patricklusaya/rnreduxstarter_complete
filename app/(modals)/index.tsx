import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAppDispatch } from "@/store/hooks";
import { addNoteAsync } from "@/store/slices/notesSlice";

export default function AddNoteScreen() {
  const dispatch = useAppDispatch();
  const tags = ["Personal", "Work", "Travel", "Reminder"];
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  const handleTagPress = (tag: string) => {
    setSelectedTag(tag);
  };

  const handleDonePress = async () => {
    if (!title.trim() || !body.trim() || !selectedTag) {
      return;
    }

    const newNote = {
      title: title.trim(),
      body: body.trim(),
      tag: selectedTag,
      date: new Date().toISOString().split('T')[0],
    };

    await dispatch(addNoteAsync(newNote));
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        placeholder="Title"
        onChangeText={(text) => setTitle(text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Your Notes goes here ..."
        onChangeText={(text) => setBody(text)}
        style={styles.body}
      />

      <View style={styles.mainTagsContainer}>
        <ThemedText type="title" style={styles.title}>
          Tags
        </ThemedText>
        <View style={styles.tagsContainer}>
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={styles.tag}
              onPress={() => handleTagPress(tag)}
            >
              <ThemedText
                type="title"
                style={[
                  {
                    color: selectedTag === tag ? "#b494f0" : "#9BA1A6",
                  },
                  styles.tagText,
                ]}
              >
                {tag}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.addTagButton} onPress={handleDonePress}>
          <ThemedText type="title" style={styles.addTagButtonText}>
            DONE
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  body: {
    width: "100%",
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    marginBottom: 10,
    color: "#fff",

  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  mainTagsContainer: {
    position: "absolute",
    margin: 10,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 0,
    width: "100%",
  },
  tagText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  tag: {
    minWidth: 80,
    alignItems: "center",
    backgroundColor: "#232323",
    borderRadius: 30,
    maxWidth: "100%",
    padding: 10,
    marginBottom: 10,
  },

  addTagButton: {
    backgroundColor: "#b494f0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 40,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    marginTop: 10,
  },
  addTagButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
