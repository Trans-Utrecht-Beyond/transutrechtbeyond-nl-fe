import styled from "@emotion/styled";
import { Stream } from "prelude-ts";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const PAGE_BUTTON_COUNT = 2;

type Props = {
  page: number;
  pageCount: number;
};

// eslint-disable-next-line react-refresh/only-export-components
const Container = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 30px;
  justify-content: center;
  margin: 15px;
  text-align: center;
`;

export default function PaginationButtons({ pageCount, page }: Props) {
  const { t } = useTranslation();
  const searchFor = (n: number) => {
    const x = new URLSearchParams(window.location.search);
    x.set("page", n.toString());
    return x.toString();
  };

  const pagesShown = Stream.iterate(
    page - PAGE_BUTTON_COUNT,
    (n) => n + 1,
  ).takeWhile((n) => n <= page + PAGE_BUTTON_COUNT);

  return (
    <Container
      style={{ visibility: pageCount === page ? "hidden" : undefined }}
    >
      <NavLink
        to={{ search: searchFor(1) }}
        aria-label={t("pagination.goToLast")}
        style={{
          visibility: page === 1 ? "hidden" : "visible",
        }}
      >
        |&lt;
      </NavLink>
      <NavLink
        to={{ search: searchFor(page - 1) }}
        aria-label={t("pagination.goToNext")}
        style={{
          visibility: page === 1 ? "hidden" : "visible",
        }}
      >
        &lt;
      </NavLink>
      {pagesShown.map((n) => {
        const valid = n < 1 || n > pageCount;
        return (
          <NavLink
            key={"goToPage" + n}
            to={{ search: searchFor(n) }}
            style={{
              visibility: valid ? "hidden" : undefined,
              textDecoration: n === page ? "underline" : "none",
            }}
          >
            {n}
          </NavLink>
        );
      })}
      <NavLink
        to={{ search: searchFor(page + 1) }}
        aria-label={t("pagination.goToNext")}
        style={{
          visibility: page > pageCount - 1 ? "hidden" : "visible",
        }}
      >
        &gt;
      </NavLink>
      <NavLink
        to={{ search: searchFor(pageCount) }}
        aria-label={t("pagination.goToLast")}
        style={{
          visibility: page > pageCount - 1 ? "hidden" : "visible",
        }}
      >
        &gt;|
      </NavLink>
    </Container>
  );
}
