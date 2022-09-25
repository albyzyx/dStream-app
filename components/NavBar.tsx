import styled from "styled-components";
import Link from "next/link";

const NavBar = () => {
  return (
    <NavBarContainer>
      <Link href="/">Home</Link>
      <Link href="/marketplace">Marketplace</Link>
      <Link href="/profile">My Profile</Link>
      <Link href="/mint">Mint</Link>
    </NavBarContainer>
  );
};

const NavBarContainer = styled.div`
  padding: 12px;
  position: fixed;
  top: 0;
  left: 0;
  a {
    margin-right: 12px;
    :hover {
      text-decoration: underline;
    }
  }
`;

export default NavBar;
