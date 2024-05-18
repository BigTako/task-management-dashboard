import { Column } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const boardRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.board.findMany();
  }),
  one: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const { id } = input;
    return ctx.db.board.findUnique({
      where: { id },
      include: {
        cards: {
          orderBy: [
            {
              position: 'asc',
            },
          ],
        },
      },
    });
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, {
            message: 'Board name should not be empty',
          })
          .max(128, {
            message: 'Board name should contain at most 128 characters',
          }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name } = input;

      return await ctx.db.board.create({
        data: {
          name,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z
          .string()
          .min(1, {
            message: 'Board name should not be empty',
          })
          .max(128, {
            message: 'Board name should contain at most 128 characters',
          }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name } = input;

      return await ctx.db.board.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.db.board.delete({
        where: {
          id,
        },
      });
    }),
});
