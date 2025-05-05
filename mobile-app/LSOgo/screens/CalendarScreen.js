import React from "react";
import {ImageBackground, Text, StyleSheet} from 'react-native';

export default function CalendarScreen(){
    return (
          <ImageBackground
                    source={require('../assets/background.png')} 
                    style={styles.container}
                    >
            <Text style={styles.text}>Kalendarz liturgiczny</Text>
       </ImageBackground>
    );
}
const styles = StyleSheet.create ({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: '#6e4b1f',
        fontWeight: 'bold',
    },
})