"use client";

import React from "react";
import { Check, X, MessageSquare } from "lucide-react";

interface SharkAvatarProps {
  index: number;
  isActive?: boolean;
  isConvinced?: boolean;
  isRejected?: boolean;
  size?: number;
}

export const SharkAvatar: React.FC<SharkAvatarProps> = ({
  index,
  isActive = false,
  isConvinced = false,
  isRejected = false,
  size = 64,
}) => {
  // Border & Accent logic based on state
  let ringColor = "border-slate-700/60 bg-slate-900/60";
  let badgeElement: React.ReactNode = null;

  if (isConvinced) {
    ringColor = "border-emerald-500 bg-emerald-950/30";
    badgeElement = <Check size={10} strokeWidth={3} className="text-emerald-400" />;
  } else if (isRejected) {
    ringColor = "border-rose-500 bg-rose-950/30";
    badgeElement = <X size={10} strokeWidth={3} className="text-rose-400" />;
  } else if (isActive) {
    ringColor = "border-amber-400 bg-amber-950/30 ring-2 ring-amber-400/30";
    badgeElement = <MessageSquare size={9} strokeWidth={2.5} className="text-amber-400" />;
  }

  return (
    <div
      className={`relative rounded-2xl border-2 flex items-center justify-center transition-all duration-300 select-none overflow-hidden ${ringColor}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1"
      >
        {/* CHARACTER 1: ARTHUR VANCE / HALIS BEY (CFO Penny-Pincher) */}
        {index === 1 && (
          <g>
            {/* Background disc */}
            <circle cx="50" cy="50" r="44" fill={isConvinced ? "#064e3b" : isRejected ? "#4c0519" : "#1e293b"} />
            {/* Shoulders & Suspenders */}
            <path d="M20 92 C20 70 32 64 50 64 C68 64 80 70 80 92 Z" fill="#334155" />
            <path d="M30 66 L30 92" stroke="#f59e0b" strokeWidth="4" />
            <path d="M70 66 L70 92" stroke="#f59e0b" strokeWidth="4" />
            <path d="M44 65 L50 74 L56 65 Z" fill="#f8fafc" />
            <path d="M47 73 L53 73 L51 90 L49 90 Z" fill="#991b1b" />

            {/* Head & Neck */}
            <rect x="42" y="55" width="16" height="14" rx="4" fill="#fcd34d" />
            <circle cx="50" cy="40" r="22" fill="#fde68a" />

            {/* Hair (Balding sides) */}
            <path d="M28 42 C26 30 32 20 40 19 C35 24 35 32 32 44 Z" fill="#94a3b8" />
            <path d="M72 42 C74 30 68 20 60 19 C65 24 65 32 68 44 Z" fill="#94a3b8" />

            {/* Spectacles */}
            <circle cx="41" cy="38" r="6" stroke="#d97706" strokeWidth="2.5" fill="#ffffff" fillOpacity="0.1" />
            <circle cx="59" cy="38" r="6" stroke="#d97706" strokeWidth="2.5" fill="#ffffff" fillOpacity="0.1" />
            <path d="M47 38 L53 38" stroke="#d97706" strokeWidth="2.5" />
            {/* Eyeballs */}
            <circle cx={isRejected ? 42 : isConvinced ? 42 : 40} cy="38" r="2" fill="#0f172a" />
            <circle cx={isRejected ? 58 : isConvinced ? 58 : 60} cy="38" r="2" fill="#0f172a" />

            {/* Eyebrows */}
            {isRejected ? (
              <>
                <path d="M36 31 L46 34" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M64 31 L54 34" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : isConvinced ? (
              <>
                <path d="M35 30 Q41 27 47 31" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M65 30 Q59 27 53 31" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M35 32 L46 30" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M65 32 L54 34" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}

            {/* Bushy Mustache */}
            <path d="M38 48 Q50 44 62 48 Q56 55 50 51 Q44 55 38 48 Z" fill="#64748b" />

            {/* Mouth / Cigar */}
            {isRejected ? (
              <path d="M44 55 Q50 53 56 55" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
            ) : isConvinced ? (
              <path d="M43 54 Q50 59 57 54" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M56 49 L66 46" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
            )}
          </g>
        )}

        {/* CHARACTER 2: MARCUS VANCE / BÜLENT DEMIR (Paranoid CISO) */}
        {index === 2 && (
          <g>
            {/* Background disc */}
            <circle cx="50" cy="50" r="44" fill={isConvinced ? "#064e3b" : isRejected ? "#4c0519" : "#0f172a"} />
            {/* High collar trenchcoat */}
            <path d="M18 92 C18 68 28 62 50 62 C72 62 82 68 82 92 Z" fill="#1e1e24" />
            <path d="M32 64 L46 78 L40 92 Z" fill="#2d3748" />
            <path d="M68 64 L54 78 L60 92 Z" fill="#2d3748" />
            {/* Gold security padlock pin */}
            <rect x="26" y="74" width="7" height="6" rx="1" fill="#f59e0b" />
            <path d="M28 74 V71 C28 69 31 69 31 71 V74" stroke="#f59e0b" strokeWidth="1.5" />

            {/* Head & Neck */}
            <rect x="42" y="52" width="16" height="15" fill="#fed7aa" />
            <path d="M30 42 C30 26 40 20 50 20 C60 20 70 26 70 42 C70 56 60 59 50 59 C40 59 30 56 30 42 Z" fill="#ffedd5" />

            {/* Slicked dark crew cut */}
            <path d="M29 36 C30 22 40 18 50 18 C60 18 70 22 71 36 C66 26 58 24 50 24 C42 24 34 26 29 36 Z" fill="#18181b" />

            {/* Dark Surveillance Sunglasses */}
            <rect x="34" y="34" width="14" height="9" rx="2" fill="#09090b" stroke="#38bdf8" strokeWidth="1" />
            <rect x="52" y="34" width="14" height="9" rx="2" fill="#09090b" stroke="#38bdf8" strokeWidth="1" />
            <path d="M48 37 L52 37" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Lens Glare */}
            <line x1="36" y1="36" x2="42" y2="41" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="54" y1="36" x2="60" y2="41" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />

            {/* Surveillance Earpiece wire */}
            <path d="M69 44 C72 44 73 47 71 52 C70 55 72 63 76 68" stroke="#38bdf8" strokeWidth="1.5" fill="none" strokeDasharray="2 2" />

            {/* Rigid Mouth */}
            {isRejected ? (
              <path d="M42 52 L58 52" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
            ) : isConvinced ? (
              <path d="M43 51 Q50 55 57 51" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M44 51 L56 51" stroke="#52525b" strokeWidth="2" strokeLinecap="round" />
            )}
          </g>
        )}

        {/* CHARACTER 3: SARAH JENKINS / ASLI KARACA (Friction-Phobic Operator) */}
        {index === 3 && (
          <g>
            {/* Background disc */}
            <circle cx="50" cy="50" r="44" fill={isConvinced ? "#064e3b" : isRejected ? "#4c0519" : "#1e1b4b"} />
            {/* Cozy Knit Sweater */}
            <path d="M18 92 C18 68 28 62 50 62 C72 62 82 68 82 92 Z" fill="#6366f1" />
            <path d="M38 62 Q50 72 62 62" stroke="#4f46e5" strokeWidth="4" fill="none" />

            {/* Steaming oversized Coffee Mug on corner */}
            <rect x="62" y="72" width="16" height="18" rx="3" fill="#fbbf24" />
            <path d="M78 76 C82 76 82 84 78 84" stroke="#fbbf24" strokeWidth="2" fill="none" />
            <path d="M67 69 Q69 66 67 63" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M72 70 Q74 67 72 64" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />

            {/* Head & Neck */}
            <rect x="43" y="53" width="14" height="14" fill="#fed7aa" />
            <circle cx="50" cy="41" r="19" fill="#ffedd5" />

            {/* Messy Top-Knot Bun & Hair */}
            <circle cx="50" cy="16" r="10" fill="#78350f" />
            <path d="M31 38 C31 22 41 18 50 18 C59 18 69 22 69 38 C69 44 67 48 68 53 C62 44 60 40 50 36 C40 40 38 44 32 53 C33 48 31 44 31 38 Z" fill="#92400e" />

            {/* Big Acetate Glasses */}
            <rect x="34" y="36" width="13" height="10" rx="3" stroke="#b45309" strokeWidth="2" fill="#ffffff" fillOpacity="0.1" />
            <rect x="53" y="36" width="13" height="10" rx="3" stroke="#b45309" strokeWidth="2" fill="#ffffff" fillOpacity="0.1" />
            <path d="M47 40 L53 40" stroke="#b45309" strokeWidth="2" />

            {/* Tired Eyes / Eye-Bags */}
            <path d="M37 47 Q40 49 44 47" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
            <path d="M56 47 Q59 49 63 47" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
            <circle cx="40" cy="41" r="2" fill="#1e293b" />
            <circle cx="60" cy="41" r="2" fill="#1e293b" />

            {/* Mouth */}
            {isRejected ? (
              <path d="M44 54 Q50 49 56 54" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
            ) : isConvinced ? (
              <path d="M43 51 Q50 57 57 51" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            ) : (
              <path d="M45 52 Q50 54 55 52" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
            )}
          </g>
        )}

        {/* CHARACTER 4: DAVID STERLING / MERT VURAL (Incumbent Loyalist) */}
        {index === 4 && (
          <g>
            {/* Background disc */}
            <circle cx="50" cy="50" r="44" fill={isConvinced ? "#064e3b" : isRejected ? "#4c0519" : "#0c4a6e"} />
            {/* Bespoke Dark Pinstripe Suit */}
            <path d="M18 92 C18 68 28 62 50 62 C72 62 82 68 82 92 Z" fill="#0369a1" />
            <path d="M44 62 L50 75 L56 62 Z" fill="#ffffff" />
            {/* Red Silk Power Tie */}
            <path d="M48 72 L52 72 L54 92 L46 92 Z" fill="#b91c1c" />
            {/* Gold Tie Clip */}
            <line x1="47" y1="80" x2="53" y2="80" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />

            {/* Head & Neck */}
            <rect x="43" y="52" width="14" height="14" fill="#fed7aa" />
            <circle cx="50" cy="38" r="19" fill="#ffedd5" />

            {/* Perfectly Coiffed Side-Part Gray/Black Hair */}
            <path d="M31 34 C31 18 42 16 50 16 C58 16 68 18 69 32 C65 24 55 22 47 22 C37 22 34 26 31 34 Z" fill="#334155" />
            <path d="M31 34 C31 30 35 24 40 22 C35 26 33 30 31 34 Z" fill="#64748b" />

            {/* Confident / Smug Eyes */}
            <line x1="38" y1="36" x2="44" y2="36" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            <line x1="56" y1="36" x2="62" y2="36" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            <circle cx="41" cy="38" r="1.5" fill="#0f172a" />
            <circle cx="59" cy="38" r="1.5" fill="#0f172a" />

            {/* Arched Corporate Eyebrow */}
            <path d="M36 31 Q41 29 46 32" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            <path d="M54 30 Q59 26 64 28" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />

            {/* Mouth */}
            {isRejected ? (
              <path d="M43 51 Q50 46 57 49" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
            ) : isConvinced ? (
              <path d="M43 48 Q50 54 57 49" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            ) : (
              <path d="M44 49 Q51 47 57 50" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            )}
          </g>
        )}

        {/* CHARACTER 5: ELENA GOMEZ / ECE TEZEL (The Hype Tourist) */}
        {index === 5 && (
          <g>
            {/* Background disc */}
            <circle cx="50" cy="50" r="44" fill={isConvinced ? "#064e3b" : isRejected ? "#4c0519" : "#581c87"} />
            {/* Bold Neon-Accented Creator Jacket */}
            <path d="M18 92 C18 68 28 62 50 62 C72 62 82 68 82 92 Z" fill="#c026d3" />
            <path d="M36 64 L45 78 L40 92 Z" fill="#9333ea" />
            <path d="M64 64 L55 78 L60 92 Z" fill="#9333ea" />

            {/* Head & Neck */}
            <rect x="43" y="52" width="14" height="14" fill="#fde047" />
            <circle cx="50" cy="38" r="19" fill="#fef08a" />

            {/* Modern Lavender/Lilac Bob Cut */}
            <path d="M29 36 C29 18 39 16 50 16 C61 16 71 18 71 36 C71 52 69 56 68 58 C66 42 64 30 50 28 C36 30 34 42 32 58 C31 56 29 52 29 36 Z" fill="#a855f7" />

            {/* AirPods Pro in ear */}
            <rect x="28" y="38" width="3" height="6" rx="1.5" fill="#ffffff" />
            <rect x="69" y="38" width="3" height="6" rx="1.5" fill="#ffffff" />

            {/* Cat-eye Trendy Glasses */}
            <path d="M34 33 L46 35 L44 42 L34 38 Z" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="1.5" />
            <path d="M66 33 L54 35 L56 42 L66 38 Z" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="1.5" />
            <line x1="46" y1="36" x2="54" y2="36" stroke="#f43f5e" strokeWidth="1.5" />
            {/* Reflective shine */}
            <line x1="36" y1="35" x2="42" y2="40" stroke="#fbcfe8" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="57" y1="36" x2="63" y2="41" stroke="#fbcfe8" strokeWidth="1.2" strokeLinecap="round" />

            {/* Expressive Mouth */}
            {isRejected ? (
              <path d="M44 52 Q50 48 56 50" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
            ) : isConvinced ? (
              <path d="M43 49 Q50 56 57 49" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            ) : (
              <circle cx="50" cy="50" r="3" fill="#e11d48" />
            )}
          </g>
        )}
      </svg>

      {/* Mini status indicator badge */}
      {badgeElement && (
        <span className="absolute bottom-0.5 right-0.5 w-4 h-4 flex items-center justify-center bg-slate-950 rounded-full shadow border border-slate-700">
          {badgeElement}
        </span>
      )}
    </div>
  );
};
