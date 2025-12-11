import { SetMetadata } from '@nestjs/common';

export enum Role {
  Tutor = 'Tutor',
  Student = 'Student',
  Parent = 'Parent',
  Admin = 'Admin',
}

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
