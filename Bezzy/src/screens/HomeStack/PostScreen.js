import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Header from '../../components/Header';

export default class PostScreen extends React.Component {
    state = {

    }

    render = () => (
        <KeyboardAwareScrollView
            style={{
                flex: 1,
                backgroundColor: '#fff'
            }}
            keyboardShouldPersistTaps="handled"
        >            
            <Header isSearchFocused headerText="Search for friends"/>
        </KeyboardAwareScrollView>
    )
}