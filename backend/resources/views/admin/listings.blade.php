@extends('admin.layout')

@section('title', 'Annonces & Modération')

@section('content')
<div class="flex flex-wrap items-center justify-between gap-4">
    <div>
        <h1 class="text-2xl font-extrabold text-[#071f49]">Annonces & Modération</h1>
        <p class="mt-1 text-sm text-[#637084]">Filtrez, créez, modifiez, validez ou refusez les biens immobiliers soumis sur la plateforme.</p>
    </div>
    <a href="{{ route('admin.listings.create') }}"
       class="rounded-xl bg-[#f3ad19] px-4 py-2.5 text-xs font-bold text-[#071f49] shadow-xs transition hover:bg-[#ffbe33]">
        + Nouvelle annonce
    </a>
</div>

<!-- Onglets de statut -->
<div class="mt-5 flex flex-wrap gap-2">
    @foreach(['all' => 'Toutes', 'pending' => 'En attente', 'approved' => 'Validées', 'rejected' => 'Refusées'] as $key => $label)
        <a href="{{ route('admin.listings', array_filter(['status' => $key, 'q' => $search, 'city' => $city, 'type' => $type, 'transaction' => $transaction, 'sort' => $sort !== 'recent' ? $sort : null])) }}"
           class="rounded-full border px-4 py-1.5 text-xs font-bold transition {{ $status === $key ? 'border-[#071f49] bg-[#071f49] text-white' : 'border-[#dce2e9] bg-white text-[#637084] hover:border-[#f3ad19]' }}">
            {{ $label }} ({{ $counts[$key] }})
        </a>
    @endforeach
</div>

<!-- Barre de filtres avancés -->
<form method="GET" action="{{ route('admin.listings') }}" class="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-[#dce2e9] bg-white p-4 sm:grid-cols-2 lg:grid-cols-6">
    <input type="hidden" name="status" value="{{ $status }}" />

    <input type="text" name="q" value="{{ $search }}" placeholder="Titre, quartier, réf, vendeur…"
           class="h-10 rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs outline-none focus:border-[#f3ad19] focus:bg-white lg:col-span-2" />

    <select name="city" class="h-10 rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs font-medium outline-none focus:border-[#f3ad19]">
        <option value="">Toutes les villes</option>
        @foreach($cities as $c)
            <option value="{{ $c }}" @selected($city === $c)>{{ $c }}</option>
        @endforeach
    </select>

    <select name="type" class="h-10 rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs font-medium outline-none focus:border-[#f3ad19]">
        <option value="">Tous les types</option>
        @foreach(['villa' => 'Villa / Maison', 'appartement' => 'Appartement', 'terrain' => 'Terrain', 'studio' => 'Studio', 'bureau' => 'Bureau'] as $tk => $tv)
            <option value="{{ $tk }}" @selected($type === $tk)>{{ $tv }}</option>
        @endforeach
    </select>

    <select name="sort" class="h-10 rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs font-medium outline-none focus:border-[#f3ad19]">
        <option value="recent" @selected($sort === 'recent')>Plus récentes</option>
        <option value="views" @selected($sort === 'views')>Plus consultées</option>
        <option value="price_asc" @selected($sort === 'price_asc')>Prix croissant</option>
        <option value="price_desc" @selected($sort === 'price_desc')>Prix décroissant</option>
    </select>

    <div class="flex items-center gap-2">
        <button type="submit" class="h-10 flex-1 rounded-xl bg-[#071f49] px-4 text-xs font-bold text-white transition hover:bg-[#0d2d66]">
            Filtrer
        </button>
        @if($search || $city || $type || $transaction || $sort !== 'recent')
            <a href="{{ route('admin.listings', ['status' => $status]) }}"
               class="flex h-10 items-center justify-center rounded-xl border border-[#dce2e9] px-3 text-xs font-semibold text-[#637084] hover:text-[#071f49]"
               title="Réinitialiser">
                ✕
            </a>
        @endif
    </div>
</form>

<!-- Tableau des annonces -->
<div class="mt-5 overflow-hidden rounded-2xl border border-[#dce2e9] bg-white shadow-xs">
    <div class="overflow-x-auto">
        <table class="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead class="border-b border-[#dce2e9] bg-[#f8fafc] text-[11px] font-bold uppercase tracking-wider text-[#637084]">
                <tr>
                    <th class="px-4 py-3.5">Bien</th>
                    <th class="px-4 py-3.5">Localisation</th>
                    <th class="px-4 py-3.5">Prix</th>
                    <th class="px-4 py-3.5">Vues</th>
                    <th class="px-4 py-3.5">Annonceur</th>
                    <th class="px-4 py-3.5">Statut</th>
                    <th class="px-4 py-3.5 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-[#eef2f6]">
                @forelse($listings as $item)
                    <tr class="transition hover:bg-[#f8fafc]">
                        <td class="px-4 py-3.5">
                            <div class="flex items-center gap-3">
                                <img src="{{ $item->image }}" alt="" class="h-13 w-18 shrink-0 rounded-lg border border-[#dce2e9] object-cover" />
                                <div class="min-w-0">
                                    <a href="{{ route('admin.listings.show', $item) }}" class="line-clamp-1 font-bold text-[#071f49] hover:underline">
                                        {{ $item->title }}
                                    </a>
                                    <p class="mt-0.5 text-xs text-[#8a95a5]">
                                        {{ $item->reference }} · {{ ucfirst($item->type) }} ({{ $item->transaction }}) · {{ $item->surface }} m²
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3.5 text-xs text-[#637084]">
                            <p class="font-semibold text-[#172b45]">{{ $item->city }}</p>
                            <p>{{ $item->neighborhood }}</p>
                        </td>
                        <td class="px-4 py-3.5 text-xs font-extrabold text-[#071f49]">
                            {{ number_format($item->price, 0, ',', ' ') }} FCFA
                            @if($item->transaction === 'location')
                                <span class="block font-normal text-[#8a95a5]">/ mois</span>
                            @endif
                        </td>
                        <td class="px-4 py-3.5 text-xs font-semibold text-[#637084]">
                            {{ number_format($item->views, 0, ',', ' ') }}
                        </td>
                        <td class="px-4 py-3.5 text-xs">
                            <p class="font-semibold text-[#071f49]">{{ $item->seller }}</p>
                            <p class="text-[#8a95a5]">{{ $item->user?->email ?? 'Catalogue' }}</p>
                        </td>
                        <td class="px-4 py-3.5">
                            @if($item->status === 'approved')
                                <span class="inline-flex items-center gap-1 rounded-full bg-[#e7f6ec] px-2.5 py-1 text-xs font-bold text-[#1f7a3d]">
                                    <span class="h-1.5 w-1.5 rounded-full bg-[#1f7a3d]"></span> Validée
                                </span>
                            @elseif($item->status === 'rejected')
                                <span class="inline-flex items-center gap-1 rounded-full bg-[#fef2f2] px-2.5 py-1 text-xs font-bold text-[#dc2626]">
                                    <span class="h-1.5 w-1.5 rounded-full bg-[#dc2626]"></span> Refusée
                                </span>
                            @else
                                <span class="inline-flex items-center gap-1 rounded-full bg-[#fff6df] px-2.5 py-1 text-xs font-bold text-[#996300]">
                                    <span class="h-1.5 w-1.5 rounded-full bg-[#f3ad19]"></span> En attente
                                </span>
                            @endif
                        </td>
                        <td class="px-4 py-3.5 text-right">
                            <div class="inline-flex items-center gap-1.5">
                                <a href="{{ route('admin.listings.show', $item) }}"
                                   class="rounded-lg border border-[#dce2e9] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#071f49] transition hover:border-[#071f49]">
                                    Inspecter
                                </a>
                                @if($item->status !== 'approved')
                                    <form method="POST" action="{{ route('admin.listings.moderate', $item) }}">
                                        @csrf @method('PATCH')
                                        <input type="hidden" name="status" value="approved" />
                                        <button type="submit" class="rounded-lg bg-[#e7f6ec] px-2.5 py-1.5 text-xs font-bold text-[#1f7a3d] transition hover:bg-[#d1fae5]">
                                            Valider
                                        </button>
                                    </form>
                                @endif
                                @if($item->status !== 'rejected')
                                    <button type="button"
                                            onclick="openRejectModal('{{ route('admin.listings.moderate', $item) }}', '{{ addslashes($item->title) }}')"
                                            class="rounded-lg bg-[#fef2f2] px-2.5 py-1.5 text-xs font-bold text-[#dc2626] transition hover:bg-[#fee2e2]">
                                        Refuser
                                    </button>
                                @endif
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="px-4 py-12 text-center text-sm text-[#637084]">
                            Aucune annonce ne correspond à vos critères.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

<div class="mt-5">
    {{ $listings->links() }}
</div>

<!-- Modale de refus rapide -->
<div id="reject-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-[#071f49]/50 p-4 backdrop-blur-xs">
    <div class="w-full max-w-md rounded-2xl border border-[#dce2e9] bg-white p-6 shadow-xl">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-[#071f49]">Refuser l'annonce</h3>
            <button type="button" onclick="closeRejectModal()" class="text-sm font-bold text-[#637084] hover:text-[#071f49]">✕</button>
        </div>
        <p id="reject-modal-title" class="mt-1 text-xs font-medium text-[#637084]"></p>

        <form id="reject-modal-form" method="POST" action="" class="mt-4 space-y-3">
            @csrf @method('PATCH')
            <input type="hidden" name="status" value="rejected" />
            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Motif du refus (visible par l'annonceur)</label>
                <textarea name="rejection_reason" rows="3" required
                          placeholder="Ex: Photos floues, prix incohérent ou document manquant…"
                          class="w-full rounded-xl border border-[#dce2e9] p-3 text-xs outline-none focus:border-[#dc2626]"></textarea>
            </div>
            <div class="flex items-center justify-end gap-2 pt-2">
                <button type="button" onclick="closeRejectModal()" class="rounded-xl border border-[#dce2e9] px-4 py-2 text-xs font-semibold text-[#637084]">
                    Annuler
                </button>
                <button type="submit" class="rounded-xl bg-[#dc2626] px-4 py-2 text-xs font-bold text-white hover:bg-[#b91c1c]">
                    Confirmer le refus
                </button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
    function openRejectModal(actionUrl, title) {
        const modal = document.getElementById('reject-modal');
        document.getElementById('reject-modal-form').action = actionUrl;
        document.getElementById('reject-modal-title').textContent = title;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
    function closeRejectModal() {
        const modal = document.getElementById('reject-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
</script>
@endpush
@endsection
