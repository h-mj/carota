import { NestFactory } from "@nestjs/core";

import { ApplicationModule } from "./ApplicationModule";
import { HttpErrorFilter } from "./base/filter/HttpErrorFilter";
import { NotFoundExceptionFilter } from "./base/filter/NotFoundExceptionFilter";
import { UnauthorizedErrorFilter } from "./base/filter/UnauthorizedErrorFilter";
import { UnknownExceptionFilter } from "./base/filter/UnknownExceptionFilter";
import { GlobalInterceptor } from "./base/GlobalInterceptor";

async function bootstrap() {
  const application = await NestFactory.create(ApplicationModule);

  application.setGlobalPrefix("/api");

  application.useGlobalFilters(
    new UnknownExceptionFilter(),
    new HttpErrorFilter(),
    new UnauthorizedErrorFilter(),
    new NotFoundExceptionFilter()
  );

  application.useGlobalInterceptors(new GlobalInterceptor());

  await application.listen(process.env.PORT || 3001);
}

bootstrap();
