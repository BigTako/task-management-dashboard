import { Column } from "@prisma/client";
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
  one: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return ctx.db.board.findUnique({ where: { id } });
    }),
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { name } = input;

      return await ctx.db.board.create({
        data: {
          name: input.name,
        },
      });
    }),
  createCard: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        column: z.string().refine((v) => Object.keys(Column).includes(v)),
        boardId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { title, description, boardId } = input;
      const column = input.column as Column;
      return await ctx.db.board.update({
        where: {
          id: boardId,
        },
        data: {
          cards: {
            create: {
              title,
              description,
              column,
            },
          },
        },
      });
      // return await ctx.db.card.create({
      //   data: {
      //     title,
      //     description,
      //     column,
      //     board: {
      //       connect: {
      //         id: boardId,
      //       },
      //     },
      //   },
      // });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        body: z.object({
          name: z.string().min(1),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, body: data } = input;

      return await ctx.db.board.update({
        where: {
          id,
        },
        data,
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
