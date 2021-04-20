const DataAccess = {
    BaseUrl : 'http://161.35.122.165/bezzy.websteptech.co.uk/api/',
    SignIn: 'login',
    Registration: 'registration',
    ForgotPass:'forgotpassotpsend',
    Search:'searchregisteruser', 
    SendOtp: 'verifyotp',
    ResetPassword: 'setforgotpassword',
    resendOtp: "resendotp",
    friendBlockList: "friendblocklist",
    userList: "RegisterUserList",
    followUser: "followingreqsend",
    friendList: "getuserfollowinglist",
    followingList: "getuserfollowinglist",
    unfollow: "unfollowuser",
    getProfileDetails: 'geteditprofiledata',
    editProfile: 'UpdateProfileData',
    uploadProfileImage: 'UpdateProfilePicture'
}

export default DataAccess