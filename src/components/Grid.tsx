import styled from "@emotion/styled";

export const Section = styled.section`
  margin: 60px 0;
  display: grid;

  grid-template-columns: repeat(4, 1fr);
  grid-gap: 2em;

  align-items: center;
  justify-content: space-around;

  &.stretch {
    align-items: stretch;
  }

  &.top {
    align-items: start;
  }

  @media screen and (max-width: 978px) {
    grid-template-columns: repeat(2, 1fr);
  }

  .double {
    grid-column: span 2;
  }

  .full {
    grid-column: span 4;

    @media screen and (max-width: 978px) {
      grid-column: span 2;
    }
  }

  .mobile-double {
    @media screen and (max-width: 978px) {
      grid-column: span 2;
    }
  }
`;

const LineImg = styled.img`
  width: 100%;
`;

export const Line = () => <LineImg aria-hidden src="/marker-line.svg" />;
