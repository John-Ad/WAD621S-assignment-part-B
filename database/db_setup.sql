--  execute source /~/Documents/Computer-Science-Semester-4/Web Development/WAD621S-assignment-part-B/database/db_setup.sql


drop database NUST_CHAT_BOARD;

create database NUST_CHAT_BOARD;

use NUST_CHAT_BOARD;

/*--#####################################################*/
/*--#####     TABLE DEFINITIONS*/
/*--#####################################################*/

create table UserInfo(
    Username varchar(100) primary key,
    Email varchar(200) not null,
    Password varchar(100) not null
);

create table Topic(
    TopicName varchar(100) primary key,
    Username varchar(100) not null,

    foreign key (Username) references UserInfo(Username)
);

create table Message(
    MessageID int primary key auto_increment,
    TopicName varchar(100) not null,
    Username varchar(100) not null,
    Date_Added datetime not null,
    Content varchar(5000) not null,
    Edited bit not null,

    foreign key (TopicName) references Topic(TopicName),
    foreign key (Username) references UserInfo(Username)
);



/*--#####################################################*/
/*--#####     ADD USER*/
/*--#####################################################*/

delimiter //
create procedure sp_addUser(
    in uname varchar(100),
    in uemail varchar(200),
    in password varchar(100)
)
begin
    if(uname in(select Username from UserInfo)) then
        select 'username already exists' as RESULT;
    else
        if(uemail in(select Email from UserInfo)) then
            select 'email already in use' as RESULT;
        else
            if(uname != '' AND uemail != '' AND password != '') then
                insert into UserInfo(Username,Email,Password) values(uname,uemail,password);
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
    in uname varchar(100),
    in tname varchar(100)
)
begin
    if(tname in(select TopicName from Topic)) then
        select 'topic already exists' as RESULT;
    else
        if(tname = '') then
            select 'name for topic not specified' as RESULT;
        else
            if(uname in(select Username from UserInfo)) then
                insert into Topic(Username,TopicName) values(uname,tname);
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
    in uname varchar(100),
    in tname varchar(100),
    in content varchar(5000)
)
begin
    if(tname not in(select TopicName from Topic)) then
        select 'topic does not exist' as RESULT;
    else
        if(content = '') then
            select 'no content added' as RESULT;
        else
            if(uname in(select Username from UserInfo)) then
                insert into Message(TopicName, Username, Date_Added, Content, Edited) values(tname, uname, now(), content, 0);

                select Username, MessageID, Date_Added, Content, Edited
                from Message
                where Username=uname
                order by MessageID desc
                limit 1;
            else
                select 'user does not exist' as RESULT;
            end if;
        end if;
    end if;
end //
delimiter ;


/*--#####################################################*/
/*--#####     EDIT MESSAGE*/
/*--#####################################################*/

delimiter //
create procedure sp_editMessage(
    in mID int,
    in mContent varchar(5000)
)
begin
    if(mID not in(select MessageID from Message)) then
        select 'message does not exist' as RESULT;
    else
        if(mContent!='') then
            update Message
            set Content=mContent, Edited=1
            where MessageID = mID;

            select 'ok' as RESULT;
        else
            select 'message cannot be empty' as RESULT;
        end if;
    end if;
end //
delimiter ;


/*--#####################################################*/
/*--#####     DELETE MESSAGE*/
/*--#####################################################*/

delimiter //
create procedure sp_deleteMessage(
    in mID int
)
begin
    if(mID not in(select MessageID from Message)) then
        select 'message does not exist' as RESULT;
    else
        delete from Message
        where MessageID = mID;

        select 'ok' as RESULT;
    end if;
end //
delimiter ;


/*--#####################################################*/
/*--#####     GET MESSAGES BY TOPIC*/
/*--#####################################################*/

delimiter //
create procedure sp_getMessagesByTopic(
    in tname varchar(100)
)
begin
    if(tname not in(select TopicName from Topic)) then
        select 'topic does not exist' as RESULT;
    else
        select Username, MessageID, Date_Added, Content, Edited
        from Message
        where TopicName=tname;
    end if;
end //
delimiter ;


/*--#####################################################*/
/*--#####     LOGIN*/
/*--#####################################################*/

delimiter //
create procedure sp_login(
    in uname varchar(100),
    in pword varchar(100)
)
begin
    if(uname not in(select Username from UserInfo)) then
        select 'user does not exist' as RESULT;
    else
        if(pword not in(select Password from UserInfo where Username=uname)) then
            select 'incorrect password' as RESULT;
        else
            select 'ok' as RESULT;
        end if;
    end if;
end //
delimiter ;


/*--#####################################################*/
/*--#####     GET ALL TOPICS*/
/*--#####################################################*/

delimiter //
create procedure sp_getAllTopics(
)
begin
    select TopicName from Topic
    order by TopicName asc;
end //
delimiter ;


/*--#####################################################*/
/*--#####     SEARCH TOPICS*/
/*--#####################################################*/

delimiter //
create procedure sp_searchTopics(
    in searchTerm varchar(200)
)
begin
    select TopicName
    from Topic
    where TopicName like searchTerm
    order by TopicName asc;
end //
delimiter ;


/*--#####################################################*/
/*--#####     SEARCH MESSAGES*/
/*--#####################################################*/

delimiter //
create procedure sp_searchMessages(
    in tname varchar(100),
    in searchTerm varchar(200)
)
begin
    if(tname in(select TopicName from Topic)) then
        select Username, MessageID, Date_Added, Content, Edited
        from Message
        where TopicName=tname AND Content like searchTerm
        order by MessageID asc;
    else
        select 'topic does not exist' as RESULT;
    end if;
end //
delimiter ;


