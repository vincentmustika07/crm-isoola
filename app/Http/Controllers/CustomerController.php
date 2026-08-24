<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use App\Models\Villa;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Customers/Index', [
            'customers' => Customer::with('villas')->orderBy('name')->paginate(20),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Customers/Create', [
            'villas' => Villa::orderBy('position')->get(),
        ]);
    }

    public function store(StoreCustomerRequest $request)
    {
        $validated = $request->validated();

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

    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $validated = $request->validated();

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
