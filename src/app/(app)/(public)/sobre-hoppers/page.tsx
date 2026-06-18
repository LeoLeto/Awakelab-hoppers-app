import type { Metadata } from "next";
import { ArrowUpRight, Award, BookOpen, Globe, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sobre Hoppers Academy | Partner SAP Europa y LATAM",
  description:
    "Hoppers Academy es el referente formativo y partner oficial de SAP para Europa y Latinoamerica. Formacion de alto nivel para profesionales ambiciosos.",
};

export default function SobreHoppersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-hopper-black py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-hopper-red font-bold text-sm tracking-wider uppercase mb-4">
              Sobre Hoppers
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.15]">
              Esto no es un manual de otra marca sin mas. Es el impulso
              definitivo para profesionales ambiciosos.
            </h1>
            <p className="mt-6 text-lg text-white/50 leading-relaxed">
              Hoppers es el puente que conecta tu experiencia con las
              oportunidades de alto valor, facilitando tu transformacion y
              garantizando un destino profesional superior.
            </p>
          </div>
        </div>
      </section>

      {/* Origin */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-hopper-black mb-6">
                Grace Hopper: nuestra inspiracion
              </h2>
              <p className="text-hopper-black/60 leading-relaxed mb-4">
                Nuestro nombre rinde homenaje a Grace Hopper, conocida como la
                madre de la computacion. Su espiritu pionero, su autoridad y
                su vision transformadora son la base de todo lo que hacemos.
              </p>
              <p className="text-hopper-black/60 leading-relaxed mb-4">
                Hopper tambien suena a salto. A avance. A movimiento. Es la
                alusion directa a la evolucion profesional que ofrecemos.
              </p>
              <p className="text-hopper-black/60 leading-relaxed">
                Y sobre todo, a apellido. A clase. Hoppers confiere un
                apellido a quienes estudian aqui, un sello de pertenencia a
                una elite profesional.
              </p>
            </div>
            <div className="bg-hopper-beige/20 rounded-2xl p-10">
              <blockquote className="text-2xl font-bold text-hopper-black leading-snug">
                No te pedimos que renaizcas ni que empieces de cero.
                Valoramos tu experiencia, conocimientos y logros.
              </blockquote>
              <p className="mt-4 text-hopper-red font-semibold">
                Hoppers Academy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-hopper-beige-light/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-hopper-black mb-12 text-center">
            Nuestros valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: "Honestidad",
                text: "Sin frases visionarias ni titulos de fantasia. Te hablamos con respeto: como alguien que busca mejorar.",
              },
              {
                icon: Users,
                title: "Pertenencia",
                text: "Estudiar en Hoppers es parte de algo: una comunidad exigente, profesional, que sabe que esta invirtiendo en formacion de verdad.",
              },
              {
                icon: BookOpen,
                title: "Exclusividad",
                text: "No es para todos. Es para los que ya tienen un recorrido, una disciplina, una ambicion. No prometemos excelencia. La requerimos.",
              },
              {
                icon: Globe,
                title: "Alcance global",
                text: "Partner oficial de SAP para Europa y Latinoamerica. Presencia en 14 paises con datos de mercado actualizados semanalmente.",
              },
            ].map((val) => (
              <Card key={val.title} className="border-hopper-beige/60">
                <CardContent className="p-6">
                  <val.icon className="h-6 w-6 text-hopper-red mb-4" />
                  <h3 className="font-bold text-hopper-black mb-2">
                    {val.title}
                  </h3>
                  <p className="text-sm text-hopper-black/50 leading-relaxed">
                    {val.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-hopper-black mb-4">
            Listo para dar el salto?
          </h2>
          <p className="text-hopper-black/50 mb-8 max-w-lg mx-auto">
            Unete a la comunidad Hoppers y descubre tu posicion en el mercado
            SAP.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro">
              <Button
                size="lg"
                className="bg-hopper-red hover:bg-hopper-red-dark text-white px-8"
              >
                Unirme a la comunidad
              </Button>
            </Link>
            <a
              href="https://hoppers.academy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="px-8">
                Visitar Hoppers Academy
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
