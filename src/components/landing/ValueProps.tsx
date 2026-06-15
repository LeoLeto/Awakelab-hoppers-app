import { Shield, Zap, Briefcase } from "lucide-react";

const props = [
  {
    icon: Shield,
    keyword: "TRUST.",
    title: "Confia en tu conocimiento",
    description:
      "Datos reales del mercado laboral SAP actualizados semanalmente. Sin promesas vacias, sin cursos milagro. Informacion verificada de mas de 14 paises para que tomes decisiones informadas.",
    color: "text-hopper-murray",
    bgColor: "bg-hopper-murray/10",
  },
  {
    icon: Zap,
    keyword: "HOP.",
    title: "Da el salto estrategico",
    description:
      "Identifica los perfiles con mayor empleabilidad, los salarios por pais y seniority, y traza tu ruta de certificacion hacia las posiciones mas demandadas del ecosistema SAP.",
    color: "text-hopper-red",
    bgColor: "bg-hopper-red/10",
  },
  {
    icon: Briefcase,
    keyword: "WORK.",
    title: "Resultados tangibles en tu carrera",
    description:
      "De los datos al empleo. Perfilamiento personalizado, match con ofertas reales y soluciones formativas respaldadas por un partner oficial de SAP.",
    color: "text-hopper-granate",
    bgColor: "bg-hopper-granate/10",
  },
];

export default function ValueProps() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-hopper-red tracking-wider uppercase mb-3">
            Propuesta de valor
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-hopper-black tracking-tight">
            Better. Smarter. Hoppers.
          </h2>
          <p className="mt-4 text-lg text-hopper-black/50">
            Valoramos tu experiencia, conocimientos y logros. No somos un salto de
            fe, somos un salto en tu carrera.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {props.map((prop) => (
            <div
              key={prop.keyword}
              className="relative group p-8 rounded-xl border border-hopper-beige/40 hover:border-hopper-murray/40 transition-all duration-300 hover:shadow-lg"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${prop.bgColor} mb-6`}
              >
                <prop.icon className={`h-6 w-6 ${prop.color}`} />
              </div>
              <p
                className={`text-sm font-bold ${prop.color} tracking-widest mb-2`}
              >
                {prop.keyword}
              </p>
              <h3 className="text-xl font-bold text-hopper-black mb-3">
                {prop.title}
              </h3>
              <p className="text-hopper-black/50 leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
