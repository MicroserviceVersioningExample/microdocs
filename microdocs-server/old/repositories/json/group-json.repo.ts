import { Group, GroupOptions } from "../../domain/groups/group.model";
import { GroupRepository } from "../group.repo";
import { BaseJsonRepository } from "./base-json.repo";

export class GroupJsonRepository extends BaseJsonRepository<Group> implements GroupRepository {

  constructor() {
    super("groups");
  }

  protected deserialize(data: string): Group {
    let json = JSON.parse(data);
    return new Group(json as GroupOptions);
  }

}
