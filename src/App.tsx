import { Global } from "@emotion/react";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { styles } from "./globalStyles";

import i18n from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector/cjs";
import { initReactI18next } from "react-i18next";
import { LayoutSettingsContext } from "./contexts/layoutSettingsContext";
import articleLoader from "./loaders/articleLoader";
import eventDetailLoader from "./loaders/eventDetailLoader";
import globalInformationLoader from "./loaders/globalInformationLoader";
import homeLoader from "./loaders/homeLoader";
import linkInBioLoader from "./loaders/linkInBioLoader";
import newsListLoader from "./loaders/newsListLoader";
import ArticlePage from "./pages/ArticlePage";
import BasePage from "./pages/BasePage";
import ErrorPage from "./pages/ErrorPage";
import EventDetailPage from "./pages/EventDetailPage";
import EventsPage from "./pages/EventsPage";
import HomePage from "./pages/HomePage";
import LinkInBioPage from "./pages/LinkInBioPage";
import NewsListPage from "./pages/NewsListPage";
import eventListPageLoader from "./loaders/eventListPageLoader.ts";

i18n
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          misc: {
            date: "Date",
            unknownErrorOccurred: "An unknown error has occurred",
          },
          menu: {
            home: "Home",
            news: "News",
            events: "Events",
            aboutUs: "About us",
            whoAreWe: "Who are we?",
            democracy: "Democracy",
            membership: "Membership & Volunteers",
            donate: "Donate",
            CoC: "Code of Conduct",
            CoE: "Code of Ethics",
            confidant: "Confidant",
          },
          events: {
            noEventsFound: "No events have been found...",
            moreEventsText: "More events",
            upcomingEvents: "Upcoming events",
            when: "When",
            where: "Where",
            moreDetails: "More details",
            aboutTheLocation: "About the location:",
            meetYourHost: "Meet your host",
            sober: "This event is sober",
            nonSober: "This event is non-sober",
          },
          articles: {
            news: "News from TUB",
            aboutTheAuthor: "About the author",
            author_one: "Author",
            author_other: "Authors",
          },
        },
      },
      nl: {
        translation: {
          misc: {
            date: "Datum",
            unknownErrorOccurred: "Er is een onbekende fout opgetreden",
          },
          menu: {
            home: "Startpagina",
            news: "Nieuws",
            events: "Evenementen",
            aboutUs: "Over ons",
            democracy: "Democratie",
            whoAreWe: "Wie zijn we?",
            membership: "Lidmaatschap & vrijwilligers",
            donate: "Doneren",
            CoC: "Gedragscode",
            CoE: "Ethische code",
            confidant: "Vertrouwenspersoon",
          },
          events: {
            noEventsFound: "Er zijn geen evenementen gevonden...",
            moreEventsText: "Meer evenementen",
            upcomingEvents: "Aankomende evenementen",
            when: "Wanneer",
            where: "Waar",
            moreDetails: "Meer details",
            aboutTheLocation: "Over de locatie:",
            meetYourHost: "Ontmoet je host",
            sober: "Dit evenement is sober",
            nonSober: "Dit evenement is niet sober",
            /* eslint-disable no-irregular-whitespace */
            headerText: ``,
            /* eslint-enable */
          },
          articles: {
            news: "Nieuws uit TUB",
            aboutTheAuthor: "Over de auteur",
            author_one: "Auteur",
            author_other: "Auteurs",
          },
        },
      },
    },
    fallbackLng: ["nl", "en"],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

const router = createBrowserRouter([
  {
    path: "/",
    element: <BasePage />,
    errorElement: <ErrorPage />,
    id: "root",
    loader: globalInformationLoader,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homeLoader,
      },
      {
        path: "link-in-bio",
        element: <LinkInBioPage />,
        loader: linkInBioLoader,
      },
      {
        path: "nieuws",
        element: <Outlet />,
        children: [
          { index: true, element: <NewsListPage />, loader: newsListLoader },
        ],
      },
      {
        path: "evenementen",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <EventsPage />,
            loader: eventListPageLoader,
          },
          {
            path: ":date/:slug",
            element: <EventDetailPage />,
            loader: eventDetailLoader,
          },
        ],
      },
      { path: ":slug", loader: articleLoader, element: <ArticlePage /> },
    ],
  },
]);

export default function App() {
  return (
    <>
      <Global styles={styles} />
      <HelmetProvider>
        <LayoutSettingsContext>
          <RouterProvider router={router} />
        </LayoutSettingsContext>
      </HelmetProvider>
    </>
  );
}
