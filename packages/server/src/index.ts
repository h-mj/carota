import { NestFactory } from "@nestjs/core";

import { ApplicationModule } from "./ApplicationModule";
import { DataInterceptor } from "./interceptor/DataInterceptor";
import { ErrorInterceptor } from "./interceptor/ErrorInterceptor";

async function bootstrap() {
  const application = await NestFactory.create(ApplicationModule);

  application.useGlobalInterceptors(
    new ErrorInterceptor(),
    new DataInterceptor()
  );

  await application.listen(process.env.PORT || 3001);
}

bootstrap();
