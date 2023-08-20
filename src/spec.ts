import { z } from "https://deno.land/x/zod@v3.22.1/mod.ts";

export const MachineSchema = z.object({
  image: z.string(),
});

export const EnvironmentSchema = z.record(z.string());

export const DockerSchema = z.object({
  image: z.string(),
});

export const RunSchema = z.union([
  z.string(),
  z.object({
    name: z.string(),
    command: z.string(),
  }),
]);

export const StepSchema = z.union([
  z.literal("checkout"),
  z.object({
    setup_remote_docker: z.object({
      docker_layer_caching: z.boolean(),
    }),
  }),
  z.object({
    run: RunSchema,
  }),
]);

export const JobSchema = z.object({
  docker: z.array(DockerSchema).optional(),
  environment: EnvironmentSchema.optional(),
  machine: MachineSchema.optional(),
  resource_class: z.string().optional(),
  steps: z.array(StepSchema),
});

export const JobsSchema = z.record(JobSchema);

export const WorkflowsSchema = z.record(
  z.object({
    jobs: z.array(z.string()),
  })
);

export const Schema = z.object({
  version: z.literal(2.1),
  jobs: JobsSchema,
  workflows: WorkflowsSchema,
});

export type Machine = z.infer<typeof MachineSchema>;

export type Docker = z.infer<typeof DockerSchema>;

export type Run = z.infer<typeof RunSchema>;

export type Job = z.infer<typeof JobSchema>;

export type Jobs = z.infer<typeof JobsSchema>;

export type Step = z.infer<typeof StepSchema>;

export type Workflows = z.infer<typeof WorkflowsSchema>;

export type Environment = z.infer<typeof EnvironmentSchema>;

export type ConfigYaml = z.infer<typeof Schema>;
