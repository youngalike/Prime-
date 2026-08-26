"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface EditModeContextValue {
  isAdmin: boolean;
  showLogin: boolean;
  openLogin: () => void;
  closeLogin: () => void;
}

const EditModeContext = createContext<EditModeContextValue | null>(null);

export function EditModeProvider({
  isAdmin,
  forceLoginOpen = false,
  children,
}: {
  isAdmin: boolean;
  forceLoginOpen?: boolean;
  children: ReactNode;
}) {
  const [showLogin, setShowLogin] = useState(forceLoginOpen && !isAdmin);

  return (
    <EditModeContext.Provider
      value={{
        isAdmin,
        showLogin,
        openLogin: () => setShowLogin(true),
        closeLogin: () => setShowLogin(false),
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const ctx = useContext(EditModeContext);
  if (!ctx) throw new Error("useEditMode must be used within EditModeProvider");
  return ctx;
}
