export function getAuthRedirectPath(role?: string | null) {
	return role === "admin" ? "/admin" : "/staff/pos"
}
