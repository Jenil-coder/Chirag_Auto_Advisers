import * as z from "zod";

const emptyStringToNull = (val: string | undefined | null) => {
  if (val === "" || val === undefined || val === null) return undefined;
  return val;
};

const numericString = z
  .union([z.string(), z.number(), z.nan(), z.null(), z.undefined()])
  .transform((val) => {
    if (val === "" || val === null || val === undefined || Number.isNaN(val)) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  })
  .refine((val) => val === undefined || val >= 0, "Value cannot be negative");

export const vehicleSchema = z.object({
  // Basic Information
  vehicle_number: z.string()
    .min(1, "Vehicle number is required")
    .max(20, "Vehicle number is too long")
    .transform(val => val.toUpperCase()),
  troli_no: z.string().nullish().transform(emptyStringToNull),
  owner_name: z.string().min(1, "Owner name is required"),
  registration_date: z.string().nullish().transform(emptyStringToNull),
  tractor_registration_date: z.string().nullish().transform(emptyStringToNull),
  
  // Address
  permanent_address: z.string().nullish().transform(emptyStringToNull),
  phone: z.string().nullish().transform(emptyStringToNull),
  status: z.enum(["Active", "Inactive", "Archived"]).default("Active"),
  
  // General Details
  class_id: z.string().nullish().transform(emptyStringToNull),
  model: z.string().nullish().transform(emptyStringToNull),
  horse_power: numericString,
  rlw: numericString,
  cylinder: numericString,
  s_c_ind: numericString,
  uw: numericString,
  make_id: numericString,
  chassis_number: z.string().nullish().transform(emptyStringToNull),
  engine_number: z.string().nullish().transform(emptyStringToNull),
  plw: numericString,
  
  // Tax Details
  tax: z.object({
    tax_up_to_date: z.string().nullish().transform(emptyStringToNull),
    tax_paid_date: z.string().nullish().transform(emptyStringToNull),
    penalty: numericString,
    interest: numericString,
    amount: numericString,
    receipt_no: z.string().nullish().transform(emptyStringToNull),
    yearly: z.boolean().default(false).optional(),
    yearly_amount: numericString,
    half_yearly: z.boolean().default(false).optional(),
    half_yearly_amount: numericString,
  }).optional(),

  // Fitness Details
  fitness: z.object({
    fitness_up_to_date: z.string().nullish().transform(emptyStringToNull),
    passed_by: z.string().nullish().transform(emptyStringToNull),
    place: z.string().nullish().transform(emptyStringToNull),
  }).optional(),

  // Permit Details
  permit: z.object({
    permit_up_to_date: z.string().nullish().transform(emptyStringToNull),
    permit_no: z.string().nullish().transform(emptyStringToNull),
    amount: numericString,
    receipt_no: z.string().nullish().transform(emptyStringToNull),
    permit_date: z.string().nullish().transform(emptyStringToNull),
  }).optional(),

  // National Permit Details
  national_permit: z.object({
    national_permit_up_to_date: z.string().nullish().transform(emptyStringToNull),
    national_permit_state: z.string().nullish().transform(emptyStringToNull),
    postal_address: z.string().nullish().transform(emptyStringToNull),
    city: z.string().nullish().transform(emptyStringToNull),
  }).optional(),

  // Insurance Details
  insurance: z.object({
    insurance_company_id: z.string().nullish().transform(emptyStringToNull),
    policy_no: z.string().nullish().transform(emptyStringToNull),
    insurance_expiry_date: z.string().nullish().transform(emptyStringToNull),
  }).optional(),

  // Additional Information
  hpa_with: z.string().nullish().transform(emptyStringToNull),
  remarks: z.string().nullish().transform(emptyStringToNull),
  group: z.string().nullish().transform(emptyStringToNull),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
