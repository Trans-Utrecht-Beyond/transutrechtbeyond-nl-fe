import { humanizeErrors } from "@prelude-io/core";
import { Option } from "prelude-ts";
import QueryString from "qs";
import { LoaderFunctionArgs } from "react-router-dom";
import { DEFAULT_LANGUAGE } from "../constants";
import { UNKNOWN } from "../errors";
import { fetchArticles } from "../io";

export default async function newListLoader({ request }: LoaderFunctionArgs) {
  const getSearchParam = Option.liftNullable((x) =>
    new URL(request.url).searchParams.get(x),
  );

  const lang = getSearchParam("lang").getOrElse(DEFAULT_LANGUAGE);
  const page = getSearchParam("page").map(Number).getOrElse(1);

  const query = QueryString.stringify({
    locale: lang,
    populate: ["Authors"],
    sort: ["Date:desc"],
    filters: {
      Listed: {
        $eq: true,
      },
    },
    pagination: {
      page,
    },
  });

  const articlesE = await fetchArticles(
    `${import.meta.env.VITE_STRAPI_URL}/api/articles?${query}`,
  );

  if (articlesE.isLeft()) {
    console.error(humanizeErrors(articlesE.getLeft()));

    throw UNKNOWN;
  }

  return articlesE.get();
}
