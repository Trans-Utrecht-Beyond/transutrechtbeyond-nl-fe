import { Function2, Option } from "prelude-ts";

const getSearchParamFn = Function2.of((request: Request, x: string) =>
  Option.ofNullable(new URL(request.url).searchParams.get(x)),
);

export default getSearchParamFn;
