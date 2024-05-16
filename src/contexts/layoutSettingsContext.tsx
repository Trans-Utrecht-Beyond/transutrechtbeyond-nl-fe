import { Option } from "prelude-ts";
import {
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { Helmet } from "react-helmet-async";

type LayoutSettings = {
  squiggleHeight: number;
  header: Option<ReactNode>;
  title: string;
};

const DEFAULTS: LayoutSettings = {
  header: Option.none(),
  squiggleHeight: 300,
  title: "Trans Utrecht & Beyond",
};

const ctx = createContext<
  [LayoutSettings, Dispatch<SetStateAction<LayoutSettings>>] | null
>(null);

ctx.displayName = "LayoutSettingsContext";

export function LayoutSettingsContext({ children }: PropsWithChildren) {
  const [v, setV] = useState<LayoutSettings>(DEFAULTS);

  return (
    <>
      <Helmet>
        <title>{v.title}</title>
      </Helmet>
      <ctx.Provider value={[v, setV]}>{children}</ctx.Provider>
    </>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLayoutSettings() {
  const [v, setV] = useContext(ctx)!;
  const resetV = useCallback(() => setV(DEFAULTS), [setV]);

  return [v, setV, resetV] as const;
}
