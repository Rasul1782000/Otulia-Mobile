import { createContext, useContext } from 'react';

const LucideContext = createContext({
  size: 24,
  color: "currentColor",
  strokeWidth: 2,
  absoluteStrokeWidth: false,
});

const LucideProvider = LucideContext.Provider;
const useLucideContext = () => useContext(LucideContext);

export { LucideProvider, useLucideContext };
