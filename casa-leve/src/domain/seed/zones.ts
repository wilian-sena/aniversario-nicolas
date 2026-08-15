import type { Zone } from '@/domain/types';

const mission = (id: string, title: string) => ({ id, title });

export const ZONES: Zone[] = [
  {
    id: 1,
    name: 'Entrada, corredor e sala de jantar',
    shortName: 'Entrada e corredor',
    icon: '🚪',
    missions: [
      mission('z1-sapatos', 'Organizar sapatos'),
      mission('z1-casacos', 'Organizar casacos'),
      mission('z1-mesa', 'Desocupar a mesa de jantar'),
      mission('z1-interruptores', 'Limpar interruptores'),
      mission('z1-portas', 'Limpar portas'),
      mission('z1-papeis', 'Organizar papéis acumulados'),
      mission('z1-rodapes', 'Limpar rodapés do corredor'),
      mission('z1-movel', 'Organizar um móvel'),
      mission('z1-gaveta', 'Organizar uma gaveta'),
    ],
  },
  {
    id: 2,
    name: 'Cozinha, lavandaria e armazenamento',
    shortName: 'Cozinha e lavandaria',
    icon: '🍳',
    missions: [
      mission('z2-gaveta', 'Organizar uma gaveta'),
      mission('z2-prateleira', 'Organizar uma prateleira'),
      mission('z2-validade', 'Rever produtos fora de validade'),
      mission('z2-frigorifico', 'Limpar uma parte do frigorífico'),
      mission('z2-detergentes', 'Organizar detergentes'),
      mission('z2-embalagens', 'Retirar embalagens vazias'),
      mission('z2-armazenamento', 'Organizar armazenamento'),
      mission('z2-lavandaria', 'Limpar uma pequena área da lavandaria'),
    ],
  },
  {
    id: 3,
    name: 'Casa de banho e quarto do Nicolas',
    shortName: 'Casa de banho e quarto',
    icon: '🛁',
    missions: [
      mission('z3-brinquedos', 'Organizar brinquedos'),
      mission('z3-gaveta', 'Organizar uma gaveta'),
      mission('z3-cama', 'Limpar debaixo da cama'),
      mission('z3-roupa', 'Separar roupa pequena'),
      mission('z3-produtos', 'Rever produtos da casa de banho'),
      mission('z3-embalagens', 'Retirar embalagens vazias'),
      mission('z3-quarto', 'Organizar uma pequena área do quarto'),
    ],
  },
  {
    id: 4,
    name: 'Suíte do casal e varanda',
    shortName: 'Suíte e varanda',
    icon: '🛏️',
    missions: [
      mission('z4-cabeceiras', 'Organizar mesas de cabeceira'),
      mission('z4-roupa', 'Retirar roupa acumulada'),
      mission('z4-guarda-roupa', 'Organizar uma parte do guarda-roupa'),
      mission('z4-cama', 'Limpar debaixo da cama'),
      mission('z4-documentos', 'Organizar documentos'),
      mission('z4-varrer', 'Varrer a varanda'),
      mission('z4-janela', 'Limpar uma janela'),
      mission('z4-porta', 'Limpar a porta da varanda'),
    ],
  },
  {
    id: 5,
    name: 'Sala de estar e varanda principal',
    shortName: 'Sala de estar',
    icon: '🛋️',
    missions: [
      mission('z5-sofa', 'Organizar o sofá'),
      mission('z5-mantas', 'Organizar mantas'),
      mission('z5-almofadas', 'Organizar almofadas'),
      mission('z5-tv', 'Limpar o móvel da televisão'),
      mission('z5-objetos', 'Recolher objetos fora do lugar'),
      mission('z5-comandos', 'Organizar comandos'),
      mission('z5-cabos', 'Organizar cabos'),
      mission('z5-varrer', 'Varrer a varanda'),
      mission('z5-varanda', 'Limpar a varanda'),
    ],
  },
];

export const ZONE_COUNT = ZONES.length;
