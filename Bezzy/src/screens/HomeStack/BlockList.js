import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Toast } from "native-base";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import DataAccess from "../../components/DataAccess";
import Header from "../../components/Header";
import PushNotificationController from "../../components/PushNotificationController";
import { heightToDp, widthToDp } from "../../components/Responsive";

class BlockList extends React.Component {
  state = {
    blockList: [],
    isLoading: false,
  };

  componentDidMount = async () => {
    this.setState({ isLoading: true });
    let userId = await AsyncStorage.getItem("userId");
    let response = await axios.post(
      DataAccess.BaseUrl + DataAccess.blockList,
      {
        loginuserID: userId,
      },
      DataAccess.AuthenticationHeader
    );
    if (response.data.resp === "success") {
      if (response.data.block_user_list !== "No user found!") {
        this.setState({ blockList: response.data.block_user_list });
      } else {
        this.setState({ blockList: [] });
      }
    } else {
      this.setState({ blockList: [] });
    }
    this.setState({ isLoading: false });
  };

  unblockUser = async (item, index) => {
    this.RBSheet.open();
    let userId = await AsyncStorage.getItem("userId");
    let response = await axios.post(
      DataAccess.BaseUrl + DataAccess.unblockUser,
      {
        loginUserID: userId,
        unblockuserID: item.block_user_id,
      },
      DataAccess.AuthenticationHeader
    );
    if (response.data.status === "success") {
      let blockList = this.state.blockList;
      blockList.splice(index, 1);
      this.setState({ blockList });
      Toast.show({
        type: "success",
        text: response.data.message,
        duration: 3000,
      });
    } else {
      Toast.show({
        type: "success",
        text: response.data.message,
        duration: 3000,
      });
      // this.setState({blockList: []});
    }
    this.RBSheet.close();
  };

  render = () => (
    <SafeAreaProvider style={{ flex: 1 }}>
      <View style={{ height: this.props.insets.top, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor="#fff" barStyle={"dark-content"} animated />
      </View>
      <Header
        isHomeStackInnerPage
        isBackButton
        block={true}
        headerText={"Block List"}
        navigation={this.props.navigation}
      />

      {this.state.isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#007dfe" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{
            padding: widthToDp("2%"),
          }}
          initialNumToRender={1000}
          data={this.state.blockList}
          ListFooterComponent={<View style={{ height: heightToDp("1%") }} />}
          ItemSeparatorComponent={() => (
            <View style={{ height: heightToDp("1%") }} />
          )}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: widthToDp("3%"),
                borderRadius: 10,
              }}
              activeOpacity={0.7}
              // onPress={() => this.props.navigation.navigate("ViewProfileScreen", {name: item.name, id: item.block_user_id, loginStack: true})}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{
                    height: Platform.isPad ? 80 : 40,
                    width: Platform.isPad ? 80 : 40,
                    borderRadius: Platform.isPad ? 80 / 2 : 40 / 2,
                    borderWidth: 1,
                    borderColor: "#69abff",
                  }}
                />
                <Text
                  style={[
                    {
                      marginLeft: widthToDp("2%"),
                      fontFamily: "Poppins-Regular",
                    },
                    Platform.isPad && { fontSize: widthToDp("3%") },
                  ]}
                >
                  {item.name}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => this.unblockUser(item, index)}
              >
                <Image
                  source={require("../../../assets/unblock.png")}
                  resizeMode="contain"
                  style={{ height: heightToDp("5%"), width: widthToDp("5%") }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
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
      <PushNotificationController navigation={this.props.navigation} />
    </SafeAreaProvider>
  );
}

export default (props) => {
  const insets = useSafeAreaInsets();
  return <BlockList {...props} insets={insets} />;
};
