import { UseFormRegister, FieldErrors } from "react-hook-form";
import { VehicleFormValues } from "@/lib/validations/vehicle";

interface GeneralDetailsProps {
  register: UseFormRegister<VehicleFormValues>;
  errors: FieldErrors<VehicleFormValues>;
  classes?: any[];
  makes?: any[];
}

export function GeneralDetails({ register, errors, classes, makes }: GeneralDetailsProps) {
  const inputClass = "w-full h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
  const labelClass = "block text-[15px] font-medium text-slate-700 mb-1.5";
  const errorClass = "text-sm text-red-600 mt-1.5";

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-800">General Vehicle Details</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6">
          
          {/* Row 1 */}
          <div className="md:col-span-1">
            <label className={labelClass}>Class</label>
            <input type="text" className={inputClass} {...register("class_id")} placeholder="e.g. LMV" />
          </div>
          
          <div className="md:col-span-1">
            <label className={labelClass}>Make</label>
            <select className={inputClass} {...register("make_id")}>
              <option value="">Select Make</option>
              {makes?.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>

          <div className="md:col-span-1">
            <label className={labelClass}>Model</label>
            <input type="text" className={inputClass} {...register("model")} placeholder="Vehicle Model" />
          </div>

          <div className="md:col-span-1">
            <label className={labelClass}>
              Chassis No. <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              className={`${inputClass} ${errors.chassis_number ? 'border-red-500 focus:ring-red-500' : ''}`} 
              {...register("chassis_number")} 
              placeholder="Chassis Number" 
            />
            {errors.chassis_number && <p className={errorClass}>{errors.chassis_number.message}</p>}
          </div>

          {/* Row 2 */}
          <div className="md:col-span-1">
            <label className={labelClass}>Engine No.</label>
            <input type="text" className={inputClass} {...register("engine_number")} placeholder="Engine Number" />
          </div>

          <div className="md:col-span-1">
            <label className={labelClass}>Cylinder</label>
            <input type="number" className={inputClass} {...register("cylinder")} placeholder="No. of Cylinders" />
          </div>

          <div className="md:col-span-1">
            <label className={labelClass}>S.C. Ind</label>
            <input type="number" className={inputClass} {...register("s_c_ind")} placeholder="Seating Capacity" />
          </div>

          <div className="md:col-span-1">
            <label className={labelClass}>Horse Power (HP)</label>
            <input type="text" className={inputClass} {...register("horse_power")} placeholder="e.g. 100" />
          </div>

          {/* Row 3 */}
          <div className="md:col-span-1">
            <label className={labelClass}>RLW</label>
            <input type="number" className={inputClass} {...register("rlw")} placeholder="Reg. Laden Wt." />
          </div>

          <div className="md:col-span-1">
            <label className={labelClass}>UW</label>
            <input type="number" className={inputClass} {...register("uw")} placeholder="Unladen Wt." />
          </div>

          <div className="md:col-span-1">
            <label className={labelClass}>PLW</label>
            <input type="number" className={inputClass} {...register("plw")} placeholder="Payload Wt." />
          </div>
          
        </div>
      </div>
    </div>
  );
}
