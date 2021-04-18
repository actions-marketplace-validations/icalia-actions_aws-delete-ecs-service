import ECS, {
  Service,
  DeleteServiceRequest,
  UpdateServiceRequest,
  DescribeServicesRequest,
} from "aws-sdk/clients/ecs";

export interface DeleteServiceInputs {
  name: string;
  cluster?: string;
  failIfNoMatch: boolean;
}

function getClient(): ECS {
  return new ECS({
    customUserAgent: "icalia-actions/aws-action",
    region: process.env.AWS_DEFAULT_REGION,
  });
}

export async function scaleServiceDownToZeroTasks(
  inputs: DeleteServiceInputs
): Promise<Service | undefined> {
  const { cluster, name } = inputs;

  const { service } = await getClient()
    .updateService({
      service: name,
      cluster,
      desiredCount: 0,
    } as UpdateServiceRequest)
    .promise();

  return service;
}

export async function getService(
  inputs: DeleteServiceInputs
): Promise<Service | undefined> {
  const { cluster, name } = inputs;

  const { services, failures } = await getClient()
    .describeServices({
      cluster,
      services: [name],
    } as DescribeServicesRequest)
    .promise();

  if (failures?.length) return;

  const service = services?.pop();
  if (service?.status == "INACTIVE") return;

  return service;
}

export async function deleteService(
  inputs: DeleteServiceInputs
): Promise<Service | undefined> {
  const { cluster, name } = inputs;
  const { service } = await getClient()
    .deleteService({
      cluster,
      service: name,
    } as DeleteServiceRequest)
    .promise();

  return service;
}
