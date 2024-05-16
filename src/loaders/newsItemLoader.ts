import { humanizeErrors } from "@prelude-io/core";
import QueryString from "qs";
import { LoaderFunctionArgs } from "react-router-dom";
import { UNKNOWN, throwNotFound } from "../errors";
import { fetchArticles } from "../io";
import makeUpcomingEventListLoader from "./makeUpcomingEventListLoader";

export default async function newsItemLoader(args: LoaderFunctionArgs) {
  const { request, params } = args;
  const searchParams = new URL(request.url).searchParams;
  const lang = searchParams.get("lang") ?? "nl";

  const query = QueryString.stringify({
    locale: lang,
    populate: ["Authors", "Content", "Authors.Picture"],
    filters: {
      Slug: params.slug,
    },
  });

  const data = await fetchArticles(
    `${import.meta.env.VITE_STRAPI_URL}/api/articles?${query}`,
  );

  if (data.isLeft()) {
    console.error(humanizeErrors(data.getLeft()));

    throw UNKNOWN;
  }

  return {
    article: data.get().data.single().getOrCall(throwNotFound),
    upcomingEvents: makeUpcomingEventListLoader(3)(args),
  };
}
