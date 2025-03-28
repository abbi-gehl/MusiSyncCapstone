import React, { useState } from "react";
import {View, Text, TouchableOpacity, Pressable, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StackNavigationProp } from '@react-navigation/stack';
import Modal from "react-native-modal";
import { Menu } from "lucide-react-native"; // Install this library or use another icon package
import "nativewind";

import { useTCP } from "../service/TCPProvider";
import NetInfo from "@react-native-community/netinfo";

type RootStackParamList = {
    LandingPage: undefined;
    HomePage: undefined;
    ChooseFilePage: undefined;
};

type CustomModalProps = {
    isModalVisible: boolean;
    handleModal: () => void;
};


const CustomModal: React.FC<CustomModalProps> = ({ isModalVisible, handleModal }:
                     {  isModalVisible: boolean; handleModal: () => void;}) => {
    // textbox elements
    const [text, setText] = useState("");
    const handleSubmit = () => {
        if (!text.trim()) return;

        // SEND TO DB HERE

        console.log("Submitted Text:", text);

        // Reset + close modal
        setText("");
        handleModal();
    }

    return (
        <Modal isVisible={isModalVisible}>
            <View className="bg-accentBlue p-6 rounded-2xl">
                <Text className="text-black text-lg font-bold mb-2">Link your devices with a Mac Address</Text>
                <Text className="text-black mb-6">If you need more info, check our documentation</Text>

                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="Enter MAC address or identifier..."
                    placeholderTextColor="#ccc"
                    multiline
                    numberOfLines={4}
                    className="bg-white rounded-xl p-3 text-black mb-4"
                />
                {/* Submit Button */}
                <Pressable
                    onPress={handleSubmit}
                    className="bg-buttonBlue rounded-xl p-3 items-center mb-2"
                >
                    <Text className="text-white font-semibold">Submit</Text>
                </Pressable>
                {/* Cancel Button */}
                <Pressable
                    onPress={handleModal}
                    className="bg-buttonBlue rounded-xl p-3 items-center"
                >
                    <Text className="text-white font-semibold">Close</Text>
                </Pressable>
            </View>
        </Modal>
    );
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'LandingPage'>;

const LandingPage = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NavigationProp>();
    const [isModalVisible, setModalVisible] = useState(false);

    const { startServer, connectToServer } = useTCP();
    const [IP, setIP] = React.useState<string>("");
    const port = 5050;

    return (
      <SafeAreaView className="flex-1 bg-transparent gap-2" style={{ paddingTop: insets.top }}>
          {/* First Section (2/5 of the Screen) */}
          <View className="flex-[2] bg-transparent px-6 my-2">
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

              {/* Login Prompt */}
              <View className="flex-1 justify-center items-center  bg-background rounded-[50] p-4 my-2">
                  <Text className="text-3xl font-semibold text-white dark:text-white">
                      Ready to Sync?
                  </Text>

                  <Pressable className="my-10" onPress={() => navigation.navigate('HomePage')}>
                      <View className="bg-buttonBlue rounded-2xl border-2 border-gray-500 w-2/5 p-4 px-6">
                          <Text className="text-2xl font-bold text-white dark:text-white">
                              Continue
                          </Text>
                      </View>
                  </Pressable>
              </View>
          </View>

          {/* Second Section (3/5 of the Screen) */}
          <View className="flex-[3] bg-transparent ">
              <View className="flex-1 bg-background rounded-br-none rounded-bl-none rounded-[50] p-4 w-screen">
                  <Text className="text-3xl font-semibold text-white dark:text-white text-center m-5 my-10">
                      It's easy to get started with MusiSync!
                  </Text>

                  <Text className="text-2xl font-semibold text-white dark:text-white text-center m-4">
                      No email is required! Just click below to link devices.
                  </Text>
                  <Pressable className="my-10 items-center" onPress={() => setModalVisible(true)}>
                      <View className="bg-buttonBlue border-2 border-gray-500 rounded-2xl p-4 px-6 w-2/3">
                          <Text className="text-2xl text-center font-bold text-white dark:text-white">
                              Add Device
                          </Text>
                      </View>
                  </Pressable>
              </View>
          </View>
          <CustomModal
              isModalVisible={isModalVisible}
              handleModal={() => setModalVisible(false)}
          />
      </SafeAreaView>
    );
};

export default LandingPage;
