import React from 'react';

export default function ApplicationLogo({ isCollapsed, ...props }) {
    if (isCollapsed) {
        return (
            <div {...props}>
                <img
                    className="h-full w-auto block dark:hidden"
                    src="/images/favicon.png"
                    alt="TechWeb"
                />
                <img
                    className="h-full w-auto hidden dark:block"
                    src="/images/favicon.png"
                    alt="TechWeb Dark"
                />
            </div>
        );
    }

    return (
        <div {...props}>
            <img
                className="h-full w-auto block dark:hidden"
                src="/images/logotechweb.png"
                alt="TechWeb"
            />
            <img
                className="h-full w-auto hidden dark:block"
                src="/images/logo3.png"
                alt="TechWeb Dark"
            />
        </div>
    );
}
