import type { ReactNode } from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface PosModalProps {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
	className?: string;
	showClose?: boolean;
	overlayClassName?: string;
}

export function PosModal({
	open,
	onClose,
	children,
	className,
	showClose = false,
	overlayClassName,
}: PosModalProps) {
	if (!open) return null;

	return (
		<div
			className={cn(
				"fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200",
				overlayClassName,
			)}
			style={{ background: "rgba(0,0,0,0.4)" }}
			onClick={onClose}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className={cn(
					"relative w-full max-w-sm rounded-3xl bg-(--pure-white) p-6 transition-all duration-200",
					className,
				)}
			>
				{showClose ? (
					<button
						type="button"
						onClick={onClose}
						className="absolute top-4 right-4 rounded-full p-2 text-(--medium-gray) transition-colors hover:bg-(--off-white)"
						aria-label="Close"
					>
						<X className="size-5" />
					</button>
				) : null}
				{children}
			</div>
		</div>
	);
}
