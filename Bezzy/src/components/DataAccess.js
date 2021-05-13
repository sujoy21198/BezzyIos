const DataAccess = {
    BaseUrl : 'http://161.35.122.165/bezzy.websteptech.co.uk/api/',

    //login api's
    SignIn: 'login',
    Registration: 'registration',
    ForgotPass:'forgotpassotpsend',
    SendOtp: 'verifyotp',
    ResetPassword: 'setforgotpassword',
    resendOtp: "resendotp",
    terms: 'terms-condition', 

    //user listing api's
    userList: "RegisterUserList",
    Search:'searchregisteruser', 

    //follow api's
    followUser: "followingreqsend",
    followerList: "getfollowerslist",
    friendBlockList: "friendblocklist",
    unfollow: "unfollowuser",
    followBack: 'followingback',
    removeUser: 'removeuser',
    blockUser: 'blockuser',

    //profile api's
    getProfileDetails: 'geteditprofiledata',
    editProfile: 'UpdateProfileData',
    uploadProfileImage: 'UpdateProfilePicture',
    UpdateProfilePicture:'UpdateProfilePicture',
    friendblockdetails : 'friendblockdetails/',
    updateProfile: 'UpdateProfileData',
    changePassword: 'changepassword',

    //post api's
    deletePost: 'deletepostimagevideo',
    likePost: 'postlikedislike',
    postLikedUsers: 'postlikeuserslist',
    postCommentedUsers: 'comment-list',
    postComment: "comment-post",
    likeDislikeComment: 'commentlikedislike',
    updatePostCaption: 'updatepostcaption',
    getPostDetails: 'friendsingleblockdetails',
    commentReplyList : 'comment-reply-list',

    //notification api's
    fetchNotifications: 'Notificationlist',
    clearNotification: 'ClearNotificationlist',


    //chat api
    //chat list for inbox
    chatListInbox:'chat-list/',
    //sendMessage
    addChatData:'add-chat-data',
    //get chat list
    chatList:'chat-notification-list'
}

export default DataAccess