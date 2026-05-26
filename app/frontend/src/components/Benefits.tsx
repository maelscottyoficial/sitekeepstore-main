import { Headphones, Shield, Lock, Truck } from "lucide-react";

const benefits = [
  {
    icon: Headphones,
    title: "SUPORTE ONLINE",
    description: "Obtenha assistência rápida e fácil. Nossa equipe está sempre pronta para ajudá-lo com qualquer dúvida.",
  },
  {
    icon: Shield,
    title: "GARANTIA DE SATISFAÇÃO",
    description: "Até 7 dias para devolver e receber seu dinheiro de volta, sem complicações.",
  },
  {
    icon: Lock,
    title: "PAGAMENTO SEGURO",
    description: "Pagamentos seguros e confiáveis, intermediados pelo Mercado Pago.",
  },
  {
    icon: Truck,
    title: "ENTREGA RÁPIDA",
    description: "Receba seus produtos rapidamente com nosso serviço de entrega expresso.",
  },
];

export default function Benefits() {
  return (
    <section className="border-t border-white/5 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="flex flex-col items-center rounded-2xl border border-white/5 bg-[#1a1a2e]/30 p-6 text-center transition-all hover:border-indigo-500/20 hover:bg-[#1a1a2e]/60"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                  <Icon className="h-7 w-7 text-indigo-400" />
                </div>
                <h3 className="mb-2 text-sm font-bold tracking-wide text-white">
                  {benefit.title}
                </h3>
                <p className="text-xs leading-relaxed text-gray-400">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}