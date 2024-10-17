import { css } from "@emotion/react";
import styled from "@emotion/styled";

const hidePrint = css`
  @media print {
    display: none;
  }
`;

export const Menu = styled.div`
  ${hidePrint}
  display: flex;

  justify-content: space-around;

  .active h3 {
    text-decoration: underline;
  }
`;

export const MenuLine = styled.img`
  ${hidePrint};
  width: 100%;
  transform: rotate(180deg);
`;

export const MobileMenu = styled.div`
  ${hidePrint};
  display: grid;
  justify-content: center;
  text-align: center;
  grid-auto-columns: 100%;

  .material-symbols-outlined {
    cursor: pointer;
  }
`;

export const NavLabel = styled.h3`
  display: flex;
  justify-content: space-between;
`;

export const SubMenu = styled.div`
  position: relative;
`;

export const SubMenuWrapper = styled.div`
  margin-left: 1em;
  padding: 0 1em;
  height: max-content;

  @media screen and (min-width: 978px) {
    background: white;
    z-index: 1;
    position: absolute;
  }
`;

export const SubMenuLine = styled.img`
  ${hidePrint};
  position: absolute;
  top: 0;
  height: 100%;
`;
