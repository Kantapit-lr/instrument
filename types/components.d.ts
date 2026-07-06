import type { LucideIcon } from "lucide-react";
import { SelectOption, InstrumentListItem, InstrumentFormData } from "./instrument";
import { CalibrationScheduleRow } from "./dashboard";

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
