import {
  StrapiRTLink,
  StrapiRTText,
  StrapiRTTextish,
  StrapiRichText,
} from "../../io";
import StrapiImage from "../StrapiImage";
import * as c from "./styled";
import { createContext, useContext } from "react";

type Props = {
  content: StrapiRichText;
  variables?: Record<string, string>;
};

const variableRegex = /\$\$([a-zA-Z]+)\b/g;

function replaceVariables(
  template: string,
  values: { [key: string]: string },
): string {
  return template.replace(variableRegex, (match, key) => {
    return Object.prototype.hasOwnProperty.call(values, key)
      ? values[key]
      : match;
  });
}

const RTVariablesCTX = createContext<Record<string, string>>({});

const codeStyles = {
  background: "lightgrey",
  padding: "1px 3px",
  margin: "-1px 0",
  borderRadius: "3px",
};

function Text({ content }: { content: StrapiRTText }) {
  const variables = useContext<Record<string, string>>(RTVariablesCTX);
  const variableReplacedText = replaceVariables(content.text, variables);

  return (
    <span
      style={{
        whiteSpace: "pre-wrap",
        ...content.code
          .filter(Boolean)
          .map<object>(() => codeStyles)
          .getOrElse({}),
        fontStyle: content.italic
          .filter(Boolean)
          .map(() => "italic")
          .getOrUndefined(),
        fontWeight: content.bold
          .filter(Boolean)
          .map(() => "bold")
          .getOrUndefined(),
        textDecoration: [
          content.underline
            .filter(Boolean)
            .map(() => "underline")
            .getOrElse(""),
          content.strikethrough
            .filter(Boolean)
            .map(() => "line-through")
            .getOrElse(""),
        ].join(" "),
      }}
    >
      {variableReplacedText}
    </span>
  );
}

function Link({ content }: { content: StrapiRTLink }) {
  return (
    <c.A
      href={content.url}
      target={
        new URL(content.url).host === window.location.host ? "_self" : "_blank"
      }
    >
      {content.children.zipWithIndex().map(([x, n]) => (
        <Text content={x} key={n} />
      ))}
    </c.A>
  );
}

function Textish({ content }: { content: StrapiRTTextish }) {
  switch (content.type) {
    case "text":
      return <Text content={content} />;

    case "link":
      return <Link content={content} />;
  }
}

export default function RichText({ content, variables }: Props) {
  return (
    <RTVariablesCTX.Provider value={variables ?? {}}>
      {content.zipWithIndex().map(([section, n]) => {
        const key = "section-" + n;
        switch (section.type) {
          case "code":
            return (
              <pre key={key} style={codeStyles}>
                {section.children.zipWithIndex().map(([x, n]) => (
                  <Text content={x} key={n} />
                ))}
              </pre>
            );

          case "heading": {
            const Comp = "h" + section.level;

            return (
              // @ts-expect-error - Need dynamic tag here
              <Comp key={key}>
                {section.children.zipWithIndex().map(([x, n]) => (
                  <Textish content={x} key={n} />
                ))}
              </Comp>
            );
          }

          case "paragraph":
            return (
              <p key={key}>
                {section.children.zipWithIndex().map(([x, n]) => (
                  <Textish content={x} key={n} />
                ))}
              </p>
            );

          case "quote":
            return (
              <c.Blockquote key={key}>
                {section.children.zipWithIndex().map(([x, n]) => (
                  <Textish content={x} key={n} />
                ))}
              </c.Blockquote>
            );

          case "image":
            return (
              <p key={key}>
                <StrapiImage
                  image={{
                    ...section.image,
                    alternativeText: section.alternativeText,
                  }}
                />
              </p>
            );

          case "list": {
            const Comp = section.format === "ordered" ? "ol" : "ul";

            return (
              <Comp key={key}>
                {section.children.zipWithIndex().map(([li, n]) => (
                  <li key={n}>
                    {li.children.zipWithIndex().map(([x, n]) => (
                      <Textish content={x} key={n} />
                    ))}
                  </li>
                ))}
              </Comp>
            );
          }
        }
      })}
    </RTVariablesCTX.Provider>
  );
}
