CREATE DATABASE [MOCKENSOLVER]
GO
USE [MOCKENSOLVER]
GO
CREATE TABLE [dbo].[User](
	UserID int IDENTITY(1,1) NOT NULL,
	UserName varchar(15) NOT NULL,
	Auth0ID varchar(32) NOT NULL,
	PRIMARY KEY(UserID)
)
GO
CREATE TABLE [dbo].[Folder](
	FolderID int IDENTITY(1,1) NOT NULL,
	FolderName varchar(30) NULL,
	UserID int NOT NULL,
	PRIMARY KEY(FolderID),
	FOREIGN KEY (UserID) REFERENCES [MOCKENSOLVER].[dbo].[User](UserID) ON DELETE CASCADE,
)
GO
CREATE TABLE [dbo].[UserTask](
	TaskID int IDENTITY(1,1) NOT NULL,
	Status bit NOT NULL,
	Description varchar(200) NULL,
	FolderID int NOT NULL,
	PRIMARY KEY(TaskID),
	FOREIGN KEY (FolderID) REFERENCES [MOCKENSOLVER].[dbo].[Folder](FolderID) ON DELETE CASCADE
)
GO
INSERT INTO [User] VALUES 
('admin','auth0|6101dfa33582bc006946c7a7');
GO
INSERT INTO [MOCKENSOLVER].[dbo].[Folder]
SELECT 'My Main Folder',UserID from [MOCKENSOLVER].[dbo].[User] WHERE UserName='admin'
GO
INSERT INTO [MOCKENSOLVER].[dbo].[UserTask]
SELECT 0,'Dummy Task #1',FolderID from [MOCKENSOLVER].[dbo].[Folder] WHERE FolderName='My Main Folder' AND UserID IN
(
	SELECT UserID from [MOCKENSOLVER].[dbo].[User] WHERE UserName='admin'
)
GO