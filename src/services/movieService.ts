const API_KEY = "de213b7c197418609f5c8e585897c989";
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Fetch trending movies from TMDB with optional genre filtering and pagination.
 * @param page Page number for pagination (default: 1)
 * @param genres Array of genre IDs to filter movies (optional)
 * @returns Array of movie results
 */
export async function getTrendingMovies(page = 1, genres: number[] = []) {
  try {
    const genreParam = genres.length > 0 ? `&with_genres=${genres.join(',')}` : '';
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}${genreParam}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error while fetching movies:", error);
    return [];
  }
}

export async function getGenres(): Promise<{ id: number; name: string }[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
      );
      const data = await response.json();
      return data.genres;
    } catch (error) {
      console.error("Error while fetching genres:", error);
      return [];
    }
  }
  
