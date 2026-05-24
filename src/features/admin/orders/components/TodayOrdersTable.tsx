import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import { formatPeso } from "@/features/admin/dashboard/utils";
import { cn } from "@/lib/utils";

export interface TodayOrderRow {
	time: string;
	order_id: string;
	staff_name: string;
	method: string;
	note: string | null;
	menu_name: string;
	cup: string;
	quantity: number;
	unit_price: number;
	line_total: number;
	discount_type: string | null;
	addons_summary: string;
}

function methodBadge(method: string) {
	const styles: Record<string, string> = {
		CASH: "bg-emerald-100 text-emerald-800",
		GCASH: "bg-blue-100 text-blue-800",
		GRAB: "bg-purple-100 text-purple-800",
	};
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
				styles[method] ?? "bg-(--off-white) text-(--dark-gray)",
			)}
		>
			{method}
		</span>
	);
}

function discountBadge(type: string | null) {
	if (!type) return <span className="text-xs text-(--medium-gray)">—</span>;
	const styles: Record<string, string> = {
		PWD: "bg-amber-100 text-amber-800",
		SENIOR: "bg-orange-100 text-orange-800",
	};
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
				styles[type] ?? "bg-(--off-white) text-(--dark-gray)",
			)}
		>
			{type}
		</span>
	);
}

const columns: ColumnDef<TodayOrderRow>[] = [
	{
		accessorKey: "time",
		header: "Time",
		size: 80,
		cell: ({ getValue }) => (
			<span className="text-xs tabular-nums whitespace-nowrap">
				{getValue() as string}
			</span>
		),
	},
	{
		accessorKey: "order_id",
		header: "Order #",
		size: 90,
		cell: ({ getValue }) => (
			<span className="text-xs font-mono text-(--medium-gray)">
				…{getValue() as string}
			</span>
		),
	},
	{
		accessorKey: "staff_name",
		header: "Staff",
		size: 100,
		cell: ({ getValue }) => (
			<span className="text-xs whitespace-nowrap">{getValue() as string}</span>
		),
	},
	{
		accessorKey: "method",
		header: "Method",
		size: 80,
		cell: ({ getValue }) => methodBadge(getValue() as string),
	},
	{
		accessorKey: "menu_name",
		header: "Menu",
		size: 140,
		cell: ({ getValue }) => (
			<span className="text-sm whitespace-nowrap">{getValue() as string}</span>
		),
	},
	{
		accessorKey: "cup",
		header: "Cup",
		size: 100,
		cell: ({ getValue }) => {
			const val = getValue() as string;
			return (
				<span className="text-xs text-(--medium-gray) whitespace-nowrap">
					{val}
				</span>
			);
		},
	},
	{
		accessorKey: "discount_type",
		header: "Disc.",
		size: 72,
		cell: ({ getValue }) => discountBadge(getValue() as string | null),
	},
	{
		accessorKey: "addons_summary",
		header: "Addons",
		size: 160,
		cell: ({ getValue }) => {
			const val = getValue() as string;
			if (!val) return <span className="text-xs text-(--medium-gray)">—</span>;
			return (
				<span className="text-[10px] text-(--medium-gray) leading-tight block max-w-[150px] truncate">
					{val}
				</span>
			);
		},
	},
	{
		accessorKey: "note",
		header: "Note",
		size: 120,
		cell: ({ getValue }) => {
			const val = getValue() as string | null;
			if (!val) return <span className="text-xs text-(--medium-gray)">—</span>;
			return (
				<span className="text-[10px] text-(--medium-gray) italic truncate block max-w-[100px]">
					{val}
				</span>
			);
		},
	},
	{
		accessorKey: "quantity",
		header: "Qty",
		size: 48,
		cell: ({ getValue }) => (
			<span className="text-sm tabular-nums">{getValue() as number}</span>
		),
	},
	{
		accessorKey: "unit_price",
		header: "Unit Price",
		size: 90,
		cell: ({ getValue }) => (
			<span className="text-xs tabular-nums">
				{formatPeso(getValue() as number)}
			</span>
		),
	},
	{
		accessorKey: "line_total",
		header: "Line Total",
		size: 90,
		cell: ({ getValue }) => (
			<span className="text-xs tabular-nums font-semibold">
				{formatPeso(getValue() as number)}
			</span>
		),
	},
];

interface TodayOrdersTableProps {
	data: TodayOrderRow[];
	limit?: number;
}

export function TodayOrdersTable({ data, limit }: TodayOrdersTableProps) {
	const displayed = limit ? data.slice(0, limit) : data;

	return (
		<div className="card-white p-5">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-sm font-bold text-(--near-black)">
					{limit ? "All Orders Today" : "Orders"}
				</h3>
				{limit && (
					<Link
						to="/admin/orders"
						className="text-xs font-semibold text-(--deep-forest) hover:underline"
					>
						View Orders
					</Link>
				)}
			</div>
			<DataTable columns={columns} data={displayed} pageSize={displayed.length} />
		</div>
	);
}
