import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import useCurrentLanguage from "../../hooks/useCurrentLanguage";
import * as c from "./styled";

type MenuItem = {
  t: string;
  content: string | MenuItem[];
};

const MENU_ITEMS: MenuItem[] = [
  {
    t: "home",
    content: "/",
  },
  {
    t: "news",
    content: "/nieuws",
  },
  {
    t: "aboutUs",
    content: [
      {
        t: "whoAreWe",
        content: "/over-ons",
      },
      {
        t: "confidant",
        content: "/vertrouwenspersoon",
      },
      {
        t: "donate",
        content: "/doneren",
      },
      {
        t: "membership",
        content: "/lid-of-vrijwilliger-worden",
      },
      {
        t: "CoC",
        content: "/gedragscode",
      },
      {
        t: "CoE",
        content: "/ethische-code",
      },
    ],
  },
  {
    t: "events",
    content: "/evenementen",
  },
];

function MenuItemComponent({ item }: { item: MenuItem }) {
  const { t } = useTranslation();
  const lang = useCurrentLanguage();

  const [isOpen, setIsOpen] = useState(false);

  const label = (
    <c.NavLabel>
      <span>{t("menu." + item.t)}</span>
      {typeof item.content !== "string" && <span>{isOpen ? "⌃" : "⌄"}</span>}
    </c.NavLabel>
  );

  const handlePointerEnter = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleClick = useCallback(() => {
    setIsOpen((x) => !x);
  }, []);

  if (typeof item.content === "string") {
    return (
      <NavLink to={`${item.content}?lang=${lang}`} end>
        {label}
      </NavLink>
    );
  }

  return (
    <c.SubMenu
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      onClick={handleClick}
    >
      {label}
      <c.SubMenuWrapper>
        {isOpen && (
          <>
            <c.SubMenuLine
              src={"/marker-line-vertical.svg"}
              aria-hidden
              className="mobile-hidden"
              style={{ left: -4 }}
            />
            {item.content.map((x) => (
              <MenuItemComponent key={x.t} item={x} />
            ))}
            <c.SubMenuLine
              src={"/marker-line-vertical.svg"}
              aria-hidden
              className="mobile-hidden"
              style={{ right: -4, transform: "rotate(180deg)" }}
            />
          </>
        )}
      </c.SubMenuWrapper>
    </c.SubMenu>
  );
}

export default function Menu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname, search } = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [pathname, search]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((x) => !x);
  }, []);

  const navLinks = MENU_ITEMS.map((x) => (
    <MenuItemComponent key={x.t} item={x} />
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
