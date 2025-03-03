import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import "nativewind";
import Container from "../components/Container.tsx"
import StdButton from "../components/StdButton.tsx";


const LandingPage = () => {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: insets.top, backgroundColor: "transparent" }}>
            <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-gray-800">
                <Container width="100%">
                    <Text className="text-lg font-semibold text-white dark:text-white">
                        Ready to Sync?
                    </Text>

                </Container>
            </View>
        </SafeAreaView>
    );
};

export default LandingPage;
