import { humanizeErrors } from "@prelude-io/core";
import { formatISO } from "date-fns";
import { Option } from "prelude-ts";
import QueryString from "qs";
import { LoaderFunctionArgs } from "react-router-dom";
import { DEFAULT_LANGUAGE } from "../constants";
import { NOT_FOUND, throwUnknown, UNKNOWN } from "../errors";
import { fetchEvents } from "../io";

export default function makeUpcomingEventListLoader(pageSize: number) {
  return async function upcomingEventListLoader({
    request,
  }: LoaderFunctionArgs) {
    const getSearchParam = Option.liftNullable((x) =>
      new URL(request.url).searchParams.get(x),
    );

    const lang = getSearchParam("lang").getOrElse(DEFAULT_LANGUAGE);
    const page = getSearchParam("page").map(Number).getOrElse(1);

    const query = QueryString.stringify({
      locale: lang,
      populate: ["EventType", "EventLocation", "EventType.Images"],
      filters: {
        Start: {
          $gt: formatISO(new Date(Date.now()), {
            representation: "date",
          }),
        },
      },
      sort: ["Start", "LengthInHours"],
      pagination: {
        page,
        pageSize,
      },
    });

    const data = await fetchEvents(
      `${import.meta.env.VITE_STRAPI_URL}/api/events?${query}`,
    );

    if (data.isLeft()) {
      console.error(humanizeErrors(data.getLeft()));

      throw UNKNOWN;
    }

    const pageCount = data
      .get()
      .meta.pagination.map(({ pageCount }) => pageCount)
      .getOrCall(throwUnknown);

    if (page && page > pageCount) {
      throw NOT_FOUND;
    }

    return data.get();
  };
}
