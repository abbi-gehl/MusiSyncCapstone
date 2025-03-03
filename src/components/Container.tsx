import React from "react";
import { View, ViewProps, Dimensions, ViewStyle } from "react-native";

interface ContainerProps extends ViewProps {
    children: React.ReactNode;
    width?: number | string;
}

const Container: React.FC<ContainerProps> = ({ children, style, width, ...props }) => {
    const screenWidth = Dimensions.get("window").width;

    const containerStyle: ViewStyle = {
        width: (width ?? screenWidth) as ViewStyle['width'],
    };

    return (
        <View
            className="p-4 bg-background rounded-2xl shadow-lg"
            style={[containerStyle, style]}  // Merge styles, applying custom width
            {...props}
        >
            {children}
        </View>
    );
};

export default Container;
