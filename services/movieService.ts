const API_KEY = "de213b7c197418609f5c8e585897c989"; 
const BASE_URL = "https://api.themoviedb.org/3";

export async function getTrendingMovies() {
    try {
        const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
        const data = await response.json();
        return data.results; // film list
    } catch (error) {
        console.error("Erreur lors de la récupération des films :", error);
        return [];
    }
}
