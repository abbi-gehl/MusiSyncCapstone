import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';
import { Pressable, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Menu } from "lucide-react-native";
import { useTCP } from "../service/TCPProvider";
import { pickFile } from "@dr.pogodin/react-native-fs";

type RootStackParamList = {
    LandingPage: undefined;
    HomePage: undefined;
    ChooseFilePage: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChooseFilePage'>;

const ChooseFilePage = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NavigationProp>();

    const {server, directory, setDeviceDirectory} = useTCP();

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
                <View className="flex-1 bg-background rounded-br-none rounded-bl-none justify-start rounded-[50] w-full p-4 gap-y-8 items-center">
                    <Text className="text-2xl font-semibold text-white dark:text-white text-center m-4">
                        Your Currently Selected File:
                    </Text>
                    <TextInput 
                        className="bg-white border-2 border-gray-500 rounded-2xl p-4 px-6 w-2/3 text-xl mb-4"
                        placeholder={directory}
                        value={directory}
                        onChangeText={setDeviceDirectory}
                        keyboardType="numeric"
                    />
                    {/* To Replace with a set directory screen */}
                    <View className="items-center">
                        <Pressable className="bg-buttonBlue rounded-2xl border-2 border-gray-500 w-2/5 p-4 px-6" onPress={async () => {
                            const files = await pickFile();
                            if (files.length > 0) {
                                setDeviceDirectory(files[0]);
                            }
                        }}>
                            <Text className="text-2xl font-bold text-center text-white dark:text-white">
                                Choose File
                            </Text>
                        </Pressable>
                    </View>
                    <View className="items-center">
                        <Pressable className="bg-buttonBlue rounded-2xl border-2 border-gray-500 w-2/5 p-4 px-6" onPress={() => navigation.navigate("HomePage")}>
                            <Text className="text-2xl font-bold text-center text-white dark:text-white">
                                Return
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default ChooseFilePage;