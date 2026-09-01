import { FileModel } from '@kcs-project/pack/models/file';

export const fileId = z.objectId().refine((_id) => FileModel.exists({ _id }));
