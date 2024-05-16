import { css } from "@emotion/react";

export const styles = css`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: "Lato", sans-serif;

    --font-size-regular: 19px;
    --font-size-h1: calc(var(--font-size-regular) * 2.35);
    --font-size-h2: calc(var(--font-size-regular) * 2);

    --color-blackish: #414042;
    --color-blueish: #065a85;
    --color-text: #414042;

    font-size: var(--font-size-regular);
    color: var(--color-text);
  }

  h1 {
    font-family: "OpenDyslexic";
    font-size: var(--font-size-h1);
  }

  h2 {
    font-family: "OpenDyslexic";
    font-size: var(--font-size-h2);
  }

  h3,
  h4 {
    font-family: "OpenDyslexic";
  }

  p {
    line-height: 1.5em;
  }

  a {
    color: var(--color-text);
    text-decoration: none;
  }

  .underline {
    text-decoration: underline;
  }

  .relative {
    position: relative;
  }

  .mobile-hidden {
    @media screen and (max-width: 978px) {
      display: none !important;
    }
  }

  .mobile-visible {
    @media screen and (min-width: 978px) {
      display: none !important;
    }
  }

  @media print {
    header,
    footer {
      display: none !important;
    }
  }
`;
