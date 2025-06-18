import { humanizeErrors } from "@prelude-io/core";
import QueryString from "qs";
import { LoaderFunctionArgs } from "react-router-dom";
import { DEFAULT_LANGUAGE } from "../constants";
import { NOT_FOUND, throwUnknown, throwUnknownWith, UNKNOWN } from "../errors";
import { fetchEvents } from "../io";
import getSearchParamFn from "./utils/getSearchParamFn.ts";
import { addMonths, formatISO } from "date-fns";

export type ExportEvent = {
  Start: Date;
  Duration: number;
  Sober: boolean;
  Type: string;
  Location: string;
  Address: string;
  Hosts: string;
};

export default async function eventsExportLoader({
  request,
}: LoaderFunctionArgs) {
  const getSearchParam = getSearchParamFn.apply1(request);

  const lang = getSearchParam("lang").getOrElse(DEFAULT_LANGUAGE);
  const from = getSearchParam("from").getOrElse(
    formatISO(new Date(), {
      representation: "date",
    }),
  );
  const until = getSearchParam("until").getOrElse(
    formatISO(addMonths(new Date(), 1), {
      representation: "date",
    }),
  );

  const query = QueryString.stringify({
    locale: lang,
    populate: ["EventType", "EventLocation", "Hosts"],
    filters: {
      Start: {
        $gt: from,
        $lte: until,
      },
    },
    sort: ["Start", "LengthInHours"],
    pagination: {
      page: 1,
      pageSize: 99,
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

  if (pageCount != 1) {
    throw NOT_FOUND;
  }

  return data
    .get()
    .data.map(
      (x): ExportEvent => ({
        Start: x.Start,
        Duration: x.LengthInHours,
        Sober: x.Sober.getOrElse(false),
        Type: x.EventType.map((y) => y.Name).getOrCall(
          throwUnknownWith(
            "Failed to get event type name for: " + JSON.stringify(x),
          ),
        ),
        Location: x.EventLocation.map((y) => y.Name).getOrCall(
          throwUnknownWith(
            "Failed to get event location name for: " + JSON.stringify(x),
          ),
        ),
        Address: x.EventLocation.map((y) => y.Address).getOrCall(
          throwUnknownWith(
            "Failed to get event location address for: " + JSON.stringify(x),
          ),
        ),
        Hosts:
          x.Hosts.map((y) => y.map((z) => z.Name))
            .getOrCall(
              throwUnknownWith(
                "Failed to get event host names for: " + JSON.stringify(x),
              ),
            )
            .toArray()
            .join(", ") || "N/A",
      }),
    )
    .toArray();
}
