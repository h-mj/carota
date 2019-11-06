import { Body, Controller, Post } from "@nestjs/common";

import { ValidationPipe } from "../../base/ValidationPipe";
import {
  GetInvitationDto,
  getInvitationDtoValidator
} from "./dto/GetInvitationDto";
import { InvitationService } from "./InvitationService";

@Controller("invitation")
export class InvitationController {
  public constructor(private readonly invitationService: InvitationService) {}

  @Post("get")
  public async get(
    @Body(new ValidationPipe(getInvitationDtoValidator)) dto: GetInvitationDto
  ) {
    const invitation = await this.invitationService.get(dto);

    return invitation.toDto();
  }
}
