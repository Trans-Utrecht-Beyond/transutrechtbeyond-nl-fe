import { useLoaderData } from "react-router-dom";
import Arrow from "../../components/Arrow";
import { LinkInBioResponse } from "../../io";
import * as c from "./styled";

export default function LinkInBioPage() {
  const loaderData = useLoaderData() as LinkInBioResponse;

  return (
    <c.Container>
      {loaderData.data.attributes.Link.map((x) => (
        <h3 key={x.Text}>
          <Arrow direction="E" />
          &nbsp;
          <a href={x.Target}>{x.Text}</a>
        </h3>
      ))}
    </c.Container>
  );
}
