/* eslint-disable e18e/ban-dependencies -- node:path.matchesGlob is not behavior-compatible with micromatch. */
// @ts-expect-error The browser-compatible package does not provide TypeScript declarations.
import * as _micromatch from '@kikiutils/micromatch';
import type * as micromatchType from 'micromatch';
/* eslint-enable e18e/ban-dependencies */

export const micromatch = _micromatch.default as unknown as typeof micromatchType.default;
