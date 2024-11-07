// MainNavigator, main component
const Stack = createStackNavigator();

export default function Main() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen name="Home" component={IndexPage} />
                    <Stack.Screen name="About" component={AboutPage} />
                    <Stack.Screen name="Team" component={TeamReports} />
                    <Stack.Screen name="Documentation" component={Documentation} />
                    <Stack.Screen name="Calendar" component={Calendar} />
                    <Stack.Screen name="Gallery" component={Gallery} />
                    <Stack.Screen name="Converter" component={Converter} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}

// TODO:
// IN:
// Login page
// User Page
// Auth Page
// Payment page
// Credits page
// OUT:
// TeamReports
