import styled from "styled-components";
import { useEffect, useState } from "react";
import { createVideoNFT } from "../services/web3DataStore";
import VideoPlayer from "../components/VideoPlayer";
import { VideoSnap } from "../lib/videoSnap";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import { useRouter } from "next/router";
const upload = () => {
  const [file, setFile] = useState();
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [formInput, updateFormInput] = useState({
    name: "",
    description: "",
  });
  const [isMinting, setIsMinting] = useState(false);
  const router = useRouter();
  useEffect(() => {}, [isMinting]);

  async function onChange(e) {
    const file = e.target.files[0];
    setFile(file);
    const fileUrl = window.URL.createObjectURL(file);
    typeof document.getElementById("video-player");
    display(file, document.getElementById("video-player"));
    const videoSnap = new VideoSnap(fileUrl);

    videoSnap.getFrames(4).then((thumbnails) => {
      setThumbnails(thumbnails);
      thumbnails;
    });
  }

  async function onMintHandler() {
    if (
      !formInput.name ||
      !formInput.description ||
      !thumbnails[selectedThumb] ||
      !file
    ) {
      alert("Fill all the fields");
      return;
    }
    setIsMinting(true);
    createVideoNFT(
      formInput.name,
      formInput.description,
      thumbnails[selectedThumb],
      file,
      mintStatusCallback
    )
      .then(() => {
        router.push("/profile/");
        setIsMinting(false);
      })
      .catch(() => {
        setIsMinting(false);
      });
  }

  const mintStatusCallback = (status) => {
    if (document.getElementById("mint-status"))
      document.getElementById("mint-status").innerHTML = status;
  };

  function display(videoFile, videoEl) {
    if (!(videoFile instanceof Blob))
      throw new Error("`videoFile` must be a Blob or File object."); // The `File` prototype extends the `Blob` prototype, so `instanceof Blob` works for both.
    if (!(videoEl instanceof HTMLVideoElement))
      throw new Error("`videoEl` must be a <video> element.");

    const newObjectUrl = URL.createObjectURL(videoFile);

    const oldObjectUrl = videoEl.currentSrc;
    if (oldObjectUrl && oldObjectUrl.startsWith("blob:")) {
      videoEl.src = "";
      URL.revokeObjectURL(oldObjectUrl);
    }

    videoEl.src = newObjectUrl;

    videoEl.load();
  }
  return (
    <Container>
      <SideBar min={true} />
      <SearchBar />
      <h1>Upload Video</h1>
      <span>Mint video NFT and upload to dStream</span>
      <Contents>
        <div id="video-image-preview">
          <VideoPlayer videoURI={""} w={889} h={500} />
          {thumbnails.length > 0 && (
            <span id="image-preview-text">Choose preview:</span>
          )}
          <div id="image-preview">
            {thumbnails.map((e, i) => {
              return (
                <Image selected={i == selectedThumb}>
                  <img key={i} src={e} onClick={() => setSelectedThumb(i)} />
                </Image>
              );
            })}
          </div>
        </div>
        <FormCard isMinting={isMinting}>
          <input
            required
            className="ip-field"
            placeholder="Video Title"
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
          <textarea
            required
            className="ip-field"
            placeholder="Video Description"
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
          <input
            required
            className="ip-field"
            type="file"
            name="Asset"
            onChange={onChange}
          />
          {/* {file && <img width="350" src={file} />} */}
          <button id="mint-button" onClick={onMintHandler}>
            Mint NFT
          </button>
          <span id="mint-status"></span>
        </FormCard>
      </Contents>
      {/* <NavBar /> */}
    </Container>
  );
};

const FormCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #252831;
  padding: 36px;
  border-radius: 24px;
  height: 100%;
  button {
    cursor: pointer;
  }
  .ip-field {
    width: 300px;
    margin-bottom: 12px;
    background-color: #353440;
    border: 0;
    padding: 6px 12px;
    border-radius: 6px;
    color: #808191;
    :focus {
      outline: none;
    }
  }
  #mint-button {
    cursor: pointer;
    color: #fff;
    font-weight: 100;
    padding: 8px 16px;
    border: 0;
    margin-right: 12px;
    margin-top: 12px;
    border-radius: 8px;
    pointer-events: ${({ isMinting }) => (isMinting ? "none" : "")};
    background-image: ${({ isMinting }) =>
      isMinting
        ? "linear-gradient(45deg, #ffcaf5, #d0caff);"
        : "linear-gradient(45deg, #f303c9, #3d309b);"};

    /* height: 24px; */
  }
`;

const Image = styled.div`
  img {
    ${({ selected }) => selected && "border: 1px solid #fff;"}
    cursor: pointer;
  }
`;

const Container = styled.div`
  padding: 24px 0;
  padding-bottom: 60px;
  margin-left: 100px;
  background-size: cover;
  height: minmax(100vh, 100%);
  /* height: 100%; */

  h1 {
    color: #fff;
    margin-bottom: 0;
    margin-top: 54px;
  }
  span {
    color: #808191;
  }
`;

const Contents = styled.div`
  display: flex;
  /* justify-content: center; */
  grid-gap: 24px;
  padding: 24px 0;
  #video-image-preview {
    display: flex;
    flex-direction: column;
  }
  #video-preview {
    grid-gap: 24px;
  }
  #image-preview-text {
    padding: 12px;
    font-size: 14px;
  }
  #image-preview {
    display: flex;
    padding: 0 12px;

    img {
      height: 100px;
      margin-right: 12px;
      border-radius: 12px;
    }
  }
`;

export default upload;
