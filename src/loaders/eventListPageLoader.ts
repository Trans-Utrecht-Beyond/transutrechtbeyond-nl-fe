import makeUpcomingEventListLoader from "./makeUpcomingEventListLoader.ts";
import makeSoberCountLoader from "./makeSoberCountLoader.ts";
import { LoaderFunctionArgs } from "react-router-dom";

export default async function eventListPageLoader(
  loaderArgs: LoaderFunctionArgs,
) {
  return {
    upcomingEvents: await makeUpcomingEventListLoader(5)(loaderArgs),
    soberCount: await makeSoberCountLoader(
      new Date(2025, 2, 1),
      new Date(2025, 8, 1),
    )(loaderArgs),
  };
}
