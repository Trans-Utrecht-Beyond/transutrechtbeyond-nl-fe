import { useTranslation } from "react-i18next";

import { Helmet } from "react-helmet-async";
import { Await, useLoaderData } from "react-router-typesafe";
import DynamicContent from "../../components/DynamicContent";
import Person from "../../components/Person";
import ShortEventList from "../../components/ShortEventList";
import { throwUnknown } from "../../errors";
import articleLoader from "../../loaders/articleLoader";
import * as c from "./styled";

export default function ArticlePage() {
  const { t } = useTranslation();
  const loaderData = useLoaderData<typeof articleLoader>();

  const { article, upcomingEvents: upcomingEventsPromise } = loaderData;

  return (
    <>
      <Helmet>
        <title>{article.Title} - Trans Utrecht & Beyond</title>
        <meta name="og:title" content={article.Title} />
        {article.Summary.map((x) => (
          <>
            <meta name="description" content={x} />
            <meta name="og:description" content={x} />
          </>
        )).getOrNull()}
      </Helmet>
      <h1>{article.Title}</h1>
      <c.ContentWrapper>
        <article>
          <DynamicContent content={article.Content.getOrCall(throwUnknown)} />
        </article>
        <aside>
          {article.Authors.getOrNull()?.map((author) => (
            <Person
              key={author.documentId}
              person={author}
              caption={t("articles.aboutTheAuthor")}
            />
          ))}
          <h2>{t("events.upcomingEvents")}</h2>
          <Await resolve={upcomingEventsPromise}>
            {(upcomingEvents) => (
              <ShortEventList events={upcomingEvents.data} />
            )}
          </Await>
        </aside>
      </c.ContentWrapper>
    </>
  );
}
