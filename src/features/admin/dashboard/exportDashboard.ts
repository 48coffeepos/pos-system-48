type DashboardCupSale = {
	name: string;
	total: number;
};

function formatFileDate(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

function applyCurrencyFormat(
	worksheet: Record<string, { v?: unknown; z?: string }>,
	rows: number,
) {
	for (let row = 2; row <= rows; row += 1) {
		const cell = worksheet[`B${row}`];
		if (cell && typeof cell.v === "number") {
			cell.z = "₱#,##0.00";
		}
	}
}

async function writeWorkbook(
	rows: Array<Array<string | number>>,
	sheetName: string,
	fileName: string,
	formatCurrency = false,
) {
	const XLSX = await import("xlsx");
	const worksheet = XLSX.utils.aoa_to_sheet(rows);
	const workbook = XLSX.utils.book_new();

	if (formatCurrency) {
		applyCurrencyFormat(
			worksheet as Record<string, { v?: unknown; z?: string }>,
			rows.length,
		);
	}

	XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
	XLSX.writeFile(workbook, fileName);
}

export async function exportCupsSalesXlsx(cupSales: DashboardCupSale[]) {
	const totalCups = cupSales.reduce((sum, cup) => sum + cup.total, 0);

	await writeWorkbook(
		[
			["Cup Name", "Total Cups Sold"],
			...cupSales.map((cup) => [cup.name, cup.total]),
			["Total", totalCups],
		],
		"Cups Sold",
		`cups-sales-${formatFileDate(new Date())}.xlsx`,
	);
}

export async function exportRevenueXlsx(
	revenueByMethod: Record<string, number>,
) {
	const revenueRows: Array<[string, number]> = [
		["CASH", revenueByMethod.CASH ?? 0],
		["GCASH", revenueByMethod.GCASH ?? 0],
	];
	const totalRevenue = revenueRows.reduce((sum, [, amount]) => sum + amount, 0);

	await writeWorkbook(
		[
			["Payment Method", "Total Revenue"],
			...revenueRows,
			["Total", totalRevenue],
		],
		"Revenue",
		`cash-gcash-revenue-${formatFileDate(new Date())}.xlsx`,
		true,
	);
}
