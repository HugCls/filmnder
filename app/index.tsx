import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import SwipeableMovieCard from "../components/SwipeableMovieCard";
import { getTrendingMovies } from "../services/movieService";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchMovies() {
      const moviesData = await getTrendingMovies();
      setMovies(moviesData);
      setLoading(false);
    }
    fetchMovies();
  }, []);

  const handleSwipeRight = () => {
    console.log("Film liké :", movies[currentIndex].title);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSwipeLeft = () => {
    console.log("Film ignoré :", movies[currentIndex].title);
    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {movies[currentIndex] && (
        <SwipeableMovieCard
          title={movies[currentIndex].title}
          posterUrl={`https://image.tmdb.org/t/p/w500${movies[currentIndex].poster_path}`}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

