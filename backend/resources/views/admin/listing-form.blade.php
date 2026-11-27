@extends('admin.layout')

@section('title', $listing ? 'Modifier une annonce' : 'Nouvelle annonce')

@section('content')
@php
    $isEdit = $listing !== null;
    $featureOptions = ['Jardin', 'Parking', 'Terrasse', 'Piscine', 'Climatisation', 'Groupe électrogène', 'Meublé', 'Clôture', 'Cuisine aménagée'];
    $documentOptions = ['Titre foncier', 'Permis de bâtir', 'Plan cadastral'];
    $selectedFeatures = old('features', $listing?->features ?? []);
    $selectedDocs = old('documents', $listing?->documents ?? []);
@endphp

<div class="flex items-center justify-between">
    <div>
        <a href="{{ $isEdit ? route('admin.listings.show', $listing) : route('admin.listings') }}"
           class="text-sm font-semibold text-[#637084] hover:text-[#071f49]">
            ← Retour
        </a>
        <h1 class="mt-2 text-2xl font-extrabold text-[#071f49]">
            {{ $isEdit ? 'Modifier : ' . $listing->title : 'Créer une nouvelle annonce' }}
        </h1>
    </div>
</div>

<form method="POST"
      action="{{ $isEdit ? route('admin.listings.update', $listing) : route('admin.listings.store') }}"
      enctype="multipart/form-data"
      class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
    @csrf
    @if($isEdit)
        @method('PUT')
    @endif

    <div class="space-y-6 lg:col-span-2">
        <div class="rounded-2xl border border-[#dce2e9] bg-white p-6 shadow-xs space-y-4">
            <h2 class="text-base font-bold text-[#071f49]">Informations principales</h2>

            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Titre de l'annonce *</label>
                <input type="text" name="title" value="{{ old('title', $listing?->title) }}" required
                       class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3.5 text-sm outline-none focus:border-[#f3ad19] focus:bg-white" />
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <label class="mb-1 block text-xs font-semibold text-[#637084]">Transaction *</label>
                    <select name="transaction" class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]">
                        <option value="vente" @selected(old('transaction', $listing?->transaction) === 'vente')>Vente</option>
                        <option value="location" @selected(old('transaction', $listing?->transaction) === 'location')>Location</option>
                    </select>
                </div>
                <div>
                    <label class="mb-1 block text-xs font-semibold text-[#637084]">Type de bien *</label>
                    <select name="type" class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]">
                        @foreach(['villa' => 'Maison / Villa', 'appartement' => 'Appartement', 'terrain' => 'Terrain', 'studio' => 'Studio', 'bureau' => 'Bureau / Commerce'] as $k => $v)
                            <option value="{{ $k }}" @selected(old('type', $listing?->type) === $k)>{{ $v }}</option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label class="mb-1 block text-xs font-semibold text-[#637084]">État *</label>
                    <select name="condition" class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]">
                        <option value="neuf" @selected(old('condition', $listing?->condition) === 'neuf')>Neuf / Récent</option>
                        <option value="ancien" @selected(old('condition', $listing?->condition ?? 'ancien') === 'ancien')>Ancien</option>
                        <option value="a_renover" @selected(old('condition', $listing?->condition) === 'a_renover')>À rénover</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label class="mb-1 block text-xs font-semibold text-[#637084]">Ville *</label>
                    <input type="text" name="city" value="{{ old('city', $listing?->city ?? 'Douala') }}" required
                           class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3.5 text-sm outline-none focus:border-[#f3ad19] focus:bg-white" />
                </div>
                <div>
                    <label class="mb-1 block text-xs font-semibold text-[#637084]">Quartier *</label>
                    <input type="text" name="neighborhood" value="{{ old('neighborhood', $listing?->neighborhood) }}" required
                           class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3.5 text-sm outline-none focus:border-[#f3ad19] focus:bg-white" />
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                    <label class="mb-1 block text-xs font-semibold text-[#637084]">Prix (FCFA) *</label>
                    <input type="number" name="price" value="{{ old('price', $listing?->price) }}" min="0" required
                           class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]" />
                </div>
                <div>
                    <label class="mb-1 block text-xs font-semibold text-[#637084]">Ancien prix</label>
                    <input type="number" name="original_price" value="{{ old('original_price', $listing?->original_price) }}" min="0"
                           class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]" />
                </div>
                <div>
                    <label class="mb-1 block text-xs font-semibold text-[#637084]">Surface (m²) *</label>
                    <input type="number" name="surface" value="{{ old('surface', $listing?->surface) }}" min="1" required
                           class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]" />
                </div>
                <div>
                    <label class="mb-1 block text-xs font-semibold text-[#637084]">Terrain (m²)</label>
                    <input type="number" name="land" value="{{ old('land', $listing?->land) }}" min="0"
                           class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]" />
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                    <label class="mb-1 block text-xs font-semibold text-[#637084]">Pièces</label>
                    <input type="number" name="rooms" value="{{ old('rooms', $listing?->rooms ?? 0) }}" min="0"
                           class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]" />
                </div>
                <div>
                    <label class="mb-1 block text-xs font-semibold text-[#637084]">Chambres</label>
                    <input type="number" name="bedrooms" value="{{ old('bedrooms', $listing?->bedrooms ?? 0) }}" min="0"
                           class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]" />
                </div>
                <div>
                    <label class="mb-1 block text-xs font-semibold text-[#637084]">Salles de bain</label>
                    <input type="number" name="bathrooms" value="{{ old('bathrooms', $listing?->bathrooms ?? 0) }}" min="0"
                           class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]" />
                </div>
                <div>
                    <label class="mb-1 block text-xs font-semibold text-[#637084]">Parking</label>
                    <input type="number" name="parking" value="{{ old('parking', $listing?->parking ?? 0) }}" min="0"
                           class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]" />
                </div>
            </div>

            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Description principale *</label>
                <textarea name="description" rows="4" required
                          class="w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] p-3 text-sm outline-none focus:border-[#f3ad19] focus:bg-white">{{ old('description', $listing?->description) }}</textarea>
            </div>

            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Complément d'information</label>
                <textarea name="description2" rows="2"
                          class="w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] p-3 text-sm outline-none focus:border-[#f3ad19] focus:bg-white">{{ old('description2', $listing?->description2) }}</textarea>
            </div>
        </div>

        <div class="rounded-2xl border border-[#dce2e9] bg-white p-6 shadow-xs space-y-4">
            <h2 class="text-base font-bold text-[#071f49]">Équipements & Documents</h2>
            <div>
                <p class="mb-2 text-xs font-semibold text-[#637084]">Équipements</p>
                <div class="flex flex-wrap gap-2">
                    @foreach($featureOptions as $feat)
                        <label class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#dce2e9] bg-[#f8fafc] px-3 py-1.5 text-xs font-semibold">
                            <input type="checkbox" name="features[]" value="{{ $feat }}" @checked(in_array($feat, $selectedFeatures, true)) />
                            {{ $feat }}
                        </label>
                    @endforeach
                </div>
            </div>
            <div>
                <p class="mb-2 text-xs font-semibold text-[#637084]">Documents disponibles</p>
                <div class="flex flex-wrap gap-2">
                    @foreach($documentOptions as $doc)
                        <label class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#dce2e9] bg-[#f8fafc] px-3 py-1.5 text-xs font-semibold">
                            <input type="checkbox" name="documents[]" value="{{ $doc }}" @checked(in_array($doc, $selectedDocs, true)) />
                            {{ $doc }}
                        </label>
                    @endforeach
                </div>
            </div>
        </div>
    </div>

    <!-- Colonne latérale -->
    <div class="space-y-6">
        <div class="rounded-2xl border border-[#dce2e9] bg-white p-6 shadow-xs space-y-4">
            <h2 class="text-base font-bold text-[#071f49]">Publication & Photos</h2>

            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Statut</label>
                <select name="status" class="h-11 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm font-semibold outline-none focus:border-[#f3ad19]">
                    <option value="approved" @selected(old('status', $listing?->status ?? 'approved') === 'approved')>Validée (publiée)</option>
                    <option value="pending" @selected(old('status', $listing?->status) === 'pending')>En attente</option>
                    <option value="rejected" @selected(old('status', $listing?->status) === 'rejected')>Refusée</option>
                </select>
            </div>

            <div class="flex flex-col gap-2 text-xs font-semibold text-[#071f49]">
                <label class="inline-flex items-center gap-2">
                    <input type="checkbox" name="is_new" value="1" @checked(old('is_new', $listing?->is_new ?? true)) />
                    Badge « Nouveau »
                </label>
                <label class="inline-flex items-center gap-2">
                    <input type="checkbox" name="price_dropped" value="1" @checked(old('price_dropped', $listing?->price_dropped ?? false)) />
                    Badge « Prix baissé »
                </label>
            </div>

            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Importer des photos</label>
                <input type="file" name="photos[]" multiple accept="image/*"
                       class="w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] p-2 text-xs" />
            </div>

            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Ou chemin image (/assets/...)</label>
                <input type="text" name="image_url" value="{{ old('image_url') }}" placeholder="/assets/d92fa.png"
                       class="h-10 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs outline-none focus:border-[#f3ad19]" />
            </div>
        </div>

        <div class="rounded-2xl border border-[#dce2e9] bg-white p-6 shadow-xs space-y-4">
            <h2 class="text-base font-bold text-[#071f49]">Annonceur</h2>
            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Nom du vendeur / agence *</label>
                <input type="text" name="seller" value="{{ old('seller', $listing?->seller ?? 'IMMO DU LETCH') }}" required
                       class="h-10 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]" />
            </div>
            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Type d'annonceur *</label>
                <select name="seller_type" class="h-10 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]">
                    <option value="professionnel" @selected(old('seller_type', $listing?->seller_type ?? 'professionnel') === 'professionnel')>Professionnel</option>
                    <option value="particulier" @selected(old('seller_type', $listing?->seller_type) === 'particulier')>Particulier</option>
                </select>
            </div>
            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Téléphone</label>
                <input type="text" name="seller_phone" value="{{ old('seller_phone', $listing?->seller_phone ?? '+237 6 55 00 00 00') }}"
                       class="h-10 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]" />
            </div>

            <button type="submit"
                    class="h-11 w-full rounded-xl bg-[#f3ad19] text-sm font-bold text-[#071f49] shadow-xs transition hover:bg-[#ffbe33]">
                {{ $isEdit ? 'Enregistrer les modifications' : 'Créer l\'annonce' }}
            </button>
        </div>
    </div>
</form>
@endsection
