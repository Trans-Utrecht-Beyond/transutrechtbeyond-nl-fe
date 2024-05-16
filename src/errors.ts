export const NOT_FOUND = new Response("Not Found", { status: 404 });
export const UNKNOWN = new Response("Unknown", { status: 500 });

export const throwUnknown = () => {
  throw UNKNOWN;
};

export const throwNotFound = () => {
  throw NOT_FOUND;
};
