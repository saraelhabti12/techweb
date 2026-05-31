import '../css/app.css';
import './bootstrap';
import './i18n';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route } from 'ziggy-js';
import CustomCursor from '@/Components/UI/CustomCursor';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

import { ConfirmProvider } from '@/Contexts/ConfirmContext';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.{js,jsx}'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Standard Ziggy initialization that prioritizes the @routes Blade directive
        window.route = (name, params, absolute, config = window.Ziggy) => route(name, params, absolute, config);

        root.render(
            <ConfirmProvider>
                <CustomCursor />
                <App {...props} />
            </ConfirmProvider>
        );
    },
    progress: {
        color: '#7c3aed', // TechWeb Purple
    },
});
