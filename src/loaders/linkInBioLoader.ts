import { humanizeErrors } from "@prelude-io/core";
import QueryString from "qs";
import { UNKNOWN } from "../errors";
import { fetchLinkInBio } from "../io";

export default async function linkInBioLoader() {
  const query = QueryString.stringify({
    populate: ["Link"],
  });

  const linkInBio = await fetchLinkInBio(
    `${import.meta.env.VITE_STRAPI_URL}/api/link-in-bio?${query}`,
  );

  if (linkInBio.isLeft()) {
    console.error(humanizeErrors(linkInBio.getLeft()));

    throw UNKNOWN;
  }

  return linkInBio.get();
}
