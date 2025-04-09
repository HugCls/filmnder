import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { getLikedMovies } from "@/storage/likes";
import { getMatchingMovies } from "@/matching/compare";
import { otherUserLikes } from "@/mock/otherUser";

export default function MatchesScreen() {
  const [matchingMovieIds, setMatchingMovieIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      const userLikes = await getLikedMovies();
      const matches = getMatchingMovies(userLikes, otherUserLikes);
      setMatchingMovieIds(matches);
      setLoading(false);
    }

    loadMatches();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading matches...</Text>
      </View>
    );
  }

  if (matchingMovieIds.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No matches yet 💔</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Movies you both liked:</Text>
      <FlatList
        data={matchingMovieIds}
        keyExtractor={(id) => id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.movieId}>Movie ID: {item}</Text>
            {/* Later: fetch movie title/poster */}
            <Text style={styles.matchLabel}>💘 You both liked this!</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  movieId: {
    fontSize: 16,
    fontWeight: "600",
  },
  matchLabel: {
    color: "#E50914",
    fontWeight: "bold",
    marginTop: 8,
  },
});
