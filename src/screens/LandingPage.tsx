import React from "react";
import {View, Text, TouchableOpacity, Pressable, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StackNavigationProp } from '@react-navigation/stack';
import { Menu } from "lucide-react-native"; // Install this library or use another icon package
import "nativewind";

import { useTCP } from "../service/TCPProvider";
import NetInfo from "@react-native-community/netinfo";

type RootStackParamList = {
    LandingPage: undefined;
    HomePage: undefined;
    ChooseFilePage: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'LandingPage'>;

const LandingPage = () => {
    const insets = useSafeAreaInsets();
    
    const navigation = useNavigation<NavigationProp>();
    
    const { isConnected, startServer, connectToServer } = useTCP();
    const [IP, setIP] = React.useState<string>("");
    const [port, setPort] = React.useState<number>(5000);
    
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
                  <Text className="text-2xl font-semibold text-white dark:text-white text-center m-4">
                      Connection Status: {isConnected ? "Connected" : "Disconnected"}
                  </Text>
                  <Pressable className="my-10 items-center" onPress={() => {startServer(port);}}>
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
      </SafeAreaView>
    );
};

export default LandingPage;
