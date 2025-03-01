import { Map } from "../components/home/Map";
import { MapSearch } from "../components/home/MapSearch/MapSearch";

export const Home = () => {
  return (
    <div className="flex flex-row bg-trk-white h-7/8">
      <div className="w-1/3">
        <MapSearch />
      </div>
      <div className="w-2/3">
        <Map />
      </div>
    </div>
  );
};
