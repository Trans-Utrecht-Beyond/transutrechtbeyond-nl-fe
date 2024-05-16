import { Either } from "prelude-ts";

export type Loadable<T> = Either<"LOADING" | "ERROR", T>;
