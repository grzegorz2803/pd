import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, Image, Platform } from "react-native";
import {View, ScrollView, ImageBackground, Text, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

const {width, height} = Dimensions.get('window');
export default function CalendarScreen({route}){
    const loggedIn = route?.params?.loggedIn;

    const today = {
        saint: 'Święto Świętego Marka ewangelisty',
        color: 'Czerwony',
    };

    const weekDays = Array.from({length: 6}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i +1);
        return{
            day: date.toLocaleDateString('pl-PL', {weekday: 'long'}),
            date: `${date.toLocaleDateString('pl-PL', {month:'long'})} ${date.getDate()}}`,
        };
    });
   
    return (
          <ImageBackground
                    source={require('../assets/background.png')} 
                    style={styles.container}
                    resizeMode="cover"
                    >
                        <SafeAreaView style={{marginTop: 0}}>
            <View style={styles.header}>
                <View style={styles.menu}>
                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuText}>≡</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.center}>
                    <Image source={require('../assets/pngwing.com.png')} style={styles.ornament} />
                
                </View>
                <View style={styles.side}>
                {!loggedIn ? (
                    <TouchableOpacity style={styles.loginButton}>
                        <Text style={styles.loginText}>LOG IN</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={{width: 60}} />
                )}
                </View>
            </View>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>Kalendarz</Text>
                <Text style={styles.title}>Liturgiczny</Text>
            </View>
            </SafeAreaView>
       </ImageBackground>
    );
}
const styles = StyleSheet.create ({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: height * 0.1,
        paddingHorizontal: width * 0.07,
        },
        menu: {
            width: width * 0.2,
            alignItems: 'left',
            justifyContent: 'center',
         
        },
        side: {
            width: width * 0.2,
            alignItems: 'center',
            justifyContent: 'center',
         
        },
        center: {
            flex: 1,
            alignItems:'center',
            justifyContent: 'center',
      
        },
        ornament: {
            maxWidth: '100%',
            height: height * 0.06,
            resizeMode: 'contain',
   
        }, 
        titleWrapper: {
            marginTop: height * 0.001,
            alignItems: 'center',
        },
        title: {
           fontFamily: 'Cinzel-Regular',
           fontSize: width * 0.09,
           color: '#1a1204',
           textAlign: 'center',
           letterSpacing: 1,
           lineHeight: width *0.1,
        },
        menuButton: {
            padding: RFValue(5),
        },
        menuText: {
            fontSize: width*0.1,
            color: '#1a1204',
        },
        loginButton: {
            borderWidth: 1,
            borderColor: '#1a1204',
            paddingHorizontal: width * 0.03,
            paddingVertical: height * 0.006,
            borderRadius: 5,
            minWidth: width * 0.2,
            alignItems: 'center',
            justifyContent: 'center',
        },
        loginText:{
            color: '#1a1204',
            fontSize: width*0.04,
        }

 
})