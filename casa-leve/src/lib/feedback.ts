/** Feedback suave no fim de um temporizador: vibracao e um som curto. */
export function celebrate(sound: boolean): void {
  if (typeof window === 'undefined') return;

  if ('vibrate' in navigator) {
    navigator.vibrate?.([60, 40, 60]);
  }

  if (!sound) return;
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const context = new Ctor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(660, context.currentTime);
    oscillator.frequency.setValueAtTime(880, context.currentTime + 0.16);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.6);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.62);
    oscillator.onended = () => void context.close();
  } catch {
    /* som e sempre opcional */
  }
}
