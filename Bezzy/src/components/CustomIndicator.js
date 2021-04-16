import React from 'react';
import {StyleSheet,ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import BaseColor from './BaseTheme';

export default function CustomIndicator(props){
    const{
        IsLoading,
        ...rest
    }= props;
    return(
        <ActivityIndicator style={styles.activityIndicator} size="large" color={BaseColor.CommonTextColor}  animating={IsLoading} {...rest}/>
    );
}

CustomIndicator.propTypes = {     
    IsLoading: PropTypes.bool.isRequired    
};

const styles = StyleSheet.create({     
    activityIndicator: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center', 
       fontSize:25      
    }
}); 