CREATE TABLE "competitor" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"draw_number" integer,
	"group_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_point" (
	"id" serial PRIMARY KEY NOT NULL,
	"competitor1_points" integer NOT NULL,
	"competitor2_points" integer NOT NULL,
	"pairing_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pairing" (
	"id" serial PRIMARY KEY NOT NULL,
	"gamenumber" integer DEFAULT 0 NOT NULL,
	"competitor1_id" integer NOT NULL,
	"competitor2_id" integer NOT NULL,
	"round" integer NOT NULL,
	"group_id" integer NOT NULL,
	"start_time" timestamp NOT NULL,
	"court" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournament_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"number_of_parallel_games" integer NOT NULL,
	"minutes_per_game" integer NOT NULL,
	"minutes_avail_for_groups_phase" integer NOT NULL,
	"finalist_count" integer NOT NULL,
	"tournament_start_time" timestamp NOT NULL,
	"finals_start_time" timestamp NOT NULL,
	"admin_password_hash" text NOT NULL,
	"referee_password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
