const logos = [
  { name: "SAP", display: "SAP" },
  { name: "Accenture", display: "Accenture" },
  { name: "NTT DATA", display: "NTT DATA" },
  { name: "KPMG", display: "KPMG" },
  { name: "McKinsey", display: "McKinsey" },
  { name: "Deloitte", display: "Deloitte" },
];

export default function ConsultancyLogos() {
  return (
    <section className="py-12 bg-white border-y border-hopper-beige/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-medium text-hopper-black/30 uppercase tracking-widest mb-8">
          Datos respaldados por estudios de las principales consultoras
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="text-lg sm:text-xl font-bold text-hopper-black/15 hover:text-hopper-black/30 transition-colors tracking-wider"
            >
              {logo.display}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
