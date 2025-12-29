'use client';

import { useStore } from '@nanostores/react';
import { themeStore } from './lib/stores/theme';
import { stripIndents } from './utils/stripIndent';
import { useEffect } from 'react';

import '@unocss/reset/tailwind-compat.css';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.scss';
import '@xterm/xterm/css/xterm.css';

const inlineThemeCode = stripIndents`
  setTutorialKitTheme();

  function setTutorialKitTheme() {
    let theme = localStorage.getItem('builder_theme');

    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.querySelector('html')?.setAttribute('data-theme', theme);
  }
`;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const theme = useStore(themeStore);

    useEffect(() => {
        document.querySelector('html')?.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <html lang="en" data-theme={theme}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                />
                <script dangerouslySetInnerHTML={{ __html: inlineThemeCode }} />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
