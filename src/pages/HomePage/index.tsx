import { Option } from "prelude-ts";
import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Await, useLoaderData } from "react-router-typesafe";
import Arrow from "../../components/Arrow";
import * as GridC from "../../components/Grid";
import ShortEventList from "../../components/ShortEventList";
import { useLayoutSettings } from "../../contexts/layoutSettingsContext";
import homeLoader from "../../loaders/homeLoader";
import * as c from "./styled";

export default function HomePage() {
  const { t } = useTranslation();
  const [, setLayoutSettings, resetLayoutSettings] = useLayoutSettings();
  const loaderData = useLoaderData<typeof homeLoader>();

  useEffect(() => {
    const header = Option.of(
      <>
        <GridC.Section>
          <c.Image src="/tub_logo.png" className="mobile-hidden" />
          <h1 className="mobile-double">
            Trans <br />
            Utrecht <br />
            &amp; Beyond
          </h1>
          <p className="double">{loaderData.home.data.attributes.Header}</p>
        </GridC.Section>
        <GridC.Line />
      </>,
    );

    setLayoutSettings((x) => ({ ...x, header, squiggleHeight: 600 }));

    return resetLayoutSettings;
  }, [
    loaderData.home.data.attributes.Header,
    resetLayoutSettings,
    setLayoutSettings,
  ]);

  return (
    <GridC.Section>
      <div className="double relative">
        <c.SofaImage src="/sofa.png" />
      </div>
      <div className="double">
        <h2>
          {t("events.upcomingEvents")}
          <Arrow direction="S" className="mobile-hidden" />
        </h2>
        <Suspense fallback={<div style={{ height: 190 }} />}>
          <Await resolve={loaderData.upcomingEvents}>
            {(upcomingEvents) => (
              <ShortEventList events={upcomingEvents.data} />
            )}
          </Await>
        </Suspense>
      </div>
    </GridC.Section>
  );
}
