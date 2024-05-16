import { humanizeErrors } from "@prelude-io/core";
import QueryString from "qs";
import { LoaderFunction } from "react-router-typesafe";
import { UNKNOWN, throwNotFound } from "../errors";
import { fetchEvents } from "../io";

export default (async function eventDetailLoader(args) {
  const { request, params } = args;
  const searchParams = new URL(request.url).searchParams;
  const lang = searchParams.get("lang") ?? "nl";

  const query = QueryString.stringify({
    locale: lang,
    populate: [
      "EventType",
      "EventLocation",
      "EventType.Images",
      "Host",
      "Host.Picture",
    ],
    filters: {
      Start: params.date,
      EventType: {
        Slug: params.slug,
      },
    },
  });

  const data = await fetchEvents(
    `${import.meta.env.VITE_STRAPI_URL}/api/events?${query}`,
  );

  if (data.isLeft()) {
    console.error(humanizeErrors(data.getLeft()));

    throw UNKNOWN;
  }

  return data.get().data.single().getOrCall(throwNotFound);
} satisfies LoaderFunction);
