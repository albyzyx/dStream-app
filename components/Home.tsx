import styled from "styled-components";

import { fetchAllVideosWithMarketData } from "../services/web3DataStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SideBar from "./SideBar";
import VideoPreview from "./VideoPreview";
import SearchBar from "./SearchBar";
const Home = () => {
  const [dashData, setDashData] = useState(null);
  const [origDash, setOrigDashData] = useState(null);

  useEffect(() => {
    fetchAllVideosWithMarketData().then((data) => {
      setDashData(data);
      setOrigDashData(data);
    });
  }, []);

  const searchQuery = (query) => {
    var newArray = origDash.filter(function (el) {
      return el.title.includes(query);
    });
    setDashData(newArray);
  };

  return (
    <Container>
      <SideBar min={false} />
      <SearchBar searchQuery={searchQuery} />
      <h1>Home</h1>
      <span>Decentralised video platform</span>
      {dashData && (
        <Contents>
          {dashData.map((e, i) => {
            return <VideoPreview key={i} data={e} me={false} dash={true} />;
          })}
        </Contents>
      )}
      {!dashData && (
        <Contents>
          <span>Fetching</span>
        </Contents>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
  margin-left: 220px;
  /* height: 100vh; */
  h1 {
    color: #fff;
    margin-bottom: 0;
  }
  span {
    color: #808191;
  }
`;

const Contents = styled.div`
  display: flex;
  grid-gap: 48px;
  flex-wrap: wrap;
  margin-top: 54px;
  background-color: transparent;
`;

export default Home;
