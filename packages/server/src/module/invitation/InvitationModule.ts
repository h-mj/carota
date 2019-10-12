import { Module } from "@nestjs/common";

import { InvitationController } from "./InvitationController";
import { InvitationService } from "./InvitationService";

@Module({
  providers: [InvitationService],
  controllers: [InvitationController]
})
export class InvitationModule {}
