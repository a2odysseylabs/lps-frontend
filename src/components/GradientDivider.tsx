import classNames from 'classnames';
import React from 'react';

const GradientDivider: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({className, ...props }) => {
    return <div {...props} className={classNames(className, "h-4 bg-gradient-to-b from-neutral-200")} />;
};

export default GradientDivider;