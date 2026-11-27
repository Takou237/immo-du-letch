<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Connexion Admin · IMMO DU LETCH</title>
    <link rel="icon" type="image/png" href="{{ asset('assets/logo.png') }}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
    </style>
</head>
<body class="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#071f49] via-[#0d2d66] to-[#133b80] p-4 text-[#071f49]">
    <div class="w-full max-w-md rounded-2xl border border-white/15 bg-white p-8 shadow-2xl">
        <div class="text-center">
            <div class="mx-auto flex h-20 w-36 items-center justify-center rounded-xl bg-[#f8fafc] p-2">
                <img src="{{ asset('assets/logo.png') }}" alt="IMMO DU LETCH" class="h-full w-full object-contain" />
            </div>
            <span class="mt-4 inline-block rounded-full bg-[#fff6df] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#996300]">
                Back-Office Administration
            </span>
            <h1 class="mt-2.5 text-2xl font-extrabold text-[#071f49]">Connexion sécurisée</h1>
            <p class="mt-1 text-sm text-[#637084]">Gérez les annonces, utilisateurs et demandes de contact</p>
        </div>

        @if($errors->any())
            <div class="mt-5 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-medium text-[#dc2626]">
                {{ $errors->first() }}
            </div>
        @endif

        <form method="POST" action="{{ route('admin.login.submit') }}" class="mt-6 space-y-4">
            @csrf
            <div>
                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#637084]">
                    E-mail administrateur
                </label>
                <input type="email" name="email" value="{{ old('email', 'admin@immoduletch.cm') }}" required
                       class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3.5 text-sm outline-none transition focus:border-[#f3ad19] focus:bg-white" />
            </div>
            <div>
                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#637084]">
                    Mot de passe
                </label>
                <input type="password" name="password" required
                       class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3.5 text-sm outline-none transition focus:border-[#f3ad19] focus:bg-white" />
            </div>
            <label class="flex items-center gap-2 text-sm text-[#637084]">
                <input type="checkbox" name="remember" class="rounded border-[#dce2e9] text-[#071f49]" />
                Rester connecté
            </label>
            <button type="submit"
                    class="h-11 w-full rounded-xl bg-[#f3ad19] text-sm font-bold text-[#071f49] shadow-sm transition hover:bg-[#ffbe33]">
                Se connecter au back-office
            </button>
        </form>
    </div>
</body>
</html>
