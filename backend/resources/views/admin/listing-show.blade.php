@extends('admin.layout')

@section('title', $listing->title)

@section('content')
@php
    $pricePerSqm = $listing->surface > 0 ? round($listing->price / $listing->surface) : 0;
    $gallery = $listing->gallery && count($listing->gallery) > 0 ? $listing->gallery : [$listing->image];
@endphp

<div class="flex flex-wrap items-center justify-between gap-3">
    <a href="{{ route('admin.listings') }}" class="inline-flex items-center gap-1.5 text-sm font-semibold text-[#637084] hover:text-[#071f49]">
        ← Retour à la liste des annonces
    </a>
    <div class="flex items-center gap-2">
        <a href="{{ route('admin.listings.edit', $listing) }}"
           class="rounded-xl border border-[#dce2e9] bg-white px-4 py-2 text-xs font-bold text-[#071f49] transition hover:border-[#071f49]">
            Modifier l'annonce
        </a>
        <form method="POST" action="{{ route('admin.listings.destroy', $listing) }}"
              onsubmit="return confirm('Supprimer définitivement cette annonce ?');">
            @csrf @method('DELETE')
            <button type="submit" class="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-2 text-xs font-bold text-[#dc2626] transition hover:bg-[#fee2e2]">
                Supprimer l'annonce
            </button>
        </form>
    </div>
</div>

<div class="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
    <!-- Colonne principale -->
    <div class="space-y-6 lg:col-span-2">
        <div class="rounded-2xl border border-[#dce2e9] bg-white p-6 shadow-xs">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                    <span class="rounded-full bg-[#eaf0f8] px-3 py-1 text-xs font-bold text-[#071f49]">
                        {{ $listing->reference }}
                    </span>
                    <span class="rounded-full bg-[#f4f6f8] px-3 py-1 text-xs font-semibold capitalize text-[#637084]">
                        {{ $listing->transaction }} · {{ $listing->type }}
                    </span>
                </div>
                @if($listing->status === 'approved')
                    <span class="rounded-full bg-[#e7f6ec] px-3 py-1 text-xs font-bold text-[#1f7a3d]">Validée · Publiée</span>
                @elseif($listing->status === 'rejected')
                    <span class="rounded-full bg-[#fef2f2] px-3 py-1 text-xs font-bold text-[#dc2626]">Refusée</span>
                @else
                    <span class="rounded-full bg-[#fff6df] px-3 py-1 text-xs font-bold text-[#996300]">En attente de validation</span>
                @endif
            </div>

            <h1 class="mt-3 text-2xl font-extrabold text-[#071f49]">{{ $listing->title }}</h1>
            <p class="mt-1 text-sm text-[#637084]">
                {{ $listing->neighborhood }}, {{ $listing->city }} ({{ $listing->region }})
            </p>

            <div class="mt-4 flex flex-wrap items-baseline gap-4">
                <p class="text-2xl font-extrabold text-[#071f49]">
                    {{ number_format($listing->price, 0, ',', ' ') }} FCFA{{ $listing->transaction === 'location' ? ' / mois' : '' }}
                </p>
                @if($pricePerSqm > 0)
                    <span class="rounded-lg bg-[#f4f6f8] px-2.5 py-1 text-xs font-semibold text-[#637084]">
                        {{ number_format($pricePerSqm, 0, ',', ' ') }} FCFA / m²
                    </span>
                @endif
                <span class="text-xs font-semibold text-[#637084]">
                    {{ number_format($listing->views, 0, ',', ' ') }} vues
                </span>
            </div>

            <!-- Galerie -->
            <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                @foreach($gallery as $photo)
                    <button type="button" onclick="openLightbox('{{ $photo }}')" class="group overflow-hidden rounded-xl border border-[#dce2e9]">
                        <img src="{{ $photo }}" alt="" class="aspect-[4/3] w-full object-cover transition duration-200 group-hover:scale-105" />
                    </button>
                @endforeach
            </div>

            <!-- Caractéristiques techniques -->
            <div class="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-[#eef2f6] bg-[#f8fafc] p-4 sm:grid-cols-4">
                <div>
                    <p class="text-[11px] font-semibold uppercase text-[#8a95a5]">Surface</p>
                    <p class="mt-0.5 text-sm font-bold text-[#071f49]">{{ $listing->surface }} m²</p>
                </div>
                <div>
                    <p class="text-[11px] font-semibold uppercase text-[#8a95a5]">Pièces</p>
                    <p class="mt-0.5 text-sm font-bold text-[#071f49]">{{ $listing->rooms }} ({{ $listing->bedrooms }} ch.)</p>
                </div>
                <div>
                    <p class="text-[11px] font-semibold uppercase text-[#8a95a5]">État</p>
                    <p class="mt-0.5 text-sm font-bold capitalize text-[#071f49]">{{ str_replace('_', ' ', $listing->condition) }}</p>
                </div>
                <div>
                    <p class="text-[11px] font-semibold uppercase text-[#8a95a5]">Parking</p>
                    <p class="mt-0.5 text-sm font-bold text-[#071f49]">{{ $listing->parking }} place(s)</p>
                </div>
            </div>

            <div class="mt-6">
                <h2 class="text-xs font-bold uppercase tracking-wider text-[#637084]">Description</h2>
                <p class="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#172b45]">{{ $listing->description }}</p>
                @if($listing->description2)
                    <p class="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#637084]">{{ $listing->description2 }}</p>
                @endif
            </div>

            @if(!empty($listing->features))
                <div class="mt-6">
                    <h2 class="text-xs font-bold uppercase tracking-wider text-[#637084]">Équipements</h2>
                    <div class="mt-2 flex flex-wrap gap-2">
                        @foreach($listing->features as $feature)
                            <span class="rounded-full border border-[#dce2e9] bg-[#f8fafc] px-3 py-1 text-xs font-semibold text-[#071f49]">{{ $feature }}</span>
                        @endforeach
                    </div>
                </div>
            @endif

            @if(!empty($listing->documents))
                <div class="mt-5">
                    <h2 class="text-xs font-bold uppercase tracking-wider text-[#637084]">Documents disponibles</h2>
                    <div class="mt-2 flex flex-wrap gap-2">
                        @foreach($listing->documents as $doc)
                            <span class="rounded-full border border-[#bbf7d0] bg-[#e7f6ec] px-3 py-1 text-xs font-semibold text-[#1f7a3d]">{{ $doc }}</span>
                        @endforeach
                    </div>
                </div>
            @endif
        </div>

        <!-- Demandes reçues sur ce bien -->
        <div class="rounded-2xl border border-[#dce2e9] bg-white p-6 shadow-xs">
            <h2 class="text-base font-bold text-[#071f49]">Demandes de contact liées ({{ $listing->inquiries->count() }})</h2>
            @if($listing->inquiries->isEmpty())
                <p class="mt-3 text-xs text-[#637084]">Aucune demande de contact reçue pour ce bien.</p>
            @else
                <div class="mt-4 space-y-3">
                    @foreach($listing->inquiries as $inq)
                        <div class="rounded-xl border border-[#eef2f6] bg-[#f8fafc] p-3.5 text-xs">
                            <div class="flex items-center justify-between gap-2">
                                <span class="font-bold text-[#071f49]">{{ $inq->name }} ({{ $inq->email }})</span>
                                <span class="text-[#8a95a5]">{{ $inq->created_at->format('d/m/Y H:i') }}</span>
                            </div>
                            <p class="mt-1.5 text-[#172b45]">{{ $inq->message }}</p>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </div>

    <!-- Colonne latérale -->
    <div class="space-y-5">
        <div class="rounded-2xl border border-[#dce2e9] bg-white p-6 shadow-xs">
            <h2 class="text-lg font-bold text-[#071f49]">Décision de modération</h2>
            <p class="mt-1 text-xs text-[#637084]">Seul l'administrateur peut valider ou refuser cette annonce.</p>

            @if($listing->moderator)
                <p class="mt-3 rounded-xl bg-[#f8fafc] p-3 text-xs text-[#637084]">
                    Dernière modération par <strong class="text-[#071f49]">{{ $listing->moderator->name }}</strong>
                    le {{ $listing->moderated_at?->format('d/m/Y H:i') }}.
                </p>
            @endif

            <div class="mt-4 space-y-2.5">
                <form method="POST" action="{{ route('admin.listings.moderate', $listing) }}">
                    @csrf @method('PATCH')
                    <input type="hidden" name="status" value="approved" />
                    <button type="submit" class="h-10 w-full rounded-xl bg-[#1f7a3d] text-xs font-bold text-white transition hover:bg-[#166534]">
                        Valider et publier l'annonce
                    </button>
                </form>

                <form method="POST" action="{{ route('admin.listings.moderate', $listing) }}">
                    @csrf @method('PATCH')
                    <input type="hidden" name="status" value="pending" />
                    <button type="submit" class="h-10 w-full rounded-xl border border-[#fde68a] bg-[#fff6df] text-xs font-bold text-[#996300] transition hover:bg-[#fef3c7]">
                        Mettre en attente
                    </button>
                </form>

                <form method="POST" action="{{ route('admin.listings.moderate', $listing) }}" class="border-t border-[#eef2f6] pt-3">
                    @csrf @method('PATCH')
                    <input type="hidden" name="status" value="rejected" />
                    <label class="block text-xs font-semibold text-[#637084]">Motif du refus</label>
                    <textarea name="rejection_reason" rows="3"
                              placeholder="Ex: Photos floues ou titre foncier manquant…"
                              class="mt-1.5 w-full rounded-xl border border-[#dce2e9] p-2.5 text-xs outline-none focus:border-[#dc2626]">{{ old('rejection_reason', $listing->rejection_reason) }}</textarea>
                    <button type="submit" class="mt-2 h-10 w-full rounded-xl bg-[#dc2626] text-xs font-bold text-white transition hover:bg-[#b91c1c]">
                        Refuser l'annonce
                    </button>
                </form>
            </div>
        </div>

        <div class="rounded-2xl border border-[#dce2e9] bg-white p-6 text-sm shadow-xs">
            <h2 class="text-base font-bold text-[#071f49]">Annonceur</h2>
            <p class="mt-2 font-bold text-[#071f49]">{{ $listing->seller }}</p>
            <p class="text-xs capitalize text-[#637084]">Type : {{ $listing->seller_type }}</p>
            @if($listing->seller_phone)
                <p class="mt-1 text-xs text-[#637084]">
                    Tél : <a href="tel:{{ $listing->seller_phone }}" class="font-semibold text-[#071f49] underline">{{ $listing->seller_phone }}</a>
                </p>
            @endif
            @if($listing->user)
                <p class="mt-1 text-xs text-[#637084]">
                    Compte : <a href="mailto:{{ $listing->user->email }}" class="font-semibold text-[#071f49] underline">{{ $listing->user->email }}</a>
                </p>
            @endif
        </div>
    </div>
</div>

<!-- Lightbox photo -->
<div id="photo-lightbox" onclick="closeLightbox()" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/80 p-4">
    <img id="lightbox-img" src="" alt="" class="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl" />
</div>

@push('scripts')
<script>
    function openLightbox(src) {
        const box = document.getElementById('photo-lightbox');
        document.getElementById('lightbox-img').src = src;
        box.classList.remove('hidden');
        box.classList.add('flex');
    }
    function closeLightbox() {
        const box = document.getElementById('photo-lightbox');
        box.classList.add('hidden');
        box.classList.remove('flex');
    }
</script>
@endpush
@endsection
