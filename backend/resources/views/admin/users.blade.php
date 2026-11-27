@extends('admin.layout')

@section('title', 'Utilisateurs')

@section('content')
<div class="flex flex-wrap items-center justify-between gap-4">
    <div>
        <h1 class="text-2xl font-extrabold text-[#071f49]">Gestion des utilisateurs</h1>
        <p class="mt-1 text-sm text-[#637084]">Membres inscrits, rôles d'administration et statut d'activation.</p>
    </div>
</div>

<!-- Stats utilisateurs -->
<div class="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
    <div class="rounded-2xl border border-[#dce2e9] bg-white p-4">
        <p class="text-xs font-semibold text-[#637084]">Total comptes</p>
        <p class="mt-1 text-2xl font-extrabold text-[#071f49]">{{ $userStats['total'] }}</p>
    </div>
    <div class="rounded-2xl border border-[#dce2e9] bg-white p-4">
        <p class="text-xs font-semibold text-[#637084]">Administrateurs</p>
        <p class="mt-1 text-2xl font-extrabold text-[#071f49]">{{ $userStats['admins'] }}</p>
    </div>
    <div class="rounded-2xl border border-[#dce2e9] bg-white p-4">
        <p class="text-xs font-semibold text-[#637084]">Comptes Professionnels</p>
        <p class="mt-1 text-2xl font-extrabold text-[#071f49]">{{ $userStats['pros'] }}</p>
    </div>
    <div class="rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-4">
        <p class="text-xs font-semibold text-[#dc2626]">Comptes bloqués</p>
        <p class="mt-1 text-2xl font-extrabold text-[#dc2626]">{{ $userStats['blocked'] }}</p>
    </div>
</div>

<!-- Filtres utilisateurs -->
<form method="GET" action="{{ route('admin.users') }}" class="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-[#dce2e9] bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
    <input type="text" name="q" value="{{ $search }}" placeholder="Rechercher nom, e-mail, tél…"
           class="h-10 rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs outline-none focus:border-[#f3ad19] focus:bg-white lg:col-span-2" />

    <select name="role" class="h-10 rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs font-medium outline-none focus:border-[#f3ad19]">
        <option value="all" @selected($role === 'all')>Tous les rôles</option>
        <option value="user" @selected($role === 'user')>Utilisateurs</option>
        <option value="admin" @selected($role === 'admin')>Administrateurs</option>
    </select>

    <select name="account_type" class="h-10 rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs font-medium outline-none focus:border-[#f3ad19]">
        <option value="all" @selected($accountType === 'all')>Particuliers & Pros</option>
        <option value="particulier" @selected($accountType === 'particulier')>Particuliers</option>
        <option value="professionnel" @selected($accountType === 'professionnel')>Professionnels</option>
    </select>

    <div class="flex items-center gap-2">
        <button type="submit" class="h-10 flex-1 rounded-xl bg-[#071f49] px-4 text-xs font-bold text-white transition hover:bg-[#0d2d66]">
            Filtrer
        </button>
        @if($search || $role !== 'all' || $accountType !== 'all' || $state !== 'all')
            <a href="{{ route('admin.users') }}" class="flex h-10 items-center justify-center rounded-xl border border-[#dce2e9] px-3 text-xs font-semibold text-[#637084]">✕</a>
        @endif
    </div>
</form>

<div class="mt-5 overflow-hidden rounded-2xl border border-[#dce2e9] bg-white shadow-xs">
    <div class="overflow-x-auto">
        <table class="w-full min-w-[780px] border-collapse text-left text-sm">
            <thead class="border-b border-[#dce2e9] bg-[#f8fafc] text-[11px] font-bold uppercase tracking-wider text-[#637084]">
                <tr>
                    <th class="px-4 py-3.5">Utilisateur</th>
                    <th class="px-4 py-3.5">E-mail & Téléphone</th>
                    <th class="px-4 py-3.5">Type</th>
                    <th class="px-4 py-3.5">Annonces</th>
                    <th class="px-4 py-3.5">Rôle</th>
                    <th class="px-4 py-3.5">Statut</th>
                    <th class="px-4 py-3.5 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-[#eef2f6]">
                @forelse($users as $u)
                    @php
                        $uInitials = collect(explode(' ', $u->name))
                            ->filter()
                            ->map(fn ($w) => mb_strtoupper(mb_substr($w, 0, 1)))
                            ->take(2)
                            ->implode('');
                    @endphp
                    <tr class="transition hover:bg-[#f8fafc]">
                        <td class="px-4 py-3.5">
                            <div class="flex items-center gap-3">
                                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf0f8] text-xs font-extrabold text-[#071f49]">
                                    {{ $uInitials ?: 'U' }}
                                </div>
                                <div>
                                    <p class="font-bold text-[#071f49]">{{ $u->name }}</p>
                                    <p class="text-[11px] text-[#8a95a5]">Inscrit le {{ $u->created_at?->format('d/m/Y') }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3.5 text-xs text-[#637084]">
                            <p class="font-medium text-[#172b45]">{{ $u->email }}</p>
                            @if($u->phone)<p>{{ $u->phone }}</p>@endif
                        </td>
                        <td class="px-4 py-3.5 text-xs capitalize">
                            <span class="font-semibold text-[#071f49]">{{ $u->account_type }}</span>
                            <span class="block text-[11px] text-[#8a95a5]">via {{ $u->provider }}</span>
                        </td>
                        <td class="px-4 py-3.5 font-bold text-[#071f49]">{{ $u->listings_count }}</td>
                        <td class="px-4 py-3.5">
                            <span class="rounded-full px-2.5 py-0.5 text-xs font-bold {{ $u->role === 'admin' ? 'bg-[#071f49] text-white' : 'bg-[#eaf0f8] text-[#071f49]' }}">
                                {{ $u->role }}
                            </span>
                        </td>
                        <td class="px-4 py-3.5">
                            <span class="rounded-full px-2.5 py-0.5 text-xs font-bold {{ $u->is_active ? 'bg-[#e7f6ec] text-[#1f7a3d]' : 'bg-[#fef2f2] text-[#dc2626]' }}">
                                {{ $u->is_active ? 'Actif' : 'Bloqué' }}
                            </span>
                        </td>
                        <td class="px-4 py-3.5 text-right">
                            @if($u->id !== auth()->id())
                                <div class="inline-flex gap-1.5">
                                    <form method="POST" action="{{ route('admin.users.toggle-role', $u) }}"
                                          onsubmit="return confirm('Modifier le rôle de {{ $u->email }} ?');">
                                        @csrf @method('PATCH')
                                        <button type="submit" class="rounded-lg border border-[#dce2e9] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#071f49] hover:border-[#071f49]">
                                            {{ $u->role === 'admin' ? 'Rétrograder' : 'Passer admin' }}
                                        </button>
                                    </form>
                                    <form method="POST" action="{{ route('admin.users.toggle-active', $u) }}">
                                        @csrf @method('PATCH')
                                        <button type="submit" class="rounded-lg border border-[#dce2e9] bg-white px-2.5 py-1.5 text-xs font-bold {{ $u->is_active ? 'text-[#dc2626] hover:border-[#dc2626]' : 'text-[#1f7a3d] hover:border-[#1f7a3d]' }}">
                                            {{ $u->is_active ? 'Bloquer' : 'Activer' }}
                                        </button>
                                    </form>
                                </div>
                            @else
                                <span class="rounded-full bg-[#f4f6f8] px-2.5 py-1 text-xs font-semibold text-[#8a95a5]">Vous</span>
                            @endif
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="px-4 py-10 text-center text-sm text-[#637084]">
                            Aucun utilisateur trouvé.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

<div class="mt-5">
    {{ $users->links() }}
</div>
@endsection
