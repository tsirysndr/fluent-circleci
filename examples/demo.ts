import {
  CircleCI,
  Job,
} from "https://deno.land/x/fluent_circleci@0.1.0/mod.ts";

const circleci = new CircleCI();

const build = new Job()
  .docker([{ image: "cimg/node:lts" }])
  .step("checkout")
  .step({
    setup_remote_docker: {
      docker_layer_caching: true,
    },
  })
  .step({
    run: {
      name: "Install deps",
      command: "npm ci",
    },
  })
  .step({
    run: {
      name: "Dagger Pipeline",
      command: "node index.mjs",
    },
  });

circleci.jobs({ build }).workflow("dagger", ["build"]);

console.log(circleci.toString());
