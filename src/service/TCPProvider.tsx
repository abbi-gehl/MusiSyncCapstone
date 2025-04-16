import { createContext, FC, useCallback, useContext, useState } from "react";
import { Alert } from "react-native";
import TcpSocket from 'react-native-tcp-socket';
import { Buffer } from 'buffer';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { useChunkStore } from "../../db/chunkStore";
import { recieveFileAck, recieveFileSyn, recieveFileSynAck } from "./TCPUtils";

interface TCPContextType {
    server: any;
    client: any;
    directory: string;
    isConnected: boolean;
    connectedClient: any;
    sentFiles: any;
    totalSentBytes: number;
    totalReceivedBytes: number;

    setDeviceDirectory: (dir: string) => void;
    startServer: (port: number) => void;
    connectToServer: (host: string, port: number) => void;
    disconnect: () => void;
    sendData: (data: string | Buffer) => void;
    sendFileSyn: (filePath: string) => void;
}

const TCPContext = createContext<TCPContextType | undefined>(undefined);

export const useTCP = (): TCPContextType => {
    const context = useContext(TCPContext);
    if (!context) {
        throw new Error('useTCP must be used within a TCPProvider');
    }
    return context;
};

const options = {
    keystore: require('../../tls_certs/server-keystore.p12'),
};

export const TCPProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [server, setServer] = useState<any>(null);
    const [client, setClient] = useState<any>(null);
    const [directory, setDirectory] = useState<string>('');
    const [serverSocket, setServerSocket] = useState<any>(null);
    const [sentFiles, setSentFiles] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [connectedClient, setConnectedClient] = useState<any>(null);
    const [totalSentBytes, setTotalSentBytes] = useState<number>(0);
    const [totalReceivedBytes, setTotalReceivedBytes] = useState<number>(0);

    const {currentChunkSet, setCurrentChunkSet, setChunkStore} = useChunkStore();

    // Set Device Directory helper function
    const setDeviceDirectory = useCallback((dir: string) => {
        setDirectory(dir);
    }, []);

    // Disconnect
    const disconnect = useCallback(() => {
        if (server) {
            server.close();
        }
        if (client) {
            client.destroy();
        }
        setIsConnected(false);
    }, [client, server]);

    // Start Server
    const startServer = useCallback((port: number) => {
        if (server) {
            console.log("Server already running");
            return;
        }

        const newServer = TcpSocket.createTLSServer(options, socket => {
            console.log("Server connected: ", socket.address());
            setIsConnected(true);
            setServerSocket(socket);

            socket.setNoDelay(true);
            socket.readableHighWaterMark = 1024 * 1024 * 1;
            socket.writableHighWaterMark = 1024 * 1024 * 1;

            socket.on("data", async data => {
                console.log("Server received:", data);

                const parsedData = JSON.parse(data?.toString());

                if (parsedData?.event === "file_syn") {
                    recieveFileSyn(parsedData.file, socket, setSentFiles);
                }

                if (parsedData?.event === "file_ack") {
                    recieveFileAck(parsedData.chunkNo, socket, setTotalSentBytes);
                }

                if (parsedData?.event === "file_syn_ack") {
                    recieveFileSynAck(parsedData.chunk, parsedData.chunkNo, socket, setTotalReceivedBytes, generateFile);
                }
            });

            socket.on("close", () => {
                console.log("Server closing");
                disconnect();
            })

            socket.on("error", error => {
                console.log("Server error:", error);
            });
        });

        newServer.listen({ port, host: '10.0.2.15' }, () => {
            const address = newServer.address();
            console.log(`Server running @ ${address?.address}:${address?.port}`);
        });

        newServer.on("error", error => {
            console.log("Server error:", error);
        });
        setServer(newServer);
    }, [server]);

    // Connect to Server (client)
    const connectToServer = useCallback((host: string, port: number) => {
        console.log("Connecting to server @", host, ":", port);
        const newClient = TcpSocket.connectTLS({
            host,
            port,
            cert: true,
            ca: require('../../tls_certs/server-cert.pem'),
        }, () => {
            console.log("Client connected to server");
            setIsConnected(true);
        });

        newClient.setNoDelay(true);
        newClient.readableHighWaterMark = 1024 * 1024 * 1;
        newClient.writableHighWaterMark = 1024 * 1024 * 1;

        newClient.on("data", data => {
            console.log("Client received:", data);

            const parsedData = JSON.parse(data?.toString());

            if (parsedData?.event === "file_syn") {
                recieveFileSyn(parsedData.file, newClient, setSentFiles);
            }

            if (parsedData?.event === "file_ack") {
                recieveFileAck(parsedData.chunkNo, newClient, setTotalSentBytes);
            }

            
            if (parsedData?.event === "file_syn_ack") {
                recieveFileSynAck(parsedData.chunk, parsedData.chunkNo, newClient, setTotalReceivedBytes, generateFile);
            }
        });

        newClient.on("close", () => {
            console.log("Client closing");
            disconnect();
        });

        newClient.on("error", error => {
            console.log("Client error:", error);
        });

        setClient(newClient);
    }, []);

    // Generate File
    const generateFile = async () => {
        const {chunkStore, resetChunkStore} = useChunkStore.getState();

        if (!chunkStore) {
            console.log("No chunkstore to generate from...")
            return;
        }

        if (chunkStore?.totalChunks !== chunkStore.chunkArray.length) {
            console.log("Not all Chunks recieved!", chunkStore.chunkArray.length, "/", chunkStore.totalChunks);
            return;
        }

        try {
            const combinedChunks = Buffer.concat(chunkStore.chunkArray);
            const filePath = `${RNFS.DownloadDirectoryPath}/${chunkStore.name}${chunkStore.type}`;

            await RNFS.writeFile(
                filePath,
                combinedChunks?.toString('base64'),
                'base64',
            );

            console.log("File saved successfully @", filePath);
            resetChunkStore();
        } catch (error) {
            console.log("Error saving file: ", error);
        }
    }

    // Send Data
    const sendData = useCallback(async (data: string | Buffer) => {
        const socket = client || server
        if (!socket) {
            console.log("No connection to send data");
            return;
        }

        try {
            socket.write(JSON.stringify({ event: "message", data: data }));
        } catch (error) {
            console.log("Error sending data:", error);
        }
    }, [server, client]);

    // Send File Syn
    const sendFileSyn = async (filePath: string) => {
        try {
            const fileName = filePath.split('/').pop() || 'file';
            let fileType = '.mp3'
            const fileData = await RNFS.readFile(filePath, 'base64');
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
                name: fileName,
                size: fileBuffer.length,
                type: fileType,
                totalChunks,
            };

            setCurrentChunkSet({
                totalChunks,
                chunkArray,
            });

            setSentFiles((prevFiles: string[]) => [...prevFiles, fileName]);

            console.log("Total chunks:", totalChunks);
            console.log("File name:", fileName);
            console.log("File size:", fileBuffer.length);

            const socket = client || server;
            if (!socket) return;

            socket.write(JSON.stringify({ event: "file_syn", file: rawData }));
        }
        catch (error) {
            console.log("Error getting file stat:", error);
            return;
        }
    }

    return (
        <TCPContext.Provider
            value={{
                server,
                client,
                directory,
                isConnected,
                connectedClient,
                sentFiles,
                totalSentBytes,
                totalReceivedBytes,
                setDeviceDirectory,
                startServer,
                connectToServer,
                disconnect,
                sendData,
                sendFileSyn,
            }}>
            {children}
        </TCPContext.Provider>
    );
};