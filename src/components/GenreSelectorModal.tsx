import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

interface Genre {
  id: number;
  name: string;
}

interface GenreSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedGenres: number[]) => void;
}

const STATIC_GENRES: Genre[] = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
];

const GenreSelectorModal: React.FC<GenreSelectorModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Choose your favorite genres</Text>
          <ScrollView style={styles.genreList}>
            {STATIC_GENRES.map((genre) => (
              <TouchableOpacity
                key={genre.id}
                style={[
                  styles.genreButton,
                  selectedGenres.includes(genre.id) && styles.genreSelected,
                ]}
                onPress={() => toggleGenre(genre.id)}
              >
                <Text style={styles.genreText}>{genre.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onConfirm(selectedGenres)}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GenreSelectorModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    width: "85%",
    maxHeight: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  genreList: {
    marginBottom: 16,
  },
  genreButton: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  genreSelected: {
    backgroundColor: "#E50914",
  },
  genreText: {
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    padding: 10,
  },
  cancelText: {
    color: "#999",
  },
  confirmButton: {
    backgroundColor: "#E50914",
    padding: 10,
    borderRadius: 8,
  },
  confirmText: {
    color: "white",
    fontWeight: "bold",
  },
});
