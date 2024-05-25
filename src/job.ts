import {
  type Job as JobSpec,
  type Docker,
  type Step,
  DockerSchema,
  StepSchema,
  type Machine,
  MachineSchema,
  type Environment,
  EnvironmentSchema,
} from "./spec.ts";
import { _ } from "../deps.ts";

class Job {
  private spec: JobSpec;

  constructor() {
    this.spec = {
      steps: [],
    };
  }

  machine(value: Machine): Job {
    MachineSchema.parse(value);
    this.spec.machine = value;
    return this;
  }

  variables(value: Environment): Job {
    EnvironmentSchema.parse(value);
    this.spec.environment = value;
    return this;
  }

  variable(key: string, value: string): Job {
    if (!this.spec.environment) {
      this.spec.environment = {};
    }
    this.spec.environment[key] = value;
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
    this.spec.steps = values.map((value) => {
      if (typeof (value as { run: string }).run === "string") {
        return {
          ...(value as { run: string }),
          run: (value as { run: string }).run
            .split("\n")
            .map((line) => line.trim())
            .join("\n"),
        };
      }

      if (
        typeof _.get(
          value as { run: { name: string; command: string } },
          "run.command"
        ) === "string"
      ) {
        return {
          ...(value as { run: { name: string; command: string } }),
          run: {
            ...(value as { run: { name: string; command: string } }).run,
            command: (
              value as { run: { name: string; command: string } }
            ).run.command
              .split("\n")
              .map((line) => line.trim())
              .join("\n"),
          },
        };
      }

      return value;
    });
    return this;
  }

  step(value: Step): Job {
    StepSchema.parse(value);
    if (typeof (value as { run: string }).run === "string") {
      this.spec.steps.push({
        ...(value as { run: string }),
        run: (value as { run: string }).run
          .split("\n")
          .map((line) => line.trim())
          .join("\n"),
      });
      return this;
    }

    if (
      typeof _.get(
        value as { run: { name: string; command: string } },
        "run.command"
      ) === "string"
    ) {
      this.spec.steps.push({
        ...(value as { run: { name: string; command: string } }),
        run: {
          ...(value as { run: { name: string; command: string } }).run,
          command: (
            value as { run: { name: string; command: string } }
          ).run.command
            .split("\n")
            .map((line) => line.trim())
            .join("\n"),
        },
      });
      return this;
    }

    this.spec.steps.push(value);
    return this;
  }

  into() {
    return this.spec;
  }
}

export default Job;
