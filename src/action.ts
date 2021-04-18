import { info, getInput, setOutput } from "@actions/core";

import {
  getService,
  deleteService,
  DeleteServiceInputs,
  scaleServiceDownToZeroTasks,
} from "./service-management";

function handleServiceNotFound(inputs: DeleteServiceInputs): void {
  const { name, failIfNoMatch } = inputs;
  const message = `Service '${name}' not found.`;
  if (failIfNoMatch) throw message;

  info(message);
}

export async function run(): Promise<number | undefined> {
  const inputs = {
    name: getInput("name"),
    cluster: getInput("cluster"),
    failIfNoMatch: getInput("fail-if-no-match") == "true",
  } as DeleteServiceInputs;

  const service = await getService(inputs);

  if (!service) {
    handleServiceNotFound(inputs);
    return;
  }

  info(`Scaling service '${service.serviceName}' down to zero tasks...`);
  await scaleServiceDownToZeroTasks(inputs);
  info("...done!");

  info(`Deleting service '${service.serviceName}'...`);
  await deleteService(inputs);
  info(`...done!`);

  setOutput("service-arn", service.serviceArn);

  return 0;
}
