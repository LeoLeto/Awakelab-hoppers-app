export interface Country {
  code: string;
  name: string;
  flag: string;
  region: "europe" | "latam" | "usa";
  currency: string;
  currencySymbol: string;
  cities: string[];
}

export interface Region {
  id: "europe" | "latam" | "usa";
  name: string;
  description: string;
}

export const regions: Region[] = [
  {
    id: "europe",
    name: "Europa",
    description: "Alemania, Suiza, Espana, Francia, Portugal, Belgica, Italia",
  },
  {
    id: "latam",
    name: "Latinoamerica",
    description: "Mexico, Colombia, Chile, Argentina, Brasil, Peru",
  },
  {
    id: "usa",
    name: "USA (Hispanohablante)",
    description: "Miami, Houston, Los Angeles, New York",
  },
];

export const countries: Country[] = [
  // Europe
  {
    code: "ES",
    name: "Espana",
    flag: "🇪🇸",
    region: "europe",
    currency: "EUR",
    currencySymbol: "€",
    cities: ["Madrid", "Barcelona", "Sevilla", "Valencia", "Malaga"],
  },
  {
    code: "DE",
    name: "Alemania",
    flag: "🇩🇪",
    region: "europe",
    currency: "EUR",
    currencySymbol: "€",
    cities: ["Berlin", "Munich", "Frankfurt", "Hamburg"],
  },
  {
    code: "CH",
    name: "Suiza",
    flag: "🇨🇭",
    region: "europe",
    currency: "CHF",
    currencySymbol: "CHF",
    cities: ["Zurich", "Basel", "Berna", "Ginebra"],
  },
  {
    code: "FR",
    name: "Francia",
    flag: "🇫🇷",
    region: "europe",
    currency: "EUR",
    currencySymbol: "€",
    cities: ["Paris", "Lyon", "Marsella", "Toulouse"],
  },
  {
    code: "PT",
    name: "Portugal",
    flag: "🇵🇹",
    region: "europe",
    currency: "EUR",
    currencySymbol: "€",
    cities: ["Lisboa", "Oporto"],
  },
  {
    code: "BE",
    name: "Belgica",
    flag: "🇧🇪",
    region: "europe",
    currency: "EUR",
    currencySymbol: "€",
    cities: ["Bruselas", "Amberes", "Gante"],
  },
  {
    code: "IT",
    name: "Italia",
    flag: "🇮🇹",
    region: "europe",
    currency: "EUR",
    currencySymbol: "€",
    cities: ["Milan", "Roma", "Turin"],
  },
  // LATAM
  {
    code: "MX",
    name: "Mexico",
    flag: "🇲🇽",
    region: "latam",
    currency: "MXN",
    currencySymbol: "$",
    cities: ["Ciudad de Mexico", "Monterrey", "Guadalajara"],
  },
  {
    code: "CO",
    name: "Colombia",
    flag: "🇨🇴",
    region: "latam",
    currency: "COP",
    currencySymbol: "$",
    cities: ["Bogota", "Medellin", "Cali"],
  },
  {
    code: "CL",
    name: "Chile",
    flag: "🇨🇱",
    region: "latam",
    currency: "CLP",
    currencySymbol: "$",
    cities: ["Santiago", "Valparaiso"],
  },
  {
    code: "AR",
    name: "Argentina",
    flag: "🇦🇷",
    region: "latam",
    currency: "USD",
    currencySymbol: "$",
    cities: ["Buenos Aires", "Cordoba", "Rosario"],
  },
  {
    code: "BR",
    name: "Brasil",
    flag: "🇧🇷",
    region: "latam",
    currency: "BRL",
    currencySymbol: "R$",
    cities: ["Sao Paulo", "Rio de Janeiro", "Brasilia"],
  },
  {
    code: "PE",
    name: "Peru",
    flag: "🇵🇪",
    region: "latam",
    currency: "PEN",
    currencySymbol: "S/",
    cities: ["Lima", "Arequipa"],
  },
  // USA
  {
    code: "US",
    name: "Estados Unidos",
    flag: "🇺🇸",
    region: "usa",
    currency: "USD",
    currencySymbol: "$",
    cities: ["Miami", "Houston", "Los Angeles", "New York"],
  },
];

export function getCountriesByRegion(region: Region["id"]): Country[] {
  return countries.filter((c) => c.region === region);
}

export function getCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code);
}
