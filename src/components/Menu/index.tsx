import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import useCurrentLanguage from "../../hooks/useCurrentLanguage";
import * as c from "./styled";

const MENU_ITEMS = [
  {
    path: "/",
    t: "home",
  },
  {
    path: "/nieuws",
    t: "news",
  },
  {
    path: "/nieuws/over-ons",
    t: "aboutUs",
  },
  {
    path: "/evenementen",
    t: "events",
  },
];

export default function Menu() {
  const { t } = useTranslation();
  const lang = useCurrentLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((x) => !x);
  }, []);

  const navLinks = MENU_ITEMS.map((x) => (
    <NavLink to={`${x.path}?lang=${lang}`} key={x.path} end>
      <h3>{t("menu." + x.t)}</h3>
    </NavLink>
  ));

  return (
    <>
      <c.Menu className="mobile-hidden">
        {navLinks.map((el, n) => (
          <Fragment key={n}>
            {el} {n !== navLinks.length - 1 && <h3>•</h3>}
          </Fragment>
        ))}
      </c.Menu>
      <c.MobileMenu className="mobile-visible">
        <h3
          onClick={toggleMobileMenu}
          className="material-symbols-outlined"
          tabIndex={1}
        >
          {mobileMenuOpen ? "close" : "menu"}
        </h3>
        {mobileMenuOpen && navLinks}
      </c.MobileMenu>
      <c.MenuLine src="/marker-line.svg" aria-hidden />
    </>
  );
}
