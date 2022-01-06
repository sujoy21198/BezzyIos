import axios from "axios";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import DataAccess from "../../components/DataAccess";
import Header from "../../components/Header";
import { heightToDp, widthToDp } from "../../components/Responsive";

class PostLikedUsersList extends React.Component {
  state = {
    likedUsers: [],
    isLoading: false,
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    await axios
      .get(
        DataAccess.BaseUrl +
          DataAccess.postLikedUsers +
          "/" +
          this.props.route.params.postId,
        DataAccess.AuthenticationHeader
      )
      .then((res) => {
        if (res.data.status === "success") {
          this.setState({ likedUsers: res.data.userlist });
        } else {
          this.setState({ likedUsers: [] });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ likedUsers: [] });
      });
    this.setState({ isLoading: false });
  }

  render = () => (
    <SafeAreaProvider style={{ flex: 1 }}>
      <View style={{ height: this.props.insets.top, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor="#fff" barStyle={"dark-content"} animated />
      </View>
      <Header
        isHomeStackInnerPage
        isBackButton
        block={true}
        headerText={"Liked Users"}
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
          data={this.state.likedUsers}
          ListFooterComponent={<View style={{ height: heightToDp("1%") }} />}
          ItemSeparatorComponent={() => (
            <View style={{ height: heightToDp("1%") }} />
          )}
          renderItem={({ item, index }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: widthToDp("3%"),
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: item.profilePicture }}
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
            </View>
          )}
        />
      )}
    </SafeAreaProvider>
  );
}

export default (props) => {
  const insets = useSafeAreaInsets();
  return <PostLikedUsersList {...props} insets={insets} />;
};
