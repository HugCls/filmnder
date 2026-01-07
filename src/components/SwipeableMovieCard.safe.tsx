import { View, Text, StyleSheet, Image, Pressable } from "react-native";

type Props = {
  title: string;
  posterUrl: string;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  index: number;
};

export default function SwipeableMovieCard({
  title,
  posterUrl,
  onSwipeRight,
  onSwipeLeft,
}: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: posterUrl }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>

      <View style={styles.row}>
        <Pressable onPress={onSwipeLeft} style={styles.btn}>
          <Text style={styles.btnText}>👎</Text>
        </Pressable>
        <Pressable onPress={onSwipeRight} style={styles.btn}>
          <Text style={styles.btnText}>👍</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 320,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#3A3A3C",
    marginVertical: 10,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 420,
  },
  title: {
    color: "white",
    fontSize: 18,
    padding: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    gap: 16,
    paddingBottom: 12,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
  },
  btnText: {
    color: "white",
    fontSize: 18,
  },
});