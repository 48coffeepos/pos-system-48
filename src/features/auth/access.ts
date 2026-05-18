import { createAccessControl } from "better-auth/plugins/access";
import {
	adminAc,
	defaultStatements,
	userAc,
} from "better-auth/plugins/admin/access";

import { ROLES } from "./roles";

const statements = { ...defaultStatements } as const;

export const ac = createAccessControl(statements);

export const cashier = ac.newRole({
	...userAc.statements,
});

export const adminRole = ac.newRole({
	...adminAc.statements,
});

export const adminPluginConfig = {
	ac,
	roles: {
		[ROLES.cashier]: cashier,
		[ROLES.admin]: adminRole,
	},
	defaultRole: ROLES.cashier,
} as const;
