import { exec } from "shelljs";
import { logger } from "../utils";

export function updateHandler(repo: string, branch: string) {
  // set branch of repo
  exec(`git config -f .gitmodules submodule.${repo}.branch ${branch}`);
  // pull latest version
  exec(`git submodule update --remote ${repo}`);

  logger.info(`${repo} updated.`);
}
