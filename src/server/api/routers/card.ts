import { de } from '@faker-js/faker';
import { Column, Prisma } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const cardRouter = createTRPCRouter({
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
        boardId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { title, description, boardId } = input;
      const column = input.column as Column;

      const { _max } = await ctx.db.card.aggregate({
        where: {
          boardId,
          column,
        },
        _max: {
          position: true,
        },
      });

      const lastPosition = _max.position ?? -1;

      return await ctx.db.card.create({
        data: {
          title,
          description,
          column,
          position: lastPosition + 1,
          board: {
            connect: {
              id: boardId,
            },
          },
        },
      });
    }),

  move: publicProcedure
    .input(
      z.object({
        id: z.string(),
        boardId: z.string(),
        toPosition: z.number(),
        toColumn: z.string(),
        // source: z.object({ position: z.number(), column: z.string() }),
        // destination: z.object({ position: z.number(), column: z.string() }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, boardId, toPosition, toColumn } = input;

      const foundedCard = await ctx.db.card.findUnique({
        where: {
          id,
        },
      });

      if (!foundedCard) return;

      const isSameColumn = foundedCard.column === toColumn;

      if (isSameColumn) {
        const columns = await ctx.db.card.findMany({
          where: {
            boardId,
            column: foundedCard.column as Column,
            id: {
              not: {
                equals: id,
              },
            },
          },
          orderBy: {
            position: 'asc',
          },
        });

        columns.splice(toPosition, 0, { ...foundedCard, position: toPosition });

        return await ctx.db.$transaction(
          columns.map((card, i) => {
            return ctx.db.card.update({
              where: { id: card.id },
              data: { position: i },
            });
          }),
        );
      }

      // query from old db
      const oldColumnCards = await ctx.db.card.findMany({
        where: {
          boardId,
          column: foundedCard.column as Column,
          id: {
            not: {
              equals: id,
            },
          },
        },
        orderBy: {
          position: 'asc',
        },
        select: {
          id: true,
        },
      });

      // reorder old column cards
      await ctx.db.$transaction(
        oldColumnCards.map((card, i) => {
          return ctx.db.card.update({
            where: { id: card.id },
            data: { position: i },
          });
        }),
      );

      // query cards from new table
      const newColumnCards = await ctx.db.card.findMany({
        where: {
          boardId,
          column: toColumn as Column,
        },
        orderBy: {
          position: 'asc',
        },
      });

      newColumnCards.splice(toPosition, 0, { ...foundedCard, column: toColumn as Column, position: toPosition });

      await ctx.db.$transaction(
        newColumnCards.map((card, i) => {
          return ctx.db.card.update({
            where: { id: card.id },
            data: { position: i, column: toColumn as Column },
          });
        }),
      );

      // reorder new column cards
      // await ctx.db.$transaction(
      //   Array.from({ length: newColumnCards.length + 1}).map((_, i) => {
      //     const card = newColumnCards[i];
      //     return ctx.db.card.update({
      //       where: { id: card.id },
      //       data: { position: i },
      //     });
      //   })
      // newColumnCards.map((card, i) => {
      // return ctx.db.card.update({
      //   where: { id: card.id },
      //   data: { position: i },
      // });
      // }),
      // );

      // const columnCards = await ctx.db.card.findMany({
      //   where: {
      //     boardId,
      //     column: toColumn as Column,
      //     id: {
      //       not: {
      //         equals: id,
      //       },
      //     },
      //   },
      // });

      // columnCards.splice(toPosition, 0, { ...foundedCard, position: toPosition });

      // const updateOperations = columnCards.map((card, i) => {
      //   return ctx.db.card.update({
      //     where: { id: card.id },
      //     data: { position: i, column: toColumn as Column },
      //   });
      // });

      // return await ctx.db.$transaction(updateOperations);

      // const { id, source, destination, boardId } = input;
      // const isSameColumn = destination.column === source.column;
      // const { _max } = await ctx.db.card.aggregate({
      //   where: {
      //     boardId,
      //     column: destination.column as Column,
      //   },
      //   _max: {
      //     position: true,
      //   },
      // });
      // const lastPosition = _max.position ?? 0;
      // if (isSameColumn) {
      //   if (destination.position === 0) {
      //     // to the beggining
      //     await ctx.db.card.updateMany({
      //       where: {
      //         boardId,
      //         column: destination.column as Column,
      //       },
      //       data: {
      //         position: {
      //           increment: 1,
      //         },
      //       },
      //     });
      //   } else if (destination.position <= lastPosition) {
      //     //somewhere to the middle
      //     await ctx.db.card.updateMany({
      //       where: {
      //         boardId,
      //         column: destination.column as Column,
      //         position: {
      //           gte: destination.position,
      //         },
      //       },
      //       data: {
      //         position: {
      //           increment: 1,
      //         },
      //       },
      //     });
      //   }
      // } else {
      //   await ctx.db.card.updateMany({
      //     where: {
      //       boardId,
      //       column: source.column as Column,
      //       position: {
      //         gt: source.position,
      //       },
      //     },
      //     data: {
      //       position: {
      //         decrement: 1,
      //       },
      //     },
      //   });
      //   await ctx.db.card.updateMany({
      //     where: {
      //       boardId,
      //       column: destination.column as Column,
      //       position: {
      //         gte: destination.position,
      //       },
      //     },
      //     data: {
      //       position: {
      //         increment: 1,
      //       },
      //     },
      //   });
      // }
      // return await ctx.db.card.update({
      //   where: {
      //     id,
      //   },
      //   data: {
      //     position: destination.position,
      //     column: destination.column as Column,
      //   },
      // });
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
