import React from "react";
import {View, Text, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Menu } from "lucide-react-native"; // Install this library or use another icon package
import "nativewind";


const LandingPage = () => {
    const insets = useSafeAreaInsets();

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
              <View className="flex-1 justify-center bg-background rounded-br-none rounded-bl-none rounded-[50] p-4 w-screen">
                  <Text className="text-xl font-semibold text-white dark:text-white text-center m-5 my-10">
                      It's easy to get started with MusiSync!
                  </Text>

                  <Text className="text-xl font-semibold text-white dark:text-white text-center">
                      No email is required! Just click below to link devices.
                  </Text>

                  <Pressable className="my-10">
                      <View className="bg-accentBlue rounded-2xl p-4 px-6 w-1/2">
                          <Text className="text-xl text-center font-bold text-white dark:text-white">
                              Continue
                          </Text>
                      </View>
                  </Pressable>

              </View>
          </View>
      </SafeAreaView>
    );
};

export default LandingPage;
