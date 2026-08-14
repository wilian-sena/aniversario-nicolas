import { describe, expect, it } from 'vitest';
import {
  createTimer,
  pauseTimer,
  resetTimer,
  startTimer,
  tickTimer,
  timerProgress,
} from '@/domain/timer';

describe('temporizador', () => {
  it('começa parado com a duração completa', () => {
    const timer = createTimer(15);
    expect(timer.total).toBe(900);
    expect(timer.remaining).toBe(900);
    expect(timer.running).toBe(false);
  });

  it('só conta quando está a correr', () => {
    let timer = createTimer(1);
    timer = tickTimer(timer);
    expect(timer.remaining).toBe(60);
    timer = startTimer(timer);
    timer = tickTimer(timer);
    expect(timer.remaining).toBe(59);
  });

  it('pára sozinho no fim e marca como terminado', () => {
    let timer = startTimer(createTimer(1));
    timer = tickTimer(timer, 59);
    expect(timer.finished).toBe(false);
    timer = tickTimer(timer, 1);
    expect(timer.remaining).toBe(0);
    expect(timer.running).toBe(false);
    expect(timer.finished).toBe(true);
  });

  it('nunca fica negativo', () => {
    let timer = startTimer(createTimer(1));
    timer = tickTimer(timer, 999);
    expect(timer.remaining).toBe(0);
  });

  it('pausa e retoma sem perder o tempo decorrido', () => {
    let timer = startTimer(createTimer(10));
    timer = tickTimer(timer, 120);
    timer = pauseTimer(timer);
    expect(timer.remaining).toBe(480);
    timer = startTimer(timer);
    expect(timer.remaining).toBe(480);
  });

  it('recomeça do zero quando é reiniciado', () => {
    let timer = startTimer(createTimer(10));
    timer = tickTimer(timer, 300);
    timer = resetTimer(timer);
    expect(timer.remaining).toBe(600);
    expect(timer.finished).toBe(false);
  });

  it('reinicia ao arrancar depois de terminado', () => {
    let timer = startTimer(createTimer(1));
    timer = tickTimer(timer, 60);
    timer = startTimer(timer);
    expect(timer.remaining).toBe(60);
    expect(timer.finished).toBe(false);
  });

  it('calcula o progresso entre 0 e 1', () => {
    let timer = startTimer(createTimer(10));
    expect(timerProgress(timer)).toBe(0);
    timer = tickTimer(timer, 300);
    expect(timerProgress(timer)).toBeCloseTo(0.5);
  });
});
