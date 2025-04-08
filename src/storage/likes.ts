import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "LIKED_MOVIES";

/**
 * Add a liked movie ID to local storage (if not already present)
 * @param movieId - The ID of the liked movie
 */
export async function addLikedMovie(movieId: number): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const likedMovies: number[] = existing ? JSON.parse(existing) : [];

    if (!likedMovies.includes(movieId)) {
      const updated = [...likedMovies, movieId];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (error) {
    console.error("❌ Error while adding liked movie:", error);
  }
}

/**
 * Retrieve the list of liked movie IDs from local storage
 * @returns An array of liked movie IDs
 */
export async function getLikedMovies(): Promise<number[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("❌ Error while reading liked movies:", error);
    return [];
  }
}

/**
 * Clear the entire list of liked movies (for development/testing)
 */
export async function clearLikedMovies(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("❌ Error while clearing liked movies:", error);
  }
}
