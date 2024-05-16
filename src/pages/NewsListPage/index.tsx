import { FormatDateOptions, format } from "date-fns";
import { enGB, nl } from "date-fns/locale";
import { Function3 } from "prelude-ts";
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
      {pagination}
      {loaderData.data.map((article) => (
        <c.Article key={article.attributes.Title}>
          <NavLink
            to={`/nieuws/${article.attributes.Slug}?lang=${currentLanguage}`}
          >
            <h3>
              <Arrow direction="E" /> &nbsp;
              {article.attributes.Title}
            </h3>
          </NavLink>
          <b>{t("misc.date")}:</b> &nbsp;
          {formatDate(article.attributes.Date)} <br />
          {article.attributes.Authors.filter((x) => !x.data.isEmpty())
            .map((authors) => (
              <>
                <b>{t("articles.author", { count: authors.data.length() })}:</b>
                &nbsp;
                {authors.data
                  .map((author) => author.attributes.Name)
                  .foldLeft("", (acc, x) => (!acc ? x : acc + ", " + x))}
              </>
            ))
            .getOrNull()}
          {article.attributes.Summary.map((x) => <p>{x}</p>).getOrNull()}
        </c.Article>
      ))}
      {pagination}
    </>
  );
}
