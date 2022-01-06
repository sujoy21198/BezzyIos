import React from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/Header";
import { heightToDp, widthToDp } from "../../components/Responsive";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import DataAccess from "../../components/DataAccess";
import { Form, Input, Item, Label, Toast } from "native-base";
import RBSheet from "react-native-raw-bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import ButtonComponent from "../../components/ButtonComponent";
import messaging from "@react-native-firebase/messaging";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
// import {
//     LoginManager,
//     LoginButton,
//     AccessToken,
//     GraphRequest,
//     GraphRequestManager,
//   } from 'react-native-fbsdk';
// import InstagramLogin from 'react-native-instagram-login';
// import CookieManager from '@react-native-community/cookies';

class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isEmailValid: "",
      isEmailFocused: false,
      isPasswordFocused: false,
      fbUserInfo: {},
      instagramToken: null,
      checkTerms: false,
    };
  }

  componentDidMount = async () => {
    await AsyncStorage.setItem("token", null);
  };

  setEmail = (text) => {
    let emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(text.trim())) {
      this.setState({ isEmailValid: false, email: text.trim() });
    } else {
      this.setState({ email: text.trim(), isEmailValid: true });
    }
  };

  logIn = async () => {
    let isOnline = await NetInfo.fetch().then((state) => state.isConnected);
    if (!isOnline) {
      return Toast.show({
        text: "Please be online to login to the app.",
        style: {
          backgroundColor: "#777",
        },
      });
    }
    let emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.state.email === "") {
      return Toast.show({
        text: "Email field can't be empty",
        style: {
          backgroundColor: "#777",
        },
      });
    }
    if (this.state.password === "") {
      return Toast.show({
        text: "Password field can't be empty",
        style: {
          backgroundColor: "#777",
        },
      });
    }
    if (!emailRegex.test(this.state.email.trim())) {
      return Toast.show({
        text: "Please enter a valid email address",
        style: {
          backgroundColor: "#777",
        },
      });
    }
    if (!this.state.checkTerms) {
      return Toast.show({
        text: "Please agree the Terms & Conditions.",
        style: {
          backgroundColor: "#777",
        },
      });
    }

    let deviceId = await messaging().getToken();
    this.RBSheet.open();
    let response = await axios.post(
      DataAccess.BaseUrl + DataAccess.SignIn,
      {
        username: this.state.email.trim(),
        password: this.state.password.trim(),
        device_token: deviceId,
      },
      DataAccess.AuthenticationHeader
    );
    if (response.data.resp === "true") {
      this.RBSheet.close();
      AsyncStorage.setItem(
        "userDetails",
        JSON.stringify(response.data.usedetails)
      );
      AsyncStorage.setItem("userId", String(response.data.id));
      AsyncStorage.setItem("token", String(response.data.remember_token));
      AsyncStorage.setItem("otpStatus", String(response.data.otp_status));
      Toast.show({
        text: response.data.message,
        type: "success",
        duration: 2000,
      });
      // this.props.navigation.navigate("HomeScreen");
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: "HomeScreen" }],
      });
    } else if (response.data.resp === "false") {
      this.RBSheet.close();
      Toast.show({
        text: response.data.message,
        style: { backgroundColor: "#777" },
        duration: 6000,
      });
      this.RBSheet.close();
      if (response.data.otp_status === "false") {
        this.props.navigation.navigate("OtpVerify", {
          userId: response.data.id,
          type: "loginVerify",
        });
      }
    } else {
      Toast.show({
        text: "Some error happened. Please retry.",
        style: {
          backgroundColor: "#777",
        },
        duration: 6000,
      });
      this.RBSheet.close();
    }
  };

  // fbLogin = () => {
  //     const infoRequest = new GraphRequest(
  //         '/me',
  //         {
  //           parameters: {
  //             'fields': {
  //                 'string' : 'id,email,name,first_name,last_name'
  //             }
  //           }
  //         },
  //         async (err, res) => {
  //           console.log("Error ==> ", err, "\nUser Credentials ==> ", res);
  //           this.setState({fbUserInfo: res})
  //           await AsyncStorage.setItem("fbUserInfo", JSON.stringify(res))
  //         }
  //     );
  //     LoginManager.logInWithPermissions(["public_profile", "email"]).then(
  //         function(result) {
  //           if (result.isCancelled) {
  //             console.log("Login cancelled");
  //           }
  //           else {
  //             console.log("Login success with permissions: " + result.grantedPermissions.toString());
  //             new GraphRequestManager().addRequest(infoRequest).start();
  //           }
  //         },
  //         function(error) {
  //           console.log("Login fail with error: " + error);
  //         }
  //     );
  // }

  render = () => (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "#69abff" }}>
      <View style={{ height: this.props.insets.top, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor="#fff" barStyle={"dark-content"} animated />
      </View>
      <Header headerText={"Welcome to Bezzy"} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        style={{
          height: heightToDp("100%"),
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#69abff",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
        }}
      >
        <View
          style={{
            paddingVertical: heightToDp("6%"),
            paddingHorizontal: widthToDp("3%"),
          }}
        >
          <Text
            style={{
              fontFamily: "ProximaNova-Black",
              fontSize: widthToDp("4.5%"),
            }}
          >
            Sign In
          </Text>
          <Text
            style={{
              fontFamily: "ProximaNova-Black",
              fontSize: widthToDp("4.5%"),
            }}
          >
            Let's get started
          </Text>
          <Form
            style={{
              marginLeft: Platform.isPad ? 0 : widthToDp("-3%"),
            }}
          >
            <Item
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: this.state.isEmailFocused
                  ? "#69abff"
                  : "#a9a9a9",
                marginTop: heightToDp("10%"),
                paddingBottom: Platform.isPad ? heightToDp("3.5%") : 0,
                marginLeft: Platform.isPad
                  ? widthToDp("0.3%")
                  : widthToDp("3%"),
              }}
              floatingLabel
            >
              <Label
                style={{
                  color: this.state.isEmailFocused ? "#69abff" : "#808080",
                  fontSize: widthToDp(
                    `${this.state.isEmailFocused ? 3 : 3.4}%`
                  ),
                  fontFamily: "Poppins-Regular",
                  marginTop: Platform.isPad ? 0 : heightToDp("-0.5%"),
                }}
              >
                Email Id
              </Label>
              <Input
                style={{
                  width: widthToDp("99%"),
                  borderWidth: 0,
                  fontSize: widthToDp("3.6%"),
                  color: "#1b1b1b",
                  fontFamily: "Poppins-Regular",
                  paddingLeft:
                    Platform.OS === "android" ? widthToDp("-1%") : undefined,
                }}
                keyboardType="email-address"
                onChangeText={(text) => this.setEmail(text)}
                onFocus={() =>
                  this.setState({
                    isEmailFocused: true,
                    isPasswordFocused: false,
                  })
                }
                returnKeyType="next"
                onSubmitEditing={() => {
                  this.setState({
                    iisEmailFocused: false,
                    isPasswordFocused: true,
                  });
                  this.refPassword._root.focus();
                }}
              />
            </Item>
            {!this.state.isEmailValid && this.state.email !== "" && (
              <Text
                style={[
                  {
                    color: "#ff0000",
                    marginLeft: Platform.isPad ? 0 : widthToDp("3%"),
                    fontFamily: "Poppins-Regular",
                  },
                  Platform.isPad && { fontSize: widthToDp("3%") },
                ]}
              >
                Entered email address is not valid
              </Text>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: this.state.isPasswordFocused
                  ? "#69abff"
                  : "#a9a9a9",
                marginTop: heightToDp("5%"),
                marginLeft: Platform.isPad
                  ? widthToDp("0.3%")
                  : widthToDp("3%"),
                paddingBottom: Platform.isPad ? heightToDp("2%") : 0,
              }}
            >
              <Item
                style={{
                  alignItems: "center",
                  marginTop: Platform.isPad
                    ? heightToDp("-3%")
                    : heightToDp("-2%"),
                  width: widthToDp("87%"),
                  marginLeft: widthToDp("0%"),
                  borderBottomWidth: 0,
                }}
                floatingLabel
              >
                <Label
                  style={{
                    color: this.state.isPasswordFocused ? "#69abff" : "#808080",
                    fontSize: widthToDp(
                      `${this.state.isPasswordFocused ? 3 : 3.4}%`
                    ),
                    marginTop: heightToDp("-0.5%"),
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  Password
                </Label>
                <Input
                  getRef={(ref) => (this.refPassword = ref)}
                  style={{
                    borderWidth: 0,
                    fontSize: widthToDp("3.6%"),
                    color: "#1b1b1b",
                    fontFamily: "Poppins-Regular",
                    paddingLeft:
                      Platform.OS === "android" ? widthToDp("-1%") : undefined,
                  }}
                  secureTextEntry={!this.state.showPassword}
                  onChangeText={(text) =>
                    this.setState({ password: text.trim() })
                  }
                  onFocus={() =>
                    this.setState({
                      isEmailFocused: false,
                      isPasswordFocused: true,
                    })
                  }
                  returnKeyType="done"
                  onSubmitEditing={() =>
                    this.setState({
                      isEmailFocused: false,
                      isPasswordFocused: false,
                    })
                  }
                />
              </Item>
              <Icon
                name={this.state.showPassword ? "eye-off" : "eye"}
                size={Platform.isPad ? 40 : 20}
                color="#808080"
                onPress={() =>
                  this.setState({ showPassword: !this.state.showPassword })
                }
              />
            </View>
          </Form>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 0,
              marginTop: heightToDp("3%"),
            }}
          >
            <Icon
              name={this.state.checkTerms ? "checkbox" : "square-outline"}
              color="#808080"
              size={Platform.isPad ? 40 : 20}
              onPress={() =>
                this.setState({ checkTerms: !this.state.checkTerms })
              }
            />
            <Text
              style={[
                {
                  marginLeft: widthToDp("1%"),
                  fontFamily: "Poppins-Regular",
                },
                Platform.isPad && { fontSize: widthToDp("3%") },
              ]}
            >
              I accept the{" "}
              <Text
                style={{ color: "#69abff" }}
                onPress={() => this.props.navigation.navigate("Terms")}
              >
                Terms & Conditions
              </Text>
            </Text>
          </View>
          <ButtonComponent onPressButton={this.logIn} buttonText={"Login"} />
          {/* <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: 'center',
                        }}
                    >
                        <ButtonComponent
                            socialLogin
                            onPressButton={
                                Object.keys(this.state.fbUserInfo).length === 0 ? this.fbLogin : async () => {
                                    LoginManager.logOut();
                                    this.setState({fbUserInfo: {}})
                                    await AsyncStorage.removeItem("fbUserInfo");
                                }
                            }
                            icon="logo-facebook"
                            buttonText={
                                Object.keys(this.state.fbUserInfo).length === 0 ? 
                                    "Facebook Login" :
                                    "Facebook Log out"
                            }
                        />
                        <View style={{width: "2%"}}/>
                        <>
                            <ButtonComponent
                                socialLogin

                                onPressButton={
                                    this.state.instagramToken === null ?
                                    () => this.instagramLogin.show() : async () => {
                                        CookieManager.clearAll(true)
                                        this.setState({ instagramToken: null })
                                        await AsyncStorage.removeItem("instaUserInfo")
                                    }
                                }
                                icon="logo-instagram"
                                buttonText={
                                    this.state.instagramToken === null ? 
                                        "Instagram Login" :
                                        "Instagram Log out"
                                }
                            />
                            <InstagramLogin
                                ref={ref => (this.instagramLogin = ref)}
                                appId='264206822197396'
                                appSecret='b785a00a32e043ae59a51f7b5ebb4a3c'
                                redirectUrl='https://www.google.com/'
                                scopes={['user_profile', 'user_media']}
                                onLoginSuccess={async (data) => {
                                    console.warn("token, user_id ==> ", data);
                                    this.setState({ instagramToken: data.access_token });
                                    await axios.get(
                                        `https://graph.instagram.com/v11.0/${data.user_id}?fields=id,username&access_token=${data.access_token}`
                                    )
                                    .then(async res => await AsyncStorage.setItem("instaUserInfo", JSON.stringify(res.data)))
                                    .catch(err => console.log("error ==> ", err));
                                }}
                                onLoginFailure={(data) => console.log(data)}
                            />
                        </>
                    </View> */}

          <RBSheet
            ref={(ref) => {
              this.RBSheet = ref;
            }}
            height={heightToDp("6%")}
            closeOnPressMask={false}
            closeOnPressBack={false}
            // openDuration={250}
            customStyles={{
              container: {
                width: widthToDp("15%"),
                position: "absolute",
                top: heightToDp("45%"),
                left: widthToDp("40%"),
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
                borderRadius: 10,
              },
            }}
          >
            <ActivityIndicator size="large" color="#69abff" />
          </RBSheet>
          <TouchableOpacity
            style={{
              marginTop: heightToDp("2%"),
            }}
            activeOpacity={0.7}
            onPress={() => this.props.navigation.navigate("ForgotPassword")}
          >
            <Text
              style={[
                {
                  color: "#69abff",
                  fontFamily: "Poppins-Regular",
                },
                Platform.isPad && { fontSize: widthToDp("3%") },
              ]}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginTop: heightToDp("1%"),
            }}
            activeOpacity={0.7}
            onPress={() => this.props.navigation.navigate("SignUpScreen")}
          >
            <Text
              style={[
                {
                  color: "#69abff",
                  fontFamily: "Poppins-Regular",
                },
                Platform.isPad && { fontSize: widthToDp("3%") },
              ]}
            >
              New User? Register
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaProvider>
  );
}

export default (props) => {
  const insets = useSafeAreaInsets();
  return <SignInScreen {...props} insets={insets} />;
};
