import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Menu } from "lucide-react-native";

type RootStackParamList = {
    LandingPage: undefined;
    HomePage: undefined;
    ChooseFilePage: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChooseFilePage'>;

const ChooseFilePage = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NavigationProp>();

    return (
        <SafeAreaView className="flex-1 bg-transparent" style={{ paddingTop: insets.top }}>
            {/* First Section (1/6 of the Screen) */}
            <View className="flex-[1] bg-transparent px-6 my-2">
                {/* Header with MusiSync & Menu Button */}
                <View className="flex-row items-center justify-between w-full my-2">

                    {/* Hamburger Menu Button */}
                    <TouchableOpacity className="p-2 flex-[2]">
                        <Menu size={48} color="black" />
                    </TouchableOpacity>

                    <View className="items-center justify-center bg-accentPeach rounded-3xl p-4 flex-[4]">
                        <Text className="text-4xl font-extrabold text-black dark:text-white">
                            MusiSync
                        </Text>
                    </View>
                </View>
            </View>

            {/* Second Section (5/6 of the Screen) */}
            <View className="flex-[6] bg-transparent">
                <View className="flex-1 bg-background rounded-br-none rounded-bl-none justify-start rounded-[50] w-full p-4 gap-y-8">

                </View>
            </View>
        </SafeAreaView>
    );
}

export default ChooseFilePage;