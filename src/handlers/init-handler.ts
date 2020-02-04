import {
  readBricorConfig,
  logger,
  BricorConfig,
  createBricorConfig
} from "../utils";
import { prompt } from "inquirer";

const ADDR_REGEX = /https?:\/\/.+\/([^/]+)$/;

export async function initHandler() {
  const result = await readBricorConfig();

  if (!result) {
    logger.warn(`The ".bricor.json" was not found in the project root path`);

    const config = await ensureConfig();

    createBricorConfig(config);

    return;
  }

  logger.warn("The .bricor.json does already exist.");
}

export function extractNameFromRepo(url: string): string | undefined {
  const result = url.match(ADDR_REGEX);

  return result ? result[1] : undefined;
}

export function concatPath(name: string) {
  return `project/${name}`;
}

// gen a config file according to some question
async function ensureConfig(): Promise<BricorConfig> {
  logger.info("This will help you create a new bricor.json");

  const config: BricorConfig = [];

  while (true) {
    const { repo } = await prompt([
      {
        message: "submodule git addr",
        type: "input",
        name: "repo",
        validate(repo: string) {
          return ADDR_REGEX.test(repo) || "The addr must be a url";
        }
      }
    ]);
    const defaultName = repo.match(ADDR_REGEX)?.[1];
    const { path, name } = await prompt([
      {
        name: "name",
        type: "input",
        message: "submodule name",
        default: defaultName
      },
      {
        name: "path",
        type: "input",
        message: "Where do you want to keep it",
        default: concatPath(defaultName)
      }
    ]);
    const { hasMore } = await prompt({
      message: "There are more submodules?",
      type: "confirm",
      name: "hasMore"
    });

    config.push({ path, name, repo });

    if (!hasMore) {
      return config;
    }
  }
}
