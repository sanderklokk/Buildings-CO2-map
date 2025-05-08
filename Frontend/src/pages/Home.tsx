import MainLayout from "../components/layout/MainLayout";
import SeachTypeTab from "../components/home/SearchTypeTab";
import { Map } from "../components/home/Map";

const Home = () => {
  return <MainLayout sidebar={<SeachTypeTab />}>{<Map />}</MainLayout>;
};

export default Home;
