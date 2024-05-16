import styled from "@emotion/styled";

export const EventContainer = styled.article`
  display: flex;
  justify-content: space-between;
  padding: 15px 0;

  &:nth-of-type(odd) {
    flex-direction: row-reverse;
  }

  picture {
    max-width: 40%;
    margin: 0 15px;
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid var(--color-blackish);
  }
`;
