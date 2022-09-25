import styled from "styled-components";
import logo from "../asset/dstream.png";
import Image from "next/image";
const Landing = ({ connect }): JSX.Element => {
  return (
    <Container>
      <Img>
        <Image src={logo} />
      </Img>
      <ConnectButton onClick={connect}>Connect Wallet</ConnectButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  align-items: center;
  flex-direction: column;
  /* width: 120px; */
`;

const Img = styled.div`
  width: 360px;
`;

const ConnectButton = styled.button`
  /* padding: 12px; */
  border: 0;
  cursor: pointer;

  color: #fff;
  font-weight: 100;
  padding: 8px 16px;
  background-image: linear-gradient(45deg, #f303c9, #3d309b);
  border: 0;
  margin-right: 12px;
  margin-top: 12px;
  border-radius: 8px;
`;

export default Landing;
