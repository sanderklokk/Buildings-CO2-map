import { useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export const BuildingSearch = () => {
  const [openDetailedSearch, setOpenDetailedSearch] = useState(false);

  const handleSetOpenDetailedSearch = () => {
    setOpenDetailedSearch(!openDetailedSearch);
  };

  const handleBuildingSearch = () => {};

  return (
    <div className="w-3/5 mx-auto pt-20 flex flex-col text-left">
      <h2 className="font-semibold text-lg">Byggsøk</h2>
      <div className="mt-4 flex flex-col">
        <label>Hurtigsøk på bygg</label>
        <input
          placeholder="Søk"
          className={`border-trk-deep-blue border-2 p-1 w-full`}
        />
        <button
          onClick={() => handleSetOpenDetailedSearch()}
          className={`ml-auto text-trk-deep-blue cursor-pointer`}
        >
          {!openDetailedSearch ? "Detailjert søk" : "Fjern felter"}{" "}
          <PlayArrowIcon
            className={`${openDetailedSearch ? "rotate-270" : ""}`}
          />
        </button>
      </div>
      <div className={`${openDetailedSearch ? "flex" : "hidden"} flex-col`}>
        <div className="mt-3 flex flex-row gap-1">
          <input
            placeholder="Gårdsnr."
            className={`border-trk-deep-blue border-2 p-1 w-full`}
          />
          <input
            placeholder="Bruksnr."
            className={`border-trk-deep-blue border-2 p-1 w-full`}
          />
          <input
            placeholder="Seksjonsnr."
            className={`border-trk-deep-blue border-2 p-1 w-full`}
          />
        </div>
      </div>
      <button
        className={`text-trk-white bg-trk-deep-blue border-2 w-fit text-sm px-12 py-2 cursor-pointer active:bg-trk-light-blue mt-4`}
        onClick={() => handleBuildingSearch()}
      >
        Søk
      </button>
    </div>
  );
};
