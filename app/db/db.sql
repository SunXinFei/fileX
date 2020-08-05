CREATE TABLE IF NOT EXISTS  "file" (
	"id"	TEXT,
	"path"	TEXT DEFAULT "",
	"modificationTime"	TEXT,
	"desc"	TEXT DEFAULT "",
	"isDelete"	INTEGER DEFAULT 0,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "tags" (
	"id"	TEXT,
	"content"	TEXT NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "file_tag" (
	"fileId"	TEXT,
	"tagId"	TEXT,
	FOREIGN KEY("fileId") REFERENCES "file"("id"),
	FOREIGN KEY("tagId") REFERENCES "tags"("id")
);