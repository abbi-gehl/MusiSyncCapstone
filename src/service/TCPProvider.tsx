import { createContext, FC, useCallback, useContext, useState } from "react";
import { Alert } from "react-native";
import TcpSocket from 'react-native-tcp-socket';

interface TCPContextType {
    server: any;
    client: any;
    directory: string;
    isConnected: boolean;
    connectedClient: any;

    setDeviceDirectory: (dir: string) => void;
    startServer: (port: number) => void;
    connectToServer: (host: string, port: number) => void;
    disconnect: () => void;
    sendData: (data: string) => void;
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

export const TCPProvider: FC<{children: React.ReactNode}> = ({children}) => {
    const [server, setServer] = useState<any>(null);
    const [client, setClient] = useState<any>(null);
    const [directory, setDirectory] = useState<string>('');
    const [serverSocket, setServerSocket] = useState<any>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [connectedClient, setConnectedClient] = useState<any>(null);

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

            setServerSocket(socket);
            socket.setNoDelay(true);
            socket.readableHighWaterMark = 1024 * 1024 * 1;
            socket.writableHighWaterMark = 1024 * 1024 * 1;

            socket.on("data", data => {
                console.log("Server received:", data);
            });

            socket.on("close", () => {
                console.log("Server closing");
                disconnect();
            })

            socket.on("error", error => {
                console.log("Server error:", error);
            });
        });

        newServer.listen({port, host: '10.0.2.15'}, () => {
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

    const sendData = useCallback((data: string) => {
        const socket = client || server
        if (!socket) {
            console.log("No connection to send data");
            return;
        }

        socket.write(JSON.stringify({ event: 'data', data: data }));
    }, [server, client, isConnected]);

    return (
        <TCPContext.Provider
            value= {{
                server,
                client,
                directory,
                isConnected,
                connectedClient,
                setDeviceDirectory,
                startServer,
                connectToServer,
                disconnect,
                sendData
            }}>
            {children}
        </TCPContext.Provider>
    );
};