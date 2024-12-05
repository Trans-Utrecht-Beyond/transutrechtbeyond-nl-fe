import { humanizeErrors } from "@prelude-io/core";
import QueryString from "qs";
import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { UNKNOWN, throwNotFound } from "../errors";
import { fetchArticles, fetchPermalinks, PermalinkResponse } from "../io";
import makeUpcomingEventListLoader from "./makeUpcomingEventListLoader";
import { Option } from "prelude-ts";

export default async function articleLoader(args: LoaderFunctionArgs) {
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

  const articleOpt = data.get().data.single();

  if (articleOpt.isNone()) {
    const permalinkQuery = QueryString.stringify({
      filters: {
        Path: params.slug,
      },
    });

    const permalinkData = await fetchPermalinks(
      `${import.meta.env.VITE_STRAPI_URL}/api/permalinks?${permalinkQuery}`,
    );

    const newTarget = (
      permalinkData.toOption() as Option<PermalinkResponse>
    ).flatMap((x) => x.data.single().map((y) => y.Target));

    if (newTarget.isSome()) {
      return redirect(newTarget.get());
    }
  }

  return {
    article: articleOpt.getOrCall(throwNotFound),
    upcomingEvents: makeUpcomingEventListLoader(3)(args),
  };
}
