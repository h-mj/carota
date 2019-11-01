import { NestFactory } from "@nestjs/core";

import { ApplicationModule } from "./ApplicationModule";
import { HttpErrorFilter } from "./filter/HttpErrorFilter";
import { NotFoundExceptionFilter } from "./filter/NotFoundExceptionFilter";
import { UnauthorizedErrorFilter } from "./filter/UnauthorizedErrorFilter";
import { UnknownExceptionFilter } from "./filter/UnknownExceptionFilter";
import { GlobalInterceptor } from "./interceptor/GlobalInterceptor";

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
