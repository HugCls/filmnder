import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
// import SwipeableMovieCard from "@/components/SwipeableMovieCard";
import GenreSelectorModal from "@/components/GenreSelectorModal";
import DebugPanel from "@/components/DebugPanel";
import UserSelectorModal from "@/components/UserSelectorModal";
import { getTrendingMovies, getGenres } from "@/services/movieService";
import { addLikedMovie } from "@/storage/likes";
import { useAuthListener } from "@/hooks/useAuthListener";
import SignInScreen from "@@/screens/SignInScreen";
import SwipeableMovieCard from "@/components/SwipeableMovieCard.safe";


interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface Genre {
  id: number;
  name: string;
}

export default function EntryPoint() {
  const { user, loading: authLoading } = useAuthListener();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [showGenreModal, setShowGenreModal] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);

  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userModalVisible, setUserModalVisible] = useState(false);

  // Load genres on startup
  useEffect(() => {
    async function fetchGenres() {
      const genres = await getGenres();
      setAvailableGenres(genres);
    }
    fetchGenres();
  }, []);

  // Check if a username is already set
  useEffect(() => {
    if (!currentUser) {
      setUserModalVisible(true);
    }
  }, [currentUser]);

  // Load movies when genres and user are selected
  useEffect(() => {
    if (selectedGenres.length > 0 && currentUser) {
      async function fetchInitialMovies() {
        const initialMovies = await getTrendingMovies(1, selectedGenres);
        setMovies(initialMovies);
        setCurrentIndex(0);
        setPage(1);
        setLoadingMovies(false);
      }
      fetchInitialMovies();
    }
  }, [selectedGenres, currentUser]);

  // Fetch more movies when nearing the end of the list
  useEffect(() => {
    if (currentIndex >= movies.length - 2 && !isFetchingMore) {
      setIsFetchingMore(true);
      getTrendingMovies(page + 1, selectedGenres).then((newMovies) => {
        setMovies((prev) => [...prev, ...newMovies]);
        setPage((prev) => prev + 1);
        setIsFetchingMore(false);
      });
    }
  }, [currentIndex]);

  const handleSwipeRight = async () => {
    const likedMovie = movies[currentIndex];
    console.log("Liked movie:", likedMovie?.title);

    if (likedMovie?.id && currentUser) {
      await addLikedMovie(likedMovie.id, currentUser);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleSwipeLeft = () => {
    console.log("Ignored movie:", movies[currentIndex]?.title);
    setCurrentIndex((prev) => prev + 1);
  };

  // Handle auth loading state
  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  // If user is not authenticated, show SignIn screen
  if (!user) {
    return <SignInScreen />;
  }

  // If movies are still loading
  if (loadingMovies) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
        <GenreSelectorModal
          visible={showGenreModal}
          onClose={() => setShowGenreModal(false)}
          onConfirm={(genres) => {
            setSelectedGenres(genres);
            setShowGenreModal(false);
          }}
          genres={availableGenres}
        />
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

      <UserSelectorModal
        visible={userModalVisible}
        onClose={() => setUserModalVisible(false)}
        onConfirm={(username) => {
          setCurrentUser(username);
          setUserModalVisible(false);
        }}
      />

      {__DEV__ && <DebugPanel visible />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
