import React from 'react';

interface TickerProps {
  borderStyle: string;
}

export const Ticker: React.FC<TickerProps> = ({ borderStyle }) => {
  return (
    <div className={`h-10 border-b-2 flex items-center overflow-hidden z-[60] bg-black text-white ${borderStyle}`} role="status">
      <div className="whitespace-nowrap flex items-center gap-16 animate-marquee">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-6">
            <span className="text-[#00FF7F]">// MY TV STAR STUDIO</span>
            <span>$5.00 REWARD / 10 MINS</span>
            <span className="text-[#FF0080]">COMPLETE CHARACTER CUSTOMIZATION</span>
            <span>MULTI-CURRENCY & CORPORATE GRANTS</span>
            <span className="text-yellow-400">AGE 3+ PARENTAL CONTROL SAFE</span>
          </span>
        ))}
      </div>
    </div>
  );
};
