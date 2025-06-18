import styled from "@emotion/styled";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
`;

export const Th = styled.th`
  background: #f5f5f5;
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

export const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
`;

export const Tr = styled.tr`
  &:hover {
    background-color: #f9f9f9;
  }
`;
