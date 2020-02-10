import {
  readBricorConfig,
  logger,
  BricorConfig,
  Exec,
  SubPkgs,
  ExecItem
} from "../utils";
import { join, dirname } from "path";
import { extractNameFromRepo, concatPath } from "./init-handler";
import Shell from "shelljs";
import { existsSync } from "fs";

interface ParsedSubPkg {
  name: string;
  path: string;
}

type ParsedSubPkgs = ParsedSubPkg[];

export async function bootstrapHandler() {
  const results = await readBricorConfig();

  if (!results) {
    logger.error(
      `The ".bricor.json" was not found in the project root path, Please run "bricor init" for create config file`
    );

    return;
  }

  const config: BricorConfig = results.config;

  for (const { name, repo, path, exec = [], subPkgs = {} } of config) {
    const parsedName = name || extractNameFromRepo(repo);

    if (!parsedName) {
      logger.error("Invalid addr of repo.");
      return;
    }

    const parsedPath = parsePath(
      path || concatPath(parsedName),
      results.filepath
    );

    const parsedSubPkgs = parseSubPkgs(subPkgs, path);

    // exec init & update when the submodule is not exist
    if (!existsSync(parsedPath) && existsSync("./.gitmodules")) {
      Shell.exec("git submodule init");
      // update all submodules
      Shell.exec("git submodule update --remote");
    } else {
      // fetch repo
      Shell.exec(`git submodule add ${repo} ${parsedPath}`);
    }

    // console.info(parsedSubPkgs);

    // exec instrucs
    parseExec(exec, parsedSubPkgs);

    // link to global
    linkModule(parsedSubPkgs);

    // reset submodule config
    Shell.exec(`git submodule update --init --remote ${name}`);

    logger.info("bootstrap success!");
  }
}

function parseSubPkgs(subPkgs: SubPkgs, parentPath?: string): ParsedSubPkgs {
  return Object.keys(subPkgs).map(pkg => ({
    name: pkg,
    path: join(parentPath || "", subPkgs[pkg])
  }));
}

function linkModule(subPkgs: ParsedSubPkgs) {
  for (const { name, path } of subPkgs) {
    linkInGlobal(name, path);
  }
}

function linkInGlobal(name: string, path: string) {
  Shell.exec(`cd ${path} && npm link`);
  Shell.exec(`npm link ${name}`);
}

function parseExec(exec: Exec, parsedSubPkgs: ParsedSubPkgs, pkgPath?: string) {
  for (const instru of exec) {
    // single instruction
    if (typeof instru === "string") {
      evalSingleInstru(instru, pkgPath);

      continue;
    }

    // the instruction of specifying a sub pkg
    if (typeof instru.exec === "string") {
      evalSingleInstru(instru.exec, findPathByPkgName(parsedSubPkgs, instru));

      continue;
    }

    parseExec(
      instru.exec,
      parsedSubPkgs,
      findPathByPkgName(parsedSubPkgs, instru)
    );
  }
}

function findPathByPkgName(parsedSubPkgs: ParsedSubPkgs, instru: ExecItem) {
  const subPkg = parsedSubPkgs.find(({ name }) => name === instru.pkg);

  if (!subPkg) {
    throw new Error(
      `Please make sure the value of "pkg" is exist in "subPkgs"`
    );
  }

  return subPkg.path;
}

function evalSingleInstru(instru: string, pkgPath?: string) {
  if (pkgPath) {
    Shell.exec(`cd ${pkgPath} && ${instru}`);
  } else {
    Shell.exec(instru);
  }
}

function parsePath(name: string, path: string) {
  return name.replace(/^project/, dirname(path));
}
