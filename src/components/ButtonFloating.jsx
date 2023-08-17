import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function ButtonFloating(){
    const navigation = useNavigation()
        

    return (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Add')}>
            <Text style={styles.plus}>+</Text>        
        </TouchableOpacity>
    ) 
}


const styles = StyleSheet.create({
	button: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#000',
        position: 'absolute',
        bottom: 50,
        right: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: .5,
        shadowRadius: 5,
        elevation: 5
    },
    plus: {
        fontSize: 44,
        color: '#fff',
        position: 'absolute',
        top: -6,
        left: 9,
    }
});