import AsyncStorage from "@react-native-async-storage/async-storage";

export const UpdateAsyncStorage = async (asyncKey, profileId, newData) => {
    let userId = await AsyncStorage.getItem("userId");
    let tempArray = await AsyncStorage.getItem(asyncKey);
    if(tempArray === null) tempArray = [];
    if(Object.keys(tempArray).length === 0) {
      tempArray = [{
        id: profileId,
        posts: newData
      }]
    } else {
      tempArray = JSON.parse(tempArray);
      if(tempArray.findIndex(item => item.id === profileId) === -1) {
        tempArray = tempArray.concat({
          id: profileId,
          posts: newData
        });
      } else {
        tempArray.splice(tempArray.findIndex(item => item.id === profileId), 1);
        tempArray = tempArray.concat({
          id: profileId,
          posts: newData
        });
      } 
    }
    await AsyncStorage.setItem(asyncKey, JSON.stringify(tempArray));
}

export const GetAsyncValue = async (key, id) => {
    let asyncKeyContent = await AsyncStorage.getItem(key);
    if(asyncKeyContent !== null) {
        JSON.parse(asyncKeyContent).map(item => {
            if(Number(item.id) === Number(id)) {
                return item.posts;
            }
        })
    } else {
        return [];
    }
}