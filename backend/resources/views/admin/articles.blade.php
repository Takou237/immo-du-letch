@extends('admin.layout')

@section('title', 'Articles & Conseils')

@section('content')
<div>
    <h1 class="text-2xl font-extrabold text-[#071f49]">Articles & Conseils immobiliers</h1>
    <p class="mt-1 text-sm text-[#637084]">Gérez les articles affichés dynamiquement sur la page d'accueil du site.</p>
</div>

<div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
    <!-- Ajouter un article -->
    <div class="rounded-2xl border border-[#dce2e9] bg-white p-6 shadow-xs h-fit">
        <h2 class="text-base font-bold text-[#071f49]">Nouvel article</h2>
        <form method="POST" action="{{ route('admin.articles.store') }}" class="mt-4 space-y-3">
            @csrf
            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Catégorie (Tag) *</label>
                <input type="text" name="tag" placeholder="Ex: ACHETER, LOUER, INVESTIR" required
                       class="h-10 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs outline-none focus:border-[#f3ad19]" />
            </div>
            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Titre *</label>
                <input type="text" name="title" required
                       class="h-10 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs outline-none focus:border-[#f3ad19]" />
            </div>
            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Image (/assets/...) *</label>
                <input type="text" name="image" value="/assets/26532.png" required
                       class="h-10 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs outline-none focus:border-[#f3ad19]" />
            </div>
            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Contenu (1 paragraphe par ligne) *</label>
                <textarea name="body" rows="5" required
                          class="w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] p-3 text-xs outline-none focus:border-[#f3ad19]"></textarea>
            </div>
            <label class="inline-flex items-center gap-2 text-xs font-semibold text-[#071f49]">
                <input type="checkbox" name="is_published" value="1" checked /> Publier immédiatement
            </label>
            <button type="submit" class="h-10 w-full rounded-xl bg-[#f3ad19] text-xs font-bold text-[#071f49] hover:bg-[#ffbe33]">
                Ajouter l'article
            </button>
        </form>
    </div>

    <!-- Liste des articles -->
    <div class="space-y-4 lg:col-span-2">
        @foreach($articles as $article)
            <div class="rounded-2xl border border-[#dce2e9] bg-white p-5 shadow-xs">
                <form method="POST" action="{{ route('admin.articles.update', $article) }}" class="space-y-3">
                    @csrf @method('PUT')
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <img src="{{ $article->image }}" alt="" class="h-12 w-16 rounded-lg border border-[#dce2e9] object-cover" />
                            <div>
                                <span class="rounded-full bg-[#eaf0f8] px-2.5 py-0.5 text-[10px] font-bold text-[#071f49]">{{ $article->tag }}</span>
                                <span class="ml-1 text-xs font-semibold {{ $article->is_published ? 'text-[#1f7a3d]' : 'text-[#8a95a5]' }}">
                                    {{ $article->is_published ? '· Publié' : '· Masqué' }}
                                </span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <input type="number" name="sort_order" value="{{ $article->sort_order }}" class="h-8 w-16 rounded-lg border border-[#dce2e9] px-2 text-center text-xs" title="Ordre" />
                            <label class="inline-flex items-center gap-1 text-xs font-semibold">
                                <input type="checkbox" name="is_published" value="1" @checked($article->is_published) /> Actif
                            </label>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <input type="text" name="tag" value="{{ $article->tag }}" required class="h-9 rounded-lg border border-[#dce2e9] px-3 text-xs font-semibold" />
                        <input type="text" name="title" value="{{ $article->title }}" required class="h-9 rounded-lg border border-[#dce2e9] px-3 text-xs font-bold sm:col-span-2" />
                    </div>
                    <input type="text" name="image" value="{{ $article->image }}" required class="h-9 w-full rounded-lg border border-[#dce2e9] px-3 text-xs" />
                    <textarea name="body" rows="3" required class="w-full rounded-lg border border-[#dce2e9] p-2.5 text-xs">{{ implode("\n\n", $article->body ?? []) }}</textarea>

                    <div class="flex items-center justify-end gap-2">
                        <button type="submit" class="rounded-lg bg-[#071f49] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0d2d66]">
                            Enregistrer
                        </button>
                    </div>
                </form>
                <form method="POST" action="{{ route('admin.articles.destroy', $article) }}"
                      onsubmit="return confirm('Supprimer cet article ?');" class="-mt-7">
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
