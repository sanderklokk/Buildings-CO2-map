import { useMap } from "react-leaflet";
import L, { HeatLatLngTuple } from 'leaflet'
import { useEffect } from "react";
import "leaflet.heat";

interface HeatLayerProps {
  data: { lat: number, long: number, intensity: number, text: string }[],
  zIndex: number
}

/*
* handle logic for when heatlayer is shown.
*/
export const HeatLayer = ({ data, zIndex }: HeatLayerProps) => {

  const map = useMap()
  useEffect(() => {
    const points: HeatLatLngTuple[] = data
      ? data.map((p) => {
        return [p.lat, p.long, p.intensity];
      })
      : [];
      
    L.heatLayer(points, { }).addTo(map);

    map.eachLayer((layer) => {
      const l = layer.getPane();
      if (l && l.className.includes("leaflet-overlay-pane")) {
        l.style.zIndex = zIndex.toString();
      }
    }
    );


  }, [map, data, zIndex]);

  return <></>
}