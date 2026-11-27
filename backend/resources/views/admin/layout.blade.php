<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@yield('title', 'Back-Office Admin') · IMMO DU LETCH</title>
    <link rel="icon" type="image/png" href="{{ asset('assets/logo.png') }}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
    </style>
</head>
<body class="min-h-screen bg-[#f4f6f8] text-[#071f49] antialiased">
    @php
        $pendingCount = \App\Models\Listing::where('status', 'pending')->count();
        $newInqCount = \App\Models\Inquiry::where('status', 'new')->count();
        $adminUser = auth()->user();
        $initials = collect(explode(' ', $adminUser?->name ?? 'A'))
            ->filter()
            ->map(fn ($w) => mb_strtoupper(mb_substr($w, 0, 1)))
            ->take(2)
            ->implode('');
    @endphp

    <div class="flex min-h-screen">
        <!-- Mobile backdrop -->
        <div id="sidebar-backdrop"
             onclick="toggleSidebar(false)"
             class="fixed inset-0 z-30 hidden bg-[#071f49]/50 backdrop-blur-xs lg:hidden"></div>

        <!-- Sidebar -->
        <aside id="admin-sidebar"
               class="fixed inset-y-0 left-0 z-40 flex w-68 -translate-x-full flex-col bg-[#071f49] text-white transition-transform duration-200 lg:static lg:translate-x-0">
            <div class="border-b border-white/10 px-5 py-5">
                <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-3">
                    <div class="flex h-12 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
                        <img src="{{ asset('assets/logo.png') }}" alt="IMMO DU LETCH" class="h-full w-full object-contain" />
                    </div>
                    <div class="min-w-0">
                        <p class="truncate text-xs font-extrabold uppercase tracking-widest text-[#f3ad19]">IMMO DU LETCH</p>
                        <p class="truncate text-sm font-bold text-white">Back-Office Admin</p>
                    </div>
                </a>
            </div>

            <nav class="flex-1 space-y-1.5 px-3 py-5 text-sm font-medium">
                <p class="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-white/40">Pilotage</p>

                <a href="{{ route('admin.dashboard') }}"
                   class="flex items-center justify-between rounded-xl px-3.5 py-2.5 transition {{ request()->routeIs('admin.dashboard') ? 'bg-[#f3ad19] font-semibold text-[#071f49] shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white' }}">
                    <span class="flex items-center gap-2.5">
                        <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Tableau de bord</span>
                    </span>
                </a>

                <p class="px-3 pt-4 pb-1 text-[11px] font-bold uppercase tracking-wider text-white/40">Gestion</p>

                <a href="{{ route('admin.listings') }}"
                   class="flex items-center justify-between rounded-xl px-3.5 py-2.5 transition {{ request()->routeIs('admin.listings*') ? 'bg-[#f3ad19] font-semibold text-[#071f49] shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white' }}">
                    <span class="flex items-center gap-2.5">
                        <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>Annonces & Modération</span>
                    </span>
                    @if($pendingCount > 0)
                        <span class="rounded-full bg-[#e11d48] px-2 py-0.5 text-[11px] font-bold text-white">{{ $pendingCount }}</span>
                    @endif
                </a>

                <a href="{{ route('admin.users') }}"
                   class="flex items-center justify-between rounded-xl px-3.5 py-2.5 transition {{ request()->routeIs('admin.users*') ? 'bg-[#f3ad19] font-semibold text-[#071f49] shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white' }}">
                    <span class="flex items-center gap-2.5">
                        <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Utilisateurs</span>
                    </span>
                </a>

                <a href="{{ route('admin.inquiries') }}"
                   class="flex items-center justify-between rounded-xl px-3.5 py-2.5 transition {{ request()->routeIs('admin.inquiries*') ? 'bg-[#f3ad19] font-semibold text-[#071f49] shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white' }}">
                    <span class="flex items-center gap-2.5">
                        <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Demandes de contact</span>
                    </span>
                    @if($newInqCount > 0)
                        <span class="rounded-full bg-[#f3ad19] px-2 py-0.5 text-[11px] font-bold text-[#071f49]">{{ $newInqCount }}</span>
                    @endif
                </a>

                <p class="px-3 pt-4 pb-1 text-[11px] font-bold uppercase tracking-wider text-white/40">Contenu du site</p>

                <a href="{{ route('admin.articles') }}"
                   class="flex items-center justify-between rounded-xl px-3.5 py-2.5 transition {{ request()->routeIs('admin.articles*') ? 'bg-[#f3ad19] font-semibold text-[#071f49] shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white' }}">
                    <span class="flex items-center gap-2.5">
                        <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <span>Articles & Conseils</span>
                    </span>
                </a>

                <a href="{{ route('admin.faqs') }}"
                   class="flex items-center justify-between rounded-xl px-3.5 py-2.5 transition {{ request()->routeIs('admin.faqs*') ? 'bg-[#f3ad19] font-semibold text-[#071f49] shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white' }}">
                    <span class="flex items-center gap-2.5">
                        <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Questions FAQ</span>
                    </span>
                </a>

                <a href="{{ route('admin.settings') }}"
                   class="flex items-center justify-between rounded-xl px-3.5 py-2.5 transition {{ request()->routeIs('admin.settings*') ? 'bg-[#f3ad19] font-semibold text-[#071f49] shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white' }}">
                    <span class="flex items-center gap-2.5">
                        <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Accueil & Paramètres</span>
                    </span>
                </a>
            </nav>

            <div class="border-t border-white/10 p-4">
                <div class="flex items-center gap-3 rounded-xl bg-white/5 p-2.5">
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f3ad19] text-xs font-extrabold text-[#071f49]">
                        {{ $initials ?: 'AD' }}
                    </div>
                    <div class="min-w-0 flex-1 text-xs">
                        <p class="truncate font-semibold text-white">{{ $adminUser?->name }}</p>
                        <p class="truncate text-white/60">{{ $adminUser?->email }}</p>
                    </div>
                </div>
                <form method="POST" action="{{ route('admin.logout') }}" class="mt-3">
                    @csrf
                    <button type="submit"
                            class="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20">
                        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Se déconnecter
                    </button>
                </form>
            </div>
        </aside>

        <!-- Main wrapper -->
        <div class="flex min-w-0 flex-1 flex-col">
            <!-- Topbar -->
            <header class="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-[#dce2e9] bg-white/95 px-4 backdrop-blur-sm sm:px-8">
                <div class="flex items-center gap-3">
                    <button type="button"
                            onclick="toggleSidebar(true)"
                            aria-label="Ouvrir le menu"
                            class="rounded-lg border border-[#dce2e9] p-2 text-[#071f49] hover:bg-[#f4f6f8] lg:hidden">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <form method="GET" action="{{ route('admin.listings') }}" class="hidden sm:block">
                        <div class="relative">
                            <svg class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8a95a5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input type="text"
                                   name="q"
                                   value="{{ request('q') }}"
                                   placeholder="Recherche rapide (titre, ville, réf…)"
                                   class="h-9 w-72 rounded-lg border border-[#dce2e9] bg-[#f8fafc] pr-3 pl-9 text-xs text-[#071f49] outline-none transition focus:w-84 focus:border-[#f3ad19] focus:bg-white" />
                        </div>
                    </form>
                </div>

                <div class="flex items-center gap-3">
                    @if($pendingCount > 0)
                        <a href="{{ route('admin.listings', ['status' => 'pending']) }}"
                           class="hidden items-center gap-1.5 rounded-full border border-[#fde68a] bg-[#fffaf0] px-3 py-1.5 text-xs font-semibold text-[#996300] hover:bg-[#fff3d6] md:inline-flex">
                            <span class="h-2 w-2 rounded-full bg-[#f3ad19]"></span>
                            {{ $pendingCount }} annonce{{ $pendingCount > 1 ? 's' : '' }} à modérer
                        </a>
                    @endif
                    <span class="text-xs font-medium text-[#8a95a5]">{{ now()->format('d/m/Y') }}</span>
                </div>
            </header>

            <!-- Main content -->
            <main class="flex-1 p-4 sm:p-8">
                <div class="mx-auto max-w-7xl">
                    @if(session('success'))
                        <div class="mb-5 flex items-center justify-between gap-3 rounded-xl border border-[#bbf7d0] bg-[#e7f6ec] px-4 py-3 text-sm font-medium text-[#1f7a3d]">
                            <span>{{ session('success') }}</span>
                            <button type="button" onclick="this.parentElement.remove()" class="text-xs font-bold opacity-70 hover:opacity-100">✕</button>
                        </div>
                    @endif
                    @if(session('error'))
                        <div class="mb-5 flex items-center justify-between gap-3 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-medium text-[#dc2626]">
                            <span>{{ session('error') }}</span>
                            <button type="button" onclick="this.parentElement.remove()" class="text-xs font-bold opacity-70 hover:opacity-100">✕</button>
                        </div>
                    @endif
                    @if($errors->any())
                        <div class="mb-5 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#dc2626]">
                            <ul class="list-disc pl-5">
                                @foreach($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    @yield('content')
                </div>
            </main>
        </div>
    </div>

    <script>
        function toggleSidebar(open) {
            const sidebar = document.getElementById('admin-sidebar');
            const backdrop = document.getElementById('sidebar-backdrop');
            if (!sidebar || !backdrop) return;
            if (open) {
                sidebar.classList.remove('-translate-x-full');
                backdrop.classList.remove('hidden');
            } else {
                sidebar.classList.add('-translate-x-full');
                backdrop.classList.add('hidden');
            }
        }
    </script>
    @stack('scripts')
</body>
</html>
