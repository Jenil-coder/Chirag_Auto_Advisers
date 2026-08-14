<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('vehicle');

        return [
            // Master vehicle fields
            'vehicle_number' => 'sometimes|required|string|unique:vehicles,vehicle_number,' . $id,
            'troli_no' => 'nullable|string',
            'owner_name' => 'sometimes|required|string',
            'registration_date' => 'nullable|date',
            'tractor_registration_date' => 'nullable|date',
            'permanent_address' => 'nullable|string',
            'phone' => 'nullable|string',
            
            'make_id' => 'nullable|exists:vehicle_makes,id',
            'class_id' => 'nullable|string',
            
            'model' => 'nullable|string',
            'horse_power' => 'nullable|numeric|min:0',
            'rlw' => 'nullable|numeric|min:0',
            'cylinder' => 'nullable|integer|min:0',
            's_c_ind' => 'nullable|integer|min:0',
            'uw' => 'nullable|numeric|min:0',
            
            'engine_number' => 'nullable|string',
            'chassis_number' => 'nullable|string',
            'plw' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:Active,Inactive,Archived',
            
            'hpa_with' => 'nullable|string',
            'remarks' => 'nullable|string',
            'group' => 'nullable|string',

            // Compliance arrays
            'tax' => 'nullable|array',
            'tax.tax_up_to_date' => 'required_with:tax|date',
            'tax.tax_paid_date' => 'nullable|date',
            'tax.penalty' => 'nullable|numeric|min:0',
            'tax.interest' => 'nullable|numeric|min:0',
            'tax.amount' => 'nullable|numeric|min:0',
            'tax.receipt_no' => 'nullable|string',
            'tax.yearly' => 'nullable|boolean',
            'tax.yearly_amount' => 'nullable|numeric|min:0',
            'tax.half_yearly' => 'nullable|boolean',
            'tax.half_yearly_amount' => 'nullable|numeric|min:0',

            'fitness' => 'nullable|array',
            'fitness.fitness_up_to_date' => 'required_with:fitness|date',
            'fitness.passed_by' => 'nullable|string',
            'fitness.place' => 'nullable|string',

            'permit' => 'nullable|array',
            'permit.permit_up_to_date' => 'required_with:permit|date',
            'permit.permit_no' => 'nullable|string',
            'permit.amount' => 'nullable|numeric|min:0',
            'permit.receipt_no' => 'nullable|string',
            'permit.permit_date' => 'nullable|date',

            'national_permit' => 'nullable|array',
            'national_permit.national_permit_up_to_date' => 'required_with:national_permit|date',
            'national_permit.national_permit_state' => 'nullable|string',
            'national_permit.postal_address' => 'nullable|string',
            'national_permit.city' => 'nullable|string',

            'insurance' => 'nullable|array',
            'insurance.insurance_company_id' => 'required_with:insurance|string',
            'insurance.policy_no' => 'required_with:insurance|string',
            'insurance.insurance_expiry_date' => 'required_with:insurance|date',
        ];
    }
}
