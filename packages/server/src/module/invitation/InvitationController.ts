import { Body, Controller, Post, UsePipes } from "@nestjs/common";

import { ValidationPipe } from "../../pipe/ValidationPipe";
import {
  GetInvitationDto,
  getInvitationDtoValidator
} from "./dto/GetInvitationDto";
import { InvitationService } from "./InvitationService";

@Controller("invitation")
export class InvitationController {
  public constructor(private readonly invitationService: InvitationService) {}

  @Post("get")
  @UsePipes(new ValidationPipe(getInvitationDtoValidator))
  public async get(@Body() dto: GetInvitationDto) {
    return this.invitationService.get(dto.id);
  }
}
