<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Faq;
use App\Models\HeroSlide;
use App\Models\Listing;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AdminContentController extends Controller
{
    public function articles(): View
    {
        $articles = Article::orderBy('sort_order')->orderBy('id')->get();
        return view('admin.articles', compact('articles'));
    }

    public function storeArticle(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'tag' => ['required', 'string', 'max:40'],
            'title' => ['required', 'string', 'max:200'],
            'image' => ['required', 'string', 'max:500'],
            'body' => ['required', 'string', 'max:5000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $paragraphs = array_values(array_filter(array_map('trim', preg_split('/\r?\n\r?\n|\r?\n/', $data['body']))));

        Article::create([
            'tag' => mb_strtoupper(trim($data['tag'])),
            'title' => trim($data['title']),
            'image' => trim($data['image']),
            'body' => $paragraphs ?: [trim($data['body'])],
            'sort_order' => (int) ($data['sort_order'] ?? (Article::max('sort_order') + 1)),
            'is_published' => $request->boolean('is_published', true),
        ]);

        return back()->with('success', 'Article ajouté avec succès.');
    }

    public function updateArticle(Request $request, Article $article): RedirectResponse
    {
        $data = $request->validate([
            'tag' => ['required', 'string', 'max:40'],
            'title' => ['required', 'string', 'max:200'],
            'image' => ['required', 'string', 'max:500'],
            'body' => ['required', 'string', 'max:5000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $paragraphs = array_values(array_filter(array_map('trim', preg_split('/\r?\n\r?\n|\r?\n/', $data['body']))));

        $article->update([
            'tag' => mb_strtoupper(trim($data['tag'])),
            'title' => trim($data['title']),
            'image' => trim($data['image']),
            'body' => $paragraphs ?: [trim($data['body'])],
            'sort_order' => (int) ($data['sort_order'] ?? $article->sort_order),
            'is_published' => $request->boolean('is_published'),
        ]);

        return back()->with('success', 'Article mis à jour.');
    }

    public function destroyArticle(Article $article): RedirectResponse
    {
        $article->delete();
        return back()->with('success', 'Article supprimé.');
    }

    public function faqs(): View
    {
        $faqs = Faq::orderBy('sort_order')->orderBy('id')->get();
        return view('admin.faqs', compact('faqs'));
    }

    public function storeFaq(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string', 'max:3000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        Faq::create([
            'question' => trim($data['question']),
            'answer' => trim($data['answer']),
            'sort_order' => (int) ($data['sort_order'] ?? (Faq::max('sort_order') + 1)),
            'is_published' => $request->boolean('is_published', true),
        ]);

        return back()->with('success', 'Question FAQ ajoutée.');
    }

    public function updateFaq(Request $request, Faq $faq): RedirectResponse
    {
        $data = $request->validate([
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string', 'max:3000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $faq->update([
            'question' => trim($data['question']),
            'answer' => trim($data['answer']),
            'sort_order' => (int) ($data['sort_order'] ?? $faq->sort_order),
            'is_published' => $request->boolean('is_published'),
        ]);

        return back()->with('success', 'FAQ mise à jour.');
    }

    public function destroyFaq(Faq $faq): RedirectResponse
    {
        $faq->delete();
        return back()->with('success', 'Question FAQ supprimée.');
    }

    public function settings(): View
    {
        $slides = HeroSlide::orderBy('sort_order')->orderBy('id')->get();
        $listings = Listing::where('status', 'approved')->orderBy('title')->get(['slug', 'title']);
        $settings = [
            'years_experience' => SiteSetting::getValue('years_experience', '5'),
            'contact_phone' => SiteSetting::getValue('contact_phone', '+237 6 55 00 00 00'),
            'contact_email' => SiteSetting::getValue('contact_email', 'contact@immoduletch.cm'),
        ];

        return view('admin.settings', compact('slides', 'listings', 'settings'));
    }

    public function updateSettings(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'years_experience' => ['required', 'string', 'max:10'],
            'contact_phone' => ['required', 'string', 'max:40'],
            'contact_email' => ['required', 'email', 'max:120'],
        ]);

        foreach ($data as $key => $value) {
            SiteSetting::setValue($key, trim($value));
        }

        return back()->with('success', 'Paramètres du site mis à jour.');
    }

    public function storeSlide(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'listing_slug' => ['nullable', 'string', 'max:120'],
            'image' => ['required', 'string', 'max:500'],
            'tag' => ['required', 'string', 'max:60'],
            'title' => ['required', 'string', 'max:200'],
            'location' => ['required', 'string', 'max:120'],
            'price_label' => ['required', 'string', 'max:80'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        HeroSlide::create([
            'listing_slug' => $data['listing_slug'] ? trim($data['listing_slug']) : null,
            'image' => trim($data['image']),
            'tag' => mb_strtoupper(trim($data['tag'])),
            'title' => trim($data['title']),
            'location' => trim($data['location']),
            'price_label' => trim($data['price_label']),
            'sort_order' => (int) ($data['sort_order'] ?? (HeroSlide::max('sort_order') + 1)),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', 'Slide ajouté à la page d\'accueil.');
    }

    public function updateSlide(Request $request, HeroSlide $slide): RedirectResponse
    {
        $data = $request->validate([
            'listing_slug' => ['nullable', 'string', 'max:120'],
            'image' => ['required', 'string', 'max:500'],
            'tag' => ['required', 'string', 'max:60'],
            'title' => ['required', 'string', 'max:200'],
            'location' => ['required', 'string', 'max:120'],
            'price_label' => ['required', 'string', 'max:80'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $slide->update([
            'listing_slug' => $data['listing_slug'] ? trim($data['listing_slug']) : null,
            'image' => trim($data['image']),
            'tag' => mb_strtoupper(trim($data['tag'])),
            'title' => trim($data['title']),
            'location' => trim($data['location']),
            'price_label' => trim($data['price_label']),
            'sort_order' => (int) ($data['sort_order'] ?? $slide->sort_order),
            'is_active' => $request->boolean('is_active'),
        ]);

        return back()->with('success', 'Slide mis à jour.');
    }

    public function destroySlide(HeroSlide $slide): RedirectResponse
    {
        $slide->delete();
        return back()->with('success', 'Slide supprimé.');
    }
}
