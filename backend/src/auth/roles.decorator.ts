import { SetMetadata } from '@nestjs/common';

/**
 * Application roles used for authorization checks.
 */
export enum Role {
  Tutor = 'Tutor',
  Student = 'Student',
  Parent = 'Parent',
  Admin = 'Admin',
}

/**
 * Decorator to attach required roles metadata to route handlers.
 *
 * Example: `@Roles(Role.Admin, Role.Tutor)`
 */
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
