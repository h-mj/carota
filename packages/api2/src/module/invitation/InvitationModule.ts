import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Invitation } from "./entity/Invitation";
import { InvitationController } from "./InvitationController";
import { InvitationService } from "./InvitationService";

@Module({
  imports: [TypeOrmModule.forFeature([Invitation])],
  providers: [InvitationService],
  exports: [InvitationService],
  controllers: [InvitationController]
})
export class InvitationModule {}
