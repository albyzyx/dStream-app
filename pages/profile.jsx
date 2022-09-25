import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styled from "styled-components";
import NavBar from "../components/NavBar";
import {
  fetchAllSenderVideos,
  listTokenInMarket,
  createMarketSale,
} from "../services/web3DataStore";
import SideBar from "../components/SideBar";
import VideoPreview from "../components/VideoPreview";
import SearchBar from "../components/SearchBar";
const profile = () => {
  const [dashData, setDashData] = useState(null);
  const [origDash, setOrigDashData] = useState(null);
  const [isMarketplace, setIsMarketplace] = useState(false);
  const router = useRouter();
  useEffect(() => {
    fetchAllSenderVideos().then((data) => {
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
  const handleBuy = (tokenId, price) => {
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
  const handleListTokenInMarket = (tokenId, price) => {
    listTokenInMarket(tokenId, price).then(
      ({ resTokenId, resSeller, resPrice }) => {
        let deepCopiedDashData = JSON.parse(JSON.stringify(dashData));
        deepCopiedDashData.forEach((element) => {
          if (element.tokenId == resTokenId) {
            element.isMarketItem = true;
            element.seller = resSeller;
            element.price = resPrice;
          }
        });
        setDashData(deepCopiedDashData);
        setIsMarketplace(false);
      }
    );
  };
  return (
    <Container>
      <SideBar />
      <SearchBar searchQuery={searchQuery} />
      <TypeSwitch isMarketplace={isMarketplace}>
        <button id="my-videos" onClick={() => setIsMarketplace(!isMarketplace)}>
          My Videos
        </button>
        <button
          id="my-marketplace"
          onClick={() => setIsMarketplace(!isMarketplace)}
        >
          My Marketplace videos
        </button>
      </TypeSwitch>
      {isMarketplace && dashData && (
        <>
          <h1>My Listed Videos</h1>
          <Contents>
            {dashData.filter((e) => e.isMarketItem).length == 0 ? (
              <span>No videos listed for sale</span>
            ) : (
              dashData.map((e, i) => {
                return (
                  e.isMarketItem && (
                    <VideoPreview
                      key={i}
                      data={e}
                      me={true}
                      handleBuy={handleBuy}
                      handleListTokenInMarket={handleListTokenInMarket}
                    />
                  )
                );
              })
            )}
          </Contents>
        </>
      )}

      {!isMarketplace && dashData && (
        <>
          <h1>My Videos</h1>

          <Contents>
            {dashData.filter((e) => !e.isMarketItem).length == 0 ? (
              <span>No videos uploaded. Upload a video and mint a NFT</span>
            ) : (
              dashData.map((e, i) => {
                return (
                  !e.isMarketItem && (
                    <VideoPreview
                      key={i}
                      data={e}
                      me={true}
                      handleBuy={handleBuy}
                      handleListTokenInMarket={handleListTokenInMarket}
                    />
                  )
                );
              })
            )}
          </Contents>
        </>
      )}
      {!dashData && (
        <Contents>
          <span>Fetching</span>
        </Contents>
      )}
    </Container>
  );
};

const TypeSwitch = styled.div`
  margin-bottom: 24px;
  button {
    cursor: pointer;
    color: #fff;
    font-weight: 100;
    padding: 8px 16px;
    background-color: transparent;
    margin-right: 12px;
    margin-top: 12px;
    border-radius: 8px;
    /* height: 24px; */
  }
  #my-marketplace {
    border: 3px solid #3d309b;

    ${({ isMarketplace }) =>
      isMarketplace &&
      "background-image: linear-gradient(45deg, #f303c9, #3d309b);"};
    ${({ isMarketplace }) => isMarketplace && "border: 0;"};
  }
  #my-videos {
    border: 3px solid #f303c9;

    ${({ isMarketplace }) =>
      !isMarketplace &&
      "background-image: linear-gradient(45deg, #f303c9, #3d309b)"};
    ${({ isMarketplace }) => !isMarketplace && "border: 0;"};
  }
`;

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

export default profile;
