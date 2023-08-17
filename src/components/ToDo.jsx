import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import moment from 'moment';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteTodoReducer } from '../redux/todosSlice';
import Checkbox from './Checkbox';


export default function ToDo({ id, text, isCompleted, isToday, hour }) {
    const dispatch = useDispatch()
    const [localHour, setLocalHour] = useState(new Date(hour))
    const todos = useSelector(state => state.todos.todos);
    const [thisTodoIsToday, setThisTodoIsToday] = hour ? useState(moment(hour).isSame(moment(), 'day')) : useState(false); // saber si es de hoy


    const handleDeleteTodo = async () => {
        dispatch(deleteTodoReducer(id));
        try {
            await AsyncStorage.setItem('Todos', JSON.stringify(
                todos.filter(todo => todo.id !== id)
            ));
            console.log('Todo deleted correctly');
        } catch (e) {
            console.log(e);
        }
    };




    return (
        <View style={styles.container}>



            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                    id={id}
                    text={text}
                    isCompleted={isCompleted}
                    isToday={thisTodoIsToday}
                    hour={hour}
                />

                <Text
                    style={
                        isCompleted ? [styles.text, { textDecorationLine: 'line-through', color: '#737373' }]
                            : styles.text
                    }
                >
                    {text}
                </Text>
                <Text
                    style={
                        isCompleted ? [styles.time, { textDecorationLine: 'line-through', color: '#737373' }]
                            : styles.time
                    }
                >
                    {moment(localHour).format('LT')}
                </Text>
            </View>


            <TouchableOpacity onPress={handleDeleteTodo}>
                <MaterialIcons name="delete-outline" size={24} color="#757575a3" style={styles.delete} />
            </TouchableOpacity>


        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 17,
        fontWeight: '500',
        color: '#737373'
    },
    time: {
        fontSize: 15,
        fontWeight: '500',
        color: '#a3a3a3'
    },
    delete: {

    }
});