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
          : events.map((x) => {
              const eventType =
                x.attributes.EventType.getOrCall(throwUnknown).data;
              const eventLocation =
                x.attributes.EventLocation.getOrCall(throwUnknown).data;
              return (
                <li key={x.id}>
                  <NavLink
                    to={formatEventSlug(
                      x.attributes.Start,
                      eventType.attributes.Slug,
                      currentLanguage,
                    )}
                  >
                    <c.Title className="underline">
                      {eventType.attributes.Name}
                    </c.Title>
                    <span>
                      {formatEventDate(
                        x.attributes.LengthInHours,
                        x.attributes.Start,
                        currentLanguage,
                      )}
                      &nbsp;@&nbsp;
                      {eventLocation.attributes.Name}
                    </span>
                  </NavLink>
                </li>
              );
            })}
      </c.List>
      {!noEventsFound && (
        <c.MoreEventsContainer>
          <NavLink to="/evenementen">
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
