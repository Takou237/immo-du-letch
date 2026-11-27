@extends('admin.layout')

@section('title', 'Accueil & Paramètres')

@section('content')
<div>
    <h1 class="text-2xl font-extrabold text-[#071f49]">Accueil & Paramètres du site</h1>
    <p class="mt-1 text-sm text-[#637084]">Configurez les slides du carrousel d'accueil et les informations générales de la plateforme.</p>
</div>

<!-- Paramètres généraux -->
<div class="mt-6 rounded-2xl border border-[#dce2e9] bg-white p-6 shadow-xs">
    <h2 class="text-base font-bold text-[#071f49]">Paramètres généraux</h2>
    <form method="POST" action="{{ route('admin.settings.update') }}" class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
        @csrf @method('PUT')
        <div>
            <label class="mb-1 block text-xs font-semibold text-[#637084]">Années d'expérience</label>
            <input type="text" name="years_experience" value="{{ $settings['years_experience'] }}" required
                   class="h-10 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]" />
        </div>
        <div>
            <label class="mb-1 block text-xs font-semibold text-[#637084]">Téléphone principal</label>
            <input type="text" name="contact_phone" value="{{ $settings['contact_phone'] }}" required
                   class="h-10 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]" />
        </div>
        <div>
            <label class="mb-1 block text-xs font-semibold text-[#637084]">E-mail de contact</label>
            <input type="email" name="contact_email" value="{{ $settings['contact_email'] }}" required
                   class="h-10 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-sm outline-none focus:border-[#f3ad19]" />
        </div>
        <div class="flex items-end">
            <button type="submit" class="h-10 w-full rounded-xl bg-[#071f49] px-4 text-xs font-bold text-white hover:bg-[#0d2d66]">
                Enregistrer
            </button>
        </div>
    </form>
</div>

<!-- Carrousel Hero -->
<div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
    <div class="rounded-2xl border border-[#dce2e9] bg-white p-6 shadow-xs h-fit">
        <h2 class="text-base font-bold text-[#071f49]">Ajouter un slide d'accueil</h2>
        <form method="POST" action="{{ route('admin.slides.store') }}" class="mt-4 space-y-3">
            @csrf
            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Annonce liée (optionnel)</label>
                <select name="listing_slug" class="h-10 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs">
                    <option value="">Aucune</option>
                    @foreach($listings as $l)
                        <option value="{{ $l->slug }}">{{ $l->title }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Tag *</label>
                <input type="text" name="tag" placeholder="Ex: VILLA CONTEMPORAINE" required
                       class="h-10 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs" />
            </div>
            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Titre *</label>
                <input type="text" name="title" required
                       class="h-10 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs" />
            </div>
            <div class="grid grid-cols-2 gap-2">
                <input type="text" name="location" placeholder="Quartier, Ville" required
                       class="h-10 rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs" />
                <input type="text" name="price_label" placeholder="185 000 000 FCFA" required
                       class="h-10 rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs" />
            </div>
            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Image (/assets/...) *</label>
                <input type="text" name="image" value="/assets/d92fa.png" required
                       class="h-10 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs" />
            </div>
            <button type="submit" class="h-10 w-full rounded-xl bg-[#f3ad19] text-xs font-bold text-[#071f49] hover:bg-[#ffbe33]">
                Ajouter le slide
            </button>
        </form>
    </div>

    <div class="space-y-4 lg:col-span-2">
        @foreach($slides as $slide)
            <div class="rounded-2xl border border-[#dce2e9] bg-white p-5 shadow-xs">
                <form method="POST" action="{{ route('admin.slides.update', $slide) }}" class="space-y-3">
                    @csrf @method('PUT')
                    <div class="flex items-center justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <img src="{{ $slide->image }}" alt="" class="h-12 w-20 rounded-lg border border-[#dce2e9] object-cover" />
                            <span class="rounded-full bg-[#fff6df] px-2.5 py-0.5 text-[10px] font-bold text-[#996300]">{{ $slide->tag }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <input type="number" name="sort_order" value="{{ $slide->sort_order }}" class="h-8 w-16 rounded-lg border border-[#dce2e9] px-2 text-center text-xs" />
                            <label class="inline-flex items-center gap-1 text-xs font-semibold">
                                <input type="checkbox" name="is_active" value="1" @checked($slide->is_active) /> Actif
                            </label>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <input type="text" name="tag" value="{{ $slide->tag }}" required class="h-9 rounded-lg border border-[#dce2e9] px-3 text-xs font-semibold" />
                        <input type="text" name="title" value="{{ $slide->title }}" required class="h-9 rounded-lg border border-[#dce2e9] px-3 text-xs font-bold sm:col-span-2" />
                    </div>
                    <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <input type="text" name="location" value="{{ $slide->location }}" required class="h-9 rounded-lg border border-[#dce2e9] px-3 text-xs" />
                        <input type="text" name="price_label" value="{{ $slide->price_label }}" required class="h-9 rounded-lg border border-[#dce2e9] px-3 text-xs font-semibold" />
                        <input type="text" name="listing_slug" value="{{ $slide->listing_slug }}" placeholder="slug annonce" class="h-9 rounded-lg border border-[#dce2e9] px-3 text-xs" />
                    </div>
                    <input type="text" name="image" value="{{ $slide->image }}" required class="h-9 w-full rounded-lg border border-[#dce2e9] px-3 text-xs" />

                    <div class="flex justify-end">
                        <button type="submit" class="rounded-lg bg-[#071f49] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0d2d66]">
                            Enregistrer
                        </button>
                    </div>
                </form>
                <form method="POST" action="{{ route('admin.slides.destroy', $slide) }}"
                      onsubmit="return confirm('Supprimer ce slide ?');" class="-mt-7">
                    @csrf @method('DELETE')
                    <button type="submit" class="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-1.5 text-xs font-bold text-[#dc2626]">
                        Supprimer
                    </button>
                </form>
            </div>
        @endforeach
    </div>
</div>
@endsection
