
//##############################################
//      GET MESSAGES BY TOPIC
//##############################################

export interface IGetMessagesByTopic {
    topicName: string
}
export interface IMessageByTopic {
    Username: string,
    MessageID: number,
    Date_Added: string,
    Content: string,
    Edited: number
}


//##############################################
//      ADD USER
//##############################################

export interface IAddUser {
    username: string,
    email: string,
    password: string
}


//##############################################
//      ADD TOPIC
//##############################################

export interface IAddTopic {
    username: string,
    name: string
}


//##############################################
//      ADD MESSAGE
//##############################################

export interface IAddMessage {
    username: string,
    topicName: string,
    content: string
}


//##############################################
//      EDIT MESSAGE
//##############################################

export interface IEditMessage {
    messageID: number,
    content: string,
    topicName: string
}


//##############################################
//      DELETE MESSAGE
//##############################################

export interface IDeleteMessage {
    messageID: number,
    topicName: string
}


//##############################################
//      RESPONSE 
//##############################################

export interface IResponse {
    stat: string,
    data: any
}


//##############################################
//     LOGIN 
//##############################################

export interface ILogin {
    username: string,
    password: string
}


//##############################################
//     GET ALL TOPICS 
//##############################################

export interface IGetAllTopics {
}
export interface IAllTopics {
    TopicName: string
}


//##############################################
//     SEARCH TOPICS 
//##############################################

export interface ISearchTopics {
    searchTerm: string
}
