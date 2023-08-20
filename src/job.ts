import {
  Job as JobSpec,
  Docker,
  Step,
  DockerSchema,
  StepSchema,
  Machine,
  MachineSchema,
} from "./spec.ts";

class Job {
  private spec: JobSpec;

  constructor() {
    this.spec = {
      docker: [],
      steps: [],
    };
  }

  machine(value: Machine): Job {
    MachineSchema.parse(value);
    this.spec.machine = value;
    return this;
  }

  resourceClass(value: string): Job {
    this.spec.resource_class = value;
    return this;
  }

  docker(values: Docker[]): Job {
    for (const value of values) {
      DockerSchema.parse(value);
    }
    this.spec.docker = values;
    return this;
  }

  steps(values: Step[]): Job {
    for (const value of values) {
      StepSchema.parse(value);
    }
    this.spec.steps = values;
    return this;
  }

  step(value: Step): Job {
    StepSchema.parse(value);
    this.spec.steps.push(value);
    return this;
  }

  into() {
    return this.spec;
  }
}

export default Job;
