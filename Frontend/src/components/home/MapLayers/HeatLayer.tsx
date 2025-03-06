import { useMap } from "react-leaflet";
import L from 'leaflet'
import { useEffect } from "react";
import "leaflet.heat";

interface HeatLayerProps {
    data: { lat: number, long: number, intensity: number, text: string }[]
}


/*
* handle logic for when heatlayer is shown.
*/
export const HeatLayer = ({data}: HeatLayerProps) => {

      const map = useMap()
    
        useEffect(() => {
          const points = data
          ? data.map((p) => {
            return [p.lat, p.long, p.intensity];
            })
          : [];
          // @ts-expect-error .heatlayer does exist after: import "leaflet.heat";
          L.heatLayer(points).addTo(map);
    
        }, [data, map]);

    return <></>
}