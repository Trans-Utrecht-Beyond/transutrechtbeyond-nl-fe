import { css } from "@emotion/react";
import styled from "@emotion/styled";
import SolidLogo from "../SolidLogo";
import StrapiImage from "../StrapiImage";

const linedGrid = (color: string) => css`
  background-size: 40px 40px;
  background-image: linear-gradient(to right, ${color} 1px, transparent 1px),
    linear-gradient(to bottom, ${color} 1px, transparent 1px);
`;

// const dottedGrid = css`
//   background-size: 40px 40px;
//   background-image: radial-gradient(circle, #000000 1px, rgba(0, 0, 0, 0) 1px);
// `;

export const Container = styled.div`
  --person-color-primary: #a5e6fa;
  --person-color-secondary: rgb(40, 41, 98, 0.8);
  --person-color-tertiary: #f4e5fa;

  background-color: var(--person-color-primary);
  padding: 30px;

  position: relative;

  color: var(--person-color-secondary);

  ${linedGrid("rgba(255, 255, 255, 0.3)")}
`;

export const ImageWrapper = styled.div`
  position: relative;
`;

export const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const Image = styled(StrapiImage)`
  img {
    max-height: 250px;

    margin: 30px 15px;

    border: 15px solid var(--person-color-secondary);
  }
`;

export const Caption = styled.h3`
  font-size: 3.5rem;

  color: var(--person-color-secondary);

  margin: 0px;
`;

export const Name = styled.span`
  display: inline-block;
  position: absolute;

  top: 0;
  left: 50px;
  text-align: right;

  transform: translateY(2em) rotate(20deg);

  h3 {
    display: inline-block;

    white-space: nowrap;

    color: var(--person-color-primary);
    background: var(--person-color-tertiary);

    font-size: 1.5rem;

    padding: 5px 10px;
    margin: 5px 0;
  }
`;

export const Logo = styled(SolidLogo)`
  fill: var(--person-color-secondary);

  position: absolute;

  bottom: -50px;
  right: -50px;

  transform: scale(0.4);
`;
