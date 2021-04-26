const DataAccess = {
    BaseUrl : 'http://161.35.122.165/bezzy.websteptech.co.uk/api/',

    //login api's
    SignIn: 'login',
    Registration: 'registration',
    ForgotPass:'forgotpassotpsend',
    SendOtp: 'verifyotp',
    ResetPassword: 'setforgotpassword',
    resendOtp: "resendotp",

    //user listing api's
    userList: "RegisterUserList",
    Search:'searchregisteruser', 

    //follow api's
    followUser: "followingreqsend",
    followerList: "getfollowerslist",
    friendBlockList: "friendblocklist",
    unfollow: "unfollowuser",

    //profile api's
    getProfileDetails: 'geteditprofiledata',
    editProfile: 'UpdateProfileData',
    uploadProfileImage: 'UpdateProfilePicture',
    friendblockdetails : 'friendblockdetails/',
    updateProfile: 'UpdateProfileData',
    changePassword: 'changepassword',

    //post api's
    deletePost: 'deletepostimagevideo',
    UpdateProfilePicture:'UpdateProfilePicture',
    likePost: 'postlikedislike',
    postLikedUsers: 'postlikeuserslist',
    postCommentedUsers: 'comment-list',
    postComment: "comment-post",
    likeDislikeComment: 'commentlikedislike',
    updatePostCaption: 'updatepostcaption',

    //notification api's
    fetchNotifications: 'Notificationlist',
    clearNotification: 'ClearNotificationlist'
}

export default DataAccess