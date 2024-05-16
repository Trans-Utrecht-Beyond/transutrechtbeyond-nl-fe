import { Vector } from "prelude-ts";
import { StrapiImageObject } from "../../io";
import * as c from "./styled";

type Props = {
  image: StrapiImageObject;
  className?: string;
};

const fixURL = (url: string) =>
  url.startsWith("/") ? import.meta.env.VITE_STRAPI_URL + url : url;

export default function StrapiImage({ image, className = "" }: Props) {
  return (
    <picture className={className}>
      {Vector.ofIterable(image.formats.valueIterable())
        .sortOn((x) => x.size)
        .map((x) => {
          return (
            <source
              media={`(max-width:${x.width}px)`}
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
