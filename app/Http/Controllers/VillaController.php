<?php

namespace App\Http\Controllers;

use App\Models\Villa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VillaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Villas/Index', [
            'villas' => Villa::orderBy('position')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Villas/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'position' => 'required|string|max:20',
            'status'   => 'required|in:available,pending,sold',
        ]);

        Villa::create($validated);

        return redirect()->route('villas.index')->with('success', 'Villa berhasil ditambahkan.');
    }

    public function show(Villa $villa): Response
    {
        return Inertia::render('Villas/Show', [
            'villa' => $villa->load('customers'),
        ]);
    }

    public function edit(Villa $villa): Response
    {
        return Inertia::render('Villas/Edit', [
            'villa' => $villa,
        ]);
    }

    public function update(Request $request, Villa $villa)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'position' => 'required|string|max:20',
            'status'   => 'required|in:available,pending,sold',
        ]);

        $villa->update($validated);

        return redirect()->route('villas.index')->with('success', 'Villa berhasil diperbarui.');
    }

    public function destroy(Villa $villa)
    {
        $villa->delete();

        return redirect()->route('villas.index')->with('success', 'Villa berhasil dihapus.');
    }
}
