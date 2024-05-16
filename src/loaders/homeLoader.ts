import { humanizeErrors } from "@prelude-io/core";
import QueryString from "qs";
import { LoaderFunction } from "react-router-typesafe";
import { UNKNOWN } from "../errors";
import { fetchHome } from "../io";
import langLoader from "./langLoader";
import makeUpcomingEventListLoader from "./makeUpcomingEventListLoader";

export default (async function homeLoader(args) {
  const lang = await langLoader(args);

  const query = QueryString.stringify({
    locale: lang,
  });

  const data = await fetchHome(
    `${import.meta.env.VITE_STRAPI_URL}/api/home?${query}`,
  );

  if (data.isLeft()) {
    console.error(humanizeErrors(data.getLeft()));

    throw UNKNOWN;
  }

  return {
    home: data.get(),
    upcomingEvents: makeUpcomingEventListLoader(3)(args),
  };
} satisfies LoaderFunction);
