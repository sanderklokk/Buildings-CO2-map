//Unused component
//---------------------------------------

// import { useState } from "react";
// import { BuildingSearch } from "./BuildingSearch";
// //import { AreaSearch } from "./AreaSearch";

// const BUILDINGSEARCH = "Byggsøk";
// const AREASEARCH = "Områdesøk";

// /* Maybe create components for some of these (if they get used more places) */
// const classnames = {
//   searchTypeBox:
//     "cursor-pointer w-full h-full border-1 box-border border-trk-deep-blue",
//   searchHeader: "font-semibold text-lg",
//   searchLabel: "",
//   searchInput: "border-trk-deep-blue border-2 p-1",
//   searchButton:
//     "text-trk-white bg-trk-deep-blue border-2 w-fit text-sm px-12 py-2 cursor-pointer active:bg-trk-light-blue",
// };

// export const MapSearch = () => {
//   const [searchType, setSearchType] = useState(BUILDINGSEARCH);

//   const handleSetSearchType = (type: string) => {
//     setSearchType(type);
//   };

//   return (
//     <div className="flex flex-col">
//       <div className="flex flex-row text-sm">
//         <div
//           className={`w-1/2 text-center h-[45px]  ${
//             searchType == BUILDINGSEARCH
//               ? "bg-trk-deep-blue"
//               : "bg-trk-white active:bg-red-100"
//           }`}
//         >
//           <button
//             className={`${classnames.searchTypeBox} ${
//               searchType == BUILDINGSEARCH
//                 ? "text-trk-white"
//                 : "text-trk-deep-blue"
//             }`}
//             onClick={() => handleSetSearchType(BUILDINGSEARCH)}
//           >
//             {BUILDINGSEARCH}
//           </button>
//         </div>
//         <div
//           className={`w-1/2 text-center h-[45px]  ${
//             searchType == AREASEARCH
//               ? "bg-trk-deep-blue text-trk-white"
//               : "bg-trk-white text-trk-deep-blue"
//           }`}
//         >
//           <button
//             className={`${classnames.searchTypeBox} ${
//               searchType == AREASEARCH ? "text-trk-white" : "text-trk-deep-blue"
//             }`}
//             onClick={() => handleSetSearchType(AREASEARCH)}
//           >
//             {AREASEARCH}
//           </button>
//         </div>
//       </div>
//       <div>
//         {searchType == BUILDINGSEARCH && (
//           <div>
//             <BuildingSearch />
//           </div>
//         )}
//         {searchType == AREASEARCH && (
//           <div>
//             <AreaSearch />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
