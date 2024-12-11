import React from "react";
import classNames from "classnames";

import Icon from "./Icon"; 

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: keyof typeof import("lucide-react").icons;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  icon,
  id,
  className,
  ...props
}) => {
  return (
    <div className={classNames("text-input", className)}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 h-0 text-transparent"
      >
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name={icon} size={20} color="gray" />
          </div>
        )}
        <input
          id={id}
          className={classNames(
            "appearance-none block w-full raised-small bg-white",
            "pr-3 py-3.5 border-none",
            "rounded-lg shadow-sm placeholder-gray-400",
            "focus:outline-none focus:ring-blue-500 focus:border-blue-500",
            "sm:text-sm transition duration-150 ease-in-out",
            icon ? "pl-10" : "pl-4"
          )}
          {...props}
        />
      </div>
    </div>
  );
};

export default TextInput;