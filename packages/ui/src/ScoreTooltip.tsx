'use client';
import { useState } from 'react';

interface Breakdown {
  ingredients: number;
  dosing: number;
  transparency: number;
  value: number;
  trust: number;
}

interface Props {
  score: number;
  breakdown: Breakdown;
}

export default function ScoreTooltip({ score, breakdown }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="font-bold text-green-700 cursor-help border-b border-dashed border-green-700"
        aria-label={`Score ${score} out of 10 — tap or hover for breakdown`}
        aria-expanded={open}
      >
        {score}/10
      </button>
      {open && (
        <div className="absolute z-20 bottom-full left-0 mb-2 bg-white border border-gray-200 shadow-lg rounded p-3 w-52 text-xs">
          <div className="font-bold text-gray-700 mb-2">Score breakdown</div>
          {(Object.entries(breakdown) as [string, number][]).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 mb-1">
              <span className="w-24 capitalize text-gray-500">{key}</span>
              <div className="score-bar flex-1">
                <div className="score-bar-fill" style={{ width: `${val * 10}%` }} />
              </div>
              <span className="w-4 text-right font-semibold text-gray-700">{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
