import { Alert } from "react-native";
import { Buffer } from "buffer";
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
        JSON.stringify({event: "file_ack", chunkNo: -1})
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
    hash: Record<string, string>,
    socket: any
) => {
    console.log("Recieved: ", hash);
}

