import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-rapi-ui";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary Caught:", error, errorInfo);
  }

  handleReset = () => {
    // Reset state agar pengguna bisa mencoba ulang tanpa menutup aplikasi
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ marginBottom: 12, textAlign: "center" }}>
            Terjadi kesalahan tak terduga. Silakan coba muat ulang layar.
          </Text>
          <Button text="Coba Lagi" onPress={this.handleReset} />
        </View>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
