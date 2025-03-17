import MapTextTab from "../components/home/MapTextTab";
import SeachTypeTab from "../components/home/SearchTypeTab";

export const Home = () => {
  return (
    <div className="flex flex-row bg-trk-white h-[85vh] overflow-hidden">
      {/* Venstre side med filtrering*/}
      <div className="w-1/3 h-full">
        <SeachTypeTab />
      </div>

      {/* Høyre side med kart*/}
      <div className="w-2/3 flex flex-col h-full overflow-x-hidden">
        <MapTextTab />
      </div>
    </div>
  );
};
