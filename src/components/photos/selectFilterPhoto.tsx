import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectFilterProps {
    label: string;
    options: string[];
    value: string | undefined;
    onChange: (val: string | undefined) => void;
}

export const SelectFilterPhoto: React.FC<SelectFilterProps> = ({ label, options, value, onChange }) => {

    return (
        <div className="flex flex-col">
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={`Select ${label}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}