<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Villa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Customers/Index', [
            'customers' => Customer::with('villas')->orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Customers/Create', [
            'villas' => Villa::orderBy('position')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'nullable|email|max:255',
            'phone_code'   => 'required|string|max:10',
            'phone_number' => 'required|string|max:20',
            'villa_ids'    => 'nullable|array',
            'villa_ids.*'  => 'exists:villas,id',
        ]);

        $customer = Customer::create([
            'name'         => $validated['name'],
            'email'        => $validated['email'] ?? null,
            'phone_code'   => $validated['phone_code'],
            'phone_number' => $validated['phone_number'],
        ]);

        if (!empty($validated['villa_ids'])) {
            $customer->villas()->sync($validated['villa_ids']);
        }

        return redirect()->route('customers.index')->with('success', 'Customer added successfully.');
    }

    public function show(Customer $customer): Response
    {
        return Inertia::render('Customers/Show', [
            'customer' => $customer->load('villas'),
        ]);
    }

    public function edit(Customer $customer): Response
    {
        return Inertia::render('Customers/Edit', [
            'customer' => $customer->load('villas'),
            'villas'   => Villa::orderBy('position')->get(),
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'nullable|email|max:255',
            'phone_code'   => 'required|string|max:10',
            'phone_number' => 'required|string|max:20',
            'villa_ids'    => 'nullable|array',
            'villa_ids.*'  => 'exists:villas,id',
        ]);

        $customer->update([
            'name'         => $validated['name'],
            'email'        => $validated['email'] ?? null,
            'phone_code'   => $validated['phone_code'],
            'phone_number' => $validated['phone_number'],
        ]);

        $customer->villas()->sync($validated['villa_ids'] ?? []);

        return redirect()->route('customers.index')->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->route('customers.index')->with('success', 'Customer deleted successfully.');
    }
}
