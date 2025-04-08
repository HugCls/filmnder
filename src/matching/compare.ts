export function getMatchingMovies(userLikes: number[], otherLikes: number[]): number[] {
    console.log("🔍 Comparing user likes:", userLikes);
    console.log("🔍 Comparing other likes:", otherLikes);
  
    const result = userLikes.filter((id) => otherLikes.includes(id));
    console.log("✅ Found matches:", result);
    return result;
  }
  