export interface TimerState {
  /** Duracao total em segundos. */
  total: number;
  remaining: number;
  running: boolean;
  finished: boolean;
}

export function createTimer(minutes: number): TimerState {
  const total = Math.max(1, Math.round(minutes * 60));
  return { total, remaining: total, running: false, finished: false };
}

export function startTimer(state: TimerState): TimerState {
  if (state.finished) return { ...state, remaining: state.total, running: true, finished: false };
  return { ...state, running: true };
}

export function pauseTimer(state: TimerState): TimerState {
  return { ...state, running: false };
}

export function resetTimer(state: TimerState): TimerState {
  return { ...state, remaining: state.total, running: false, finished: false };
}

/** Avanca o temporizador; nunca fica negativo e para sozinho no fim. */
export function tickTimer(state: TimerState, seconds = 1): TimerState {
  if (!state.running || state.finished) return state;
  const remaining = Math.max(0, state.remaining - seconds);
  if (remaining === 0) return { ...state, remaining, running: false, finished: true };
  return { ...state, remaining };
}

export function timerProgress(state: TimerState): number {
  if (state.total === 0) return 1;
  return (state.total - state.remaining) / state.total;
}
