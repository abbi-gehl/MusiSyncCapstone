import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, Pressable, TextInput, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNFS from '@dr.pogodin/react-native-fs';
import Modal from "react-native-modal";


const STORAGE_KEY = 'selectedDirectory';
const DEFAULT_MUSIC_DIR = `${RNFS.ExternalStorageDirectoryPath}/Music`; // Default Android music folder

interface DirectoryPickerProps {
  isVisible: boolean;
  handleModal: () => void;
}

const DirectoryPicker: React.FC<DirectoryPickerProps> = ({ isVisible, handleModal }) => {
  const [directory, setDirectory] = useState<string>(DEFAULT_MUSIC_DIR);
  const [input, setInput] = useState('');

  useEffect(() => {
    async function fetchDirectory() {
      const storedDir = await AsyncStorage.getItem(STORAGE_KEY);
      setDirectory(storedDir || DEFAULT_MUSIC_DIR);
    }
    fetchDirectory();
  }, []);

  const handleSaveDirectory = async () => {
    if (!input.trim()) {
      Alert.alert('Error', 'Please enter a valid directory path.');
      return;
    }

    try {
      const exists = await RNFS.exists(input);
      if (!exists) {
        Alert.alert('Error', 'Directory does not exist.');
        return;
      }

      await AsyncStorage.setItem(STORAGE_KEY, input);
      setDirectory(input);
      Alert.alert('Success', 'Directory saved!');
      setInput('');
      handleModal();
    } catch (error) {
      console.error('Error setting directory:', error);
    }
  };

  return (
    <Modal isVisible={isVisible}>
      <View className="bg-accentBlue p-6 rounded-2xl">
        <Text className="text-black text-lg font-bold mb-2">Select Music Folder</Text>
        <Text className="text-black mb-6">Choose a directory to sync your music files.</Text>

        {/* Current Directory */}
        <Text className="text-black font-semibold mb-2">Current Directory:</Text>
        <Text className="text-black bg-white p-2 rounded-xl mb-4">{directory}</Text>

        {/* Text Input for Custom Directory */}
        <Text className="text-black font-semibold mb-2">Set Custom Directory:</Text>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Enter custom directory path..."
          placeholderTextColor="#ccc"
          numberOfLines={1}
          className="bg-white rounded-xl p-3 text-black mb-4"
        />
        <Text className="text-black font-semibold mb-2">For more info, look at our FAQ</Text>
        {/* Submit Button */}
        <Pressable
          onPress={handleSaveDirectory}
          className="bg-buttonBlue rounded-xl p-3 items-center mb-2"
        >
          <Text className="text-white font-semibold">Save Directory</Text>
        </Pressable>

        {/* Cancel Button */}
        <Pressable
          onPress={handleModal}
          className="bg-buttonBlue rounded-xl p-3 items-center mb-2"
        >
          <Text className="text-white font-semibold">Close</Text>
        </Pressable>

      </View>
    </Modal>
  );
};

export default DirectoryPicker;
