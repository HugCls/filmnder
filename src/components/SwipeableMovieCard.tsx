import * as React from "react";
import { StyleSheet, Dimensions, Image, Text } from "react-native";
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface MovieCardProps {
  title: string;
  posterUrl: string;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  index: number;
}

const SwipeableMovieCard: React.FC<MovieCardProps> = ({ title, posterUrl, onSwipeRight, onSwipeLeft, index }) => {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = event.translationX;
      rotate.value = event.translationX / SCREEN_WIDTH;
    },
    onEnd: (event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        runOnJS(onSwipeRight)();
        translateX.value = withSpring(SCREEN_WIDTH);
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        runOnJS(onSwipeLeft)();
        translateX.value = withSpring(-SCREEN_WIDTH);
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value * 15}deg` },
    ],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, animatedStyle, { zIndex: index }]}>
        <Image source={{ uri: posterUrl }} style={styles.poster} />
        <Text style={styles.title}>{title}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.9,
    height: 500,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  poster: {
    width: "100%",
    height: "85%",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
});

export default SwipeableMovieCard;

