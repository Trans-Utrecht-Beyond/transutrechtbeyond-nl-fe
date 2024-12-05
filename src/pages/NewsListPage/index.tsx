import { FormatDateOptions, format } from "date-fns";
import { enGB, nl } from "date-fns/locale";
import { Function3, Vector } from "prelude-ts";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLoaderData } from "react-router-dom";
import Arrow from "../../components/Arrow";
import PaginationButtons from "../../components/PaginationButtons";
import { throwUnknown } from "../../errors";
import useCurrentLanguage from "../../hooks/useCurrentLanguage";
import { ArticlesResponse } from "../../io";
import * as c from "./styled";

export default function NewsListPage() {
  const { t } = useTranslation();
  const loaderData = useLoaderData() as ArticlesResponse;
  const currentLanguage = useCurrentLanguage();
  const formatDate = useMemo(
    () =>
      Function3.of<Date, string, FormatDateOptions, string>(format)
        .flipped()
        .apply2(
          {
            locale: currentLanguage === "en" ? enGB : nl,
          },
          "P",
        ),
    [currentLanguage],
  );

  const pagination = useMemo(
    () =>
      loaderData.meta.pagination
        .map(({ page, pageCount }) => (
          <PaginationButtons page={page} pageCount={pageCount} />
        ))
        .getOrCall(throwUnknown),
    [loaderData.meta.pagination],
  );

  return (
    <>
      <h1>{t("articles.news")}</h1>
      {pagination}
      {loaderData.data.map(
        ({ Title, Slug, Date, Authors: AuthorsOpt, Summary }) => (
          <c.Article key={Title}>
            <NavLink to={`/${Slug}?lang=${currentLanguage}`}>
              <h3>
                <Arrow direction="E" /> &nbsp;
                {Title}
              </h3>
            </NavLink>
            <b>{t("misc.date")}:</b> &nbsp;
            {formatDate(Date)} <br />
            {AuthorsOpt.filter(Vector.isNotEmpty)
              .map((authors) => (
                <>
                  <b>{t("articles.author", { count: authors.length() })}:</b>
                  &nbsp;
                  {authors
                    .map((author) => author.Name)
                    .foldLeft("", (acc, x) => (!acc ? x : acc + ", " + x))}
                </>
              ))
              .getOrNull()}
            {Summary.map((x) => <p>{x}</p>).getOrNull()}
          </c.Article>
        ),
      )}
      {pagination}
    </>
  );
}
