-- CreateTable
CREATE TABLE "Text" (
    "identifier" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Text_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "File" (
    "identifier" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
