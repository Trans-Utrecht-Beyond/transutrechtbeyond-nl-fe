import { useTranslation } from "react-i18next";

import { Helmet } from "react-helmet-async";
import { Await, useLoaderData } from "react-router-typesafe";
import DynamicContent from "../../components/DynamicContent";
import Person from "../../components/Person";
import ShortEventList from "../../components/ShortEventList";
import { throwUnknown } from "../../errors";
import newsItemLoader from "../../loaders/newsItemLoader";
import * as c from "./styled";

export default function NewsItemPage() {
  const { t } = useTranslation();
  const loaderData = useLoaderData<typeof newsItemLoader>();

  const { article, upcomingEvents: upcomingEventsPromise } = loaderData;

  return (
    <>
      <Helmet>
        <title>{article.attributes.Title} - Trans Utrecht & Beyond</title>
        {article.attributes.Summary.map((x) => (
          <meta name="description" content={x} />
        )).getOrNull()}
      </Helmet>
      <h1>{article.attributes.Title}</h1>
      <c.ContentWrapper>
        <article>
          <DynamicContent
            content={article.attributes.Content.getOrCall(throwUnknown)}
          />
        </article>
        <aside>
          {article.attributes.Authors.getOrNull()?.data.map((author) => (
            <Person
              key={author.id}
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
