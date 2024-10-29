"use client";

// AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Defina o tipo dos dados do usuário
interface UserData {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  avatar_url: string;
  token?: string;
}

// Defina o tipo das propriedades do contexto
interface AuthContextProps {
  user: UserData | null;
  setUser: (userData: UserData) => void;
  logout: () => void;
}

// Inicialize o contexto com valor undefined
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Crie o Provider para o contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);

  // Carregue os dados do usuário do localStorage ao montar o componente
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Função para definir o usuário e salvar no localStorage
  const handleSetUser = (userData: UserData) => {
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
  };

  // Função de logout para limpar o contexto e o localStorage
  const logout = () => {
    localStorage.removeItem("userData");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Crie um hook para facilitar o uso do contexto
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
