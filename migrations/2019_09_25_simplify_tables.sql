USE VomBot
GO

DROP TABLE Emoji
DROP TABLE EmojiCategory;

CREATE TABLE Emoji(
   Id INT IDENTITY(1, 1) PRIMARY KEY,
   Code VARCHAR(256),
   Category VARCHAR(256)
)

CREATE INDEX EmojiCode
ON Emoji(Code)

CREATE INDEX EmojiCategory
ON Emoji(Category)
