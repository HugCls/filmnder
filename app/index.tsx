import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import SwipeableMovieCard from "@/components/SwipeableMovieCard";
import GenreSelectorModal from "@/components/GenreSelectorModal";
import DebugPanel from "@/components/DebugPanel"; // Optional: for dev only
import UserSelectorModal from "@/components/UserSelectorModal";
import { getTrendingMovies, getGenres } from "@/services/movieService";
import { addLikedMovie } from "@/storage/likes";

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

  // State for genre selection
  const [showGenreModal, setShowGenreModal] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);

  // State for user selection; if null, ask the user to select their username.
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userModalVisible, setUserModalVisible] = useState(false);

  // 🔁 Load genre list at startup
  useEffect(() => {
    async function fetchGenres() {
      const genres = await getGenres();
      setAvailableGenres(genres);
    }
    fetchGenres();
  }, []);

  // 🔁 Check if a user is already set; otherwise, open the user selection modal.
  useEffect(() => {
    async function checkUser() {
      // Here, you might fetch the current user from AsyncStorage.
      // For simplicity, we suppose currentUser is null if not yet set.
      if (!currentUser) {
        setUserModalVisible(true);
      }
    }
    checkUser();
  }, [currentUser]);

  // 🎯 Load movies when genres are selected and a user is set
  useEffect(() => {
    if (selectedGenres.length > 0 && currentUser) {
      async function fetchInitialMovies() {
        const initialMovies = await getTrendingMovies(1, selectedGenres);
        setMovies(initialMovies);
        setCurrentIndex(0);
        setPage(1);
        setLoading(false);
      }
      fetchInitialMovies();
    }
  }, [selectedGenres, currentUser]);

  // ➕ Fetch next page when reaching the end of the current list
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

  // 👉 Handle right swipe: like a movie and store it
  const handleSwipeRight = async () => {
    const likedMovie = movies[currentIndex];
    console.log("Liked movie:", likedMovie?.title);

    if (likedMovie?.id && currentUser) {
      await addLikedMovie(likedMovie.id, currentUser);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  // 👈 Handle left swipe: ignore movie
  const handleSwipeLeft = () => {
    console.log("Ignored movie:", movies[currentIndex]?.title);
    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
        {/* Show Genre Modal during loading */}
        <GenreSelectorModal
          visible={showGenreModal}
          onClose={() => setShowGenreModal(false)}
          onConfirm={(genres) => {
            setSelectedGenres(genres);
            setShowGenreModal(false);
          }}
          genres={availableGenres}
        />
        {/* Show User Selector Modal if user is not defined */}
        <UserSelectorModal
          visible={userModalVisible}
          onClose={() => setUserModalVisible(false)}
          onConfirm={(username) => {
            setCurrentUser(username);
            setUserModalVisible(false);
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Display stacked movie cards */}
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

      {/* Genre selection modal */}
      <GenreSelectorModal
        visible={showGenreModal}
        onClose={() => setShowGenreModal(false)}
        onConfirm={(genres) => {
          setSelectedGenres(genres);
          setShowGenreModal(false);
        }}
        genres={availableGenres}
      />

      {/* User selection modal */}
      <UserSelectorModal
        visible={userModalVisible}
        onClose={() => setUserModalVisible(false)}
        onConfirm={(username) => {
          setCurrentUser(username);
          setUserModalVisible(false);
        }}
      />

      {/* Optional dev tool */}
      <DebugPanel visible={__DEV__} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#2C2C2E", 
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
