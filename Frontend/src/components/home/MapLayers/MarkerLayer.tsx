import { Marker, Popup, useMap, useMapEvent } from "react-leaflet";
import { useState } from "react";

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


    const map = useMap();
    useMapEvent('zoomend', () => {
        setZoom(map.getZoom());
    })

    useMapEvent('moveend', () => {
        const bounds = map.getBounds();
        setBounds([bounds.getNorth(), bounds.getEast(), bounds.getSouth(), bounds.getWest()]);
    });


    return <>
        {zoom > 17 && data.filter((d) => d.lat > bounds[2] && d.lat < bounds[0] && d.long > bounds[3] && d.long < bounds[1]).map((p, i) => {
            return <Marker key={i} position={[p.lat, p.long]}>
                <Popup>
                    {p.text}
                </Popup>
            </Marker>
        }
        )}
    </>
}