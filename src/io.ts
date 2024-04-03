import * as io from "@prelude-io/core";
import { ioFetch } from "@prelude-io/fetch";
import { Function2 } from "prelude-ts";

const StrapiResponse = (data: io.Bus) =>
  io.Complex("StrapiResponse[" + data.name + "]", {
    data,
    meta: io.Complex("Meta", {
      pagination: io.Complex("Pagination", {
        page: io.number,
        pageSize: io.number,
        pageCount: io.number,
        total: io.number,
      }),
    }),
  });

const Document = <Bus extends io.Bus>(attributes: Bus) =>
  io.Complex("Document[" + attributes.name + "]", {
    id: io.positiveNumber,
    attributes,
  });

const StrapiRTText = io.Complex("StrapiRTText", {
  type: io.Literal("text"),
  text: io.string,
});

const StrapiRTParagraph = io.Complex("StrapiRTParagraph", {
  type: io.Literal("paragraph"),
  children: io.Vector(StrapiRTText),
});

const StrapiRichText = io.Vector(StrapiRTParagraph, "StrapiRichText");

const BoardMember = Document(
  io.Complex("BoardMember", {
    Name: io.string,
    Role: io.string,
    Order: io.Optional(io.validNumber),
    Introduction: StrapiRichText,
  }),
);

const BoardMembersResponse = StrapiResponse(io.Vector(BoardMember));

export const Event = io.Complex("Event", {
  Title: io.string,
  Time: io.string,
  Location: io.string,
  Day: io.string,
});

export type Event = io.BusOutputType<typeof Event>;
export type BoardMember = io.BusOutputType<typeof BoardMember>;

export const fetchBoardMembers = Function2.of(
  ioFetch(BoardMembersResponse, null),
).apply1(import.meta.env.VITE_STRAPI_URL + "/board-members");
