<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use App\Models\Vehicle;
use App\Models\VehicleMake;
use App\Models\VehicleClass;
use App\Models\InsuranceCompany;
use App\Models\InsurancePolicy;
use App\Models\TaxRecord;
use App\Models\FitnessRecord;
use App\Models\Permit;
use App\Models\NationalPermit;

class VehicleAndInsuranceSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Makes & Classes
        $tata = VehicleMake::firstOrCreate(['name' => 'TATA']);
        $mahindra = VehicleMake::firstOrCreate(['name' => 'MAHINDRA']);
        $ashok = VehicleMake::firstOrCreate(['name' => 'ASHOK LEYLAND']);

        $truck = VehicleClass::firstOrCreate(['name' => 'Truck']);
        $bus = VehicleClass::firstOrCreate(['name' => 'Bus']);

        // 2. Create Insurance Companies
        $digit = InsuranceCompany::firstOrCreate(['name' => 'GO DIGIT']);
        $icici = InsuranceCompany::firstOrCreate(['name' => 'ICICI Lombard']);

        // 3. Create Vehicles
        $vehicles = [
            [
                'vehicle_number' => 'MH01AB1234',
                'owner_name' => 'Rajesh Kumar',
                'phone' => '9876543210',
                'registration_date' => '2020-05-15',
                'make_id' => $tata->id,
                'class_id' => $truck->id,
                'model' => 'LPT 2518',
                'status' => 'Active',
            ],
            [
                'vehicle_number' => 'GJ03XY9876',
                'owner_name' => 'Amit Patel',
                'phone' => '8765432109',
                'registration_date' => '2019-11-20',
                'make_id' => $mahindra->id,
                'class_id' => $bus->id,
                'model' => 'Tourister',
                'status' => 'Active',
            ],
            [
                'vehicle_number' => 'DL04ZC5566',
                'owner_name' => 'Suresh Singh',
                'phone' => '7654321098',
                'registration_date' => '2021-02-10',
                'make_id' => $ashok->id,
                'class_id' => $truck->id,
                'model' => 'Dost+',
                'status' => 'Active',
            ],
            [
                'vehicle_number' => 'MH12KL4455',
                'owner_name' => 'Priya Transport',
                'phone' => '6543210987',
                'registration_date' => '2018-08-30',
                'make_id' => $tata->id,
                'class_id' => $truck->id,
                'model' => 'Signa 4923',
                'status' => 'Inactive',
            ],
            [
                'vehicle_number' => 'RJ14MN7788',
                'owner_name' => 'Ramesh Logistics',
                'phone' => '5432109876',
                'registration_date' => '2022-01-05',
                'make_id' => $ashok->id,
                'class_id' => $truck->id,
                'model' => 'Boss 1218',
                'status' => 'Active',
            ],
        ];

        foreach ($vehicles as $index => $vData) {
            $vehicle = Vehicle::where('vehicle_number', $vData['vehicle_number'])->first();
            if ($vehicle) {
                continue;
            }
            
            $vehicle = Vehicle::create($vData);

            // Add dummy compliance records (staggered dates)
            // Some valid, some expiring soon, some expired
            $offset = $index % 3; // 0 = valid, 1 = expiring soon, 2 = expired
            
            $taxDate = $offset === 0 ? Carbon::now()->addMonths(6) : 
                       ($offset === 1 ? Carbon::now()->addDays(15) : 
                       Carbon::now()->subMonths(2));
                       
            TaxRecord::create([
                'vehicle_id' => $vehicle->id,
                'valid_upto' => $taxDate,
                'amount' => 15000 + ($index * 1000)
            ]);

            FitnessRecord::create([
                'vehicle_id' => $vehicle->id,
                'expiry_date' => $taxDate->copy()->addMonth(),
            ]);

            Permit::create([
                'vehicle_id' => $vehicle->id,
                'expiry_date' => $taxDate->copy()->addMonths(2),
            ]);
            
            NationalPermit::create([
                'vehicle_id' => $vehicle->id,
                'expiry_date' => $taxDate->copy()->addMonths(3),
            ]);

            // Create an Insurance Policy for this vehicle
            $insCompanyId = $index % 2 == 0 ? $digit->id : $icici->id;
            
            InsurancePolicy::create([
                'vehicle_id' => $vehicle->id,
                'insurance_company_id' => $insCompanyId,
                'policy_number' => 'POL' . rand(100000, 999999),
                'start_date' => $taxDate->copy()->subYear()->addDays(21),
                'expiry_date' => $taxDate->copy()->addDays(20), // Follows the offset pattern roughly
                'sum_insured' => 500000 + ($index * 50000),
                'od_tp_premium' => 15000,
                'trolley_amount' => 0,
                'other_amount' => 500,
                'ncb' => 1000,
                'service_tax' => 2700,
                'total_premium' => 17200,
                'is_active' => !$taxDate->copy()->addDays(20)->isPast(),
            ]);
        }
    }
}
