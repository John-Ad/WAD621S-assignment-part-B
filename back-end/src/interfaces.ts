
//##############################################
//      GET MESSAGES BY TOPIC
//##############################################

export interface IGetMessagesByTopic {
    topicID: number
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
