import { defineConfig } from 'vitepress'

export default defineConfig({
    title: 'Actionable',
    description: 'Clean, testable, and reusable actions for Laravel applications',

    head: [
        ['link', { rel: 'icon', href: '/images/LumoSolutionsLogo.png' }],
        ['meta', { name: 'theme-color', content: '#3c82f6' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:locale', content: 'en' }],
        ['meta', { property: 'og:title', content: 'Actionable | Laravel Actions & DTOs' }],
        ['meta', { property: 'og:site_name', content: 'Actionable' }],
        ['meta', { property: 'og:image', content: 'https://actionable.lumosolutions.org/images/LumoSolutionsLogo.png' }],
        ['meta', { property: 'og:url', content: 'https://actionable.lumosolutions.org/' }],
    ],

    themeConfig: {
        logo: '/images/LumoSolutionsLogo.png',

        nav: [
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            {
                text: 'More',
                items: [
                    //{ text: 'Examples', link: '/examples/basic-usage' },
                    { text: 'Best Practice', link: '/guide/best-practice' },
                    { text: 'Contributing', link: '/contributing' }
                ]
            },
            {
                text: 'GitHub',
                link: 'https://github.com/LumoSolutions/actionable'
            }
        ],

        sidebar: {
            '/guide/': [
                {
                    text: 'Getting Started',
                    items: [
                        { text: 'Installation', link: '/guide/installation' },
                        { text: 'Quick Start', link: '/guide/getting-started' },
                    ]
                },
                {
                    text: 'Comparisons',
                    items: [
                        { text: 'Laravel Actions', link: '/guide/vs-laravel-actions' }
                    ]
                },
                {
                    text: 'Core Concepts',
                    items: [
                        { text: 'Actions', link: '/guide/actions' },
                        { text: 'Queues', link: '/guide/queues' },
                        { text: 'Data Transfer Objects', link: '/guide/dtos' },
                        { text: 'Attributes', link: '/guide/attributes' },
                        { text: 'Testing', link: '/guide/testing' }
                    ]
                },
                {
                    text: 'Artisan Commands',
                    items: [
                        { text: 'make:action', link: '/guide/make-action' },
                        { text: 'make:dto', link: '/guide/make-dto' },
                        { text: 'ide-helper:actions', link: '/guide/ide-helper' },
                        { text: 'Export Stubs', link: '/guide/export-stubs' }
                    ]
                },
                {
                    text: 'Advanced Topics',
                    items: [
                        { text: 'Best Practices', link: '/guide/best-practices' },
                        { text: 'Upgrade Guide', link: '/guide/upgrade' },
                        { text: 'Contributing', link: '/guide/contributing' }
                    ]
                }
            ],
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/LumoSolutions/actionable' }
        ],

        editLink: {
            pattern: 'https://github.com/LumoSolutions/actionable-docs/edit/main/docs/:path',
            text: 'Edit this page on GitHub'
        },

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2024 Lumo Solutions'
        },

        search: {
            provider: 'local'
        },

        outline: {
            level: [2, 3]
        }
    },

    markdown: {
        theme: {
            light: 'github-light',
            dark: 'github-dark'
        },
        lineNumbers: true
    },

    lastUpdated: true,

    sitemap: {
        hostname: 'https://actionable.lumosolutions.org'
    }
});