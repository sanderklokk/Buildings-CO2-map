import { MapContainer } from "react-leaflet";
import { HeatLayer } from "./MapLayers/HeatLayer";
import { MarkerLayer } from "./MapLayers/MarkerLayer";
import { TileLayer } from "./MapLayers/TileLayer";

// temporary
import { getData } from "../../../../Data/getdata.ts";


export const Map = () => {
  
 const data = getData();
 
 // const data = [{ lat: 63.43049, long: 10.39506, text: "Trondheim", intensity: 40 }];

  return (
    <MapContainer
      className="h-full"
      center={[63.43049, 10.39506]}
      zoom={13}
      scrollWheelZoom={true}
      maxBounds={[
        [63.895025250709246, 8.530996400060626],
        [62.731479127003986, 12.232074915704278],
      ]}
      minZoom={9}

      
    >
      
    <TileLayer url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={20}
        zIndex={1}
        id={"fullmaplayer"}
        
      />
  
      <HeatLayer data={data} zIndex={2} />
      <MarkerLayer data={data} />
      
      <TileLayer url='https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png'
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            maxZoom={20}
            zIndex={3}
            id="labelmaplayer"
          />
     

    </MapContainer>
  );
};
