import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import AddToDo from './src/screens/AddToDo';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';


const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<Provider store={store} >
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen 
						name="Home" 
						component={Home} 
						options={{ headerShown: false}}
					/>

					<Stack.Screen 
						name="Add" 
						component={AddToDo} 
						options={{ presentation: "modal"}}
					/>

				</Stack.Navigator>
			</NavigationContainer>
		</Provider>		
	);
}