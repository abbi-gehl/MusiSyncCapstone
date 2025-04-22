import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, Pressable, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRealm, useQuery } from '@realm/react'  // Realm DB for react
import Realm, { BSON } from 'realm' // Realm DB
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



// Modal popup for handling user input of devices
const CustomModal: React.FC<CustomModalProps> = ({ isModalVisible, handleModal }:
                                                 {  isModalVisible: boolean; handleModal: () => void;}) => {
    const printDatabaseEntries = () => {
        const hosts = realm.objects("Host");
        console.log("DB Entries:", JSON.stringify(hosts, null, 2));
    };

    // textbox elements
    const [text, setText] = useState("");
    const [nameText, setNameText] = useState("");

    const realm = useRealm();

    const handleSubmit = () => {
        if (!text.trim() || !nameText.trim()) return;


        // SEND TO DB
        try {
            realm.write(() => {
                realm.create("Host", {
                    _id: new BSON.ObjectId(),
                    device_name: nameText,
                    mac_address: text,
                    last_sync: new Date(),
                });
            });
            console.log("Device added:", nameText, text);
        } catch (error) {
            console.error("Error adding device:", error);
        }

        // Reset + close modal
        setText("");
        setNameText("")
        handleModal();
    }

    return (
        <Modal isVisible={isModalVisible}>
            <View className="bg-accentBlue p-6 rounded-2xl">
                <Text className="text-black text-lg font-bold mb-2">Link your devices with a IP Address</Text>
                <Text className="text-black mb-6">If you need more info, check our documentation</Text>

                <TextInput
                    value={nameText}
                    onChangeText={setNameText}
                    placeholder="Enter Device name..."
                    placeholderTextColor="#ccc"
                    numberOfLines={1}
                    className="bg-white rounded-xl p-3 text-black mb-4"
                />

                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="Enter IP address or identifier..."
                    placeholderTextColor="#ccc"
                    numberOfLines={1}
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
                    className="bg-buttonBlue rounded-xl p-3 items-center mb-2"
                >
                    <Text className="text-white font-semibold">Close</Text>
                </Pressable>
                {/* {/* Delete later, debug button /}
                <Pressable
                    onPress={printDatabaseEntries}
                    className="bg-buttonBlue rounded-xl p-3 items-center mb-2"
                >
                    <Text className="text-white font-semibold">print DB</Text>
                </Pressable> */}
            </View>
        </Modal>
    );
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'LandingPage'>;

const LandingPage = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NavigationProp>();
    const [isModalVisible, setModalVisible] = useState(false);

    const { startServer, connectToServer, isConnected } = useTCP();
    const [IP, setIP] = React.useState<string>("");
    const port = 5000;
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

                  <Pressable className="my-8" onPress={() => navigation.navigate('HomePage')}>
                      <View className="bg-buttonBlue rounded-2xl border-2 border-gray-500 w-3/5 p-4 px-8">
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
                  <Text className="text-2xl font-semibold text-white dark:text-white text-center m-4">
                      Connection Status: {isConnected ? "Connected" : "Disconnected"}
                  </Text>
                  <Pressable className="my-10 items-center" onPress={() => {
                    startServer(port);
                    setModalVisible(true)
                }
                    }>
                      <View className="bg-buttonBlue border-2 border-gray-500 rounded-2xl p-4 px-6 w-2/3">
                          <Text className="text-2xl text-center font-bold text-white dark:text-white">
                              Host
                          </Text>
                      </View>
                  </Pressable>
                  <View className="my-10 items-center">
                      <TextInput    
                          className="bg-white border-2 border-gray-500 rounded-2xl p-4 px-6 w-2/3 text-xl mb-4"
                          placeholder="Enter IP Address"
                          value={IP}
                          onChangeText={setIP}
                          keyboardType="numeric"
                      />
                      <Pressable className="bg-buttonBlue border-2 border-gray-500 rounded-2xl p-4 px-6 w-2/3" onPress={() => {
                        const items = IP.split(":");
                        connectToServer(items[0], parseInt(items[1]));
                      }}>
                          <Text className="text-2xl text-center font-bold text-white dark:text-white">
                              Connect
                          </Text>
                      </Pressable>
                  </View>
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
