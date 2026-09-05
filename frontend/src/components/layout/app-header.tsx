import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/auth-context";
import { cn } from "../../lib/cn";
import { Avatar } from "../ui/avatar";
import { Logo } from "../ui/logo";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard" },
  { to: "/transactions", label: "Transações" },
  { to: "/categories", label: "Categorias" },
];

/** Navegação das telas autenticadas. O item ativo fica verde, como no Figma. */
export function AppHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6">
        <Logo className="h-8" />

        <nav className="flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-base transition-colors",
                  isActive
                    ? "font-semibold text-brand-base"
                    : "text-gray-600 hover:text-gray-800",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => navigate("/profile")}
          aria-label="Abrir perfil"
          className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base"
        >
          <Avatar name={user?.name ?? ""} imageUrl={user?.avatarDataUrl} />
        </button>
      </div>
    </header>
  );
}
