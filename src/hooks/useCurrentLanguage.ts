import { useTranslation } from "react-i18next";

export default function useCurrentLanguage() {
  const {
    i18n: { language },
  } = useTranslation();

  return language.substring(0, 2);
}
