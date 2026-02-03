import { z } from "zod";

export const fileValidationRules = z.object({
  files: z.array(z.file("Why it's not a file?")),
});
