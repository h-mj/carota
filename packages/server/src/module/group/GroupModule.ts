import { Module } from "@nestjs/common";

import { GroupController } from "./GroupController";
import { GroupService } from "./GroupService";

/**
 * `Group` entity managing module.
 */
@Module({
  providers: [GroupService],
  controllers: [GroupController]
})
export class GroupModule {}
