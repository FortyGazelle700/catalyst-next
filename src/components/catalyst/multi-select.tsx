"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

type Option =
  | {
      type: "option";
      render: React.ReactNode;
      value: string;
      checked?: boolean;
      onSelect?: () => void;
    }
  | {
      type: "separator";
    };

interface ISelectProps {
  render: React.ReactNode;
  options: Option[];
  selectedOptions: string[];
  setSelectedOptions: Dispatch<SetStateAction<string[]>>;
  custom?: boolean;
}
const MultiSelect = ({
  render,
  options: values,
  selectedOptions: selectedItems,
  setSelectedOptions: setSelectedItems,
  custom,
}: ISelectProps) => {
  const handleSelectChange = (value: string) => {
    if (!selectedItems.includes(value)) {
      setSelectedItems((prev) => [...prev, value]);
    } else {
      const referencedArray = [...selectedItems];
      const indexOfItemToBeRemoved = referencedArray.indexOf(value);
      referencedArray.splice(indexOfItemToBeRemoved, 1);
      setSelectedItems(referencedArray);
    }
  };

  const isOptionSelected = (value: string): boolean => {
    return selectedItems.includes(value) ? true : false;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="w-full">
          {custom ? (
            <button className="w-full flex items-center justify-between">
              <div>{render}</div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
          ) : (
            <Button
              variant="outline"
              className="w-full flex items-center justify-between"
            >
              <div>{render}</div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {values.map((value: ISelectProps["options"][0], index: number) =>
            value.type == "separator" ? (
              <>
                <div key={index} className="h-0.5 bg-secondary mx-4 my-2" />
              </>
            ) : (
              <DropdownMenuCheckboxItem
                // onSelect={(e) => e.preventDefault()}
                key={index}
                checked={value.checked ?? isOptionSelected(value.value)}
                onCheckedChange={() => {
                  handleSelectChange(value.value);
                  value.onSelect?.();
                }}
              >
                {value.render}
              </DropdownMenuCheckboxItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MultiSelect;
