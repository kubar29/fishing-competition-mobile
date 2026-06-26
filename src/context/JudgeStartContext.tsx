import { createContext, useContext, useState } from 'react';

import { Start } from '../types/start';

type JudgeStartContextType = {
  starts: Start[];
  setStarts: React.Dispatch<React.SetStateAction<Start[]>>;

  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
};

const JudgeStartContext = createContext<JudgeStartContextType | undefined>(
  undefined
);

export function JudgeStartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [starts, setStarts] = useState<Start[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <JudgeStartContext.Provider
      value={{
        starts,
        setStarts,
        currentIndex,
        setCurrentIndex,
      }}
    >
      {children}
    </JudgeStartContext.Provider>
  );
}

export function useJudgeStart() {
  const context = useContext(JudgeStartContext);

  if (!context) {
    throw new Error(
      'useJudgeStart musi być wewnątrz JudgeStartProvider'
    );
  }

  return context;
}