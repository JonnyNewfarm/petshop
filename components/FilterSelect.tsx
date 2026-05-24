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
  index?: string;
};

export default function FilterSelect({
  label,
  value,
  options,
  onValueChange,
  placeholder,
  index = "01",
}: FilterSelectProps) {
  const selectedLabel =
    options.find((option) => option.value === value)?.label ||
    placeholder ||
    `Select ${label}`;

  return (
    <div className="group">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.24em] text-black/40">
          {label}
        </p>

        <span className="text-[10px] uppercase tracking-[0.22em] text-black/30">
          {index}
        </span>
      </div>

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className="
            relative h-auto min-h-[86px] w-full overflow-hidden rounded-none
            border-0 border-b border-black/20 bg-transparent px-0 py-4
            text-left shadow-none outline-none ring-0 ring-offset-0
            transition duration-300
            hover:border-black
            focus:ring-0 focus:ring-offset-0
            data-[placeholder]:text-black/35
            [&>svg]:hidden
          "
        >
          <div
            className="
              pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left
              scale-x-0 bg-black transition-transform duration-500
              group-hover:scale-x-100
            "
          />

          <div className="flex w-full items-end justify-between gap-6">
            <div className="min-w-0">
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-black/35">
                Selected
              </p>

              <p
                className="
                  truncate text-[clamp(1.6rem,3.2vw,2.6rem)]
                  uppercase  tracking-[-0.01em]
                  text-black
                "
              >
                <SelectValue placeholder={placeholder || `Select ${label}`} />
              </p>
            </div>

            <div
              className="
                mb-1 flex h-9 w-9 shrink-0 items-center justify-center
                border border-black/20 transition duration-300
                group-hover:border-black group-hover:bg-black group-hover:text-[#f6f1e8]
              "
            >
              <ChevronDown className="h-4 w-4 transition duration-300 group-data-[state=open]:rotate-180" />
            </div>
          </div>
        </SelectTrigger>

        <SelectContent
          position="popper"
          sideOffset={10}
          align="start"
          className="
            z-50 min-w-[var(--radix-select-trigger-width)]
            rounded-none border border-black bg-[#dddad5]
            p-0 text-black shadow-none
            [&_*]:rounded-none
          "
        >
          <div className="border-b border-black px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.24em] text-black/45">
              Choose {label}
            </p>
          </div>

          <SelectGroup>
            {options.map((option, optionIndex) => (
              <SelectItem
                key={option.value || "empty"}
                value={option.value}
                className="
                  group/item relative cursor-pointer border-b border-black/10
                  px-4 py-4 pr-12 uppercase tracking-[0.18em]
                  text-black outline-none transition
                  last:border-b-0

                  data-[highlighted]:bg-black
                  data-[highlighted]:text-[#f6f1e8]

                  data-[state=checked]:bg-black
                  data-[state=checked]:text-[#f6f1e8]

                  focus:bg-black
                  focus:text-[#f6f1e8]

                  [&_*]:text-inherit
                  [&_[data-radix-select-item-indicator]]:text-inherit
                  [&>span]:text-inherit
                "
              >
                <div className="flex items-center justify-between gap-5">
                  <span className="text-[10px] opacity-45">
                    {String(optionIndex + 1).padStart(2, "0")}
                  </span>

                  <span className="mr-auto text-[12px] font-medium text-inherit">
                    {option.label}
                  </span>

                  {selectedLabel === option.label && (
                    <Check className="h-4 w-4 text-inherit" />
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
