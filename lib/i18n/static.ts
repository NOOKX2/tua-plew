import { DEFAULT_LOCALE } from "./config";
import { createTranslator } from "./translate";

export const STATIC_LOCALE = DEFAULT_LOCALE;
export const staticT = createTranslator(DEFAULT_LOCALE);
