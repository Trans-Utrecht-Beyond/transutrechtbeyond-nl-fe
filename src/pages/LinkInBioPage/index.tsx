import { useLoaderData } from "react-router-dom";
import Arrow from "../../components/Arrow";
import { LinkInBioResponse } from "../../io";
import * as c from "./styled";
import { Helmet } from "react-helmet-async";

export default function LinkInBioPage() {
  const loaderData = useLoaderData() as LinkInBioResponse;

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <c.Container>
        {loaderData.data.Link.map(({ Text, Target }) => (
          <h3 key={Text}>
            <Arrow direction="E" />
            &nbsp;
            <a href={Target}>{Text}</a>
          </h3>
        ))}
      </c.Container>
    </>
  );
}
