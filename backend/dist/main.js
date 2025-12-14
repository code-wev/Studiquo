"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const roles_guard_1 = require("./auth/roles.guard");
const response_interceptor_1 = require("./common/response.interceptor");
const users_service_1 = require("./users/users.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const reflector = app.get(core_1.Reflector);
    app.useGlobalGuards(new roles_guard_1.RolesGuard(reflector));
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    await app.listen(process.env.PORT ?? 8080);
    const logger = new common_1.Logger('Bootstrap');
    try {
        const usersService = app.get(users_service_1.UsersService);
        if (usersService && typeof usersService.ensureAdminExists === 'function') {
            await usersService.ensureAdminExists();
            logger.log('Admin user check completed');
        }
    }
    catch (err) {
        logger.error('Error ensuring default admin user', err);
    }
    console.log(`App running at port ${process.env.PORT ?? 3000}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map