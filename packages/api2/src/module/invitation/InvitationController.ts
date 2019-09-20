import { Body, Controller, Post, UsePipes } from "@nestjs/common";

import {
  GetInvitationDto,
  getInvitationDtoValidationPipe
} from "./dto/GetInvitationDto";
import { InvitationService } from "./InvitationService";

@Controller("invitation")
export class InvitationController {
  public constructor(private readonly invitationService: InvitationService) {}

  @Post("get")
  @UsePipes(getInvitationDtoValidationPipe)
  public async get(@Body() getInvitationDto: GetInvitationDto) {
    return this.invitationService.findById(getInvitationDto.id);
  }
}
