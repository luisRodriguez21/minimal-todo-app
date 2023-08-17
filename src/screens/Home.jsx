import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity, Platform } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Constants } from 'expo-constants';
import moment from 'moment';
import * as Device from 'expo-device';

import { hideComplitedReducer, setTodosReducer } from '../redux/todosSlice';
import ListToDo from '../components/ListToDo'
import todosData from '../data/todos'
import ButtonFloating from '../components/ButtonFloating'


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    })
})


export default function Home() {
    const dispatch = useDispatch()
    const todos = useSelector(state => state.todos.todos);
    const [isHidden, setIsHidden] = useState(false)
    const [expoPushToken, setExpoPushToken] = useState('');

    useEffect(() => {
        registerForPushNotificationsAsync().then(token=> setExpoPushToken(token))

        const getTodos = async () => {
            try {
                const todos = await AsyncStorage.getItem('Todos')
                if (todos !== null) {
                    const todosData = JSON.parse(todos)
                    const todosFiltered = todosData.filter(todo => { // desechaos los que son de un dia anterior, solo se quedan de hoy
                        return moment(new Date(todo.hour)).isSameOrAfter(moment(), 'day')
                    })

                    console.log("todosFiltered: ",todosFiltered);

                    if(todosFiltered !== null) {
                        await AsyncStorage.setItem('Todos', JSON.stringify(todosFiltered))
                        console.log("we deleted some passed todos");

                        dispatch(setTodosReducer(todosFiltered))
                    }
                }
            } catch (error) {
                console.log("error: ", error);
            }
        }
        getTodos()
    }, []);


    const handleHideCompleted = async () => {
        if (isHidden) {
            setIsHidden(false);
            const todos = await AsyncStorage.getItem('Todos')
            if (todos !== null) {
                dispatch(setTodosReducer(JSON.parse(todos)))
            }
            return
        }

        setIsHidden(true)
        dispatch(hideComplitedReducer());
    }


    const registerForPushNotificationsAsync = async () => {
        console.log("registerForPushNotificationsAsync");
        let token;
        
        if (Device.isDevice) { // saber si estamos en cel o simulador
            const { status: existingStatus } = await Notifications.getPermissionsAsync(); // permiso de usuario
            let finalStatus = existingStatus; // para saber si ya existe autorizacion del permiso de notificaciones
           
            if (existingStatus !== 'granted') { // acepto permiso
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            
            if (finalStatus !== 'granted') { // no acepto
                alert('Failed to get push token for push notification!');
                return;
            }
            
           

            token = (await Notifications.getExpoPushTokenAsync()).data;

            
            // https://expo.dev/accounts/[ACCOUNT_NAME]/projects.
            /* token = (await Notifications.getExpoPushTokenAsync({
                projectId: 'f1fd5227-d4fe-4edb-b542-7e053a7afb89',
            })).data; */

                
            
            console.log("token: ", token);

        } else {
            return;
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
        
        return token;
    }


    const todayTodos = todos.filter(todo => moment(todo.hour).isSame(moment(), 'day'));
    const tomorrowTodos = todos.filter(todo => moment(todo.hour).isAfter(moment(), 'day')); 

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/cute-photos-of-cats-cleaning-1593202999.jpg' }}
                style={styles.pic}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.title}>Today</Text>

                <TouchableOpacity onPress={handleHideCompleted}>
                    <Text style={{ color: '#3478f6', fontSize: 18 }} >
                        {isHidden ? 'Show completed' : 'Hide comepleted'}
                    </Text>
                </TouchableOpacity>
            </View>


            <ListToDo
                todosData={todayTodos.filter(todo => todo.isToday)}
            />

            <Text style={styles.title}>Tomorrow</Text>
            <ListToDo
                todosData={tomorrowTodos.filter(todo => !todo.isToday)}
            />

            <ButtonFloating />

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 55,
        paddingHorizontal: 15
    },
    pic: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignSelf: 'flex-end',
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 35,
        marginTop: 10,
    },
});
