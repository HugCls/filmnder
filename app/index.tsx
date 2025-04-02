import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import SwipeableMovieCard from "@/components/SwipeableMovieCard";
import GenreSelectorModal from "@/components/GenreSelectorModal";
import { getTrendingMovies, getGenres } from "@/services/movieService";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface Genre {
  id: number;
  name: string;
}

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [showGenreModal, setShowGenreModal] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]); // 🆕 genres dynamiques

  // 🧠 Charger la liste des genres au démarrage
  useEffect(() => {
    async function fetchGenres() {
      const genres = await getGenres();
      setAvailableGenres(genres);
    }
    fetchGenres();
  }, []);

  // 🎯 Charger les films quand les genres sont choisis
  useEffect(() => {
    if (selectedGenres.length > 0) {
      async function fetchInitialMovies() {
        const initialMovies = await getTrendingMovies(1, selectedGenres);
        setMovies(initialMovies);
        setCurrentIndex(0);
        setPage(1);
        setLoading(false);
      }
      fetchInitialMovies();
    }
  }, [selectedGenres]);

  // 🔄 Charger la page suivante si on approche de la fin
  useEffect(() => {
    if (currentIndex >= movies.length - 2 && !isFetchingMore) {
      setIsFetchingMore(true);
      getTrendingMovies(page + 1, selectedGenres).then((newMovies) => {
        setMovies((prevMovies) => [...prevMovies, ...newMovies]);
        setPage((prevPage) => prevPage + 1);
        setIsFetchingMore(false);
      });
    }
  }, [currentIndex]);

  const handleSwipeRight = () => {
    console.log("Liked movie:", movies[currentIndex]?.title);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSwipeLeft = () => {
    console.log("Ignored movie:", movies[currentIndex]?.title);
    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
        {/* Affiche aussi la modal pendant le chargement */}
        <GenreSelectorModal
          visible={showGenreModal}
          onClose={() => setShowGenreModal(false)}
          onConfirm={(genres) => {
            setSelectedGenres(genres);
            setShowGenreModal(false);
          }}
          genres={availableGenres}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {movies
        .slice(currentIndex)
        .reverse()
        .map((movie, i) => (
          <SwipeableMovieCard
            key={movie.id}
            title={movie.title}
            posterUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            index={i}
          />
        ))}

      {isFetchingMore && (
        <ActivityIndicator size="small" color="#E50914" style={styles.loader} />
      )}

      <GenreSelectorModal
        visible={showGenreModal}
        onClose={() => setShowGenreModal(false)}
        onConfirm={(genres) => {
          setSelectedGenres(genres);
          setShowGenreModal(false);
        }}
        genres={availableGenres}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    position: "absolute",
    bottom: 20,
  },
});
