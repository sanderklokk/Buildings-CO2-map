import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import { latLng } from "leaflet";

export const Map = () => {
  const { data } = {
    data: [{ lat: 63.43049, long: 10.39506, text: "Trondheim" }],
  }; /*useQuery({
        queryKey: ["buildingSearch", address],
        queryFn: () => searchBuilding(address)
    });*/

  return (
    <MapContainer
      className="h-full"
      center={[63.43049, 10.39506]}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data &&
        data.map((pos, i) => (
          <Marker key={i} position={latLng(pos.lat, pos.long)}>
            <Popup>{pos.text}</Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};
