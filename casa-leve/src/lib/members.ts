import type { FamilyMember, MemberColor, MemberId } from '@/domain/types';
import { FAMILY, SHARED } from '@/domain/seed/family';

export interface MemberTheme {
  /** Fundo suave do cartao. */
  soft: string;
  /** Texto forte. */
  text: string;
  /** Barra/ponto de cor. */
  dot: string;
  /** Botao cheio. */
  solid: string;
  border: string;
  ring: string;
}

// Classes estaticas: o Tailwind precisa de as ver no codigo.
const THEMES: Record<MemberColor | 'familia', MemberTheme> = {
  wilian: {
    soft: 'bg-wilian-soft',
    text: 'text-wilian-strong',
    dot: 'bg-wilian',
    solid: 'bg-wilian text-white',
    border: 'border-wilian/25',
    ring: 'ring-wilian/30',
  },
  ana: {
    soft: 'bg-ana-soft',
    text: 'text-ana-strong',
    dot: 'bg-ana',
    solid: 'bg-ana text-white',
    border: 'border-ana/25',
    ring: 'ring-ana/30',
  },
  nicolas: {
    soft: 'bg-nicolas-soft',
    text: 'text-nicolas-strong',
    dot: 'bg-nicolas',
    solid: 'bg-nicolas text-white',
    border: 'border-nicolas/25',
    ring: 'ring-nicolas/30',
  },
  familia: {
    soft: 'bg-lavanda-soft',
    text: 'text-lavanda',
    dot: 'bg-lavanda',
    solid: 'bg-lavanda text-white',
    border: 'border-lavanda/25',
    ring: 'ring-lavanda/30',
  },
};

export const SHARED_MEMBER: FamilyMember = {
  id: SHARED,
  name: 'Todos',
  color: 'wilian',
  isChild: false,
  responsibilities: [],
};

export function getMember(id: MemberId, family: FamilyMember[] = FAMILY): FamilyMember {
  if (id === SHARED) return SHARED_MEMBER;
  return family.find((m) => m.id === id) ?? SHARED_MEMBER;
}

export function memberTheme(id: MemberId, family: FamilyMember[] = FAMILY): MemberTheme {
  if (id === SHARED) return THEMES.familia;
  const member = family.find((m) => m.id === id);
  return THEMES[member?.color ?? 'wilian'];
}

export function memberName(id: MemberId, family: FamilyMember[] = FAMILY): string {
  return getMember(id, family).name;
}

export function initials(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}
