<?php

return [

    /*
     * Allowed origins — set FRONTEND_URL in Railway environment variables.
     * Example: https://immo-du-letch.vercel.app
     * Wildcard '*' is accepted for quick testing but should be narrowed in production.
     */
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:5173'),
        env('FRONTEND_URL_PREVIEW', ''), // optional preview URL
    ],

    'allowed_origins_patterns' => [],

    'allowed_methods' => ['*'],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
