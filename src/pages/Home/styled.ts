import styled from "@emotion/styled";

export const Header = styled.div`
  margin-top: 60px;
  display: grid;

  grid-template-columns: repeat(4, 1fr);
  grid-gap: 2em;

  align-items: center;
  justify-content: space-around;

  .double {
    grid-column: span 2;
  }
`;

export const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  margin: auto;
`;

export const SofaImage = styled(Image)`
  width: 80%;
`;

export const Line = styled.img`
  width: 100%;
`;
