'use client';

import { useState } from 'react';

export function useAILoad(steps: string[], totalMs = 2400) {
  const [active, setActive] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const stepMs = totalMs / steps.length;

  const start = (onDone?: () => void) => {
    setActive(true);
    setStepIdx(0);
    let i = 0;
    const tick = () => {
      i++;
      if (i < steps.length) {
        setStepIdx(i);
        setTimeout(tick, stepMs);
      } else {
        setTimeout(() => {
          setActive(false);
          onDone?.();
        }, stepMs);
      }
    };
    setTimeout(tick, stepMs);
  };

  const reset = () => {
    setActive(false);
    setStepIdx(0);
  };

  return { active, stepIdx, start, reset };
}
