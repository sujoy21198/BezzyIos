const DataAccess = {
  BaseUrl: "https://bezzy-app.com/admin/api/",
  AuthenticationHeader: {
    headers: {
      APPKEY: "BZZY#$%*OM||" + Math.floor(Math.random() * 100000000),
    },
  },

  //login api's
  SignIn: "login",
  Registration: "registration",
  ForgotPass: "forgotpassotpsend",
  SendOtp: "verifyotp",
  ResetPassword: "setforgotpassword",
  resendOtp: "resendotp",
  terms: "terms-condition",
  setUserActiveStatus: "appbasic_userative_status",

  //user listing api's
  userList: "RegisterUserList",
  Search: "searchregisteruser",

  //follow api's
  followUser: "followingreqsend",
  followerList: "getfollowerslist",
  friendBlockList: "friendblocklist",
  userFollowingList: "getuserfollowinglist",
  unfollow: "unfollowuser",
  followBack: "followingback",
  removeUser: "removeuser",
  blockUser: "blockuser",
  postTaggedUserContent: "PostOnlyContentForImage",
  videoPostTaggedUserContent: "PostOnlyContentForVideo",
  requestFollow: "addFollowRequest",
  followRequests: "listFollowers",
  approveFollowRequest: "followRequestUpdate",

  //profile api's
  getProfileDetails: "geteditprofiledataupdated",
  editProfile: "UpdateProfileData",
  uploadProfileImage: "UpdateProfilePicture",
  UpdateProfilePicture: "UpdateProfilePicture",
  friendblockdetails: "friendblockdetails/",
  updateProfile: "UpdateProfileData",
  changePassword: "changepassword",
  blockList: "userblocklist",
  unblockUser: "unblockuser",
  setAccountPrivate: "updatePrivateAcc",

  //post api's
  deletePost: "deletepostimagevideo",
  deleteVideo: "deletepostimagevideo", //delete video
  likePost: "postlikedislike",
  postLikedUsers: "postlikeuserslist",
  postCommentedUsers: "comment-list",
  postComment: "comment-post",
  likeDislikeComment: "commentlikedislike",
  updatePostCaption: "updatepostcaption",
  getPostDetails: "friendsingleblockdetails",
  commentReplyList: "comment-reply-list",
  reportPost: "report-to-block-post",
  deleteSingleComment: "deletecommentsmsg", //delete single comment/reply
  deleteMultipleComment: "deletecommentsmsgmultiple", //delete multiple comment/reply

  //notification api's
  fetchNotifications: "Notificationlist",
  clearNotification: "ClearNotificationlist",
  readNotifications: "ReadNotificationData",

  //chat api's
  chatListInbox: "chat-list/", //chat list for inbox
  addChatData: "add-chat-data", //sendMessage
  chatList: "chat-notification-list", //get chat list
  addChatDataImage: "add-chat-data-image", //post image to chat
  readUnreadChats: "click-on-chat-notification", //read unread chats
  deleteSingleMessage: "deletechatmsg", //delete single chat message
  deleteMultipleMessage: "deletechatmsgmultiple", //delete multiple chat message
  instantMessage: "get-last-unread_msg", //incoming message
  clearChat: "deletechatmsgclearchat", //clear chat

  //share api's
  getSharePostData: "getshare-postdata-updated", //share post view
  sharePostInternally: "share_post_internally", //share post internally
  GetVideoDetails: "postimagevideodetails", //get video details
};

export default DataAccess;
