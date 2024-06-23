export const currencies = [
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
  { value: "UAH", label: "₴ Hryvnnia", locale: "uk-UA" },
  { value: "GPB", label: "£ Pound", locale: "en-GB" },
];

export type Currency = (typeof currencies)[0]