import React from "react";
import { View, StyleSheet } from "react-native";
import MovieCard from "../components/MovieCard";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <MovieCard 
        title="Inception"
        posterUrl="https://image.tmdb.org/t/p/w600_and_h900_bestv2/bmK3XsNFgAv1RfEV681KLLIKbbV.jpg"
      />
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
});
