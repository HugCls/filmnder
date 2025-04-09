import React from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getLikedMovies, clearLikedMovies } from "@/storage/likes";
import { getMatchingMovies } from "@/matching/compare";
import { otherUserLikes } from "@/mock/otherUser";

interface DebugPanelProps {
  visible?: boolean; // allows disabling in production easily
}

const DebugPanel: React.FC<DebugPanelProps> = ({ visible = true }) => {
  if (!visible) return null;
  const router = useRouter();


  return (
    <View style={styles.container}>
      <TouchableOpacity
  onPress={() => router.push("/matches")}
  style={[styles.button, { backgroundColor: "#673AB7" }]}
>
  <Text style={styles.text}>Go to MatchesScreen</Text>
</TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          const liked = await getLikedMovies();
          console.log("🎯 Liked movies:", liked);
        }}
      >
        <Text style={styles.text}>Log liked movies</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#555" }]}
        onPress={async () => {
          await clearLikedMovies();
          console.log("🧹 Liked movies cleared");
        }}
      >
        <Text style={styles.text}>Clear liked movies</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          const userLikes = await getLikedMovies();
          const matches = getMatchingMovies(userLikes, otherUserLikes);
          console.log("💘 Matching movies:", matches);
        }}
        style={[styles.button, { backgroundColor: "#4CAF50" }]}
      >
        <Text style={styles.text}>Show Matches</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DebugPanel;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    zIndex: 1000,
  },
  button: {
    backgroundColor: "#E50914",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
