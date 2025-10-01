import { PlotData } from "./plot";

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