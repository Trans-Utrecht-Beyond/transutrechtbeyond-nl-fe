import styled from "@emotion/styled";

export const ContentWrapper = styled.div`
  display: flex;
  gap: 25px;
  flex-direction: row-reverse;

  @media screen and (max-width: 978px) {
    flex-direction: column;
  }

  aside {
    /* width: 425px; */
    flex: 4 0 425px;
    max-width: 100%;

    & > * {
      margin-bottom: 15px;
    }
  }
`;
