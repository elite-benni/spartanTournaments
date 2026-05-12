import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const competitors = pgTable('competitor', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  drawNumber: integer('draw_number'),
  groupID: integer('group_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tournamentDetails = pgTable('tournament_detail', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  numberOfParallelGames: integer('number_of_parallel_games').notNull(),
  minutesPerGame: integer('minutes_per_game').notNull(),
  minutesAvailForGroupsPhase: integer('minutes_avail_for_groups_phase').notNull(),
  finalistCount: integer('finalist_count').notNull(),
  tournamentStartTime: timestamp('tournament_start_time').notNull(),
  finalsStartTime: timestamp('finals_start_time').notNull(),
  adminPasswordHash: text('admin_password_hash').notNull(),
  refereePasswordHash: text('referee_password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const pairings = pgTable('pairing', {
  id: serial('id').primaryKey(),
  gamenumber: integer('gamenumber').default(0).notNull(),
  competitor1ID: integer('competitor1_id').notNull(),
  competitor2ID: integer('competitor2_id').notNull(),
  round: integer('round').notNull(),
  groupID: integer('group_id').notNull(),
  startTime: timestamp('start_time').notNull(),
  court: integer('court').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const gamePoints = pgTable('game_point', {
  id: serial('id').primaryKey(),
  competitor1Points: integer('competitor1_points').notNull(),
  competitor2Points: integer('competitor2_points').notNull(),
  pairingID: integer('pairing_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
