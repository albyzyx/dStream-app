import styled from "styled-components";
import Link from "next/link";
import NavBar from "../components/NavBar";
import {
  createMarketSale,
  fetchAllMarketplaceVideos,
  getAddress,
} from "../services/web3DataStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BigNumber } from "ethers";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import VideoPreview from "../components/VideoPreview";
import { faL } from "@fortawesome/free-solid-svg-icons";

const Marketplace = () => {
  const [dashData, setDashData] = useState(null);
  const [origDash, setOrigDashData] = useState(null);
  const [address, setAddress] = useState("");
  const router = useRouter();

  useEffect(() => {
    getAddress().then(setAddress);
    fetchAllMarketplaceVideos().then((data) => {
      setOrigDashData(data);
      setDashData(data);
    });
  }, []);
  const searchQuery = (query) => {
    var newArray = origDash.filter(function (el) {
      return el.title.includes(query);
    });
    setDashData(newArray);
  };

  const handleBuy = (tokenId: BigNumber, price: string) => {
    createMarketSale(tokenId, price).then(() => {
      let deepCopiedDashData = JSON.parse(JSON.stringify(dashData));
      for (let i = 0; i < deepCopiedDashData.length; i++) {
        if (deepCopiedDashData[i].tokenId == tokenId) {
          delete deepCopiedDashData[i];
          break;
        }
      }
      setDashData(deepCopiedDashData);
    });
  };

  return (
    <Container>
      <SideBar min={false} />
      <SearchBar searchQuery={searchQuery} />
      <h1>Marketplace</h1>
      <span>{"Buy & sell digital ownersip"}</span>
      {dashData && dashData.length == 0 && (
        <Contents>
          <span>No videos in marketplace</span>
        </Contents>
      )}
      {dashData && (
        <Contents>
          {dashData.map((e, i) => {
            return (
              <VideoPreview key={i} data={e} me={false} handleBuy={handleBuy} />
            );
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

const Preview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  #preview-img {
    height: 200px;
  }
`;
const Container = styled.div`
  padding: 24px;
  margin-left: 220px;
  /* height: 100vh; */
  /* background-size: cover; */
  /* background-color: transparent; */
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
`;

export default Marketplace;
