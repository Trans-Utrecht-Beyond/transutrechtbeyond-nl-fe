import { Vector } from "prelude-ts";
import { Fragment, ReactNode } from "react";
import { throwUnknown } from "../../errors";
import { ComponentArticleBasicText } from "../../io";
import RichText from "../RichText";

type Item = ComponentArticleBasicText;

type Props = {
  content: Vector<Item>;
};

const getNode = (item: Item): ReactNode => {
  switch (item.__component) {
    case "article.basic-text":
      return <RichText content={item.Content} />;

    default:
      throwUnknown();
  }
};

export default function DynamicContent({ content }: Props) {
  return content.map((item) => (
    <Fragment key={item.id}>{getNode(item)}</Fragment>
  ));
}
