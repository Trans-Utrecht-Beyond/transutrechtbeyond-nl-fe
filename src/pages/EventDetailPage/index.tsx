import * as GridC from "../../components/Grid";
import Person from "../../components/Person";
import RichText from "../../components/RichText";
import StrapiImage from "../../components/StrapiImage";

import { useTranslation } from "react-i18next";
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
  const eventType = loaderData.attributes.EventType.getOrCall(throwUnknown);
  const host = loaderData.attributes.Host.getOrCall(throwUnknown);
  const eventLocation =
    loaderData.attributes.EventLocation.getOrCall(throwUnknown);

  return (
    <>
      <>
        <GridC.Section>
          <div className="double">
            <c.Title>{eventType.data.attributes.Name}</c.Title>
            <h3>
              {formatEventDate(
                loaderData.attributes.LengthInHours,
                loaderData.attributes.Start,
                currentLanguage,
              )}
            </h3>
          </div>
          {getRandom(eventType.data.attributes.Images.data)
            .map((x) => {
              return (
                <StrapiImage
                  className="mobile-hidden double"
                  image={x.attributes}
                />
              );
            })
            .getOrNull()}
        </GridC.Section>
        <GridC.Line />
        <GridC.Section>
          <div className="full">
            <RichText content={eventType.data.attributes.Description} />
          </div>
        </GridC.Section>
      </>
      <GridC.Section style={{ alignItems: "stretch" }}>
        <div className="double">
          <h2>{t("events.aboutTheLocation")}</h2>
          <b>{eventLocation.data.attributes.Name}</b>
          <br />
          {eventLocation.data.attributes.Address}
          <p>{eventLocation.data.attributes.Description}</p>
        </div>
        <div className="double">
          <Person person={host.data} caption={t("events.meetYourHost")} />
        </div>
      </GridC.Section>
    </>
  );
}
