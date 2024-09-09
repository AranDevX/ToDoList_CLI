-- CreateTable
CREATE TABLE "lists" (
    "list_id" SERIAL NOT NULL,
    "list_name" VARCHAR(100) NOT NULL,
    "user_id" INTEGER,
    "soft_delete" BOOLEAN DEFAULT false,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("list_id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "task_id" SERIAL NOT NULL,
    "task_title" VARCHAR(255) NOT NULL,
    "completed" BOOLEAN DEFAULT false,
    "list_id" INTEGER,
    "deadline" TIMESTAMP(6),
    "soft_delete" BOOLEAN DEFAULT false,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("list_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
