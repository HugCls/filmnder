declare module "react-native-swipe-cards" {
  import React from "react";
  import { Component } from "react";
  import { ViewStyle } from "react-native";

  interface SwipeCardsProps {
    cards: any[];
    renderCard: (card: any) => JSX.Element;
    renderNoMoreCards?: () => JSX.Element;
    loop?: boolean;
    stack?: boolean;
    stackOffsetX?: number;
    stackOffsetY?: number;
    showYStack?: boolean;
    showXStack?: boolean;
    handleYup?: (card: any) => void;
    handleNope?: (card: any) => void;
    containerStyle?: ViewStyle;
  }

  export default class SwipeCards extends Component<SwipeCardsProps> {}
}
