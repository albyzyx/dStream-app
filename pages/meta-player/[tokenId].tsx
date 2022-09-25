import styled from "styled-components";

import { useRouter } from "next/router";
import NavBar from "../../components/NavBar";
import VideoPlayer from "../../components/VideoPlayer";
// import { fetchIpfsResourceURI } from "../../services/ipfsHelper";
import { createMarketSale, fetchTokenMeta } from "../../services/web3DataStore";
import { useEffect, useState } from "react";
import ethIcon from "../../asset/token.png";
import { BigNumber, ethers } from "ethers";
import { fetchAllAddressVideos } from "../../services/web3DataStore";

import Image from "next/image";

import SideBar from "../../components/SideBar";
import { ellipseAddress } from "../../lib/utilities";
import VideoPreview from "../../components/VideoPreview";

const Player = () => {
  const router = useRouter();
  const [videoMeta, setVideoMeta] = useState(null);
  const [otherVideos, setOtherVideos] = useState(null);
  const { tokenId } = router.query;
  useEffect(() => {
    fetchTokenMeta(BigNumber.from(tokenId)).then((data) => {
      setVideoMeta(data);
    });
  }, [tokenId]);

  useEffect(() => {
    if (videoMeta && videoMeta.owner) {
      fetchAllAddressVideos(videoMeta.owner, tokenId).then((data) => {
        setOtherVideos(data);
      });
    }
  }, [videoMeta, tokenId]);

  const handleBuy = (tokenId, price) => {
    createMarketSale(tokenId, price).then(() => {
      let deepCopiedDashData = JSON.parse(JSON.stringify(videoMeta));
      // delete deepCopiedDashData;
      deepCopiedDashData.owner = "";
      deepCopiedDashData.isMarketItem = false;

      setVideoMeta(deepCopiedDashData);
    });
  };
  return (
    <Container>
      <SideBar min={true} />

      {videoMeta && (
        <>
          <Contents>
            <h1>{videoMeta.title}</h1>
            <VideoPlayer videoURI={videoMeta.videoURI} h={500} w={900} />
            <MetaStrip>
              <>
                <div id="owner-sec">
                  <img
                    src={`https://avatars.dicebear.com/api/identicon/your-${videoMeta.owner}custom-seed.svg`}
                    alt=""
                  />
                  <span id="owner">{ellipseAddress(videoMeta.owner)}</span>
                </div>
                {videoMeta.isMarketItem && (
                  <div id="market-sec">
                    <>
                      <div>
                        <span id="current-price-text">Current price</span>
                        <div id="price-sec">
                          <Image
                            id="eth-ico"
                            src={ethIcon}
                            width={24}
                            height={24}
                          />
                          <span id="price">{videoMeta.price} ETH</span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleBuy(videoMeta.tokenId, videoMeta.price)
                        }
                      >
                        Buy Now
                      </button>
                    </>
                  </div>
                )}
              </>
            </MetaStrip>
            <h4>Description:</h4>
            <span id="desc"> {videoMeta.description}</span>
          </Contents>
          <SideCarousel>
            <span id="title">More videos by this creator:</span>
            {otherVideos &&
              otherVideos.length > 1 &&
              otherVideos.map((e, i) => {
                return <VideoPreview key={i} data={e} me={false} dash={true} />;
              })}
            {otherVideos && otherVideos.length <= 1 && (
              <span>This creator has no other video</span>
            )}
          </SideCarousel>
        </>
      )}
    </Container>
  );
};

Player.getInitialProps = async ({ query }) => {
  const { tokenId } = query;
  return { tokenId };
};

const SideCarousel = styled.div`
  /* background-color: aqua; */
  width: 100%;
  margin: 36px;
  margin-top: 54px;
  display: flex;
  flex-direction: column;
  grid-gap: 24px;
`;

const Container = styled.div`
  padding: 24px 0;
  margin-left: 100px;
  background-image: linear-gradient(110deg, #1f1d2b, #1f1d2b, #312e41);
  height: 100vh;
  background-size: cover;
  display: flex;
  h1 {
    color: #fff;
    /* margin-bottom: 0; */
    margin-left: 24px;
  }
  span {
    color: #808191;
  }
`;
const Contents = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  h4 {
    margin-bottom: 0;
    font-size: 18px;
    color: #fff;
  }
  span {
    padding: 12px;
  }
  #desc {
    padding-bottom: 72px;
    /* background-color: #fff; */
  }
`;

const MetaStrip = styled.div`
  display: flex;
  /* background-color: #fff; */
  width: 900px;
  justify-content: space-between;
  #market-sec {
    display: flex;
    /* padding: 0 12px; */
    align-items: center;

    button {
      cursor: pointer;

      color: #fff;
      font-weight: 100;
      padding: 8px 16px;
      background-image: linear-gradient(45deg, #f303c9, #3d309b);
      border: 0;
      margin-right: 12px;
      margin-top: 12px;
      border-radius: 8px;
      /* height: 24px; */
    }
    justify-content: space-between;
    #current-price-text {
      font-size: 12px;
      margin-left: 6px;
    }
    #price-sec {
      display: flex;
      align-items: center;
    }
    #price {
      color: #fff;
    }
  }
  #owner-sec {
    display: flex;
    align-items: center;
    margin-top: 12px;
    #owner {
      font-size: 12px;
      /* margin-left: 8px; */
    }
    :hover {
      #owner {
        text-decoration: underline;
      }
      cursor: pointer;
    }
    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid #fff;
    }
  }
`;
export default Player;
