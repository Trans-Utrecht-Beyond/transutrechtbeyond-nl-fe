import * as GridC from "../../components/Grid";
import Person from "../../components/Person";
import RichText from "../../components/RichText";
import StrapiImage from "../../components/StrapiImage";
import { fixAssetURL } from "../../utils";

import { Helmet } from "react-helmet-async";
import { Trans, useTranslation } from "react-i18next";
import { useLoaderData } from "react-router-typesafe";
import { throwUnknown } from "../../errors";
import useCurrentLanguage from "../../hooks/useCurrentLanguage";
import eventDetailLoader from "../../loaders/eventDetailLoader";
import { formatEventDate, getRandom } from "../../utils";
import * as c from "./styled";

export default function EventDetailPage() {
  const { t } = useTranslation();
  const currentLanguage = useCurrentLanguage();
  const loaderData = useLoaderData<typeof eventDetailLoader>();
  const eventType = loaderData.EventType.getOrCall(throwUnknown);
  const hosts = loaderData.Hosts.getOrCall(throwUnknown);
  const eventLocation = loaderData.EventLocation.getOrCall(throwUnknown);

  return (
    <>
      <Helmet>
        <title>{eventType.Name} - Trans Utrecht & Beyond</title>
        <meta name="og:title" content={eventType.Name} />
        <meta name="description" content={eventType.Summary} />
        <meta name="og:description" content={eventType.Summary} />
        {eventType.Images.flatMap(getRandom)
          .map((x) => <meta name="og:image" content={fixAssetURL(x.url)} />)
          .getOrNull()}
      </Helmet>
      <GridC.Section>
        <div className="double">
          <c.Title>{eventType.Name}</c.Title>
          <h3>
            {formatEventDate(
              loaderData.LengthInHours,
              loaderData.Start,
              currentLanguage,
            )}
          </h3>
        </div>
        {eventType.Images.flatMap(getRandom)
          .map((x) => {
            return <StrapiImage className="mobile-hidden double" image={x} />;
          })
          .getOrNull()}
      </GridC.Section>
      <GridC.Line />
      <GridC.Section>
        <div className="full">
          <h4>
            <Trans
              i18nKey={loaderData.Sober ? "events.sober" : "events.nonSober"}
            />
          </h4>
          <RichText content={eventType.Description} />
          {loaderData.ExtraDescription.map((x) => (
            <RichText content={x} />
          )).getOrNull()}
        </div>
      </GridC.Section>

      <GridC.Section style={{ alignItems: "stretch" }}>
        <div className="double">
          <h2>{t("events.aboutTheLocation")}</h2>
          <b>{eventLocation.Name}</b>
          <br />
          {eventLocation.Address}
          <p>{eventLocation.Description}</p>
        </div>
        <div className="double">
          {hosts.zipWithIndex().map(([host, index]) => (
            <Person
              key={host.documentId}
              person={host}
              caption={index === 0 ? t("events.meetYourHost") : ""}
            />
          ))}
        </div>
      </GridC.Section>
    </>
  );
}
