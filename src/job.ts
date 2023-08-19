import {
  Job as JobSpec,
  Docker,
  Step,
  DockerSchema,
  StepSchema,
} from "./spec.ts";

class Job {
  private spec: JobSpec;

  constructor() {
    this.spec = {
      docker: [],
      steps: [],
    };
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
