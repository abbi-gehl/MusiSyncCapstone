
import React, {useState} from "react";
import {View, Text, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Menu, CloudUpload, CloudDownload, RefreshCcw, Folder } from "lucide-react-native"; // Install this library or use another icon package
import "nativewind";
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useTCP } from "../service/TCPProvider";
import { Buffer } from 'buffer';
import { pickFile, readFile } from '@dr.pogodin/react-native-fs';
import { generateHashMap } from '../utils/fsScanner.tsx';
import DirectoryPicker from '../utils/dirPicker.tsx';

type RootStackParamList = {
  LandingPage: undefined;
  HomePage: undefined;
  ChooseFilePage: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'HomePage'>;

const LandingPage = () => {

  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [isModalVisible, setModalVisible] = useState(false);

  const { directory, sendData, sendFileSyn } = useTCP();

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
          {/*Upload Button*/}
          <Pressable className="mx-0" onPress={async () => {
            try {
              const files = await pickFile();
              if (files.length > 0) {
                sendFileSyn(files[0]);
              }
            }
            catch (error) {
              console.error("Error picking file:", error);
            }
          }}>
            <View className="bg-transparent flex-row items-center p-2 mt-6">
              <View className="w-12 mx-2">
                <CloudUpload size={48} color="black" />
              </View>
              <Text className="shrink text-3xl font-semibold text-white dark:text-white m-5">
                Send Files to connected Device
              </Text>
            </View>
          </Pressable>

          {/*Download Button*/}
          <Pressable className="mx-0" onPress={() => navigation.navigate('ChooseFilePage')}>
            <View className="bg-transparent flex-row items-center p-2 mt-6">
              <View className="w-12 mx-2">
                <CloudDownload size={48} color="black" />
              </View>
              <Text className="shrink text-3xl font-semibold text-white dark:text-white m-5">
                Download Files from other Device
              </Text>
            </View>
          </Pressable>

          {/*Full sync Button, currently used to test hash map*/}
          <Pressable className="mx-0" onPress={() => generateHashMap()}>
            <View className=" bg-transparent flex-row items-center p-2 mt-8 gap-y-[8]">
              <View className="w-12 mx-2">
                <RefreshCcw size={48} color="black" />
              </View>
              <Text className="shrink text-3xl font-semibold text-white dark:text-white m-5">
                Full Library Sync
              </Text>
            </View>
          </Pressable>
          {/* Old function call sorry i moved it
          async () => {
            const files = await pickFile();
            if (files.length > 0) {
              const content = await readFile(files[0]);
              console.log(content);
            }*/}
          {/*Download Button*/}
          <Pressable className="mx-0" onPress={() => setModalVisible(true)}>
          {/*Download Button*/}
<!--       <Pressable className="mx-0" onPress={() => navigation.navigate('ChooseFilePage')}> -->
            <View className=" bg-transparent flex-row items-center p-2 mt-6">
              <View className="w-12 mx-2">
                <Folder size={48} color="black" />
              </View>
              <Text className="shrink text-3xl font-semibold text-white dark:text-white m-5">
                Set Music Directory
              </Text>
            </View>
          </Pressable>
          <DirectoryPicker
            isVisible={isModalVisible}
            handleModal={() => setModalVisible(false)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LandingPage;
