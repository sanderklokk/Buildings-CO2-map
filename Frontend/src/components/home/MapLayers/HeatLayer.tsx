import { useMap } from "react-leaflet";
import L, { HeatLatLngTuple } from 'leaflet'
import { useEffect } from "react";
import { useRef } from "react";

import "leaflet.heat";
import { useBoundStore } from "../../../store/Store";

interface HeatLayerProps {
  data: { lat: number, long: number, intensity: number, text: string }[],
  zIndex: number
}

/*
* handle logic for when heatlayer is shown.
*/
export const HeatLayer = ({ data, zIndex }: HeatLayerProps) => {
  const { buildings } = useBoundStore().mapSlice;
  const heatLayerRef = useRef<L.HeatLayer | null>(null);
  const map = useMap();

  
  useEffect(() => {

    const points: HeatLatLngTuple[] = buildings
      ? buildings.map((p) => [p.y, p.x, p.totalamount])
      : [];

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    const heatLayer = L.heatLayer(points, {}).addTo(map);
    heatLayerRef.current = heatLayer;

    map.eachLayer((layer) => {
      const pane = layer.getPane();
      if (pane && pane.className.includes("leaflet-overlay-pane")) {
        pane.style.zIndex = zIndex.toString();
      }
    });
   
    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [map, buildings, zIndex]);

  return <></>;
};