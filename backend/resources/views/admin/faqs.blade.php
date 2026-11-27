@extends('admin.layout')

@section('title', 'Questions FAQ')

@section('content')
<div>
    <h1 class="text-2xl font-extrabold text-[#071f49]">Foire aux questions (FAQ)</h1>
    <p class="mt-1 text-sm text-[#637084]">Ajoutez, modifiez ou masquez les questions affichées sur la page d'accueil.</p>
</div>

<div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
    <div class="rounded-2xl border border-[#dce2e9] bg-white p-6 shadow-xs h-fit">
        <h2 class="text-base font-bold text-[#071f49]">Nouvelle question</h2>
        <form method="POST" action="{{ route('admin.faqs.store') }}" class="mt-4 space-y-3">
            @csrf
            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Question *</label>
                <input type="text" name="question" required
                       class="h-10 w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs outline-none focus:border-[#f3ad19]" />
            </div>
            <div>
                <label class="mb-1 block text-xs font-semibold text-[#637084]">Réponse *</label>
                <textarea name="answer" rows="4" required
                          class="w-full rounded-xl border border-[#dce2e9] bg-[#f8fafc] p-3 text-xs outline-none focus:border-[#f3ad19]"></textarea>
            </div>
            <label class="inline-flex items-center gap-2 text-xs font-semibold text-[#071f49]">
                <input type="checkbox" name="is_published" value="1" checked /> Publier immédiatement
            </label>
            <button type="submit" class="h-10 w-full rounded-xl bg-[#f3ad19] text-xs font-bold text-[#071f49] hover:bg-[#ffbe33]">
                Ajouter à la FAQ
            </button>
        </form>
    </div>

    <div class="space-y-4 lg:col-span-2">
        @foreach($faqs as $faq)
            <div class="rounded-2xl border border-[#dce2e9] bg-white p-5 shadow-xs">
                <form method="POST" action="{{ route('admin.faqs.update', $faq) }}" class="space-y-3">
                    @csrf @method('PUT')
                    <div class="flex items-center justify-between gap-2">
                        <span class="text-xs font-bold {{ $faq->is_published ? 'text-[#1f7a3d]' : 'text-[#8a95a5]' }}">
                            {{ $faq->is_published ? 'Publiée' : 'Masquée' }}
                        </span>
                        <div class="flex items-center gap-2">
                            <input type="number" name="sort_order" value="{{ $faq->sort_order }}" class="h-8 w-16 rounded-lg border border-[#dce2e9] px-2 text-center text-xs" />
                            <label class="inline-flex items-center gap-1 text-xs font-semibold">
                                <input type="checkbox" name="is_published" value="1" @checked($faq->is_published) /> Active
                            </label>
                        </div>
                    </div>
                    <input type="text" name="question" value="{{ $faq->question }}" required class="h-9 w-full rounded-lg border border-[#dce2e9] px-3 text-xs font-bold text-[#071f49]" />
                    <textarea name="answer" rows="3" required class="w-full rounded-lg border border-[#dce2e9] p-2.5 text-xs text-[#172b45]">{{ $faq->answer }}</textarea>
                    <div class="flex justify-end">
                        <button type="submit" class="rounded-lg bg-[#071f49] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0d2d66]">
                            Enregistrer
                        </button>
                    </div>
                </form>
                <form method="POST" action="{{ route('admin.faqs.destroy', $faq) }}"
                      onsubmit="return confirm('Supprimer cette question ?');" class="-mt-7">
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
