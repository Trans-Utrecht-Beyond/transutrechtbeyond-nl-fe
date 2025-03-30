import { humanizeErrors } from "@prelude-io/core";
import { formatISO } from "date-fns";
import QueryString from "qs";
import { LoaderFunctionArgs } from "react-router-dom";
import { DEFAULT_LANGUAGE } from "../constants";
import { UNKNOWN } from "../errors";
import { fetchEvents } from "../io";
import getSearchParamFn from "./utils/getSearchParamFn.ts";

export default function makeSoberCountLoader(from: Date, to: Date) {
  return async function soberCountLoader({ request }: LoaderFunctionArgs) {
    const getSearchParam = getSearchParamFn.apply1(request);

    const lang = getSearchParam("lang").getOrElse(DEFAULT_LANGUAGE);

    const query = QueryString.stringify({
      locale: lang,
      filters: {
        Start: {
          $gt: formatISO(from, {
            representation: "date",
          }),
          $lt: formatISO(to, {
            representation: "date",
          }),
        },
      },
      sort: ["Start", "LengthInHours"],
      pagination: {
        pageSize: 9999,
      },
    });

    const data = await fetchEvents(
      `${import.meta.env.VITE_STRAPI_URL}/api/events?${query}`,
    );

    if (data.isLeft()) {
      console.error(humanizeErrors(data.getLeft()));

      throw UNKNOWN;
    }

    const eventCount = data.get().data.length();
    const soberSum = data
      .get()
      .data.filter((x) => x.Sober.contains(true))
      .length();

    return Math.round((soberSum / eventCount) * 100);
  };
}
