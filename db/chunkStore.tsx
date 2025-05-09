import { create } from 'zustand';
import { Buffer } from 'buffer';

interface ChunkState {
    chunkStore: {
        name: string;
        totalChunks: number;
        type: string;
        chunkArray: Buffer[];
    } | null;
    currentChunkSet: {
        totalChunks: number;
        chunkArray: Buffer[];
    } | null;

    setChunkStore: (chunkStore: any) => void;
    resetChunkStore: () => void;
    setCurrentChunkSet: (chunkSet: any) => void;
    resetCurrentChunkSet: () => void;
}

export const useChunkStore = create<ChunkState>(set => ({
    chunkStore: null,
    currentChunkSet: null,
    setChunkStore: chunkStore => set(() => ({ chunkStore })),
    resetChunkStore: () => set(() => ({ chunkStore: null })),
    setCurrentChunkSet: currentChunkSet => set(() => ({ currentChunkSet })),
    resetCurrentChunkSet: () => set(() => ({ currentChunkSet: null })),
}));