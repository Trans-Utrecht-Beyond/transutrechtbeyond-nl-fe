import { Option } from "prelude-ts";
import { NavLink } from "react-router-dom";
import Arrow from "../../components/Arrow";
import SmallCalendar from "../../components/SmallCalendar";
import useBoardMembers from "../../hooks/useBoardMembers";
import BasePage from "../BasePage";
import * as c from "./styled";

const header = Option.of(
  <>
    <c.Header>
      <c.Image src="/tub_logo.png" />
      <h1>
        Trans <br />
        utrecht <br />
        &amp; Beyond
      </h1>
      <p className="double">
        Events/activities for trans, non binary and gender diverse people in
        Utrecht, and beyond. Events are catered towards people in the age range
        18-32 and other placeholder text.
      </p>
      <div className="double relative">
        <c.SofaImage src="/sofa.png" />
      </div>
      <div className="double">
        <h2>
          What's happening <Arrow direction="S" />
        </h2>
        <SmallCalendar />
        <NavLink to="/evenementen">
          <h2>
            <Arrow direction="E" />
            &nbsp; <span className="underline">More events</span>
          </h2>
        </NavLink>
      </div>
    </c.Header>
    <c.Line aria-hidden src="/marker-line.svg" />
  </>,
);

export default function Home() {
  const boardMembers = useBoardMembers();

  return (
    <BasePage header={header}>
      <div>
        <h2>Board Members or something:</h2>
        {typeof boardMembers !== "string"
          ? boardMembers.map((x) => <p>{x.attributes.Name}</p>).toArray()
          : boardMembers}
      </div>
    </BasePage>
  );
}
