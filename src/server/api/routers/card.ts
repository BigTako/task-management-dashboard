import { Column, Prisma } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const cardRouter = createTRPCRouter({
  //   list: publicProcedure.query(async ({ ctx }) => {
  //     return ctx.db.card.findMany();
  //   }),
  //   one: publicProcedure
  //     .input(z.object({ id: z.string() }))
  //     .query(async ({ ctx, input }) => {
  //       const { id } = input;
  //       return ctx.db.board.findUnique({ where: { id } });
  //     }),
  byBoard: publicProcedure
    .input(z.object({ boardId: z.string(), column: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.card.findMany({
        where: {
          boardId: input.boardId,
          column: input.column as Column,
        },
        include: {
          board: {
            select: {
              id: true,
            },
          },
        },
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(1, {
            message: 'Title should not be empty',
          })
          .max(128, {
            message: 'Title should contain at most 128 characters',
          }),
        description: z
          .string()
          .min(1, {
            message: 'Description should not be empty',
          })
          .max(512, {
            message: 'Description should contain at most 512 characters',
          }),
        column: z.string().refine(v => Object.keys(Column).includes(v)),
        position: z.number(),
        boardId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { title, description, boardId, position } = input;
      const column = input.column as Column;
      return await ctx.db.card.create({
        data: {
          title,
          description,
          column,
          position,
          board: {
            connect: {
              id: boardId,
            },
          },
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z
          .string()
          .min(1, {
            message: 'Title should not be empty',
          })
          .max(128, {
            message: 'Title should contain at most 128 characters',
          })
          .optional(),
        description: z
          .string()
          .min(1, {
            message: 'Description should not be empty',
          })
          .max(512, {
            message: 'Description should contain at most 512 characters',
          })
          .optional(),
        column: z
          .string()
          .optional()
          .refine(v => {
            if (v) return Object.keys(Column).includes(v);
            return true;
          }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, title, description } = input;

      const column = input.column as Column;

      return await ctx.db.card.update({
        where: {
          id,
        },
        data: {
          title,
          description,
          column,
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
      return await ctx.db.card.delete({
        where: {
          id,
        },
      });
    }),
});
