import React from 'react';

export default function ApplicationLogo(props) {
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
