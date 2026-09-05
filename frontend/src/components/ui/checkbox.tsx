import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { useId } from "react";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Checkbox({ label, checked, onCheckedChange }: CheckboxProps) {
  const id = useId();

  return (
    <div className="flex items-center gap-2">
      <RadixCheckbox.Root
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        className="flex size-5 items-center justify-center rounded border border-gray-300 bg-white
                   transition-colors data-[state=checked]:border-brand-base data-[state=checked]:bg-brand-base
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base"
      >
        <RadixCheckbox.Indicator>
          <Check className="size-3.5 text-white" strokeWidth={3} />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>

      <label htmlFor={id} className="cursor-pointer text-sm text-gray-700 select-none">
        {label}
      </label>
    </div>
  );
}
