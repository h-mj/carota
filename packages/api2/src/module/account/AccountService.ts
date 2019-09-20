import { hash } from "bcryptjs";
import { Repository } from "typeorm";

import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { BadRequestError } from "../../error/BadRequestError";
import { AuthenticationService } from "../authentication/AuthenticationService";
import { InvitationService } from "../invitation/InvitationService";
import { CreateAccountDto } from "./dto/CreateAccountDto";
import { Account } from "./entity/Account";

@Injectable()
export class AccountService {
  public constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @Inject(forwardRef(() => AuthenticationService))
    private readonly authenticationService: AuthenticationService,
    private readonly invitationService: InvitationService
  ) {}

  public async getById(id: string) {
    return this.accountRepository.findOne({ id });
  }

  public async getByEmail(email: string) {
    return this.accountRepository.findOne({ email });
  }

  public async create(createAccountDto: CreateAccountDto) {
    const { email, invitationId, language, name, password } = createAccountDto;
    const invitation = await this.invitationService.findById(invitationId);

    if (invitation === undefined) {
      throw BadRequestError.fromNotFoundId(["id"]);
    }

    const { adviser, inviter, rights, type } = invitation;

    const template = this.accountRepository.create({
      name,
      language,
      email,
      hash: await hash(password, 12),
      adviser,
      inviter,
      type,
      rights
    });

    const account = await this.accountRepository.save(template);

    return this.authenticationService.generateToken(account);
  }
}
