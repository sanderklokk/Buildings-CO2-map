import trkLogoWithText from "../../assets/trk/trklogo_withtext.svg";

export const Navbar = () => {
  return (
    <nav className="w-full h-[15vh] flex items-center overflow-hidden">
      <img
        src={trkLogoWithText}
        alt="TRK Logo"
        className="h-full object-contain"
      />
    </nav>
  );
};
