export interface AdminAccount {
	id: string;
	name: string;
	email: string;
	username: string | null;
	role: string | null;
	banned: boolean;
	isOnline: boolean;
	lastSeenAt: Date | null;
	updatedAt: Date;
}
