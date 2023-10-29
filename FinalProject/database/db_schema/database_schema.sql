CREATE DATABASE NotesDatabase;

CREATE TABLE `user` (
    `user_id` int(10) NOT NULL AUTO_INCREMENT,
    `username` varchar(255) NOT NULL UNIQUE,
    `password` varchar(255) NOT NULL,
    `salt` varchar(25) NOT NULL,
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4;

CREATE TABLE `notes` (
    `note_id` int(10) NOT NULL AUTO_INCREMENT,
    `name` varchar(30) NOT NULL,
    `sub_name` varchar(60),
    `owner` int(10) NOT NULL,
    `last_save` datetime NOT NULL,
    `file_path` text NOT NULL,
    PRIMARY KEY (`note_id`),
    CONSTRAINT `FK_USR_NOTE` FOREIGN KEY (`owner`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4;

CREATE TABLE `images` (
    `img_id` int(10) NOT NULL AUTO_INCREMENT,
    `img_path` text NOT NULL,
    `note` int(10) NOT NULL,
    PRIMARY KEY (`img_id`),
    CONSTRAINT `FK_IMG_NOTE` FOREIGN KEY (`note`) REFERENCES `notes` (`note_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4;

CREATE TABLE `folders` (
    `folder_id` int(10) NOT NULL AUTO_INCREMENT,
    `folder_name` varchar(30) NOT NULL,
    `owner` int(10) NOT NULL,
    PRIMARY KEY (`folder_id`),
    CONSTRAINT `FK_FOLDER_USER` FOREIGN KEY (`owner`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `folder_note_lookup` (
    `folder_id` int(10) NOT NULL,
    `note_id` int(10) NOT NULL,
    PRIMARY KEY (`folder_id`,`note_id`),
    CONSTRAINT FK_FOLDER_NOTE FOREIGN KEY (`folder_id`) REFERENCES `folders` (`folder_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT FK_NOTE_FOLDER FOREIGN KEY (`note_id`) REFERENCES `notes` (`note_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
