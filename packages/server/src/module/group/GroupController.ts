import { Body, Controller, Post } from "@nestjs/common";

import { Principal } from "../../base/AuthenticationMiddleware";
import { ValidationPipe } from "../../base/ValidationPipe";
import { Account } from "../account/Account";
import { CreateGroupDto, createGroupDtoValidator } from "./dto/CreateGroupDto";
import { GetGroupsDto, getGroupsDtoValidator } from "./dto/GetGroupsDto";
import { InsertGroupDto, insertGroupDtoValidator } from "./dto/InsertGroupDto";
import { RenameGroupDto, renameGroupDtoValidator } from "./dto/RenameGroupDto";
import { GroupService } from "./GroupService";

/**
 * Controller that defines all endpoints related to `Group` entity.
 */
@Controller("group")
export class GroupController {
  /**
   * Creates a new instance of `GroupController`. This constructor is only
   * called by Nest.
   */
  public constructor(private readonly groupService: GroupService) {}

  /**
   * Group creation endpoint.
   */
  @Post("create")
  public async create(
    @Body(new ValidationPipe(createGroupDtoValidator)) dto: CreateGroupDto,
    @Principal() principal: Account
  ) {
    const group = await this.groupService.create(dto, principal);

    return await group.toDto();
  }

  /**
   * Account advisee group retrieval endpoint.
   */
  @Post("get")
  public async get(
    @Body(new ValidationPipe(getGroupsDtoValidator)) dto: GetGroupsDto,
    @Principal() principal: Account
  ) {
    const { ungrouped, groups } = await this.groupService.get(dto, principal);

    return {
      ungrouped: await Promise.all(ungrouped.map(account => account.toDto())),
      groups: await Promise.all(groups.map(group => group.toDto()))
    };
  }

  /**
   * Group insertion endpoint.
   */
  @Post("insert")
  public async insert(
    @Body(new ValidationPipe(insertGroupDtoValidator)) dto: InsertGroupDto,
    @Principal() principal: Account
  ) {
    await this.groupService.insert(dto, principal);

    return true as const;
  }

  /**
   * Group rename endpoint.
   */
  @Post("rename")
  public async rename(
    @Body(new ValidationPipe(renameGroupDtoValidator)) dto: RenameGroupDto,
    @Principal() principal: Account
  ) {
    await this.groupService.rename(dto, principal);

    return true as const;
  }
}
