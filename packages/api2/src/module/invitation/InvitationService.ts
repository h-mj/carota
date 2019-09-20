import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Invitation } from "./entity/Invitation";

@Injectable()
export class InvitationService {
  public constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>
  ) {}

  public async findById(id: string) {
    return this.invitationRepository.findOne({ id });
  }
}
