// @ts-ignore
import type { Auth } from "googleapis";
// @ts-ignore
import { sheets_v4 } from "googleapis";
import {
	FIRST_DAY_EVENT,
	PERMISSION_KEY,
	SECOND_DAY_EVENT,
	SHEET_NAME,
	SPREADSHEET_ID,
	THIRD_DAY_EVENT,
} from "../shared/constants";
import type { Participation, SheetRow } from "../shared/types/row.type";
import { auth } from "../shared/connection";

export async function execute(id: string, key: string) {
	const googleSheets = await connectToGoogleSheets();

	const rows = await getSpreadsheetRows(googleSheets);

	const targetRow = await findByRowId(id, rows);

	if (!targetRow) {
		return null;
	}

	const day = getParticipationDay();

	if (!day) {
		return targetRow;
	}

	if (key === PERMISSION_KEY) {
		await updateAttendance(targetRow.rowNumber.toString(), googleSheets, day);

		const updatedRows = await getSpreadsheetRows(googleSheets);
		const updatedTargetRow = await findByRowId(id, updatedRows);

		return updatedTargetRow;
	}

	return targetRow;
}

export async function connectToGoogleSheets() {
	const client = await auth.getClient();

	const googleSheets = new sheets_v4.Sheets({
		auth: client as Auth.OAuth2Client,
	});

	return googleSheets;
}

export async function getSpreadsheetRows(
	googleSheets: sheets_v4.Sheets
): Promise<SheetRow[]> {
	const getRows = await googleSheets.spreadsheets.values.get({
		auth,
		spreadsheetId: SPREADSHEET_ID,
		range: SHEET_NAME,
	});

	if (!getRows.data.values) {
		return [];
	}

	const rows: SheetRow[] = getRows.data.values
		.slice(1)
		.map((row, index: number) => ({
			rowNumber: index + 2,
			registeredAt: row[0],
			id: row[1],
			school: row[2],
			schoolEmail: row[3],
			teamName: row[4],
			area: row[5],
			representative: {
				name: row[6],
				email: row[7],
				dni: row[8],
				phoneNumber: row[9],
			},
			teamMembers: [
				{ name: row[10], age: Number(row[11]) },
				{ name: row[12], age: Number(row[13]) },
				{ name: row[14], age: Number(row[15]) },
			],
			participation: row.slice(16, 19) as [
				Participation,
				Participation,
				Participation
			],
		}));

	return rows;
}

async function findByRowId(
	id: string,
	rows: SheetRow[]
): Promise<SheetRow | undefined> {
	return rows.find((row) => row.id === id);
}

function getParticipationDay(): string | null {
	const MAY_INDEX = 4;
	const currentMonth = new Date().getMonth();
	const currentDay = new Date().getDate();

	if (currentMonth !== MAY_INDEX) {
		return null;
	}

	if (currentDay === FIRST_DAY_EVENT.date) {
		return FIRST_DAY_EVENT.row;
	}
	if (currentDay === SECOND_DAY_EVENT.date) {
		return SECOND_DAY_EVENT.row;
	}
	if (currentDay === THIRD_DAY_EVENT.date) {
		return THIRD_DAY_EVENT.row;
	}

	return null;
}

export async function updateAttendance(
	affectedRowNumber: string,
	googleSheets: sheets_v4.Sheets,
	participationDay: string
) {
	await googleSheets.spreadsheets.values.update({
		spreadsheetId: SPREADSHEET_ID,
		range: `${SHEET_NAME}!${participationDay}${affectedRowNumber}`,
		valueInputOption: "USER_ENTERED",
		requestBody: {
			values: [[true]],
		},
	});
}
