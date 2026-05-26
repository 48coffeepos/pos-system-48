import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { RECEIPT_CONTENT_ID, RECEIPT_THERMAL_CLASS } from "./printer";

interface ReceiptThermalContentProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const ReceiptThermalContent = forwardRef<
	HTMLDivElement,
	ReceiptThermalContentProps
>(function ReceiptThermalContent({ children, className, ...props }, ref) {
	return (
		<div
			ref={ref}
			id={RECEIPT_CONTENT_ID}
			className={className ? `${RECEIPT_THERMAL_CLASS} ${className}` : RECEIPT_THERMAL_CLASS}
			{...props}
		>
			{children}
		</div>
	);
});
