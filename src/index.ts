import {
  Beautifier,
  BeautifierBeautifyData,
  DependencyType,
  ExecutableDependency,
  RunOptions,
} from "unibeautify";
import * as readPkgUp from "read-pkg-up";
import * as fs from "fs";
import * as path from "path";

const { pkg } = readPkgUp.sync({ cwd: __dirname });

export const beautifier: Beautifier = {
  name: "Black",
  package: pkg,
  badges: [
    {
      description: "Build Status",
      url:
        "https://travis-ci.com/Unibeautify/beautifier-black.svg?branch=master",
      href: "https://travis-ci.com/Unibeautify/beautifier-black",
    },
  ],
  options: {
    Python: {
      wrap_line_length: true,
    },
  },
  dependencies: [
    {
      type: DependencyType.Executable,
      name: "Black",
      program: "black",
      // parseVersion: [/version (\d+\.\d+\.\d+)/],
      homepageUrl: "https://github.com/ambv/black",
      installationUrl: "https://github.com/ambv/black#installation",
      bugsUrl: "https://github.com/ambv/black/issues",
      badges: [
        {
          description: "Build Status",
          url: "https://travis-ci.org/ambv/black.svg?branch=master",
          href: "https://travis-ci.org/ambv/black",
        },
        {
          description: "Documentation Status",
          url: "https://readthedocs.org/projects/black/badge/?version=stable",
          href: "https://black.readthedocs.io/en/stable/?badge=stable",
        },
        {
          description: "Coverage Status",
          url: "https://badges.gitter.im/Join%20Chat.svg",
          href: "https://coveralls.io/github/ambv/black?branch=master",
        },
        {
          description: "PyPI",
          url: "https://black.readthedocs.io/en/stable/_static/pypi.svg",
          href: "https://pypi.python.org/pypi/black",
        },
      ],
    },
  ],
  beautify({
    text,
    dependencies,
    filePath,
    projectPath,
    options,
  }: BeautifierBeautifyData) {
    const black = dependencies.get<ExecutableDependency>("Black");
    const rootDir = projectPath || (filePath && path.basename(filePath));
    const { wrap_line_length: wrapLineLength } = options;
    const args = ["--safe", "-"];
    if (wrapLineLength) {
      args.push(...["--line-length", wrapLineLength]);
    }
    const runOptions: RunOptions = rootDir
      ? {
          cwd: rootDir,
        }
      : {};
    return black
      .run({ args, stdin: text, options: runOptions })
      .then(({ exitCode, stderr, stdout }) => {
        if (exitCode) {
          return Promise.reject(stderr);
        }
        return Promise.resolve(stdout);
      });
  },
};

export default beautifier;
