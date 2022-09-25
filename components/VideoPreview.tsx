import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import ethIcon from "../asset/token.png";
import { ellipseAddress } from "../lib/utilities";

const VideoPreview = (props) => {
  const router = useRouter();
  const [price, setPrice] = useState();
  if (!props.data) {
    return <></>;
  }
  return (
    <Card>
      <CardContent
        onClick={() => {
          router.push("/meta-player/" + props.data.tokenId);
        }}
      >
        <img src={props.data.previewImageURI} alt="" />
        <div id="card-footer">
          <div>
            <span id="title">{props.data.title}</span>
            <span id="token-id">#{props.data.tokenId}</span>
          </div>
          <div id="owner-sec">
            <img
              src={`https://avatars.dicebear.com/api/identicon/your-${props.data.owner}custom-seed.svg`}
              alt=""
            />
            <span id="owner">{ellipseAddress(props.data.owner)}</span>
          </div>
        </div>
      </CardContent>
      {!props.dash && (
        <Content>
          {props.data.isMarketItem ? (
            <>
              <div>
                <span id="current-price-text">Current price</span>
                <div id="price-sec">
                  <Image id="eth-ico" src={ethIcon} width={24} height={24} />
                  <span id="price">{props.data.price} MATIC</span>
                </div>
              </div>

              <button
                onClick={() =>
                  props.handleBuy(props.data.tokenId, props.data.price)
                }
              >
                Buy Now
              </button>
            </>
          ) : props.me ? (
            <div id="nfs">
              <input
                id="price-input"
                type="text"
                placeholder="Price in MATIC"
              />
              <button
                onClick={() => {
                  const price = (
                    document.getElementById("price-input") as HTMLInputElement
                  ).value;
                  if (!price) {
                    return;
                  }
                  props.handleListTokenInMarket(props.data.tokenId, price);
                }}
              >
                List in Marketplace
              </button>
            </div>
          ) : (
            <div id="nfs">Not for sale</div>
          )}
        </Content>
      )}
    </Card>
  );
};

export default VideoPreview;

const Card = styled.div``;

const Content = styled.div`
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
  #nfs {
    display: flex;
    justify-content: center;
    align-items: baseline;
    margin-top: 12px;
    height: 50px;
    width: 100%;
    font-size: 10px;

    #price-input {
      /* height: 24px; */
      border-radius: 12px;
      padding: 10px 10px;
      margin-right: 8px;
      margin-left: 8px;
      background-color: #353440;
      color: #808191;
      border: 0;
    }
  }
`;
const CardContent = styled.div`
  background-color: #252831;
  border-radius: 12px;
  border: 0;
  max-width: 355px;
  /* box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
    rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
    rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset; */
  img {
    height: 200px;
    width: 355px;
    border-radius: 12px 12px 0 0;
  }
  #card-footer {
    padding: 12px 18px 24px 18px;
    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid #fff;
    }
  }
  #title {
    color: #ffffff;
    font-weight: 100;
  }
  #token-id {
    font-size: 12px;
  }
  #owner {
    font-size: 12px;
    margin-left: 8px;
  }
  #owner-sec {
    display: flex;
    align-items: center;
    margin-top: 12px;
    :hover {
      #owner {
        text-decoration: underline;
      }
      cursor: pointer;
    }
  }
  cursor: pointer;
  :hover {
    transform: scale(1.1);
    transition-duration: 200ms;
  }
`;

{
  /* <Preview
  key={i}
  onClick={() => {
    router.push("/meta-player/" + e.tokenId);
  }}
>
  <img id="preview-img" src={e.previewImageURI} alt="" />
  <span style={{ marginBottom: "12px" }}>{e.title + " #" + e.tokenId}</span>
  {/* {JSON.stringify(e.image)} 
</Preview>; */
}

// {data}
// {
//     "tokenId": 1,
//     "author": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
//     "owner": "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
//     "isMarketItem": false,
//     "seller": "0x0000000000000000000000000000000000000000",
//     "price": "0.0",
//     "title": "My NFT",
//     "description": "Desc",
//     "previewImageURI": "https://ipfs.io/ipfs/bafybeibrglmzenunmw7lwz2rv43eyev3dg543uthwx6lb7caoqrufzrp7a",
//     "videoURI": "https://ipfs.livepeer.com/ipfs/QmNh4HXE5sPA1s9pGEnAkmBG4H4bdUbBwxhStnEA2AWswG",
//     "videoCID": "QmNh4HXE5sPA1s9pGEnAkmBG4H4bdUbBwxhStnEA2AWswG",
//     "metaCID": "QmQkmhZgDo4Uj2QbVL4Y3YtW5icCvCEVGpdP2Wrq1fMtio"
// }
