export type SheetRow = {
	rowNumber: number;
	registeredAt: string;
	id: string;
	school: string;
	schoolEmail: string;
	teamName: string;
	area: string;
	representative: Representative;
	teamMembers: [TeamMember, TeamMember, TeamMember];
	participation: [Participation, Participation, Participation];
};

export type Representative = {
	name: string;
	email: string;
	dni: string;
	phoneNumber: string;
};

export type TeamMember = {
	name: string;
	age: number;
};

export type Participation = boolean | string | undefined;
