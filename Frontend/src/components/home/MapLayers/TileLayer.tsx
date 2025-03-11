import { useMap } from "react-leaflet";
import L from "leaflet";

interface TileLayerProps {
    url: string;
    attribution: string;
    maxZoom: number;
    zIndex: number;
    id: string;
}

/*
custom tilelayer creation to handle separate z-index for label- and normal map
*/
export const TileLayer = ({ url, attribution, maxZoom, zIndex, id }: TileLayerProps) => {
    const map = useMap();

    const pane = map.createPane(id);
    const layer = L.tileLayer(url, { attribution, maxZoom, zIndex, pane: id});
    pane.style.zIndex = zIndex.toString();
    map.addLayer(layer);

    return <></>;
};