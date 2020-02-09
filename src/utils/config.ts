import { cosmiconfig } from "cosmiconfig";
import { writeFile } from "fs";
import { promisify } from "util";
import { join } from "path";

export type Exec = (ExecItem | string)[];

export interface ExecItem {
  pkg: string;
  exec: Exec;
}

// map <sub pkg name => pkg path>
export interface SubPkgs {
  [name: string]: string;
}

interface BricorConfigItem {
  repo: string;
  name?: string;
  path?: string;
  exec?: Exec;
  subPkgs?: SubPkgs;
}

const CONFIG_NAME = ".bricor.json";

export async function createBricorConfig(config: BricorConfig) {
  return promisify(writeFile)(
    join(process.cwd(), CONFIG_NAME),
    JSON.stringify(config),
    {
      encoding: "utf8"
    }
  );
}

export const readBricorConfig = () =>
  cosmiconfig("bricor", {
    searchPlaces: [CONFIG_NAME, "package.json"]
  }).search();

export type BricorConfig = BricorConfigItem[];
