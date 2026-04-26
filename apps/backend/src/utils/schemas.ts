import { z } from "zod";
export default {
  identifier: z.string().min(1),
  email: z.email().min(1),
  auth: {
    register: z.object({
      name: z.string().min(1),
      email: z.email().min(1),
      password: z.string().min(1),
    }),
    login: z.object({
      email: z.email().min(1),
      password: z.string().min(1),
    }),
  },
};
