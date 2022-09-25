import Image from "next/image";
import styled from "styled-components";
import wallet from "../asset/money-bag.png";
const SearchBar = ({ searchQuery }) => {
  return (
    <Search>
      <input
        id="search"
        placeholder="Search"
        onChange={(e) => {
          searchQuery(e.target.value);
        }}
      />
      <div>
        <Image width={36} height={36} id="img" src={wallet} alt="" />
        <span>0.756 DST</span>
      </div>
    </Search>
  );
};

const Search = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 12px;
  div {
    /* position: fixed; */
    /* right: 24px; */
    height: 36px !important;
    display: flex;
    align-items: center;
    top: 24px;
    span {
      margin-left: 12px;
    }
  }
  input {
    width: 430px;
    background-color: #353440;
    border: 0;
    padding: 6px 12px;
    border-radius: 6px;
    color: #808191;
    :focus {
      outline: none;
    }
  }
`;

export default SearchBar;
