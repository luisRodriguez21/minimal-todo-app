import React from 'react'
import { FlatList, View, Text } from 'react-native'
import ToDo from './ToDo'


export default function ListToDo ({ todosData }) {
    // console.log("todosData: ",todosData);

    return (
        <FlatList
            data={todosData}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => 
                <ToDo {...item} />
            }
        /> 
    )
}