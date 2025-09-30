// src/components/LoaderOverlay.tsx
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

type LoaderOverlayProps = {
  visible: boolean;
};

const LoaderOverlay: React.FC<LoaderOverlayProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

export default LoaderOverlay;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});