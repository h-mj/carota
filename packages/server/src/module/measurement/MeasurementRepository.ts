import { EntityRepository, Repository } from "typeorm";

import { Measurement } from "./Measurement";

@EntityRepository(Measurement)
export class MeasurementRepository extends Repository<Measurement> {}
