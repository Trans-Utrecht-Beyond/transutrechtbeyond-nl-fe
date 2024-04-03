import styled from "@emotion/styled";

export const Outer = styled.div`
  position: relative;
  display: flex;

  justify-content: center;

  min-height: 100vh;
`;

export const Inner = styled.main`
  width: 100%;
  max-width: 1080px;
`;

export const Header = styled.header``;

export const Menu = styled.div`
  display: flex;

  justify-content: space-around;
`;

export const MenuLine = styled.img`
  width: 100%;
  transform: rotate(180deg);
`;
