import React, { useState } from 'react';
import type { State } from '../../shared/types';

const states: State[] = ['idle', 'listening', 'thinking', 'speaking'];

export default function StateMachine() {
  const [state, setState] = useState<State>('idle');
  return (
    <div>
      <div>目前狀態：{state}</div>
      {states.map(s => (
        <button key={s} onClick={() => setState(s)} disabled={state === s}>{s}</button>
      ))}
    </div>
  );
}
