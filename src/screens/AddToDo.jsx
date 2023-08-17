import React, {useState} from 'react'
import { View, TouchableOpacity, Text, StyleSheet, TextInput, Switch, TouchableWithoutFeedback, Keyboard} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import * as Notifications from 'expo-notifications';
import { addTodoReducer } from '../redux/todosSlice';


export default function AddToDo() {
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const [name, setName] = React.useState('');
    const [date, setDate] = React.useState(new Date());
    const [isToday, setIsToday] = React.useState(false);
    const listTodos = useSelector(state => state.todos.todos);
    const [withAlert, setWithAlert] = useState(false);
    

    const addTodo = async () => {
        console.log("addTodo");
        const newTodo = {
            id: Math.floor(Math.random() * 1000000),
            text: name,
            hour: isToday ? date.toISOString() : new Date(date).getTime() + 24 * 60 * 60 * 1000, // si no es para hoy pone la hora seleccionada mas 24 hrs 
            isToday: isToday,
            isComplited: false 
        }
        // console.log("newTodo: " ,newTodo);

        try {
            await AsyncStorage.setItem('Todos', JSON.stringify([...listTodos, newTodo])); // guardamos localmente el arreglo actual mas el nuevo
            dispatch(addTodoReducer(newTodo));
            console.log('Todo saved correctly');           
            
            if(withAlert){
                await scheduleTodoNotifications(newTodo);
            }
            
           navigation.goBack();
        } catch (error) {
            console.log("error: " ,error);
        }
    }


    const scheduleTodoNotifications = async (todo) => {
        console.log("scheduleTodoNotifications: ", todo);
        const trigger = new Date(todo.hour);
        
        // set trigger time to todo.hour if todo.isToday === true else set trigger time to todo.hour + 24 hours
        // const trigger = todo.isToday ? todo.hour : new Date(todo.hour).getTime() + 24 * 60 * 60 * 1000;
        
        try {
            
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "It's time!!!",
                    body: todo.text
                },
                trigger
            })

            console.log('Notification scheduled');

        } catch (error) {
            console.log("error: " ,error);
            alert('The notification failed to schedule, make sure the hour is valid');
        }

    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>AddToDo</Text>

            <View style={styles.inputContainer} >
                <Text style={styles.inputTitle}> Name </Text>
                <TextInput 
                    style={styles.textInput}
                    placeholder="Task"
                    placeHolderTextColor="#00000030"
                    onChangeText={(text) => setName(text)}
                />
            </View>

            <View style={styles.inputContainer} >
                <Text style={styles.inputTitle}> Hour </Text>
                <DateTimePicker
                    value={date}
                    mode={'time'}
                    is24Hour={true}
                    onChange={(event, selectedDate) => setDate(selectedDate)}
                    style={{width: '80%'}}
                />
            </View>

            <View style={styles.inputContainer} >
                <View>
                    <Text style={styles.inputTitle}> Today </Text>
                    <Text style={{color: '#00000040', fontSize: 15, maxWidth: '85%', paddingBottom: 10 }}>
                        If you disable today, the task will be considered as tomorrow
                    </Text>
                </View>
                <Switch
                    value={isToday}
                    onValueChange={(value) => { setIsToday(value) }}
                />
            </View>   

            <View style={styles.inputContainer} >
                <View>
                    <Text style={styles.inputTitle}>Alert</Text>
                    <Text style={{color: '#00000040', fontSize: 15, maxWidth: '85%'}}>You will receive an alert at the time you set for this reminder</Text>
                </View>
                <Switch
                    value={withAlert}
                    onValueChange={(value) => { setWithAlert(value) }}
                />
            </View>        

            <TouchableOpacity onPress={addTodo} style={styles.button}>
                <Text style={{color: 'white'}}>Done</Text>
            </TouchableOpacity>

            
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        paddingHorizontal: 30
    },  
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 35,
        marginTop: 10,
    },
    inputTitle: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 24
    },
    textInput: {
        borderBottomColor: '#00000030',
        borderBottomWidth: 1,
        width: '80%',
        fontSize: 17
    },
    inputContainer: {
        justifyContent: 'space-between', 
        flexDirection: 'row', 
        paddingBottom: 30,
    },
    button: {
        marginTop: 30,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        height: 46,
        borderRadius: 11,
    }
});
