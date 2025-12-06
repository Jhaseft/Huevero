import '../css/app.css';
import './bootstrap';

import axios from "axios";

// Configuración global de axios
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Manejo automático del error 419
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 419) {
            alert("Tu sesión expiró. La página se recargará.");
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
