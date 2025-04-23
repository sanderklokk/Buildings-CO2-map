import { Marker, Popup, useMap, useMapEvent } from "react-leaflet";
import { useState } from "react";
import { useBoundStore } from "../../../store/Store";
import {MapBuildingPopup} from "./MapBuildingPopup";

/**
 * handle logic for when markers are shown.
 * handle performance fixes when markers are shown.
 */
export const MarkerLayer = () => {
    const [zoom, setZoom] = useState<number>(13);
    // north, east, south, west
    const [bounds, setBounds] = useState<number[]>([0, 0, 0, 0]);

    const { buildings, hurtigSokResult } = useBoundStore().mapSlice;

    const map = useMap();
    useMapEvent('zoomend', () => {
        setZoom(map.getZoom());
    })

    useMapEvent('moveend', () => {
        const bounds = map.getBounds();
        setBounds([bounds.getNorth(), bounds.getEast(), bounds.getSouth(), bounds.getWest()]);
    });
    

    return <>
        {hurtigSokResult && 
        <Marker position={[hurtigSokResult.longitude, hurtigSokResult.latitude]}>
            <Popup>
                <MapBuildingPopup
                    building={hurtigSokResult}
                    coordinates={{ lat: hurtigSokResult.latitude, long: hurtigSokResult.longitude }}
                    />
            </Popup>
        </Marker>
        }
        {zoom > 17 && buildings.filter((d) => d.longitude > bounds[2] && d.longitude < bounds[0] && d.latitude > bounds[3] && d.latitude < bounds[1]).map((p, i) => {
            return <Marker key={i} position={[p.longitude, p.latitude]}>
                <Popup>
                    <MapBuildingPopup
                        building={p}
                        coordinates={{ lat: p.latitude, long: p.longitude }}
                        />
                </Popup>
            </Marker>
        }
        )}
        </>
}