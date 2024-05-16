import { FormatDateOptions, addHours, format, formatISO9075 } from "date-fns";
import { enGB, nl } from "date-fns/locale";
import { Vector } from "prelude-ts";

export function getRandom<T>(v: Vector<T>) {
  return v.get(Math.floor(v.length() - 1 * Math.random()));
}

export function formatEventDate(
  lengthInHours: number,
  start: Date,
  locale: string,
) {
  const options: FormatDateOptions = {
    locale: locale === "en" ? enGB : nl,
  };

  return `${format(start, "P", options)}, ${format(start, "p", options)} — ${format(addHours(start, lengthInHours), "p", options)}`;
}

export function formatEventSlug(start: Date, typeSlug: string, lang: string) {
  return `/evenementen/${formatISO9075(start)}/${typeSlug}?lang=${lang}`;
}
