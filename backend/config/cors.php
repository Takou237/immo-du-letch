<?php

return [

    /*
     * Allowed origins — set FRONTEND_URL in Railway environment variables.
     */
    'allowed_origins' => array_values(array_filter([
        env('FRONTEND_URL', 'http://localhost:5173'),
        env('FRONTEND_URL_PREVIEW'),
    ])),

    'allowed_origins_patterns' => [
        '#^https://immo-du-letch(-[a-z0-9-]+)?\.vercel\.app$#',
    ],

    'allowed_methods' => ['*'],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
