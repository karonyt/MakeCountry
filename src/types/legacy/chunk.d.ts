import { PlotData } from "@/types/legacy/plot";

export interface ChunkData {
    x: number;
    z: number;
    id: string
    owner: string,
    countryId: number,
    special: boolean,
    noTerritory: boolean,
    price: number,
    plot: PlotData
}