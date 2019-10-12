import { EntityRepository, Repository } from "typeorm";

import { Invitation } from "./Invitation";

@EntityRepository(Invitation)
export class InvitationRepository extends Repository<Invitation> {}
