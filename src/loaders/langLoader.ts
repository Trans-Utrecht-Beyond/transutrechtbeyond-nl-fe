import { LoaderFunctionArgs } from "react-router-dom";

export default async function langLoader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;

  return searchParams.get("lang") ?? "nl";
}
