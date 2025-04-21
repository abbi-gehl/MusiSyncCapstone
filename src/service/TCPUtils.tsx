import { Alert } from "react-native";
import { Buffer } from "buffer";
import { useChunkStore } from "../../db/chunkStore";
import { generateHashMap, FileHashMap} from "../utils/fsScanner";
import { sendFiles, dictionary } from "../utils/sendFiles";
import * as RNFS from '@dr.pogodin/react-native-fs';

export const recieveFileSyn = async (
    fileData: any,
    socket: any,
    setRecievedFiles: any,
) => {
    const { chunkStore, setChunkStore } = useChunkStore.getState();

    if (chunkStore) {
        Alert.alert("Currently Reciving File, wait before sending another one");
        return;
    }

    setRecievedFiles((prevFiles: string[]) => [...prevFiles, fileData.name]);

    setChunkStore({
        name: fileData.name,
        size: fileData.size,
        type: fileData.type,
        totalChunks: fileData.totalChunks,
        chunkArray: [],
    });

    if (!socket) return;

    try {
        await new Promise<void>(resolve => setTimeout(resolve, 10));
        console.log("Recieving file:", fileData.name);
        socket.write(JSON.stringify({ event: "file_ack", chunkNo: 0 }));
        console.log("Requested first packet...")
    } catch (error) {
        console.log("Error sending file:", error);
    }
}

export const recieveFileAck = async (
    chunkNo: number,
    socket: any,
    setTotalSentBytes: any,
) => {
    const {currentChunkSet, setCurrentChunkSet, resetCurrentChunkSet} = useChunkStore.getState();

    if (!currentChunkSet) {
        Alert.alert("Nothing to send!");
        return;
    }

    if (!socket) {
        Alert.alert("No connected clients!")
        return;
    }

    const totalChunks = currentChunkSet?.totalChunks;

    try {
        await new Promise<void>(resolve => setTimeout(resolve, 10));
        console.log("Sending Packet #", chunkNo);
        socket.write(JSON.stringify({
            event: "file_syn_ack",
            chunk: currentChunkSet?.chunkArray[chunkNo].toString('base64'),
            chunkNo: chunkNo,
        }));

        setTotalSentBytes((prev: number) => prev + currentChunkSet?.chunkArray[chunkNo]?.length);

        if (chunkNo + 2 > totalChunks) {
            console.log("All chunks sent!")
            resetCurrentChunkSet();
        }
    } catch (error) {
        console.log("Error sending chunk: ", error)
    }
}

export const recieveFileSynAck = async (
    chunk: any,
    chunkNo: number,
    socket: any,
    setTotalReceivedBytes: any,
    generateFile: any,
) => {
    const { chunkStore, setChunkStore, resetChunkStore } = useChunkStore.getState();

    if (!chunkStore) {
        console.log("No file transfer initiated (null chunkStore)")
        return;
    }

    try {
        const bufferChunk = Buffer.from(chunk, 'base64');
        const updatedChunkArray = [...(chunkStore.chunkArray || [])];
        updatedChunkArray[chunkNo] = bufferChunk;

        setChunkStore(
            {
                ...chunkStore,
                chunkArray: updatedChunkArray,
            }
        );

        setTotalReceivedBytes((prev: number) => prev + bufferChunk.length);
        
    } catch (error) {
        console.log("Failed to recieve chunk: ", error);
    }

    if (chunkNo + 1 === chunkStore?.totalChunks) {
        console.log("All Chunks Recieved!!!");
        socket.write(JSON.stringify({event: "sync_ack"}));
        generateFile();
        return;
    }

    try {
        await new Promise<void>(resolve => setTimeout(resolve, 10));
        console.log("Requesting Chunk #", chunkNo +1 );
        socket.write(
            JSON.stringify({event: "file_ack", chunkNo: chunkNo + 1})
        )
    } catch (error) {
        console.log("Error requesting next chunk: ", error)
    }
}

export const recieveSyncSyn = async (
    hash: FileHashMap,
    myDir: string,
    socket: any
) => {
    console.log("Recieved sync_syn of: ", hash);

    const myHash = await generateHashMap(myDir);

    console.log("myHash: ", myHash);

    try {
        await new Promise<void>(resolve => setTimeout(resolve, 10));
        console.log("Sending sync_syn_ack...");
        socket.write(JSON.stringify({ event: "sync_syn_ack", serverHash: hash, clientHash: myHash }));
    } catch (error) {
        console.log("Error sending sync_syn_ack: ", error);
    }
}

export const recieveSyncSynAck = async (
    serverHash: FileHashMap,
    clientHash: FileHashMap,
    myDir: string,
    socket: any,
    setFilesToSend: any,
    setCurrentChunkSet: any,
    setSentFiles: any,
) => {
    const diff = sendFiles(serverHash, clientHash);
    const filesToSend: dictionary = diff[0];
    const filesToDelete: dictionary = diff[1];

    console.log("Files to send: ", filesToSend);
    console.log("Files to delete: ", filesToDelete);

    setFilesToSend(filesToSend);
    recieveSyncAck(filesToSend, myDir, setFilesToSend, setCurrentChunkSet, setSentFiles, socket);
}

export const recieveSyncAck = async (
    filesToSend: dictionary,
    directory: string,
    setFilesToSend: any,
    setCurrentChunkSet: any,
    setSentFiles: any,
    socket: any,
) => {
    const nextFile = Object.keys(filesToSend)[0];
    const nextFilePath = filesToSend[nextFile];

    console.log("Recieved sync_ack, sending file: ", nextFilePath);

    try {
        let fileType = '.mp3'
        const fileData = await RNFS.readFile(directory + nextFilePath, 'base64');
        const fileBuffer = Buffer.from(fileData, 'base64');

        const CHUNK_SIZE = 1024 * 8;

        let totalChunks = 0;
        let offset = 0;
        let chunkArray = [];

        while (offset < fileBuffer.length) {
            const chunk = fileBuffer.slice(offset, offset + CHUNK_SIZE);
            chunkArray.push(chunk);
            offset += chunk.length;
            totalChunks++;
        }

        if (fileData.substring(0, 5) === "UklGR")
            fileType = '.wav';
        if (fileData.substring(0, 10) === "ZkxhQwAAAC")
            fileType = '.flac';
        if (fileData.substring(0, 4) === "SUQz")
            fileType = '.mp3'

        const rawData = {
            name: nextFilePath,
            size: fileBuffer.length,
            type: fileType,
            totalChunks,
        };

        setCurrentChunkSet({
            totalChunks,
            chunkArray,
        });

        setSentFiles((prevFiles: string[]) => [...prevFiles, nextFilePath]);

        console.log("Total chunks:", totalChunks);
        console.log("File name:", nextFilePath);
        console.log("Assumed file type:", fileType);
        console.log("File size:", fileBuffer.length);

        setFilesToSend((prevFiles: dictionary) => {
            const updatedFiles = { ...prevFiles };
            delete updatedFiles[nextFile]; // Remove the sent file from the list
            return updatedFiles;
        });

        socket.write(JSON.stringify({event:"file_syn", file: rawData}));
    } catch (error) {
        console.log("Error sending file: ", error);
    }
}
