@extends('admin.layout')

@section('title', 'Demandes de contact')

@section('content')
<div class="flex flex-wrap items-center justify-between gap-4">
    <div>
        <h1 class="text-2xl font-extrabold text-[#071f49]">Demandes de contact</h1>
        <p class="mt-1 text-sm text-[#637084]">Messages envoyés par les visiteurs depuis les fiches de biens immobiliers.</p>
    </div>

    <form method="GET" action="{{ route('admin.inquiries') }}" class="flex items-center gap-2">
        <input type="hidden" name="status" value="{{ $status }}" />
        <input type="text" name="q" value="{{ $search }}" placeholder="Nom, e-mail, bien…"
               class="h-10 w-60 rounded-xl border border-[#dce2e9] bg-white px-3 text-xs outline-none focus:border-[#f3ad19]" />
        <button type="submit" class="h-10 rounded-xl bg-[#071f49] px-4 text-xs font-bold text-white">
            Filtrer
        </button>
    </form>
</div>

<!-- Onglets de statut -->
<div class="mt-5 flex flex-wrap gap-2">
    @foreach(['all' => 'Toutes', 'new' => 'Nouvelles', 'read' => 'Lues', 'replied' => 'Répondues'] as $key => $label)
        <a href="{{ route('admin.inquiries', ['status' => $key, 'q' => $search]) }}"
           class="rounded-full border px-4 py-1.5 text-xs font-bold transition {{ $status === $key ? 'border-[#071f49] bg-[#071f49] text-white' : 'border-[#dce2e9] bg-white text-[#637084] hover:border-[#f3ad19]' }}">
            {{ $label }} ({{ $counts[$key] }})
        </a>
    @endforeach
</div>

<div class="mt-5 space-y-3">
    @forelse($inquiries as $inq)
        <div class="rounded-2xl border border-[#dce2e9] bg-white p-5 shadow-xs">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <div class="flex flex-wrap items-center gap-2">
                        <p class="font-bold text-[#071f49]">{{ $inq->name }}</p>
                        @if($inq->status === 'new')
                            <span class="rounded-full bg-[#fff6df] px-2.5 py-0.5 text-[11px] font-bold text-[#996300]">Nouveau</span>
                        @elseif($inq->status === 'replied')
                            <span class="rounded-full bg-[#e7f6ec] px-2.5 py-0.5 text-[11px] font-bold text-[#1f7a3d]">Répondu</span>
                        @else
                            <span class="rounded-full bg-[#eaf0f8] px-2.5 py-0.5 text-[11px] font-bold text-[#071f49]">Lu</span>
                        @endif
                    </div>
                    <div class="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#637084]">
                        <a href="mailto:{{ $inq->email }}" class="font-medium text-[#071f49] underline">{{ $inq->email }}</a>
                        @if($inq->phone)
                            <span>·</span>
                            <a href="tel:{{ $inq->phone }}" class="font-medium text-[#071f49] underline">{{ $inq->phone }}</a>
                        @endif
                        <span>·</span>
                        <span>{{ $inq->created_at->format('d/m/Y H:i') }}</span>
                    </div>
                    <p class="mt-1 text-xs text-[#637084]">
                        Bien concerné :
                        @if($inq->listing)
                            <a href="{{ route('admin.listings.show', $inq->listing) }}" class="font-semibold text-[#071f49] underline">{{ $inq->listing->title }}</a>
                        @else
                            <span class="italic">Annonce supprimée</span>
                        @endif
                    </p>
                </div>

                <div class="flex items-center gap-2">
                    <form method="POST" action="{{ route('admin.inquiries.status', $inq) }}">
                        @csrf @method('PATCH')
                        <select name="status" onchange="this.form.submit()" class="h-9 rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-3 text-xs font-bold text-[#071f49] outline-none focus:border-[#f3ad19]">
                            <option value="new" @selected($inq->status === 'new')>Nouveau</option>
                            <option value="read" @selected($inq->status === 'read')>Lu</option>
                            <option value="replied" @selected($inq->status === 'replied')>Répondu</option>
                        </select>
                    </form>

                    <form method="POST" action="{{ route('admin.inquiries.destroy', $inq) }}"
                          onsubmit="return confirm('Supprimer cette demande de contact ?');">
                        @csrf @method('DELETE')
                        <button type="submit" class="h-9 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3 text-xs font-bold text-[#dc2626] hover:bg-[#fee2e2]">
                            Supprimer
                        </button>
                    </form>
                </div>
            </div>
            <p class="mt-3 rounded-xl bg-[#f8fafc] p-3.5 text-sm leading-relaxed text-[#172b45]">{{ $inq->message }}</p>
        </div>
    @empty
        <div class="rounded-2xl border border-dashed border-[#dce2e9] bg-white p-12 text-center text-sm text-[#637084]">
            Aucune demande de contact pour le moment.
        </div>
    @endforelse
</div>

<div class="mt-5">
    {{ $inquiries->links() }}
</div>
@endsection
