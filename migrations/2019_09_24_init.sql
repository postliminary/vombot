USE VomBot
GO

CREATE TABLE Users(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    SlackId VARCHAR(32),
    SlackAccessToken VARCHAR(256),
    SlackNonce VARCHAR(256)
)

CREATE INDEX UserSlackIds
ON Users(SlackId)

CREATE TABLE UserActivity(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    SlackId VARCHAR(32),
    RequestedOn DATETIME,
)

CREATE INDEX UserActivitySlackIds
ON UserActivity(SlackId)

CREATE INDEX UserActivityRequestedOn
ON UserActivity(RequestedOn)

CREATE TABLE Emoji(
   Id INT IDENTITY(1, 1) PRIMARY KEY,
   Code VARCHAR(256)
)

CREATE INDEX EmojiCode
ON Emoji(Code)

CREATE TABLE EmojiCategory(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Code VARCHAR(256),
    Category VARCHAR(256)
)

CREATE INDEX EmojiCategoryCode
ON EmojiCategory(Code)

CREATE INDEX EmojiCategoryCategory
ON EmojiCategory(Category)

CREATE TABLE EmojiBlacklist(
  Id INT IDENTITY(1, 1) PRIMARY KEY,
  Code VARCHAR(256)
)

CREATE INDEX EmojiBlacklistCode
ON EmojiBlacklist(Code)
