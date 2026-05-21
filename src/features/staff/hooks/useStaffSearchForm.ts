import { useAppForm } from "@/integrations/tanstack-form";
import {
	emptyStaffSearchValues,
	staffSearchSchema,
} from "@/features/staff/schemas/staffSearch";

export function useStaffSearchForm() {
	return useAppForm({
		defaultValues: emptyStaffSearchValues(),
		validators: {
			onChange: staffSearchSchema,
		},
	});
}
