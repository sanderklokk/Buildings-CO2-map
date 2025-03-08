import { MapContainer, TileLayer } from "react-leaflet";
import { HeatLayer } from "./MapLayers/HeatLayer";
import { MarkerLayer } from "./MapLayers/MarkerLayer";

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
    >
      <HeatLayer data={data} />
      <MarkerLayer data={data} />
      <TileLayer url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains='abcd'
        maxZoom={20}
      />
    
 
    </MapContainer>
  );
};
