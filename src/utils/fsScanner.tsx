import * as RNFS from '@dr.pogodin/react-native-fs';
import { MD5 } from 'react-native-crypto-js';

type FileHashMap = Record<string, string>; // { fileHash: relativePath }
const HASH_MAP_FILE = `${RNFS.DocumentDirectoryPath}/fileHashMap.json`;


/*
* TODO: - implement proper directory selecting
*       - Use music metadata library for hashing only raw music file data
*       - set up file access permissions screen/popup for user
* */

// replace with real external path later
let directory = '/data/user/0/com.musisync';

export async function generateHashMap(): Promise<FileHashMap>{
  const hashMap: FileHashMap = {};



  async function scanDirectory(dir: string) {
    try{
      const files = await RNFS.readDir(dir);
      for (const file of files) {
        if (file.isDirectory()) {
          await scanDirectory(file.path); // recursive scan
        } else {
          const fileData = await RNFS.readFile(file.path, 'utf8');
          const hash = MD5(fileData).toString();
          const relativePath = file.path.replace(directory, '');
          hashMap[hash] = relativePath;
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error);
    }
  }
  await scanDirectory(directory);

  try {
    await RNFS.writeFile(HASH_MAP_FILE, JSON.stringify(hashMap, null, 2), 'utf8');
    console.log(`Hash map saved to ${HASH_MAP_FILE}`);
  } catch (error) {
    console.error('Error saving hash map:', error);
  }

  return hashMap;
}
