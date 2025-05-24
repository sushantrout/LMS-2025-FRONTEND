import React, { useState, useEffect } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface MultiSelectProps<T> {
  options: T[];
  values?: T[];
  optionLabel: keyof T;
  optionValue: keyof T;
  placeholder?: string;
  onChange?: (values: T[]) => void;
}

export function MultiSelect<T>({
  options,
  values = [],
  optionLabel,
  optionValue,
  placeholder = "Select...",
  onChange
}: MultiSelectProps<T>) {
  const [selected, setSelected] = useState<T[]>(values);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (JSON.stringify(values) !== JSON.stringify(selected)) {
      setSelected(values);
    }
  }, [values]);

  const getLabel = (item: T) => String(item[optionLabel]);
  const getValue = (item: T) => String(item[optionValue]);

  const handleSelect = (option: T) => {
    const exists = selected.find((item) => getValue(item) === getValue(option));
    const updated = exists
      ? selected.filter((item) => getValue(item) !== getValue(option))
      : [...selected, option];

    setSelected(updated);
    onChange?.(updated);
  };

  const handleRemove = (value: string) => {
    const updated = selected.filter((item) => getValue(item) !== value);
    setSelected(updated);
    onChange?.(updated);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start flex-wrap">
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.map((item) => (
                <Badge key={getValue(item)} className="flex items-center gap-1">
                  {getLabel(item)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(getValue(item));
                    }}
                  />
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            {options.map((option) => {
              const isSelected = selected.some((item) => getValue(item) === getValue(option));
              return (
                <CommandItem
                  key={getValue(option)}
                  onSelect={() => handleSelect(option)}
                  className="flex items-center gap-2"
                >
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                  {!isSelected && <span className="h-4 w-4" />} {/* keeps alignment */}
                  {getLabel(option)}
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
