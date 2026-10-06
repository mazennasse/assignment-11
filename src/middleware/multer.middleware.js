import { BadExecption } from "../common/execption/index.js"
import { processFileMulterUpload } from "../common/utlis/index.js";

export const uploadMiddleware = ({
    isrequired = true,
    multermiddleware,
    customPath = "general",
    validation = []
}) => {

    return (req, res, next) => {

        multermiddleware(req, res, async (error) => {

            if (error) {
                next(new Error(error.message, {
                    cause: { status: 400 }
                }));
                return;
            }

            try {

                const exisitsFiles =
                    req.file ||
                    (Array.isArray(req.files) && req.files.length) ||
                    (
                        req.files &&
                        typeof req.files === "object" &&
                        Object.keys(req.files).length
                    );

                if (isrequired && !exisitsFiles) {
                    next(BadExecption("file is required"));
                    return;
                }

                await processFileMulterUpload({
                    req,
                    customPath,
                    validation
                });

                next();

            } catch (error) {
                next(error);
            }
        });
    };
};