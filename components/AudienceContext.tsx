"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

/** op = venue/organization, al = individual (allergy), in = insurer/MGA */
export type Audience = "op" | "al" | "in";

type Ctx = {
  audience: Audience;
  /** instant: skip the panel crossfade (used when jumping to the form from elsewhere on the page) */
  setAudience: (a: Audience, opts?: { instant?: boolean }) => void;
  instantRef: React.MutableRefObject<boolean>;
};

const AudienceCtx = createContext<Ctx | null>(null);

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audience, setAud] = useState<Audience>("op");
  const instantRef = useRef(false);
  const setAudience = useCallback((a: Audience, opts?: { instant?: boolean }) => {
    instantRef.current = !!opts?.instant;
    setAud(a);
  }, []);
  return <AudienceCtx.Provider value={{ audience, setAudience, instantRef }}>{children}</AudienceCtx.Provider>;
}

export function useAudience() {
  const ctx = useContext(AudienceCtx);
  if (!ctx) throw new Error("useAudience must be used inside <AudienceProvider>");
  return ctx;
}

/** A link that jumps to the form and preselects an audience tab. */
export function AudienceLink({
  audience,
  className,
  style,
  children,
}: {
  audience: Audience;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  const { setAudience } = useAudience();
  return (
    <a href="#join" className={className} style={style} onClick={() => setAudience(audience, { instant: true })}>
      {children}
    </a>
  );
}
