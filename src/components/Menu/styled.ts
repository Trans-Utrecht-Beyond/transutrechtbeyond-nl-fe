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
  ${hidePrint}
  width: 100%;
  transform: rotate(180deg);
`;

export const MobileMenu = styled.div`
  ${hidePrint}
  display: grid;
  justify-content: center;
  text-align: center;
  .material-symbols-outlined {
    cursor: pointer;
  }
`;
