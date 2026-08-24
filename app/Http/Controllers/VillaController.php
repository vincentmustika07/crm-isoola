<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVillaRequest;
use App\Http\Requests\UpdateVillaRequest;
use App\Models\Villa;
use Inertia\Inertia;
use Inertia\Response;

class VillaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Villas/Index', [
            'villas' => Villa::orderBy('position')->paginate(20),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Villas/Create');
    }

    public function store(StoreVillaRequest $request)
    {
        Villa::create($request->validated());

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

    public function update(UpdateVillaRequest $request, Villa $villa)
    {
        $villa->update($request->validated());

        return redirect()->route('villas.index')->with('success', 'Villa berhasil diperbarui.');
    }

    public function destroy(Villa $villa)
    {
        $villa->delete();

        return redirect()->route('villas.index')->with('success', 'Villa berhasil dihapus.');
    }
}
