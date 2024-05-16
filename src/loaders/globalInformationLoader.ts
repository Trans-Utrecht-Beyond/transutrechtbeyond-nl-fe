import { humanizeErrors } from "@prelude-io/core";
import QueryString from "qs";
import { LoaderFunctionArgs } from "react-router-dom";
import { UNKNOWN } from "../errors";
import { fetchGlobalInformation } from "../io";
import langLoader from "./langLoader";

export default async function globalInformationLoader(
  args: LoaderFunctionArgs,
) {
  const lang = await langLoader(args);

  const query = QueryString.stringify({
    locale: lang,
    populate: ["Sections", "Sections.Links"],
  });

  const data = await fetchGlobalInformation(
    `${import.meta.env.VITE_STRAPI_URL}/api/global-information?${query}`,
  );

  if (data.isLeft()) {
    console.error(humanizeErrors(data.getLeft()));

    throw UNKNOWN;
  }

  return data.get();
}
