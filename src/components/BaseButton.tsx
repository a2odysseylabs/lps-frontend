import React, { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import { Link, LinkProps } from 'react-router-dom';

export interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    as: 'a';
    href: string;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    as: 'button';
}

export interface RouterLinkProps extends LinkProps {
    as: 'link';
    disabled?: boolean;
}

export type BaseButtonTypes = AnchorProps | ButtonProps | RouterLinkProps;

const BaseButton = (props: BaseButtonTypes) => {
    const { as, children, className, ...rest } = props;

    const baseButtonClasses = classNames(className, 'base-button', {
        'base-button--disabled': (as === 'button' || as === 'link') && props.disabled,
    });

    const renderButton = () => {
        switch (as) {
            case 'a':
                return (
                    <a className={baseButtonClasses} {...(rest as AnchorProps)}>
                        {children}
                    </a>
                );
            case 'button':
                return (
                    <button className={baseButtonClasses} type="button" {...(rest as ButtonProps)}>
                        {children}
                    </button>
                );
            case 'link':
                return (
                    <Link className={baseButtonClasses} {...(rest as RouterLinkProps)}>
                        {children}
                    </Link>
                );
            default:
                return null;
        }
    };

    return renderButton();
};

export default BaseButton;
