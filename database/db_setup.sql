--  execute source /~/Documents/Computer-Science-Semester-4/Web Development/WAD621S-assignment-part-B/database/db_setup.sql


drop database NUST_CHAT_BOARD;

create database NUST_CHAT_BOARD;

use NUST_CHAT_BOARD;

/*--#####################################################*/
/*--#####     TABLE DEFINITIONS*/
/*--#####################################################*/

create table UserInfo(
    UserID int primary key,
    Username varchar(100) not null,
    Email varchar(200) not null,
    Password varchar(100) not null
);

create table Topic(
    TopicID int primary key,
    UserID int not null,
    Name varchar(100) not null,

    foreign key (UserID) references UserInfo(UserID)
);

create table Message(
    MessageID int primary key,
    TopicID int not null,
    UserID int not null,
    Date_Added date not null,
    Content varchar(5000) not null,
    Edited bit not null,

    foreign key (UserID) references UserInfo(UserID),
    foreign key (TopicID) references Topic(TopicID)
);



/*--#####################################################*/
/*--#####     ADD USER*/
/*--#####################################################*/

delimiter //
create procedure sp_addUser(
    in username varchar(100),
    in email varchar(200),
    in password varchar(100)
)
begin
    if(username in(select username from UserInfo)) then
        select 'username already exists' as RESULT;
    else
        if(email in(select email from UserInfo)) then
            select 'email already in use' as RESULT;
        else
            if(username != '' AND email != '' AND password != '') then
                insert into UserInfo(Username,Email,Password) values(username,email,password);
                select 'ok' as RESULT;
            else
                select 'please fill all fields' as RESULT;
            end if;
        end if;
    end if;
end //
delimiter ;


/*--#####################################################*/
/*--#####     ADD TOPIC*/
/*--#####################################################*/

delimiter //
create procedure sp_addTopic(
    in userID int,
    in name varchar(100)
)
begin
    if(name in(select Name from Topic)) then
        select 'topic already exists' as RESULT;
    else
        if(name = '') then
            select 'name for topic not specified' as RESULT;
        else
            if(userID in(select UserID from UserInfo)) then
                insert into Topic(UserID,Name) values(userID,name);
                select 'ok' as RESULT;
            else
                select 'user does not exist' as RESULT;
            end if;
        end if;
    end if;
end //
delimiter ;


/*--#####################################################*/
/*--#####     ADD MESSAGE*/
/*--#####################################################*/

delimiter //
create procedure sp_addMessage(
    in userID int,
    in topicID int,
    in content varchar(5000)
)
begin
    if(topicID not in(select TopicID from Topic)) then
        select 'topic does not exist' as RESULT;
    else
        if(content = '') then
            select 'no content added' as RESULT;
        else
            if(userID in(select UserID from UserInfo)) then
                insert into Message(TopicID, UserID, Date_Added, Content, Edited) values(topicID, userID, curdate(), content, 0);
                select 'ok' as RESULT;
            else
                select 'user does not exist' as RESULT;
            end if;
        end if;
    end if;
end //
delimiter ;


/*--#####################################################*/
/*--#####     DELETE MESSAGE*/
/*--#####################################################*/

delimiter //
create procedure sp_deleteMessage(
    in messageID int
)
begin
    if(messageID not in(select MessageID from Message)) then
        select 'message does not exist' as RESULT;
    else
        delete from Message
        where MessageID = messageID;
    end if;
end //
delimiter ;


/*--#####################################################*/
/*--#####     GET MESSAGES BY TOPIC*/
/*--#####################################################*/

delimiter //
create procedure sp_getMessagesByTopic(
    in topicID int
)
begin
    if(topicID not in(select TopicID from Topic)) then
        select 'topic does not exist' as RESULT;
    else
        select UserInfo.Username, Message.MessageID, Message.Date_Added, Message.Content, Message.Edited
        from Message
        inner join UserInfo
        on Message.UserID = UserInfo.UserID
        where Message.TopicID = topicID;
    end if;
end //
delimiter ;

