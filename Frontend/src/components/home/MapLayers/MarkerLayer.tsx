import { Marker, Popup, useMap, useMapEvent } from "react-leaflet";
import { useState } from "react";
import { useBoundStore } from "../../../store/Store";
import {MapBuildingPopup} from "./MapBuildingPopup";

interface HeatLayerProps {
    data: { lat: number, long: number, intensity: number, text: string }[]
}
/**
 * handle logic for when markers are shown.
 * handle performance fixes when markers are shown.
 */
export const MarkerLayer = ({ data }: HeatLayerProps) => {
    const [zoom, setZoom] = useState<number>(13);
    // north, east, south, west
    const [bounds, setBounds] = useState<number[]>([0, 0, 0, 0]);

    const { buildings } = useBoundStore().mapSlice;

    const map = useMap();
    useMapEvent('zoomend', () => {
        setZoom(map.getZoom());
    })

    useMapEvent('moveend', () => {
        const bounds = map.getBounds();
        setBounds([bounds.getNorth(), bounds.getEast(), bounds.getSouth(), bounds.getWest()]);
    });


  /*  return <>
        {zoom > 17 && data.filter((d) => d.lat > bounds[2] && d.lat < bounds[0] && d.long > bounds[3] && d.long < bounds[1]).map((p, i) => {
            return <Marker key={i} position={[p.lat, p.long]}>
                <Popup>
                    {p.text}
                </Popup>
            </Marker>
        }
        )}
    </>*/

    return <>
        {zoom > 17 && buildings.map(x => ({lat: x.y, long: x.x, building: x.building})).filter((d) => d.lat > bounds[2] && d.lat < bounds[0] && d.long > bounds[3] && d.long < bounds[1]).map((p, i) => {
            return <Marker key={i} position={[p.lat, p.long]}>
                <Popup>
                    <MapBuildingPopup
                        buildingid={p.building}
                        />
                </Popup>
            </Marker>
        }
        )}
        </>
}