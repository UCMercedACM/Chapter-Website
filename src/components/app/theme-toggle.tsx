import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useCallback } from "react";

import { useTheme } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light" | "system";

interface ThemeOption {
  value: Theme;
  label: string;
  Icon: LucideIcon;
}

const OPTIONS: ThemeOption[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "system", label: "System", Icon: Monitor },
  { value: "dark", label: "Dark", Icon: Moon },
];

interface ThemeButtonProps {
  option: ThemeOption;
  active: boolean;
  setTheme: (theme: Theme) => void;
}

function ThemeButton({ option, active, setTheme }: Readonly<ThemeButtonProps>) {
  const { value, label, Icon } = option;
  const onClick = useCallback(() => {
    setTheme(value);
  }, [value, setTheme]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        "flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-3.5" />
    </button>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <fieldset
      aria-label="Theme"
      className="inline-flex items-center gap-0.5 rounded-full border border-border bg-background/40 p-0.5"
    >
      {OPTIONS.map((option) => (
        <ThemeButton
          key={option.value}
          option={option}
          active={theme === option.value}
          setTheme={setTheme}
        />
      ))}
    </fieldset>
  );
}
