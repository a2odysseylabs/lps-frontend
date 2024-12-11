import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import classNames from "classnames";
import BaseButton, { BaseButtonTypes } from "./BaseButton";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-primary-foreground hover:bg-blue-400",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type StyledButtonProps = BaseButtonTypes & VariantProps<typeof buttonVariants>;

export const StyledButton: React.FC<StyledButtonProps> = ({
  variant,
  size,
  className,
  ...props
}) => {
  const finalClassName = classNames(
    buttonVariants({ variant, size }),
    className
  );

  return <BaseButton className={finalClassName} {...props} />;
};

export default StyledButton;