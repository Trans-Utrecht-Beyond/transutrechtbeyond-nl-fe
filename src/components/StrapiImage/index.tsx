import { Function0, Option, Vector } from "prelude-ts";
import { StrapiImageObject } from "../../io";
import * as c from "./styled";

type Props = {
  image: StrapiImageObject;
  className?: string;
  size?: Option<string>;
};

const fixURL = (url: string) =>
  url.startsWith("/") ? import.meta.env.VITE_STRAPI_URL + url : url;

export default function StrapiImage({
  image,
  className = "",
  size = Option.none(),
}: Props) {
  return (
    <picture className={className}>
      {Vector.ofIterable(
        image.formats
          .filterKeys(
            size
              .map((x) => (key: string) => x === key)
              .getOrElse(Function0.constant(true)),
          )
          .valueIterable(),
      )
        .sortOn((x) => x.size)
        .map((x) => {
          return (
            <source
              media={size.isSome() ? "" : `(max-width:${x.width}px)`}
              srcSet={fixURL(x.url)}
              key={x.size}
            />
          );
        })}
      <c.Image
        src={fixURL(image.url)}
        alt={image.alternativeText.getOrUndefined()}
      />
    </picture>
  );
}
