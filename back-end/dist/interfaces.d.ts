export interface IGetMessagesByTopic {
    topicName: string;
}
export interface IMessageByTopic {
    Username: string;
    MessageID: number;
    Date_Added: string;
    Content: string;
    Edited: number;
}
export interface IAddUser {
    username: string;
    email: string;
    password: string;
}
export interface IAddTopic {
    username: string;
    name: string;
}
export interface IAddMessage {
    username: string;
    topicName: string;
    content: string;
}
export interface IEditMessage {
    messageID: number;
    content: string;
    topicName: string;
}
export interface IDeleteMessage {
    messageID: number;
    topicName: string;
}
export interface IResponse {
    stat: string;
    data: any;
}
export interface ILogin {
    username: string;
    password: string;
}
export interface IGetAllTopics {
}
export interface IAllTopics {
    TopicName: string;
}
export interface ISearchTopics {
    searchTerm: string;
}
export interface ISearchMessages {
    topicName: string;
    searchTerm: string;
}
