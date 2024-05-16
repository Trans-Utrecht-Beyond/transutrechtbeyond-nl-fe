import styled from "@emotion/styled";

export const Sizer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Outer = styled.div`
  position: relative;
  display: flex;

  justify-content: center;
`;

export const Inner = styled.section`
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;

  position: relative;
`;

export const Main = styled(Outer.withComponent("main"))`
  flex: 1;
`;

export const Header = Outer.withComponent("header");

export const LanguageSwitcher = styled.button`
  background: var(--color-blackish);

  padding: 5px;
  margin: 5px;

  display: inline-flex;
  justify-content: space-around;

  border-radius: 50%;

  position: absolute;
  right: 0px;
  top: 0px;

  color: white;

  border: 0;

  cursor: pointer;

  opacity: 65%;

  @media print {
    display: none;
  }
`;

export const Flag = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
`;

export const Footer = styled(Outer.withComponent("footer"))`
  background: var(--color-blackish);

  margin-top: 60px;
  padding: 20px;
`;

export const FooterInner = styled(Inner)`
  display: grid;

  color: white !important;
  align-items: stretch;

  font-size: 0.8rem;

  grid-template-columns: repeat(4, 25%);

  @media screen and (max-width: 978px) {
    grid-template-columns: 100%;
  }

  a {
    color: white !important;
    text-decoration: underline;
  }

  grid-gap: 15px;
`;

export const FooterLogo = styled.img`
  margin: auto;
  padding: 20px;

  width: 100px;
  height: 100px;

  background: white;
  border-radius: 50%;
`;
