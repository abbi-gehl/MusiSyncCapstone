import { Alert } from "react-native";
import { useChunkStore } from "../../db/chunkStore";

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