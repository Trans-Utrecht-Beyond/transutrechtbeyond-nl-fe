import { Option } from "prelude-ts";
import { useTranslation } from "react-i18next";
import { NavLink, isRouteErrorResponse, useRouteError } from "react-router-dom";
import Squigles from "../components/Squigles";

export default function ErrorPage() {
  const { t } = useTranslation();
  const error = useRouteError();

  if (isRouteErrorResponse(error))
    return (
      <>
        <Squigles lines={10} maxHeight={Option.of(800)} />
        <div
          style={{
            height: 500,
            display: "grid",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h1>{error.status ?? t("misc.unknownErrorOccurred")}</h1>
          <h2>
            <NavLink to="/">
              ◄ <span className="underline">{t("menu.home")}</span>
            </NavLink>
          </h2>
        </div>
      </>
    );

  return t("misc.unknownErrorOccurred");
}
