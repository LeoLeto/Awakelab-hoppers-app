export interface Country {
  code: string;
  name: string;
  flag: string;
  region: "europe" | "latam" | "usa";
  currency: string;
  currencySymbol: string;
  cities: string[];
  dialCode: string;
  phoneDigits: number;
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
    description: "Alemania, Suiza, España, Francia, Portugal, Bélgica, Italia",
  },
  {
    id: "latam",
    name: "Latinoamerica",
    description: "México, Colombia, Chile, Argentina, Brasil, Perú",
  },
  {
    id: "usa",
    name: "USA (Hispanohablante)",
    description: "Miami, Houston, Los Ángeles, Nueva York",
  },
];

// phoneDigits = exact number of digits expected (excluding dial code and separators)
// 9 digits:  ES, CH, FR, PT, BE, CL, PE
// 10 digits: IT, MX, CO, AR, US
// 11 digits: DE, BR

export const countries: Country[] = [
  // Europe
  { code: "ES", name: "España",   flag: "🇪🇸", region: "europe", currency: "EUR", currencySymbol: "€",   cities: ["Madrid", "Barcelona", "Sevilla", "Valencia", "Málaga"],  dialCode: "+34",  phoneDigits: 9  },
  { code: "DE", name: "Alemania", flag: "🇩🇪", region: "europe", currency: "EUR", currencySymbol: "€",   cities: ["Berlin", "Munich", "Frankfurt", "Hamburg"],               dialCode: "+49",  phoneDigits: 11 },
  { code: "CH", name: "Suiza",    flag: "🇨🇭", region: "europe", currency: "CHF", currencySymbol: "CHF", cities: ["Zurich", "Basel", "Berna", "Ginebra"],                    dialCode: "+41",  phoneDigits: 9  },
  { code: "FR", name: "Francia",  flag: "🇫🇷", region: "europe", currency: "EUR", currencySymbol: "€",   cities: ["París", "Lyon", "Marsella", "Toulouse"],                  dialCode: "+33",  phoneDigits: 9  },
  { code: "PT", name: "Portugal", flag: "🇵🇹", region: "europe", currency: "EUR", currencySymbol: "€",   cities: ["Lisboa", "Oporto"],                                       dialCode: "+351", phoneDigits: 9  },
  { code: "BE", name: "Bélgica",  flag: "🇧🇪", region: "europe", currency: "EUR", currencySymbol: "€",   cities: ["Bruselas", "Amberes", "Gante"],                           dialCode: "+32",  phoneDigits: 9  },
  { code: "IT", name: "Italia",   flag: "🇮🇹", region: "europe", currency: "EUR", currencySymbol: "€",   cities: ["Milán", "Roma", "Turín"],                                 dialCode: "+39",  phoneDigits: 10 },
  // LATAM
  { code: "MX", name: "México",        flag: "🇲🇽", region: "latam", currency: "MXN", currencySymbol: "$",   cities: ["Ciudad de México", "Monterrey", "Guadalajara"],          dialCode: "+52",  phoneDigits: 10 },
  { code: "CO", name: "Colombia",      flag: "🇨🇴", region: "latam", currency: "COP", currencySymbol: "$",   cities: ["Bogotá", "Medellín", "Cali"],                            dialCode: "+57",  phoneDigits: 10 },
  { code: "CL", name: "Chile",         flag: "🇨🇱", region: "latam", currency: "CLP", currencySymbol: "$",   cities: ["Santiago", "Valparaíso"],                                dialCode: "+56",  phoneDigits: 9  },
  { code: "AR", name: "Argentina",     flag: "🇦🇷", region: "latam", currency: "USD", currencySymbol: "$",   cities: ["Buenos Aires", "Córdoba", "Rosario"],                    dialCode: "+54",  phoneDigits: 10 },
  { code: "BR", name: "Brasil",        flag: "🇧🇷", region: "latam", currency: "BRL", currencySymbol: "R$",  cities: ["São Paulo", "Río de Janeiro", "Brasilia"],               dialCode: "+55",  phoneDigits: 11 },
  { code: "PE", name: "Perú",          flag: "🇵🇪", region: "latam", currency: "PEN", currencySymbol: "S/",  cities: ["Lima", "Arequipa"],                                      dialCode: "+51",  phoneDigits: 9  },
  // USA
  { code: "US", name: "Estados Unidos", flag: "🇺🇸", region: "usa",   currency: "USD", currencySymbol: "$",   cities: ["Miami", "Houston", "Los Ángeles", "Nueva York"],         dialCode: "+1",   phoneDigits: 10 },
];

export function getCountriesByRegion(region: Region["id"]): Country[] {
  return countries.filter((c) => c.region === region);
}

export function getCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code);
}
