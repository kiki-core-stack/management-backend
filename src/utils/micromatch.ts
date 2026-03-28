// @ts-expect-error Ignore this error.
import * as _micromatch from '@kikiutils/micromatch';
import type * as micromatchType from 'micromatch';

export const micromatch = _micromatch.default as unknown as typeof micromatchType.default;
