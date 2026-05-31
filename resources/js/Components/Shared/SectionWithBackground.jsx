import React, { useRef } from 'react';
import { useInView } from "framer-motion";
import PremiumBackground from '@/Components/UI/PremiumBackground';

const SectionWithBackground = ({ children, variant, className, id, ...props }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "200px" });
    
    return (
        <section ref={ref} id={id} className={`relative ${className}`} {...props}>
            {isInView && <PremiumBackground variant={variant} />}
            {children}
        </section>
    );
};

export default SectionWithBackground;
