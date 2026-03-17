"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  label: string;
  value: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  options: Option[];
  onValueChange: (value: string) => void;
  placeholder?: string;
};

export default function FilterSelect({
  label,
  value,
  options,
  onValueChange,
  placeholder,
}: FilterSelectProps) {
  return (
    <div>
      <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-black/45">
        {label}
      </p>

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className="
            h-auto min-h-[72px] w-full rounded-none border border-black/10
            bg-[#f3efe8] px-4 py-4 text-left shadow-none outline-none
            ring-0 ring-offset-0 transition hover:border-black
            focus:border-black focus:ring-0 focus:ring-offset-0
            data-[placeholder]:text-black/40
            [&>svg]:hidden
          "
        >
          <div className="flex w-full items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
                {label}
              </p>

              <p className="mt-2 truncate text-[1.05rem] uppercase leading-none tracking-[-0.03em]">
                <SelectValue placeholder={placeholder || `Select ${label}`} />
              </p>
            </div>

            <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-black/70" />
          </div>
        </SelectTrigger>

        <SelectContent
          position="popper"
          sideOffset={8}
          className="
            rounded-none border border-black bg-[#ebe5dd] text-black shadow-none
            [&_*]:rounded-none
          "
        >
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option.value || "empty"}
                value={option.value}
                className="
                  border-b border-black/10 px-4 py-3 uppercase tracking-[0.18em]
                  last:border-b-0

                  text-black
                  data-[highlighted]:bg-black
                  data-[highlighted]:text-[#f6f1e8]

                  data-[state=checked]:bg-black
                  data-[state=checked]:text-[#f6f1e8]
                  data-[state=checked]:font-medium

                  focus:bg-black
                  focus:text-[#f6f1e8]

                  [&_*]:text-inherit
                  [&_[data-radix-select-item-indicator]]:text-inherit
                  [&>span]:text-inherit
                "
              >
                <span className="text-[11px] text-inherit">{option.label}</span>
                <Check className="ml-auto h-4 w-4 text-inherit opacity-0 group-data-[state=checked]:opacity-100" />
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
