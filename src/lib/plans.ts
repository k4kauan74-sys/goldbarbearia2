export type PlanId = 'basico' | 'gold';
export type PlanPeriod = 'semestral';

export interface PlanData {
  id: PlanId;
  name: string;
  badge: string;
  description: string;
  rulesDescription: string;
  monthlyPrice: number;
  priceFormatted: string;
  period: PlanPeriod;
  periodMonths: number;
  days: string;
  daysFull: string;
  scheduleRule: string;
  priorityRule?: string;
  usageLimitRule: string;
  features: string[];
  rulesSummary: string[];
  individualComparison: {
    value: number;
    description: string;
  };
  directPaymentLink: string;
}

export const PLANS: Record<PlanId, PlanData> = {
  basico: {
    id: 'basico',
    name: 'Plano Básico',
    badge: 'Semestral',
    description: 'Perfeito para manter o visual em dia com praticidade',
    rulesDescription:
      'O Plano Básico foi criado para quem deseja manter o visual sempre em dia com praticidade e economia. Ideal para o homem moderno que busca agilidade sem abrir mão da qualidade Gold.',
    monthlyPrice: 69.90,
    priceFormatted: 'R$ 69,90',
    period: 'semestral',
    periodMonths: 6,
    days: 'Terça e quarta',
    daysFull: 'de terça e quarta-feira',
    scheduleRule: 'Atendimento exclusivo por ordem de chegada de terça e quarta-feira.',
    usageLimitRule: 'É permitido apenas 1 serviço por dia por cliente cadastrado no plano.',
    features: [
      'Cortes ilimitados',
      'Terça e quarta',
      'Corte de cabelo',
      'Atendimento ágil'
    ],
    rulesSummary: [
      'Cortes ilimitados',
      'Atendimento de terça e quarta',
      'Somente corte de cabelo',
      'Ordem de chegada',
      'Limite de 1 serviço por dia'
    ],
    individualComparison: {
      value: 180.00,
      description: '4 CORTES AVULSOS'
    },
    directPaymentLink: 'https://invoice.infinitepay.io/plans/thasha_magulas/ANaUkabAIM'
  },
  gold: {
    id: 'gold',
    name: 'Plano Gold',
    badge: 'Elite Semestral',
    description: 'Experiência completa para quem quer sempre estar impecável',
    rulesDescription:
      'O Plano Gold foi desenvolvido para clientes que desejam uma experiência mais completa e com maior comodidade. A elite do cuidado masculino com benefícios exclusivos.',
    monthlyPrice: 145.00,
    priceFormatted: 'R$ 145,00',
    period: 'semestral',
    periodMonths: 6,
    days: 'Terça, quarta e quinta',
    daysFull: 'de terça, quarta e quinta-feira',
    scheduleRule: 'Escolha entre agendar seu horário previamente ou ser atendido por ordem de chegada.',
    priorityRule: 'Atendimento prioritário de terça, quarta e quinta-feira para todos os serviços.',
    usageLimitRule: 'É permitido apenas 1 serviço por dia por cliente cadastrado no plano.',
    features: [
      'Cortes ilimitados',
      'Terça, quarta e quinta',
      'Barba',
      'Sobrancelha',
      'Atendimento prioritário',
      'Desconto em produtos'
    ],
    rulesSummary: [
      'Cortes ilimitados',
      'Atendimento de terça, quarta e quinta',
      'Cabelo, barba e sobrancelha',
      'Atendimento prioritário',
      'Pode agendar horário',
      'Ordem de chegada disponível',
      'Limite de 1 serviço por dia'
    ],
    individualComparison: {
      value: 360.00,
      description: '4 COMBOS COMPLETOS AVULSOS'
    },
    directPaymentLink: 'https://invoice.infinitepay.io/plans/thasha_magulas/Ae3brIQ8bN'
  }
};

export const PLANS_LIST = [PLANS.basico, PLANS.gold];
