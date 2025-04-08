import { cleanEnv, port } from "envalid";
import { notEmptyStr } from "./not-empty-st";

export const validateEnv = () => {
	return cleanEnv(process.env, {
		PORT: port(),
		PERMISSION_KEY: notEmptyStr(),
		SHEET_NAME: notEmptyStr(),
		SPREADSHEET_ID: notEmptyStr(),
	});
};
