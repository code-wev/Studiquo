import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../src/models/User.model';

/**
 * Decorator to attach required roles metadata to route handlers.
 *
 * Example: `@Roles(Role.Admin, Role.Tutor)`
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
