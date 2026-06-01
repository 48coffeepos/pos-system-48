import {
  CheckIcon,
  KeyIcon,
  PlusIcon,
  UserIcon,
  XIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { useAccountForm } from "@/features/admin/accounts/hooks/useAccountForm";
import type { AdminAccount } from "@/features/admin/accounts/types";
import { ROLES } from "@/features/auth/roles";

interface AccountFormProps {
  editingAccount: AdminAccount | null;
  onCancel: () => void;
  onCompleted: () => void;
}

function getRoleLabel(role: string | null) {
  return role === ROLES.admin ? "Administrator" : "Staff";
}

export function AccountForm({
  editingAccount,
  onCancel,
  onCompleted,
}: AccountFormProps) {
  const { form, isEditing, isPending } = useAccountForm({
    editingAccount,
    onCompleted,
  });

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-primary">
            {isEditing ? <UserIcon /> : <PlusIcon />}
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold">
              {isEditing ? "Edit Account" : "Create Account"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Update the account name or set a new password."
                : "Add a staff or administrator account for the POS."}
            </p>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
          className="flex flex-col gap-6"
        >
          <FieldGroup className="flex flex-col gap-4">
            <form.AppField name="name">
              {(field) => (
                <field.Input label="Full Name" placeholder="e.g. Maria Clara" />
              )}
            </form.AppField>

            {isEditing ? null : (
              <>
                <form.AppField name="email">
                  {(field) => (
                    <field.Input
                      label="Email"
                      type="email"
                      placeholder="maria@coffee48.com"
                    />
                  )}
                </form.AppField>

                <form.AppField name="username">
                  {(field) => (
                    <field.Input label="Username" placeholder="mariaclara" />
                  )}
                </form.AppField>

                <form.AppField name="role">
                  {(field) => (
                    <field.Select
                      label="Role"
                      placeholder="Select a role"
                      description="Choose the role when creating the account."
                      options={[
                        { value: ROLES.staff, label: "Staff" },
                        { value: ROLES.admin, label: "Administrator" },
                      ]}
                    />
                  )}
                </form.AppField>
              </>
            )}

            {isEditing ? (
              <Field>
                <FieldLabel htmlFor="role-display">Role</FieldLabel>
                <Input
                  id="role-display"
                  value={getRoleLabel(editingAccount?.role ?? null)}
                  readOnly
                  disabled
                />
                <FieldDescription>
                  Role changes stay locked on this screen for now.
                </FieldDescription>
              </Field>
            ) : null}

            <form.AppField name="password">
              {(field) => (
                <field.Password label="Password" placeholder="Enter password" />
              )}
            </form.AppField>
          </FieldGroup>

          <Separator />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <div className="flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || isPending}
                >
                  {isEditing ? (
                    <CheckIcon data-icon="inline-start" />
                  ) : (
                    <PlusIcon data-icon="inline-start" />
                  )}
                  {isSubmitting || isPending
                    ? isEditing
                      ? "Saving..."
                      : "Creating..."
                    : isEditing
                      ? "Save Changes"
                      : "Create Account"}
                </Button>
                {isEditing ? (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    <XIcon data-icon="inline-start" />
                    Cancel
                  </Button>
                ) : null}
              </div>
            )}
          </form.Subscribe>
        </form>
      </div>
    </section>
  );
}
