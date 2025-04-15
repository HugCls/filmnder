import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { getLikedMovies } from "@/storage/likes";
import { getMatchingMovies } from "@/matching/compare";
import { otherUserLikes } from "@/mock/otherUser";
import { getMovieDetails } from "@/services/movieService";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export default function MatchesScreen() {
  const [matchingMovies, setMatchingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      const userLikes = await getLikedMovies("testUser");
      const matches = getMatchingMovies(userLikes, otherUserLikes);

      const detailedMatches: Movie[] = [];

      for (const id of matches) {
        const movie = await getMovieDetails(id);
        if (movie) {
          detailedMatches.push(movie);
        }
      }

      setMatchingMovies(detailedMatches);
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

  if (matchingMovies.length === 0) {
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
        data={matchingMovies}
        keyExtractor={(movie) => movie.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              style={styles.poster}
            />
            <Text style={styles.movieTitle}>{item.title}</Text>
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
    backgroundColor: "#3A3A3C" // Gris équilibré, parfait pour la lisibilité

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
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    alignItems: "center",
  },
  poster: {
    width: 200,
    height: 300,
    borderRadius: 10,
    marginBottom: 12,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  matchLabel: {
    color: "#E50914",
    fontWeight: "bold",
    marginTop: 6,
  },
});
