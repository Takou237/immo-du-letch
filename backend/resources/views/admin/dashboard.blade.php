@extends('admin.layout')

@section('title', 'Tableau de bord')

@section('content')
@php
    $totalListings = max(1, $stats['total_listings']);
    $approvedPct = round(($stats['approved_listings'] / $totalListings) * 100);
    $pendingPct = round(($stats['pending_listings'] / $totalListings) * 100);
    $rejectedPct = round(($stats['rejected_listings'] / $totalListings) * 100);
    $ventePct = round(($stats['vente_listings'] / $totalListings) * 100);
    $locationPct = 100 - $ventePct;
    $typeLabels = [
        'villa' => 'Maisons & villas',
        'appartement' => 'Appartements',
        'terrain' => 'Terrains',
        'studio' => 'Studios',
        'bureau' => 'Bureaux & commerces',
    ];
@endphp

<!-- Header -->
<div class="flex flex-wrap items-center justify-between gap-4">
    <div>
        <h1 class="text-2xl font-extrabold text-[#071f49]">Tableau de bord</h1>
        <p class="mt-1 text-sm text-[#637084]">Vue d'ensemble et pilotage de la plateforme IMMO DU LETCH</p>
    </div>
    <div class="flex flex-wrap items-center gap-2.5">
        <a href="{{ route('admin.listings') }}"
           class="rounded-xl border border-[#dce2e9] bg-white px-4 py-2.5 text-xs font-bold text-[#071f49] transition hover:border-[#071f49]">
            Toutes les annonces
        </a>
        <a href="{{ route('admin.listings', ['status' => 'pending']) }}"
           class="rounded-xl bg-[#f3ad19] px-4 py-2.5 text-xs font-bold text-[#071f49] shadow-sm transition hover:bg-[#ffbe33]">
            File de modération ({{ $stats['pending_listings'] }})
        </a>
    </div>
</div>

<!-- KPI Cards (Row 1: Annonces & Modération) -->
<div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
    <div class="rounded-2xl border border-[#dce2e9] bg-white p-5 shadow-xs">
        <div class="flex items-center justify-between">
            <p class="text-xs font-semibold uppercase tracking-wider text-[#637084]">Total annonces</p>
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf0f8] text-[#071f49]">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                </svg>
            </span>
        </div>
        <p class="mt-2 text-3xl font-extrabold text-[#071f49]">{{ $stats['total_listings'] }}</p>
        <p class="mt-1 text-xs text-[#637084]">{{ $stats['vente_listings'] }} ventes · {{ $stats['location_listings'] }} locations</p>
    </div>

    <a href="{{ route('admin.listings', ['status' => 'pending']) }}"
       class="rounded-2xl border border-[#fde68a] bg-[#fffaf0] p-5 shadow-xs transition hover:border-[#f3ad19]">
        <div class="flex items-center justify-between">
            <p class="text-xs font-semibold uppercase tracking-wider text-[#996300]">En attente</p>
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fef3c7] text-[#996300]">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </span>
        </div>
        <p class="mt-2 text-3xl font-extrabold text-[#996300]">{{ $stats['pending_listings'] }}</p>
        <p class="mt-1 text-xs text-[#996300]/80">{{ $pendingPct }}% du catalogue à vérifier</p>
    </a>

    <a href="{{ route('admin.listings', ['status' => 'approved']) }}"
       class="rounded-2xl border border-[#bbf7d0] bg-[#e7f6ec] p-5 shadow-xs transition hover:border-[#1f7a3d]">
        <div class="flex items-center justify-between">
            <p class="text-xs font-semibold uppercase tracking-wider text-[#1f7a3d]">Validées</p>
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d1fae5] text-[#1f7a3d]">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </span>
        </div>
        <p class="mt-2 text-3xl font-extrabold text-[#1f7a3d]">{{ $stats['approved_listings'] }}</p>
        <p class="mt-1 text-xs text-[#1f7a3d]/80">{{ $approvedPct }}% publiées en ligne</p>
    </a>

    <a href="{{ route('admin.listings', ['status' => 'rejected']) }}"
       class="rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-5 shadow-xs transition hover:border-[#dc2626]">
        <div class="flex items-center justify-between">
            <p class="text-xs font-semibold uppercase tracking-wider text-[#dc2626]">Refusées</p>
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fee2e2] text-[#dc2626]">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </span>
        </div>
        <p class="mt-2 text-3xl font-extrabold text-[#dc2626]">{{ $stats['rejected_listings'] }}</p>
        <p class="mt-1 text-xs text-[#dc2626]/80">{{ $rejectedPct }}% non conformes</p>
    </a>
</div>

<!-- KPI Cards (Row 2: Utilisateurs, Contacts, Engagement) -->
<div class="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
    <a href="{{ route('admin.users') }}" class="rounded-2xl border border-[#dce2e9] bg-white p-4 transition hover:border-[#071f49]">
        <p class="text-xs font-semibold text-[#637084]">Utilisateurs inscrits</p>
        <div class="mt-1.5 flex items-baseline justify-between">
            <p class="text-2xl font-extrabold text-[#071f49]">{{ $stats['total_users'] }}</p>
            <span class="rounded-full bg-[#eaf0f8] px-2 py-0.5 text-[11px] font-bold text-[#071f49]">
                {{ $stats['pro_users'] }} pros
            </span>
        </div>
        <p class="mt-1 text-[11px] text-[#8a95a5]">{{ $stats['active_users'] }} comptes actifs</p>
    </a>

    <a href="{{ route('admin.inquiries') }}" class="rounded-2xl border border-[#dce2e9] bg-white p-4 transition hover:border-[#071f49]">
        <p class="text-xs font-semibold text-[#637084]">Demandes de contact</p>
        <div class="mt-1.5 flex items-baseline justify-between">
            <p class="text-2xl font-extrabold text-[#071f49]">{{ $stats['total_inquiries'] }}</p>
            @if($stats['new_inquiries'] > 0)
                <span class="rounded-full bg-[#fff6df] px-2 py-0.5 text-[11px] font-bold text-[#996300]">
                    {{ $stats['new_inquiries'] }} nouvelles
                </span>
            @endif
        </div>
        <p class="mt-1 text-[11px] text-[#8a95a5]">Messages clients reçus</p>
    </a>

    <div class="rounded-2xl border border-[#dce2e9] bg-white p-4">
        <p class="text-xs font-semibold text-[#637084]">Vues cumulées</p>
        <p class="mt-1.5 text-2xl font-extrabold text-[#071f49]">{{ number_format($stats['total_views'], 0, ',', ' ') }}</p>
        <p class="mt-1 text-[11px] text-[#8a95a5]">Consultations de fiches</p>
    </div>

    <div class="rounded-2xl border border-[#dce2e9] bg-white p-4">
        <p class="text-xs font-semibold text-[#637084]">Favoris enregistrés</p>
        <p class="mt-1.5 text-2xl font-extrabold text-[#071f49]">{{ number_format($stats['total_favorites'], 0, ',', ' ') }}</p>
        <p class="mt-1 text-[11px] text-[#8a95a5]">Biens sauvegardés</p>
    </div>
</div>

<!-- Répartitions analytiques -->
<div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
    <!-- Par ville -->
    <div class="rounded-2xl border border-[#dce2e9] bg-white p-6">
        <h2 class="text-base font-bold text-[#071f49]">Répartition par ville</h2>
        <p class="mt-0.5 text-xs text-[#637084]">Volume d'annonces par localité</p>

        <div class="mt-4 space-y-3">
            @forelse($listingsByCity as $row)
                @php $pct = round(($row->total / $totalListings) * 100); @endphp
                <div>
                    <div class="flex items-center justify-between text-xs font-semibold">
                        <span class="text-[#071f49]">{{ $row->city }}</span>
                        <span class="text-[#637084]">{{ $row->total }} ({{ $pct }}%)</span>
                    </div>
                    <div class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#eef2f6]">
                        <div class="h-full rounded-full bg-[#071f49]" style="width: {{ $pct }}%"></div>
                    </div>
                </div>
            @empty
                <p class="text-xs text-[#637084]">Aucune donnée disponible.</p>
            @endforelse
        </div>
    </div>

    <!-- Par type & transaction -->
    <div class="rounded-2xl border border-[#dce2e9] bg-white p-6">
        <h2 class="text-base font-bold text-[#071f49]">Typologie du catalogue</h2>
        <p class="mt-0.5 text-xs text-[#637084]">Ventes vs Locations & types de biens</p>

        <div class="mt-4">
            <div class="flex h-3 w-full overflow-hidden rounded-full bg-[#eef2f6]">
                <div class="bg-[#071f49]" style="width: {{ $ventePct }}%" title="Ventes {{ $ventePct }}%"></div>
                <div class="bg-[#f3ad19]" style="width: {{ $locationPct }}%" title="Locations {{ $locationPct }}%"></div>
            </div>
            <div class="mt-2 flex items-center justify-between text-xs font-semibold">
                <span class="flex items-center gap-1.5 text-[#071f49]">
                    <span class="h-2.5 w-2.5 rounded-full bg-[#071f49]"></span> Vente ({{ $ventePct }}%)
                </span>
                <span class="flex items-center gap-1.5 text-[#996300]">
                    <span class="h-2.5 w-2.5 rounded-full bg-[#f3ad19]"></span> Location ({{ $locationPct }}%)
                </span>
            </div>
        </div>

        <div class="mt-5 space-y-2.5 border-t border-[#eef2f6] pt-4">
            @foreach($listingsByType as $row)
                @php $pct = round(($row->total / $totalListings) * 100); @endphp
                <div class="flex items-center justify-between text-xs">
                    <span class="font-medium text-[#172b45]">{{ $typeLabels[$row->type] ?? ucfirst($row->type) }}</span>
                    <span class="rounded-md bg-[#f4f6f8] px-2 py-0.5 font-bold text-[#071f49]">{{ $row->total }} · {{ $pct }}%</span>
                </div>
            @endforeach
        </div>
    </div>

    <!-- Top annonces les plus vues -->
    <div class="rounded-2xl border border-[#dce2e9] bg-white p-6">
        <h2 class="text-base font-bold text-[#071f49]">Biens les plus consultés</h2>
        <p class="mt-0.5 text-xs text-[#637084]">Classement par nombre de vues</p>

        <div class="mt-4 space-y-3">
            @forelse($topListings as $item)
                <a href="{{ route('admin.listings.show', $item) }}"
                   class="flex items-center justify-between gap-3 rounded-xl border border-[#eef2f6] p-2.5 transition hover:border-[#f3ad19] hover:bg-[#fffdf7]">
                    <div class="flex min-w-0 items-center gap-2.5">
                        <img src="{{ $item->image }}" alt="" class="h-10 w-12 shrink-0 rounded-lg border border-[#dce2e9] object-cover" />
                        <div class="min-w-0">
                            <p class="truncate text-xs font-bold text-[#071f49]">{{ $item->title }}</p>
                            <p class="text-[11px] text-[#637084]">{{ $item->city }} · {{ number_format($item->price, 0, ',', ' ') }} FCFA</p>
                        </div>
                    </div>
                    <span class="shrink-0 rounded-full bg-[#eaf0f8] px-2.5 py-1 text-[11px] font-bold text-[#071f49]">
                        {{ number_format($item->views, 0, ',', ' ') }} vues
                    </span>
                </a>
            @empty
                <p class="text-xs text-[#637084]">Aucune annonce enregistrée.</p>
            @endforelse
        </div>
    </div>
</div>

<!-- File de modération + Derniers contacts -->
<div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
    <div class="rounded-2xl border border-[#dce2e9] bg-white p-6 lg:col-span-2">
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-lg font-bold text-[#071f49]">Annonces en attente de validation</h2>
                <p class="text-xs text-[#637084]">Validez ou inspectez rapidement les nouvelles soumissions</p>
            </div>
            <a href="{{ route('admin.listings', ['status' => 'pending']) }}" class="text-xs font-bold text-[#071f49] underline">
                Tout voir
            </a>
        </div>

        @if($pendingListings->isEmpty())
            <div class="mt-6 rounded-xl border border-dashed border-[#dce2e9] bg-[#f8fafc] p-8 text-center">
                <p class="text-sm font-semibold text-[#071f49]">File de modération vide</p>
                <p class="mt-1 text-xs text-[#637084]">Toutes les annonces soumises ont été traitées.</p>
            </div>
        @else
            <div class="mt-4 divide-y divide-[#eef2f6]">
                @foreach($pendingListings as $item)
                    <div class="flex flex-wrap items-center justify-between gap-4 py-3.5">
                        <div class="flex min-w-0 items-center gap-3">
                            <img src="{{ $item->image }}" alt="" class="h-14 w-20 shrink-0 rounded-xl border border-[#dce2e9] object-cover" />
                            <div class="min-w-0">
                                <a href="{{ route('admin.listings.show', $item) }}" class="block truncate font-semibold text-[#071f49] hover:underline">
                                    {{ $item->title }}
                                </a>
                                <p class="text-xs text-[#637084]">
                                    {{ $item->neighborhood }}, {{ $item->city }} · {{ number_format($item->price, 0, ',', ' ') }} FCFA · Par {{ $item->seller }}
                                </p>
                                <p class="mt-0.5 text-[11px] text-[#8a95a5]">
                                    Soumise {{ $item->created_at?->diffForHumans() }} · {{ $item->reference }}
                                </p>
                            </div>
                        </div>
                        <div class="flex shrink-0 items-center gap-2">
                            <form method="POST" action="{{ route('admin.listings.moderate', $item) }}">
                                @csrf @method('PATCH')
                                <input type="hidden" name="status" value="approved" />
                                <button type="submit" class="rounded-lg bg-[#e7f6ec] px-3 py-1.5 text-xs font-bold text-[#1f7a3d] transition hover:bg-[#d1fae5]">
                                    Valider
                                </button>
                            </form>
                            <a href="{{ route('admin.listings.show', $item) }}" class="rounded-lg border border-[#dce2e9] px-3 py-1.5 text-xs font-semibold text-[#071f49] transition hover:bg-[#f8fafc]">
                                Inspecter
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>
        @endif
    </div>

    <div class="rounded-2xl border border-[#dce2e9] bg-white p-6">
        <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-[#071f49]">Derniers contacts</h2>
            <a href="{{ route('admin.inquiries') }}" class="text-xs font-bold text-[#071f49] underline">Tout voir</a>
        </div>
        @if($recentInquiries->isEmpty())
            <p class="mt-6 text-sm text-[#637084]">Aucune demande de contact reçue.</p>
        @else
            <div class="mt-4 space-y-3">
                @foreach($recentInquiries as $inq)
                    <div class="rounded-xl border border-[#eef2f6] bg-[#f8fafc] p-3.5">
                        <div class="flex items-center justify-between gap-2">
                            <p class="truncate text-xs font-bold text-[#071f49]">{{ $inq->name }}</p>
                            @if($inq->status === 'new')
                                <span class="rounded-full bg-[#fff6df] px-2 py-0.5 text-[10px] font-bold text-[#996300]">Nouveau</span>
                            @elseif($inq->status === 'replied')
                                <span class="rounded-full bg-[#e7f6ec] px-2 py-0.5 text-[10px] font-bold text-[#1f7a3d]">Répondu</span>
                            @else
                                <span class="rounded-full bg-[#eaf0f8] px-2 py-0.5 text-[10px] font-bold text-[#071f49]">Lu</span>
                            @endif
                        </div>
                        <p class="mt-0.5 truncate text-[11px] font-medium text-[#637084]">{{ $inq->listing?->title ?? 'Bien supprimé' }}</p>
                        <p class="mt-1.5 line-clamp-2 text-xs text-[#172b45]">{{ $inq->message }}</p>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</div>
@endsection
