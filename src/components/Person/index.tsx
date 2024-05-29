import { Option } from "prelude-ts";
import { throwUnknown } from "../../errors";
import { Person as PersonData } from "../../io";
import RichText from "../RichText";

import * as c from "./styled";

type Props = {
  caption: string;
  person: PersonData;
  className?: string;
};

export default function Person({ person, caption, className }: Props) {
  return (
    <c.Container className={className}>
      <c.Caption>{caption}</c.Caption>
      <c.ImageWrapper>
        <c.Logo />
        {person.attributes.Picture.map((x) => (
          <c.ImageContainer>
            <c.Image image={x.data.attributes} size={Option.of("small")} />
            <c.Name>
              <h3>{person.attributes.Name}</h3>
            </c.Name>
          </c.ImageContainer>
        )).getOrCall(throwUnknown)}
      </c.ImageWrapper>
      <RichText content={person.attributes.Description} />
    </c.Container>
  );
}
