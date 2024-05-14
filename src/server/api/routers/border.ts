import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const boardRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.board.findMany({
      include: {
        cards: true,
      },
    });
  }),
  //   hello: publicProcedure
  //     .input(z.object({ text: z.string() }))
  //     .query(({ input }) => {
  //       return {
  //         greeting: `Hello ${input.text}`,
  //       };
  //     }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      //   await new Promise((resolve) => setTimeout(resolve, 1000));

      // return {
      //   name: input.name,
      // };
      return await ctx.db.board.create({
        data: {
          name: input.name,
        },
      });
    }),

  // getLatest: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //   });
  // }),
});
