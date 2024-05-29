import * as io from "@prelude-io/core";
import { ioFetch } from "@prelude-io/fetch";

const LocaleBus = io.Literal("en").else(io.Literal("nl"));

const StrapiPaginationBus = io.Complex("StrapiPagination", {
  page: io.number,
  pageSize: io.number,
  pageCount: io.number,
  total: io.number,
});

const StrapiResponseBus = <Bus extends io.Bus>(data: Bus) =>
  io.Complex("StrapiResponse[" + data.name + "]", {
    data,
    meta: io.Complex("Meta", {
      pagination: io.Optional(StrapiPaginationBus),
    }),
  });

const StrapiDocumentBus = <Bus extends io.Bus>(attributes: Bus) =>
  io.Complex("Document[" + attributes.name + "]", {
    id: io.positiveNumber,
    attributes,
  });

const StrapiComponentBus = <Fields extends io.ComplexFields>(
  name: string,
  fields: Fields,
) =>
  io.Complex("Component[" + name + "]", {
    id: io.positiveNumber,
    ...fields,
  });

const StrapiRelationBus = <Bus extends io.Bus>(data: Bus) =>
  io.Complex("Relation[" + data.name + "]", { data });

const StrapiBaseImageFieldsBus = {
  ext: io.string,
  url: io.string,
  hash: io.string,
  mime: io.string,
  name: io.string,
  path: io.Optional(io.string),
  size: io.number,
  width: io.number,
  height: io.number,
} satisfies io.ComplexFields;

const StrapiImageObjectBus = io.Complex("StrapiImage", {
  ...StrapiBaseImageFieldsBus,
  alternativeText: io.Optional(io.string),
  formats: io.objectEntries.chain(
    // @ts-expect-error - This validates the type
    io.HashMap(
      io.string,
      io.Complex("StrapiImageFormat", {
        ...StrapiBaseImageFieldsBus,
      }),
    ),
  ),
});

const StrapiRTTextBus = io.Complex("StrapiRTText", {
  type: io.Literal("text"),
  text: io.string,
  bold: io.Optional(io.boolean),
  italic: io.Optional(io.boolean),
  underline: io.Optional(io.boolean),
  strikethrough: io.Optional(io.boolean),
  code: io.Optional(io.boolean),
});

const StrapiRTLinkBus = io.Complex("StrapiRTLink", {
  type: io.Literal("link"),
  url: io.string,
  children: io.Vector(StrapiRTTextBus),
});

const StrapiRTTextishBus = StrapiRTTextBus.else(StrapiRTLinkBus);

const StrapiRTParagraphBus = io.Complex("StrapiRTParagraph", {
  type: io.Literal("paragraph"),
  children: io.Vector(StrapiRTTextishBus),
});

const StrapiRTHeadingBus = io.Complex("StrapiRTHeading", {
  type: io.Literal("heading"),
  level: io.positiveNumber,
  children: io.Vector(StrapiRTTextishBus),
});

const StrapiRTListItemBus = io.Complex("StrapiRTListItem", {
  type: io.Literal("list-item"),
  children: io.Vector(StrapiRTTextishBus),
});

const StrapiRTListBus = io.Complex("StrapiRTList", {
  type: io.Literal("list"),
  format: io.Literal("ordered").else(io.Literal("unordered")),
  children: io.Vector(StrapiRTListItemBus),
});

const StrapiRTImageBus = io.Complex("StrapiRTImage", {
  type: io.Literal("image"),
  image: StrapiImageObjectBus,
  previewUrl: io.Optional(io.string),
  alternativeText: io.Optional(io.string),
});

const StrapiRTQuoteBus = io.Complex("StrapiRTQuote", {
  type: io.Literal("quote"),
  children: io.Vector(StrapiRTTextBus),
});

const StrapiRTCodeBus = io.Complex("StrapiRTCode", {
  type: io.Literal("code"),
  children: io.Vector(StrapiRTTextBus),
});

const StrapiRichTextBus = io.Vector(
  StrapiRTParagraphBus.else(StrapiRTHeadingBus)
    .else(StrapiRTListBus)
    .else(StrapiRTCodeBus)
    .else(StrapiRTQuoteBus)
    .else(StrapiRTImageBus),
  "StrapiRichText",
);

const DynamicItem = <Fields extends io.ComplexFields, Name extends string>(
  name: Name,
  fields: Fields,
) =>
  io.Complex(`DynamicItem[${name}]`, {
    id: io.number,
    __component: io.Literal(name),
    ...fields,
  });

const ComponentArticleBasicTextBus = DynamicItem("article.basic-text", {
  Content: StrapiRichTextBus,
});

const PersonBus = StrapiDocumentBus(
  io.Complex("Person", {
    Name: io.string,
    Role: io.string,
    Pronouns: io.string,
    Picture: io.Optional(
      StrapiRelationBus(StrapiDocumentBus(StrapiImageObjectBus)),
    ),
    Order: io.Optional(io.validNumber),
    Description: StrapiRichTextBus,
  }),
);

const EventLocationBus = StrapiDocumentBus(
  io.Complex("EventLocation", {
    Name: io.string,
    Address: io.string,
    Description: io.string,
  }),
);

const EventTypeBus = StrapiDocumentBus(
  io.Complex("EventType", {
    Name: io.string,
    Summary: io.string,
    Slug: io.string,
    Description: StrapiRichTextBus,
    Images: StrapiRelationBus(
      io.Optional(io.Vector(StrapiDocumentBus(StrapiImageObjectBus))),
    ),
  }),
);

const EventBus = StrapiDocumentBus(
  io.Complex("Event", {
    Start: io.date,
    LengthInHours: io.number,
    Host: io.Optional(StrapiRelationBus(PersonBus)),
    EventType: io.Optional(StrapiRelationBus(EventTypeBus)),
    EventLocation: io.Optional(StrapiRelationBus(EventLocationBus)),
  }),
);

const ArticleBus = StrapiDocumentBus(
  io.Complex("Article", {
    Title: io.string,
    Slug: io.string,
    Date: io.date,
    Authors: io.Optional(StrapiRelationBus(io.Vector(PersonBus))),
    Summary: io.Optional(io.string),
    Content: io.Optional(io.Vector(ComponentArticleBasicTextBus)),
  }),
);

const HomeBus = StrapiDocumentBus(
  io.Complex("Home", {
    Header: io.string,
    locale: LocaleBus,
  }),
);

const LinkBus = StrapiComponentBus("Link", {
  Text: io.string,
  Target: io.string,
});

const GeneralInformationBus = StrapiDocumentBus(
  io.Complex("GeneralInformation", {
    Sections: io.Vector(
      StrapiComponentBus("Section", {
        Description: io.Optional(io.string),
        Title: io.Optional(io.string),
        Links: io.Vector(LinkBus),
      }),
    ),
  }),
);

const LinkInBioBus = StrapiDocumentBus(
  io.Complex("LinkInBio", {
    Link: io.Vector(LinkBus),
  }),
);

const EventsResponseBus = StrapiResponseBus(io.Vector(EventBus));
const ArticlesResponseBus = StrapiResponseBus(io.Vector(ArticleBus));
const EventDetailsResponseBus = StrapiResponseBus(EventBus);
const HomeResponseBus = StrapiResponseBus(HomeBus);
const GlobalInformationResponseBus = StrapiResponseBus(GeneralInformationBus);
const LinkInBioResponseBus = StrapiResponseBus(LinkInBioBus);

export type ComponentArticleBasicText = io.BusOutputType<
  typeof ComponentArticleBasicTextBus
>;
export type StrapiImageObject = io.BusOutputType<typeof StrapiImageObjectBus>;
export type StrapiRTText = io.BusOutputType<typeof StrapiRTTextBus>;
export type StrapiRTLink = io.BusOutputType<typeof StrapiRTLinkBus>;
export type StrapiRTTextish = io.BusOutputType<typeof StrapiRTTextishBus>;
export type StrapiRichText = io.BusOutputType<typeof StrapiRichTextBus>;
export type Event = io.BusOutputType<typeof EventBus>;
export type Person = io.BusOutputType<typeof PersonBus>;
export type Home = io.BusOutputType<typeof HomeBus>;
export type GeneralInformation = io.BusOutputType<typeof GeneralInformationBus>;
export type StrapiPagination = io.BusOutputType<typeof StrapiPaginationBus>;
export type EventsResponse = io.BusOutputType<typeof EventsResponseBus>;
export type LinkInBioResponse = io.BusOutputType<typeof LinkInBioResponseBus>;
export type EventDetailsResponse = io.BusOutputType<
  typeof EventDetailsResponseBus
>;
export type StrapiResponse = io.BusOutputType<
  ReturnType<typeof StrapiResponseBus>
>;
export type ArticlesResponse = io.BusOutputType<typeof ArticlesResponseBus>;

export const fetchArticles = ioFetch(ArticlesResponseBus);
export const fetchHome = ioFetch(HomeResponseBus);
export const fetchGlobalInformation = ioFetch(GlobalInformationResponseBus);
export const fetchEventDetails = ioFetch(EventDetailsResponseBus);
export const fetchEvents = ioFetch(EventsResponseBus);
export const fetchLinkInBio = ioFetch(LinkInBioResponseBus);
