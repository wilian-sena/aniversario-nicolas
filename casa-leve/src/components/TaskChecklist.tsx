'use client';

import type { ResolvedTask } from '@/domain/types';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { memberName } from '@/lib/members';

export function TaskChecklist({
  tasks,
  onToggle,
  emptyMessage = 'Nada importante agora. Aproveita.',
  showMember = false,
}: {
  tasks: ResolvedTask[];
  onToggle: (task: ResolvedTask) => void;
  emptyMessage?: string;
  showMember?: boolean;
}) {
  if (tasks.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.instanceId}
          task={task}
          onToggle={onToggle}
          showMember={showMember}
          memberName={memberName(task.memberId)}
        />
      ))}
    </ul>
  );
}
