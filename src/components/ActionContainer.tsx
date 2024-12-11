import React, { ReactNode } from "react";
import classNames from "classnames";

import Icon from "./Icon";
import BaseButton from "./BaseButton";

interface ActionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    footerContent?: ReactNode;
    onClose?: () => void;
}

const ActionContainer: React.FC<ActionContainerProps> = ({
    onClose,
    className,
    children,
    ...props
}) => {
    return (
        <div 
            className={classNames(
                "action-container relative raised-medium rounded-xl bg-neutral-200 p-8", className, props
            )}
        >
            {onClose && (
                <BaseButton className="p-2 absolute right-2 top-2" as="button" onClick={onClose}>
                    <Icon name="X" size={20} color="gray" />
                </BaseButton>
            )}
            {children}
        </div>
    );
};

export default ActionContainer;
