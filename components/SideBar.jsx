import styled from "styled-components";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../asset/dstream.png";
import logoMin from "../asset/logo-min.jpg";
import Image from "next/image";
import {
  faHome,
  faShop,
  faBroadcastTower,
  faBook,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router";

const SideBar = ({ min }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const router = useRouter();

  return (
    <Container isOpen={isOpen} min={min} onClick={() => setIsOpen(!isOpen)}>
      <Contents>
        <Header>
          {/* <Image id="img-full" src={logoMin} /> */}
          {/* <img src={logo} alt="" /> */}
          {min && <Image id="logo-min" src={logoMin} />}
          {!min && <Image id="logo-min" src={logo} />}
        </Header>
        <SidebarItems>
          <Link href="/">
            <SidebarItem active={router.pathname === "/"}>
              <div className="iconContainer">
                <FontAwesomeIcon className="icon" icon={faHome} />
              </div>
              {!min && <span>Dashboard</span>}
            </SidebarItem>
          </Link>
          <Link href="/marketplace">
            <SidebarItem active={router.pathname === "/marketplace"}>
              <div className="iconContainer">
                <FontAwesomeIcon className="icon" icon={faShop} />
              </div>
              {!min && <span>Marketplace</span>}
            </SidebarItem>
          </Link>

          <Link href="/livestream">
            <SidebarItem active={router.pathname === "/livestream"}>
              <div className="iconContainer">
                <FontAwesomeIcon className="icon" icon={faBroadcastTower} />
              </div>
              {!min && <span>Live Stream</span>}
            </SidebarItem>
          </Link>

          <Link href="/profile">
            <SidebarItem active={router.pathname === "/profile"}>
              <div className="iconContainer">
                <FontAwesomeIcon className="icon" icon={faBook} />
              </div>
              {!min && <span>My collection</span>}
            </SidebarItem>
          </Link>

          <Link href="/mint">
            <SidebarItem active={router.pathname === "/mint"}>
              <div className="iconContainer">
                <FontAwesomeIcon className="icon" icon={faUpload} />
              </div>
              {!min && <span>Mint NFT</span>}
            </SidebarItem>
          </Link>
        </SidebarItems>
      </Contents>
    </Container>
  );
};
const Container = styled.div`
  background-color: #1f1d2b;
  position: fixed;
  height: 100vh;
  ${({ min }) => (min ? "width:100px;" : "width:220px;")}
  top: 0;
  left: 0;
`;

const Contents = styled.div``;
const Header = styled.div`
  padding: 24px;
  display: flex;
  height: 100px;

  align-items: center;
  /* img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid #fff;
  } */
  #img-full {
    /* width: 48px; */
    /* background-color: #fff; */
  }
  span {
    color: #fff;
    font-size: 20px;
    margin-left: 12px;
  }
`;
const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 42px;
  cursor: pointer;
  span {
    color: ${({ active }) => (active ? "#ffffff" : "#808191")};
    margin-left: 12px;
  }
  .icon {
    color: ${({ active }) => (active ? "#ffffff" : "#808191")};
    margin: 9px 0 0 9px;
  }

  .iconContainer {
    background-color: ${({ active }) => (active ? "#ff00cc" : "#353440")};
    height: 36px;
    width: 36px;
    border-radius: 12px;
    margin-left: 28px;
  }
`;
const SidebarItems = styled.div`
  margin-top: 24px;
`;

export default SideBar;
