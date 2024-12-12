import classNames from "classnames";
import React from "react";
import Icon from "./Icon";

interface SelectInputProps<
    T extends string | number | readonly string[] | undefined
> extends React.SelectHTMLAttributes<HTMLSelectElement> {
    value: T;
    options: Array<{ label: string; value: T }>;
    placeholder?: string;
}

const SelectInput = <
    T extends string | number | readonly string[] | undefined
>({
    value,
    options,
    onChange,
    placeholder = "Select Option",
    className,
    ...rest
}: SelectInputProps<T>) => {
    return (
        <div className={classNames(className, "mt-1 relative rounded-md shadow-sm")}>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Icon name="ChevronDown" size={20} color="gray" />
            </div>
            <select
                value={value}
                onChange={onChange}
                className={classNames(
                    "select-input appearance-none block w-full raised-small bg-gray-200",
                    "pl-4 pr-8 py-3.5 border-none",
                    "rounded-lg shadow-sm placeholder-gray-400",
                    "focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                    "sm:text-sm transition duration-150 ease-in-out"
                )}
                {...rest}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value?.toString()} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectInput;
