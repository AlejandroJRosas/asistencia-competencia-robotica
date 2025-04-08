import dotenv from "dotenv";
import { validateEnv } from "../utils/validate-env";

dotenv.config();

export const { PORT, SPREADSHEET_ID, SHEET_NAME, PERMISSION_KEY } =
	validateEnv();

export const FIRST_DAY_EVENT = {
	date: 28,
	row: "Q",
};

export const SECOND_DAY_EVENT = {
	date: 29,
	row: "R",
};

export const THIRD_DAY_EVENT = {
	date: 30,
	row: "S",
};
