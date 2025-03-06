import trkLogoWithText from "../../assets/trk/trklogo_withtext.svg";

export const Navbar = () => {
  return (
    <nav className="w-full h-1/8 flex flex-row">
      <img src={trkLogoWithText} className="h-full"></img>
    </nav>
  );
};
