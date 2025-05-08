import { useMap } from "react-leaflet";
import L, { HeatLatLngTuple } from "leaflet";
import { useEffect } from "react";
import { useRef } from "react";

import "leaflet.heat";
import { useBoundStore } from "../../../store/Store";

interface HeatLayerProps {
  zIndex: number;
}

// tweak intensity for a less "completely red" map
const HEAT_INTENSITY_MULTIPLIER = 0.005;

/*
 * handle logic for when heatlayer is shown.
 */
export const HeatLayer = ({ zIndex }: HeatLayerProps) => {
  const { buildings } = useBoundStore().mapSlice;
  const heatLayerRef = useRef<L.HeatLayer | null>(null);
  const map = useMap();

  useEffect(() => {
    const points: HeatLatLngTuple[] = buildings
      ? buildings.map((p) => [
          p.longitude,
          p.latitude,
          p.totalamount * HEAT_INTENSITY_MULTIPLIER,
        ])
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
