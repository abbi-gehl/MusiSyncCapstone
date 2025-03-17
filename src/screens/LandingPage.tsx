import React from "react";
import {View, Text, TouchableOpacity, Pressable, Alert, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Menu } from "lucide-react-native"; // Install this library or use another icon package
import "nativewind";

import { useTCP } from "../service/TCPProvider";
import NetInfo from "@react-native-community/netinfo";

const LandingPage = () => {
    const insets = useSafeAreaInsets();
    const { startServer, connectToServer } = useTCP();
    const [IP, setIP] = React.useState<string>("");
    const port = 5050;
    return (
      <SafeAreaView className="flex-1 bg-transparent" style={{ paddingTop: insets.top }}>
          {/* First Section (2/5 of the Screen) */}
          <View className="flex-[2] bg-transparent px-6 my-3">
              {/* Header with MusiSync & Menu Button */}
              <View className="flex-row items-center justify-between w-full my-4">

                  <TouchableOpacity className="p-2 flex-1">
                      <Menu size={32} color="black" />
                  </TouchableOpacity>

                  <View className="items-center justify-center bg-accentPeach rounded-3xl p-4 flex-2">
                      <Text className="text-xl font-bold text-black dark:text-white">
                          MusiSync
                      </Text>
                  </View>

                  {/* Hamburger Menu Button */}

              </View>

              {/* Login Prompt */}
              <View className="flex-1 justify-center items-center bg-background rounded-[50] p-4">
                  <Text className="text-xl font-semibold text-white dark:text-white">
                      Ready to Sync?
                  </Text>

                  <Pressable className="my-10">
                      <View className="bg-accentBlue rounded-2xl p-4 px-6">
                          <Text className="text-xl font-bold text-white dark:text-white">
                              Continue
                          </Text>
                      </View>
                  </Pressable>
              </View>
          </View>

          {/* Second Section (3/5 of the Screen) */}
          <View className="flex-[3] bg-transparent ">
              <View className="flex-1 justify-center items-center bg-background rounded-br-none rounded-bl-none rounded-[50] p-4 w-screen">
                  <Text className="text-xl font-semibold text-white dark:text-white text-center m-5 my-10">
                      It's easy to get started with MusiSync!
                  </Text>

                  <Text className="text-xl font-semibold text-white dark:text-white text-center">
                      No email is required! Just click below to link devices.
                  </Text>

                  <Pressable className="my-10" onPress={() => NetInfo.fetch().then(state => console.log(state))}>
                      <View className="bg-accentBlue rounded-2xl p-4 px-6 w-1/2">
                          <Text className="text-xl text-center font-bold text-white dark:text-white">
                              Get Networking Info
                          </Text>
                      </View>
                  </Pressable>

                  <Pressable className="my-10" onPress={() => startServer(port)}>
                      <View className="bg-accentBlue rounded-2xl p-4 px-6 w-1/2">
                          <Text className="text-xl text-center font-bold text-white dark:text-white">
                              Start Server
                          </Text>
                      </View>
                  </Pressable>

                <View className="my-6 w-4/5">
                    <Text className="text-lg font-semibold text-white mb-2">
                        Enter IP Address:
                    </Text>
                    <View className="flex-row items-center">
                        <TextInput
                            className="bg-white text-black p-3 rounded-l-lg flex-1"
                            placeholder="192.168.1.1"
                            value={IP}
                            onChangeText={setIP}
                            keyboardType="numeric"
                        />
                        <Pressable 
                            className="bg-accentPeach p-3 rounded-r-lg"
                            onPress={() => {
                                if (IP.trim()) {
                                    console.log(`Using IP: ${IP}`);
                                    const addr = IP.split(":");
                                    connectToServer(addr[0], parseInt(addr[1], 10));
                                } else {
                                    Alert.alert("Please enter a valid IP address");
                                }
                            }}
                        >
                            <Text className="text-white font-bold">Connect</Text>
                        </Pressable>
                    </View>
                </View>

              </View>
          </View>
      </SafeAreaView>
    );
};

export default LandingPage;
