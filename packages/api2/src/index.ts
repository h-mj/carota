import { NestFactory } from "@nestjs/core";

import { ApplicationModule } from "./ApplicationModule";
import { DataInterceptor } from "./DataInterceptor";
import { ErrorFilter } from "./ErrorFilter";

const bootstrap = async (): Promise<void> => {
  const application = await NestFactory.create(ApplicationModule);

  application
    .setGlobalPrefix("api")
    .useGlobalFilters(new ErrorFilter())
    .useGlobalInterceptors(new DataInterceptor());

  await application.listen(process.env.PORT || 3001);
};

bootstrap();
