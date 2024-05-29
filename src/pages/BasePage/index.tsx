import { Option } from "prelude-ts";
import { Fragment, useCallback, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Outlet, useLoaderData, useSearchParams } from "react-router-dom";
import Menu from "../../components/Menu";
import Squigles from "../../components/Squigles";
import { DEFAULT_LANGUAGE } from "../../constants";
import { useLayoutSettings } from "../../contexts/layoutSettingsContext";
import useCurrentLanguage from "../../hooks/useCurrentLanguage";
import globalInformationLoader from "../../loaders/globalInformationLoader";
import * as c from "./styled";

export default function BasePage() {
  const [{ header: headerOpt, squiggleHeight }] = useLayoutSettings();
  const currentLanguage = useCurrentLanguage();
  const {
    i18n: { changeLanguage },
  } = useTranslation();

  const shortLang = useMemo(
    () => currentLanguage.split("-")[0],
    [currentLanguage],
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const { data } = useLoaderData() as Awaited<
    ReturnType<typeof globalInformationLoader>
  >;

  useEffect(() => {
    const spLang = searchParams.get("lang");
    if (spLang && !currentLanguage.startsWith(spLang)) {
      changeLanguage(spLang);
    } else if (!spLang) {
      setSearchParams(
        (params) => {
          params.set("lang", DEFAULT_LANGUAGE);
          return params;
        },
        { replace: true },
      );
    }
  }, [changeLanguage, currentLanguage, searchParams, setSearchParams]);

  const toggleLanguage = useCallback(() => {
    setSearchParams((params) => {
      params.set("lang", shortLang === "en" ? "nl" : "en");
      return params;
    });
  }, [shortLang, setSearchParams]);

  return (
    <>
      <Helmet>
        <title>Trans Utrecht & Beyond</title>
        <meta name="og:title" content="Trans Utrecht & Beyond" />
        <meta name="og:image" content={"/tub_logo.png"} />
      </Helmet>
      <c.Sizer>
        <Squigles maxHeight={Option.of(squiggleHeight)} lines={4} />
        {headerOpt
          .map((header) => (
            <c.Header>
              <c.Inner>{header}</c.Inner>
            </c.Header>
          ))
          .getOrNull()}
        <c.Main>
          <c.Inner>
            <Menu />
            <Outlet />
          </c.Inner>
        </c.Main>
        <c.Footer>
          <c.FooterInner>
            <c.FooterLogo aria-hidden src="/tub_logo.png" />
            {data.attributes.Sections.map(
              ({ Title, id, Description, Links }) => (
                <div key={id}>
                  {Title.map((x) => <b>{x}</b>).getOrNull()}
                  {Description.map((x) => <p>{x}</p>).getOrNull()}
                  {Links.map(({ id: linkID, Target, Text }) => (
                    <Fragment key={linkID}>
                      <a href={Target} target="_blank">
                        {Text}
                      </a>
                      <br />
                    </Fragment>
                  ))}
                </div>
              ),
            )}
          </c.FooterInner>
        </c.Footer>
        <c.LanguageSwitcher onClick={toggleLanguage}>
          {shortLang === "en" ? (
            <c.Flag alt="NLD" src="/flag_nl.png" />
          ) : (
            <c.Flag alt="ENG" src="/flag_uk.png" />
          )}
        </c.LanguageSwitcher>
      </c.Sizer>
    </>
  );
}
