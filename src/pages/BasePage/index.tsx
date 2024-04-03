import { Option } from "prelude-ts";
import { PropsWithChildren, ReactNode } from "react";
import { NavLink } from "react-router-dom";
import Squigles from "../../components/Squigles";
import * as c from "./styled";

type Props = {
  header: Option<ReactNode>;
};

export default function BasePage({
  header: headerOpt = Option.none(),
  children,
}: PropsWithChildren<Props>) {
  return (
    <>
      <Squigles maxHeight={Option.of(600)} lines={4} />
      <c.Outer>
        <c.Inner>
          {headerOpt.map((header) => <c.Header>{header}</c.Header>).getOrNull()}
          <c.Menu>
            <NavLink to="/news">
              <h3 className="underline">News &amp; Articles</h3>
            </NavLink>
            <NavLink to="/resources">
              <h3 className="underline">Resources</h3>
            </NavLink>
            <NavLink to="/about">
              <h3 className="underline">About TUB</h3>
            </NavLink>
            <NavLink to="/events">
              <h3 className="underline">Events</h3>
            </NavLink>
          </c.Menu>
          <c.MenuLine src="/marker-line.svg" aria-hidden />
          <p>Test</p>
          {children}
        </c.Inner>
      </c.Outer>
    </>
  );
}
