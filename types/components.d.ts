import type { LucideIcon } from "lucide-react";
import { SelectOption, InstrumentListItem, InstrumentFormData } from "./instrument";
import { CalibrationScheduleRow } from "./dashboard";
import { RequestListFormData, RequestListItem, RequestDetailInput } from "./annualPlan";
import {
  MaintenancePlanFormData,
  MaintenancePlanItem,
  MaintenanceDetailInput,
} from "./maintenancePlan";

export interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

export interface InstrumentGridProps {
  instruments: InstrumentListItem[];
  loading: boolean;
  emptyMessage: string;
}

export interface CountryComboboxProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}

export interface InstrumentFormProps {
  formId: string;
  mode?: "create" | "edit";
  initialData?: InstrumentFormData;
  onSubmitSuccess?: () => void;
}

export interface ImageGalleryProps {
  registrationNumber: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
}

export interface GoalGaugeCardProps {
  title: string;
  percent: number;
}

export interface CalibrationScheduleCardProps {
  title: string;
  rows: CalibrationScheduleRow[];
}

export interface AnnualPlanFormProps {
  formId: string;
  mode?: "create" | "edit";
  requestListId?: number;
  initialData?: RequestListFormData;
  onSubmitSuccess?: () => void;
}

export interface RequestDetailRowProps {
  detail: RequestDetailInput;
  index: number;
  instrumentOptions: SelectOption[];
  onChange: (index: number, detail: RequestDetailInput) => void;
  onRemove: (index: number) => void;
}

export interface AnnualPlanListProps {
  plans: RequestListItem[];
  loading: boolean;
  onDelete: (plan: RequestListItem) => void;
}

export interface MaintenancePlanFormProps {
  formId: string;
  mode?: "create" | "edit";
  maintenancePlanId?: number;
  initialData?: MaintenancePlanFormData;
  onSubmitSuccess?: () => void;
}

export interface MaintenanceDetailCardProps {
  detail: MaintenanceDetailInput;
  index: number;
  onChange: (index: number, detail: MaintenanceDetailInput) => void;
}

export interface MaintenancePlanListProps {
  plans: MaintenancePlanItem[];
  loading: boolean;
  onDelete: (plan: MaintenancePlanItem) => void;
}
