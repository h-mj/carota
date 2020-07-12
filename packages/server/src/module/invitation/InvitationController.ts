import { Body, Controller, Post } from "@nestjs/common";

import { Principal } from "../../base/AuthenticationMiddleware";
import { ValidationPipe } from "../../base/ValidationPipe";
import { Account } from "../account/Account";
import {
  GetInvitationDto,
  getInvitationDtoValidator,
} from "./dto/GetInvitationDto";
import { InvitationService } from "./InvitationService";

/**
 * Controller that defines all endpoints related to `Invitation` entity.
 */
@Controller("invitation")
export class InvitationController {
  /**
   * Creates a new instance of `InvitationController`. This constructor is only
   * called by Nest.
   */
  public constructor(private readonly invitationService: InvitationService) {}

  /**
   * Advisee invitation creation endpoint.
   */
  @Post("createForAdvisee")
  public async createForAdvisee(
    @Body() _: undefined,
    @Principal() principal: Account
  ) {
    const invitation = await this.invitationService.createForAdvisee(principal);

    return invitation.toDto();
  }

  /**
   * Invitation retrieval endpoint.
   */
  @Post("get")
  public async get(
    @Body(new ValidationPipe(getInvitationDtoValidator)) dto: GetInvitationDto
  ) {
    const invitation = await this.invitationService.get(dto);

    return invitation.toDto();
  }
}
