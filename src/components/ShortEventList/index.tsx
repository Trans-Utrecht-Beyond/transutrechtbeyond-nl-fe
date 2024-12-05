import { Vector } from "prelude-ts";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { throwUnknown } from "../../errors";
import useCurrentLanguage from "../../hooks/useCurrentLanguage";
import { Event } from "../../io";
import { formatEventDate, formatEventSlug } from "../../utils";
import Arrow from "../Arrow";
import * as c from "./styled";

type Props = {
  events: Vector<Event>;
};

export default function ShortEventList({ events }: Props) {
  const { t } = useTranslation();
  const currentLanguage = useCurrentLanguage();
  const noEventsFound = !events.length();

  return (
    <>
      <c.List>
        {noEventsFound
          ? t("events.noEventsFound")
          : events.map(
              ({
                EventType,
                EventLocation,
                documentId,
                Start,
                LengthInHours,
              }) => {
                const eventType = EventType.getOrCall(throwUnknown);
                const eventLocation = EventLocation.getOrCall(throwUnknown);
                return (
                  <li key={documentId}>
                    <NavLink
                      to={formatEventSlug(
                        Start,
                        eventType.Slug,
                        currentLanguage,
                      )}
                    >
                      <c.Title className="underline">{eventType.Name}</c.Title>
                      <span>
                        {formatEventDate(LengthInHours, Start, currentLanguage)}
                        &nbsp;@&nbsp;
                        {eventLocation.Name}
                      </span>
                    </NavLink>
                  </li>
                );
              },
            )}
      </c.List>
      {!noEventsFound && (
        <c.MoreEventsContainer>
          <NavLink to={`/evenementen?lang=${currentLanguage}`}>
            <h4>
              <Arrow direction="E" />
              &nbsp;
              <span className="underline">{t("events.moreEventsText")}</span>
            </h4>
          </NavLink>
        </c.MoreEventsContainer>
      )}
    </>
  );
}
