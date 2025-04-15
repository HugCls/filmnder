import AsyncStorage from "@react-native-async-storage/async-storage";

export function getLikesKey(username: string): string {
  return `LIKED_MOVIES_${username}`;
}

/**
 * Add a liked movie ID for the given user, preventing duplicates.
 * @param movieId - The movie ID to add.
 * @param username - The username of the current user.
 */
export async function addLikedMovie(movieId: number, username: string): Promise<void> {
  try {
    const key = getLikesKey(username);
    console.log("Storing movie ID:", movieId, "with key:", key);
    const existing = await AsyncStorage.getItem(key);
    const likedMovies: number[] = existing ? JSON.parse(existing) : [];
    console.log("Existing liked movies:", likedMovies);
    
    if (!likedMovies.includes(movieId)) {
      const updated = [...likedMovies, movieId];
      console.log("Updated liked movies:", updated);
      await AsyncStorage.setItem(key, JSON.stringify(updated));
      console.log("Successfully stored the updated liked movies.");
    } else {
      console.log("Movie ID already exists in liked movies.");
    }
  } catch (error) {
    console.error("Error while adding liked movie:", error);
  }
}

/**
 * Retrieve the list of liked movie IDs for the given user.
 * @param username - The username of the current user.
 * @returns An array of movie IDs.
 */
export async function getLikedMovies(username: string): Promise<number[]> {
  try {
    const key = getLikesKey(username);
    const data = await AsyncStorage.getItem(key);
    console.log("Retrieving liked movies from key:", key, "data:", data);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error while reading liked movies:", error);
    return [];
  }
}

/**
 * Clear the liked movies for the given user (useful for testing).
 * @param username - The username of the current user.
 */
export async function clearLikedMovies(username: string): Promise<void> {
  try {
    const key = getLikesKey(username);
    await AsyncStorage.removeItem(key);
    console.log("Cleared liked movies for key:", key);
  } catch (error) {
    console.error("Error while clearing liked movies:", error);
  }
}
