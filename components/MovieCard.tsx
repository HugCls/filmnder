import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface MovieCardProps {
  title: string;
  posterUrl: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, posterUrl }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: posterUrl }} style={styles.poster} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: "center",
  },
  poster: {
    width: 300,
    height: 450,
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MovieCard;
