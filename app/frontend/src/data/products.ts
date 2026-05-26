export interface Product {
  id: number;
  name: string;
  originalPrice?: number;
  currentPrice: number;
  discount?: number;
  installments: number;
  installmentPrice: number;
  category: string;
  gradient: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  href: string;
}

export const categories: Category[] = [
  { id: 1, name: "Smartwatches", icon: "Watch", href: "#smartwatches" },
  { id: 2, name: "Massageadores", icon: "Heart", href: "#massageadores" },
  { id: 3, name: "Fones de Ouvido", icon: "Headphones", href: "#fones" },
  { id: 4, name: "Caixas de Som", icon: "Speaker", href: "#caixas" },
  { id: 5, name: "Acessórios p/ Celular", icon: "Smartphone", href: "#celular" },
  { id: 6, name: "Acessórios p/ PC", icon: "Monitor", href: "#pc" },
  { id: 7, name: "Máquinas de Cortar Cabelo", icon: "Scissors", href: "#maquinas" },
  { id: 8, name: "Promoções", icon: "Tag", href: "#promocoes" },
];

export const promotionalProducts: Product[] = [
  {
    id: 1,
    name: "Controle Joystick Bluetooth Ipega 9076 – Experiência de Jogo Sem Limites",
    originalPrice: 155.0,
    currentPrice: 131.9,
    discount: 15,
    installments: 12,
    installmentPrice: 13.37,
    category: "Acessórios PC",
    gradient: "from-indigo-900 to-purple-900",
  },
  {
    id: 2,
    name: "Máquina de Cortar Cabelo Wmark NG108: Alta Performance Sem Fio",
    originalPrice: 265.0,
    currentPrice: 239.0,
    discount: 10,
    installments: 12,
    installmentPrice: 24.22,
    category: "Máquinas",
    gradient: "from-slate-800 to-zinc-900",
  },
  {
    id: 3,
    name: "Máquina de Cortar Cabelo Wmark NG-222: Design Inclinável e Tecnologia Avançada",
    originalPrice: 375.0,
    currentPrice: 349.0,
    discount: 7,
    installments: 12,
    installmentPrice: 35.37,
    category: "Máquinas",
    gradient: "from-gray-800 to-slate-900",
  },
  {
    id: 4,
    name: "Máquina de Cortar Cabelo Wmark NG121: Estilo Preciso em Azul Elegante",
    originalPrice: 320.0,
    currentPrice: 298.0,
    discount: 7,
    installments: 12,
    installmentPrice: 30.2,
    category: "Máquinas",
    gradient: "from-blue-900 to-indigo-900",
  },
  {
    id: 5,
    name: "Massageador Portátil Recarregável para Dor em Pescoço e Coluna",
    originalPrice: 35.0,
    currentPrice: 20.0,
    discount: 43,
    installments: 12,
    installmentPrice: 2.03,
    category: "Massageadores",
    gradient: "from-emerald-900 to-teal-900",
  },
  {
    id: 6,
    name: "Pistola Massageadora Elétrica Portátil",
    originalPrice: 105.0,
    currentPrice: 84.0,
    discount: 20,
    installments: 12,
    installmentPrice: 8.51,
    category: "Massageadores",
    gradient: "from-rose-900 to-pink-900",
  },
  {
    id: 7,
    name: "Tapete Massageador Portátil – Inovação em Alívio para Pés Cansados",
    originalPrice: 35.0,
    currentPrice: 24.0,
    discount: 31,
    installments: 12,
    installmentPrice: 2.43,
    category: "Massageadores",
    gradient: "from-violet-900 to-purple-900",
  },
  {
    id: 8,
    name: "Smartwatch W34s: Monitoramento Avançado de Saúde e Bem-Estar",
    originalPrice: 155.0,
    currentPrice: 128.0,
    discount: 17,
    installments: 12,
    installmentPrice: 12.97,
    category: "Smartwatches",
    gradient: "from-cyan-900 to-blue-900",
  },
  {
    id: 9,
    name: "Smartwatch W68+ Completo com Chamadas, Fotos e NFC – Resistente à Água",
    originalPrice: 165.0,
    currentPrice: 124.0,
    discount: 25,
    installments: 12,
    installmentPrice: 12.57,
    category: "Smartwatches",
    gradient: "from-sky-900 to-indigo-900",
  },
];

export const bestSellers: Product[] = [
  {
    id: 10,
    name: "Suportes de Parede para Jogos – Organize Seus Consoles com Estilo",
    currentPrice: 121.5,
    installments: 12,
    installmentPrice: 12.31,
    category: "Acessórios",
    gradient: "from-gray-800 to-zinc-900",
  },
  {
    id: 11,
    name: "Mouse MO308: Desempenho Confiável em um Design Leve",
    currentPrice: 64.9,
    installments: 12,
    installmentPrice: 6.58,
    category: "Acessórios PC",
    gradient: "from-slate-800 to-gray-900",
  },
  {
    id: 12,
    name: "Webcam GT953: Clareza e Desempenho para Comunicações Online",
    currentPrice: 58.5,
    installments: 12,
    installmentPrice: 5.93,
    category: "Acessórios PC",
    gradient: "from-indigo-900 to-slate-900",
  },
  {
    id: 13,
    name: "Microfone GXT 210: Áudio Imersivo para Experiência Gamer",
    currentPrice: 146.9,
    installments: 12,
    installmentPrice: 14.89,
    category: "Acessórios PC",
    gradient: "from-red-900 to-rose-900",
  },
  {
    id: 14,
    name: "Caixa de Som G-Speaker – Portátil, Bluetooth, 10W",
    currentPrice: 83.5,
    installments: 12,
    installmentPrice: 8.46,
    category: "Caixas de Som",
    gradient: "from-purple-900 to-violet-900",
  },
  {
    id: 15,
    name: "Caixa de Som Aca600 – Bluetooth, 600W, LED e Portabilidade",
    currentPrice: 956.9,
    installments: 12,
    installmentPrice: 96.97,
    category: "Caixas de Som",
    gradient: "from-amber-900 to-orange-900",
  },
  {
    id: 16,
    name: "Caixa de Som AL-3031 – Bluetooth, 3W, Portátil e Recarregável",
    currentPrice: 47.9,
    installments: 12,
    installmentPrice: 4.85,
    category: "Caixas de Som",
    gradient: "from-teal-900 to-cyan-900",
  },
  {
    id: 17,
    name: "Controle Mini Teclado Universal Smart TV PC",
    currentPrice: 56.5,
    installments: 12,
    installmentPrice: 5.73,
    category: "Acessórios PC",
    gradient: "from-zinc-800 to-neutral-900",
  },
  {
    id: 18,
    name: "Hub 303: Expanda suas Conexões com Eficiência e Velocidade",
    currentPrice: 41.9,
    installments: 12,
    installmentPrice: 4.25,
    category: "Acessórios PC",
    gradient: "from-blue-900 to-sky-900",
  },
];