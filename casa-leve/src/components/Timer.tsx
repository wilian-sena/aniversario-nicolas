'use client';

import { useCallback, useEffect, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import {
  createTimer,
  pauseTimer,
  resetTimer,
  startTimer,
  tickTimer,
  timerProgress,
  type TimerState,
} from '@/domain/timer';
import { Button } from '@/components/ui/Button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { formatDuration } from '@/lib/date';
import { celebrate } from '@/lib/feedback';
import { useApp } from '@/store/AppState';

export function Timer({
  minutes,
  startLabel,
  doneMessage,
  onDone,
  doneAction,
}: {
  minutes: number;
  startLabel: string;
  doneMessage: string;
  onDone?: () => void;
  doneAction?: { label: string; onClick: () => void };
}) {
  const { snapshot } = useApp();
  const [timer, setTimer] = useState<TimerState>(() => createTimer(minutes));

  useEffect(() => {
    setTimer(createTimer(minutes));
  }, [minutes]);

  useEffect(() => {
    if (!timer.running) return;
    const id = window.setInterval(() => setTimer((current) => tickTimer(current)), 1000);
    return () => window.clearInterval(id);
  }, [timer.running]);

  const finished = timer.finished;
  useEffect(() => {
    if (!finished) return;
    celebrate(snapshot.settings.soundEnabled);
    onDone?.();
  }, [finished, onDone, snapshot.settings.soundEnabled]);

  const toggle = useCallback(() => {
    setTimer((current) => (current.running ? pauseTimer(current) : startTimer(current)));
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <ProgressRing
        progress={timerProgress(timer)}
        label={formatDuration(timer.remaining)}
        sublabel={timer.finished ? 'Terminado' : `${minutes} minutos`}
        size={168}
        stroke={10}
      />

      <div
        role="status"
        aria-live="polite"
        className="min-h-[24px] text-center text-sm font-medium text-navy-700"
      >
        {timer.finished ? doneMessage : null}
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        {timer.finished && doneAction ? (
          <Button size="lg" className="w-full sm:w-auto" onClick={doneAction.onClick}>
            {doneAction.label}
          </Button>
        ) : (
          <Button size="lg" className="w-full sm:w-auto" onClick={toggle}>
            {timer.running ? (
              <>
                <Pause className="h-4 w-4" aria-hidden="true" /> Pausar
              </>
            ) : (
              <>
                <Play className="h-4 w-4" aria-hidden="true" /> {startLabel}
              </>
            )}
          </Button>
        )}
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => setTimer((current) => resetTimer(current))}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Recomeçar
        </Button>
      </div>
    </div>
  );
}
