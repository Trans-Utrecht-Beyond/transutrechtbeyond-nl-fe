import { Vector } from "prelude-ts";
import { NavLink } from "react-router-dom";
import { Event } from "../../io";
import * as c from "./style";

export default function SmallCalendar() {
  const events: Vector<Event> = Vector.of(
    {
      Title: "Trans & Queer Hangout",
      Day: "21/04/2024",
      Location: "Boulderhal Zuidhaven",
      Time: "15:00 -17:00",
    },
    {
      Title: "Trans Boardgame Night",
      Day: "21/04/2024",
      Location: "Savannah Bay",
      Time: "15:00 -17:00",
    },
    {
      Title: "Trans Spoken Word",
      Day: "21/04/2024",
      Location: "Moira",
      Time: "15:00 -17:00",
    },
  );

  return (
    <c.List>
      {events.map((x) => (
        <li key={x.Title}>
          <NavLink to="/">
            <c.Title className="underline">{x.Title}</c.Title>
            <span>
              {x.Day}, {x.Time} @ {x.Location}
            </span>
          </NavLink>
        </li>
      ))}
    </c.List>
  );
}
