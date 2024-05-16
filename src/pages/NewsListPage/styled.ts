import styled from "@emotion/styled";

export const Article = styled.article`
  padding-bottom: 30px;

  &:not(:last-of-type) {
    border-bottom: 1px solid var(--color-blackish);
  }
`;
