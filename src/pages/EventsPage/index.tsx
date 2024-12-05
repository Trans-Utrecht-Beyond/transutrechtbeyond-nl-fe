import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import Arrow from "../../components/Arrow";

import { Option } from "prelude-ts";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useLoaderData } from "react-router-typesafe";
import PaginationButtons from "../../components/PaginationButtons";
import StrapiImage from "../../components/StrapiImage";
import { throwUnknown } from "../../errors";
import useCurrentLanguage from "../../hooks/useCurrentLanguage";
import makeUpcomingEventListLoader from "../../loaders/makeUpcomingEventListLoader";
import { formatEventDate, formatEventSlug, getRandom } from "../../utils";
import * as c from "./styled";

export default function EventsPage() {
  const loaderData =
    useLoaderData<ReturnType<typeof makeUpcomingEventListLoader>>();
  const currentLanguage = useCurrentLanguage();

  const { t } = useTranslation();

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
      <Helmet>
        <title>{t("events.upcomingEvents")} - Trans Utrecht & Beyond</title>
        <meta name="og:title" content={t("events.upcomingEvents")} />
      </Helmet>
      <h1>{t("events.upcomingEvents")}</h1>
      {pagination}
      {loaderData.data.map((x) => {
        const eventType = x.EventType.getOrCall(throwUnknown);
        const eventLocation = x.EventLocation.getOrCall(throwUnknown);

        return (
          <c.EventContainer key={x.documentId}>
            <div>
              <h3>{eventType.Name}</h3>
              <p>
                <b>{t("events.when")}:</b>
                &nbsp;
                {formatEventDate(x.LengthInHours, x.Start, currentLanguage)}
                <br />
                <b>{t("events.where")}:</b>
                &nbsp;
                {eventLocation.Name}
              </p>
              <p>{eventType.Summary}</p>
              <NavLink
                to={formatEventSlug(x.Start, eventType.Slug, currentLanguage)}
              >
                <h3>
                  <Arrow direction="E" /> &nbsp;
                  {t("events.moreDetails")}
                </h3>
              </NavLink>
            </div>
            {eventType.Images.flatMap(getRandom)
              .map((x) => {
                return (
                  <StrapiImage
                    className="mobile-hidden"
                    image={x}
                    size={Option.of("medium")}
                  />
                );
              })
              .getOrNull()}
          </c.EventContainer>
        );
      })}
      {pagination}
    </>
  );
}
