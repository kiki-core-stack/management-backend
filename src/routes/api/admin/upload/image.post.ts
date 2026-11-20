import { uploadImageAndCreateFileDocument } from '@kcs-project/pack/libs/image';

const formDataSchema = z.object({ file: z.customFile().commonImages().gif().maxSizeMb(8) });
const querySchema = z.object({ allowGif: z.coerceBooleanStrict().optional() });

export default defineRoute({ permission: 'ignore' })(
    apiValidator('query', querySchema),
    apiValidator('form', formDataSchema),
    async (ctx) => {
        const { file } = ctx.req.valid('form');
        if (!ctx.req.valid('query').allowGif && file.type.endsWith('gif')) {
            throwFieldValidationError(
                ['file'],
                {
                    'en': 'GIF images are not allowed',
                    'zh-TW': '不允許上傳 GIF 圖片',
                },
            );
        }

        const fileDocument = await uploadImageAndCreateFileDocument({ image: file });
        return ctx.createApiSuccessResponse({ id: fileDocument._id.toHexString() });
    },
);
