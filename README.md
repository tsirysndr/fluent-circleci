# Fluent CircleCI

[![deno module](https://shield.deno.dev/x/fluent_circleci)](https://deno.land/x/fluent_circleci)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![](https://img.shields.io/codecov/c/gh/tsirysndr/fluent-circleci)](https://codecov.io/gh/tsirysndr/fluent-circleci)

Fluent CircleCI is a deno module for generating CircleCI configuration files easily and fluently.

## 🚀 Usage

```typescript
import { CircleCI, Job } from "https://deno.land/x/fluent_circleci/mod.ts";

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

circleci.save(".circleci/config.yml");
```