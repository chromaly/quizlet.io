import { useEffect, useId, useRef, useState } from "react";

type DropdownValue = string | number;

type DropdownOption<T extends DropdownValue> = {
  value: T;
  label: string;
};

type CustomDropdownProps<T extends DropdownValue> = {
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
};

export function CustomDropdown<T extends DropdownValue>({
  label,
  value,
  options,
  onChange,
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        event.target instanceof Node &&
        !dropdownRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      <p id={`${menuId}-label`} className="mb-1 text-sm font-medium">
        {label}
      </p>

      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-labelledby={`${menuId}-label`}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
        className="w-full rounded-lg border border-divider/10 bg-bg/30 px-3 py-2 text-left text-text"
      >
        {selectedOption?.label ?? "Select…"}
      </button>

      {isOpen && (
        <ul
          id={menuId}
          className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-accent-2/40 bg-surface shadow-lg"
        >
          {options.map((option) => (
            <li key={String(option.value)}>
              <button
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-accent-1/20"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}