import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import Arrow from "../../components/Arrow";

import { useMemo } from "react";
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
      <h1>{t("events.upcomingEvents")}</h1>
      {pagination}
      {loaderData.data.map((x) => {
        const eventType = x.attributes.EventType.getOrCall(throwUnknown).data;
        const eventLocation =
          x.attributes.EventLocation.getOrCall(throwUnknown).data;

        return (
          <c.EventContainer key={x.id}>
            <div>
              <h3>{eventType.attributes.Name}</h3>
              <p>
                <b>{t("events.when")}:</b>
                &nbsp;
                {formatEventDate(
                  x.attributes.LengthInHours,
                  x.attributes.Start,
                  currentLanguage,
                )}
                <br />
                <b>{t("events.where")}:</b>
                &nbsp;
                {eventLocation.attributes.Name}
              </p>
              <p>{eventType.attributes.Summary}</p>
              <NavLink
                to={formatEventSlug(
                  x.attributes.Start,
                  eventType.attributes.Slug,
                  currentLanguage,
                )}
              >
                <h3>
                  <Arrow direction="E" /> &nbsp;
                  {t("events.moreDetails")}
                </h3>
              </NavLink>
            </div>
            {eventType.attributes.Images.data
              .flatMap(getRandom)
              .map((x) => {
                return (
                  <StrapiImage className="mobile-hidden" image={x.attributes} />
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
