import { SelectOption, InstrumentListItem, InstrumentFormData } from "./instrument";
import { CalibrationScheduleRow } from "./dashboard";
import { RequestListFormData, RequestListItem, RequestDetailInput } from "./annualPlan";
import {
  MaintenancePlanFormData,
  MaintenancePlanItem,
  MaintenanceDetailInput,
} from "./maintenancePlan";
import { CalibrationFormData, CalibrationItem, OpenScheduleOption } from "./calibration";
import { InstrumentDetailData, HistoryItem } from "./profileDetail";

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
}

export interface GoalGaugeCardProps {
  title: string;
  percent: number;
}

export type DashboardViewMode = "list" | "calendar";

export interface DashboardScheduleSectionProps {
  initialRows: CalibrationScheduleRow[];
  initialYear: number;
  initialMonth: number;
  completed: number;
  goalPercent: number;
}

export interface CalibrationScheduleCardProps {
  viewMode: DashboardViewMode;
  onViewModeChange: (mode: DashboardViewMode) => void;
  year: number;
  month: number;
  onGoToMonth: (offset: number) => void;
  rows: CalibrationScheduleRow[];
  loading: boolean;
  selectedDay: number | null;
  onSelectDay: (day: number | null) => void;
}

export interface ScheduleCalendarViewProps {
  year: number;
  month: number;
  rows: CalibrationScheduleRow[];
  selectedDay: number | null;
  onSelectDay: (day: number | null) => void;
}

export interface MonthAgendaListProps {
  year: number;
  month: number;
  rows: CalibrationScheduleRow[];
  selectedDay: number | null;
  onSelectRow: (day: number) => void;
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

export interface ResultRowField {
  name: string;
  label: string;
  type?: "text" | "number";
}

export interface ResultRowsEditorProps {
  rows: Record<string, string>[];
  fields: ResultRowField[];
  onChange: (rows: Record<string, string>[]) => void;
}

export interface CalibrationFormProps {
  formId: string;
  mode?: "create" | "edit";
  calibrationId?: number;
  initialData?: CalibrationFormData;
  initialSchedule?: OpenScheduleOption;
  onSubmitSuccess?: () => void;
}

export interface CalibrationListProps {
  calibrations: CalibrationItem[];
  loading: boolean;
  onDelete: (calibration: CalibrationItem) => void;
}

export interface AppShellProps {
  children: React.ReactNode;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface TopbarProps {
  onToggleSidebar: () => void;
}

export interface SidebarMenuProps {
  onNavigate?: () => void;
}

export interface InstrumentDetailHeaderProps {
  detail: InstrumentDetailData;
}

export interface InstrumentDetailTabsProps {
  detail: InstrumentDetailData;
}

export interface InstrumentInfoTabProps {
  detail: InstrumentDetailData;
}

export interface InstrumentHistoryTabProps {
  registrationNumber: string;
}

export interface HistoryListProps {
  items: HistoryItem[];
  loading: boolean;
  onEdit: (item: HistoryItem) => void;
  onDelete: (item: HistoryItem) => void;
}
