import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: 'your_jwt_secret',
  signOptions: { expiresIn: '1d' },
};
