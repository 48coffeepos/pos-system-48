import { AnimatePresence, motion } from "motion/react";
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
	return (
		<AnimatePresence>
			{open ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className={cn(
						"fixed inset-0 z-50 flex items-center justify-center p-4",
						overlayClassName,
					)}
					style={{ background: "rgba(0,0,0,0.4)" }}
					onClick={onClose}
				>
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						onClick={(e) => e.stopPropagation()}
						className={cn(
							"relative w-full max-w-sm rounded-3xl bg-(--pure-white) p-6",
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
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
