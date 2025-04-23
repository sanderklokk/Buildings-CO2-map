import { MapContainer, Pane, TileLayer } from "react-leaflet";
import { HeatLayer } from "./MapLayers/HeatLayer";
import { MarkerLayer } from "./MapLayers/MarkerLayer";
import { useEffect } from "react";
import { get_search_building_materials } from "../../api/mapsearchAPI";
import { useBoundStore } from "../../store/Store";

//import { TileLayer } from "./MapLayers/TileLayer";

// temporary
// import { getData } from "../../../../Data/getdata.ts";

export const Map = () => {

  const { setBuildings } = useBoundStore().mapSlice;

  useEffect(() => {
    const initialfetch = async () => {
      try {
        const res = await get_search_building_materials([], [], undefined);
        if (res.status === 200) {
          setBuildings(res.data);
        } else {
          setBuildings([]);
          console.error("Error fetching building materials");
        }
      } catch (error) {
        setBuildings([]);
        console.error("Error fetching building materials", error);
      }
    };

    initialfetch();
  }, [setBuildings]);

  return (
    <MapContainer
      className="h-full"
      center={[63.3516508469412, 10.3585716127384]}
      zoom={10}

      scrollWheelZoom={true}
      maxBounds={[
        [63.895025250709246, 8.530996400060626],
        [62.731479127003986, 12.232074915704278],
      ]}
      minZoom={9}
      maxZoom={20}

    >
      <Pane name="fullmappane" style={{ zIndex: 1 }} >
        <TileLayer url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png' maxZoom={20}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
      </Pane>
      <HeatLayer zIndex={2} />
      <MarkerLayer />
      <Pane name="labelpane" style={{ zIndex: 3 }}>
        <TileLayer url='https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png' maxZoom={20}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
      </Pane>

    </MapContainer>
  );
};
