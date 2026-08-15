import { FAMILY } from '@/domain/seed/family';
import { MemberDetail } from '@/components/MemberDetail';

export function generateStaticParams() {
  return FAMILY.map((member) => ({ id: member.id }));
}

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MemberDetail memberId={id} />;
}
