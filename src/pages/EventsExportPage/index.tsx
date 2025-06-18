import { useEffect, useState } from "react";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import schema from "./schema.json";
import uischema from "./uischema.json";
import { addMonths, formatISO } from "date-fns";
import { useSearchParams } from "react-router-dom";
import eventsExportLoader, {
  ExportEvent,
} from "../../loaders/eventsExportLoader.ts";
import { useLoaderData } from "react-router-typesafe";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as C from "./styled.ts";

const initialData = {
  from: formatISO(new Date(), {
    representation: "date",
  }),
  until: formatISO(addMonths(new Date(), 1), { representation: "date" }),
};

const columnHelper = createColumnHelper<ExportEvent>();

const columns = [
  columnHelper.accessor("Start", {
    header: "Start",
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
  columnHelper.accessor("Duration", {
    header: "Duration",
    cell: (info) => `${info.getValue()}h`,
  }),
  columnHelper.accessor("Type", {
    header: "Type",
  }),
  columnHelper.accessor("Location", {
    header: "Location",
  }),
  columnHelper.accessor("Address", {
    header: "Address",
  }),
  columnHelper.accessor("Hosts", {
    header: "Hosts",
  }),
  columnHelper.accessor("Sober", {
    header: "Sober",
    cell: (info) => (info.getValue() ? "✓" : "✗"),
  }),
];

export default function EventsExportPage() {
  const [data, setData] = useState(initialData);
  const [searchParams, setSearchParams] = useSearchParams();
  const loaderData = useLoaderData<typeof eventsExportLoader>();

  useEffect(() => {
    const from = searchParams.get("from");
    const until = searchParams.get("until");

    if (from !== data.from && until !== data.until) {
      setSearchParams((params) => {
        params.set("from", data.from);
        params.set("until", data.until);
        return params;
      });
    }
  }, [data, searchParams, setSearchParams]);

  const table = useReactTable({
    data: loaderData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h1>Events Data Export</h1>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data }) => setData(data)}
      />
      <C.Table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <C.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <C.Th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </C.Th>
              ))}
            </C.Tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <C.Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <C.Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </C.Td>
              ))}
            </C.Tr>
          ))}
        </tbody>
      </C.Table>
    </div>
  );
}
