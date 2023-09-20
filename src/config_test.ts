import { assertEquals } from "../deps.ts";
import CircleCI from "./config.ts";
import Job from "./job.ts";

Deno.test(function circleciTest() {
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

  const yaml = Deno.readTextFileSync("./fixtures/config.yml");

  assertEquals(circleci.toString(), yaml);
});
