import logoFull from "../../assets/logo-full.svg";
import logoSymbol from "../../assets/logo-symbol.svg";

interface LogoProps {
  /** `full` traz símbolo + wordmark; `symbol` apenas a marca. */
  variant?: "full" | "symbol";
  className?: string;
}

export function Logo({ variant = "full", className }: LogoProps) {
  const source = variant === "full" ? logoFull : logoSymbol;

  return <img src={source} alt="Financy" className={className} />;
}
