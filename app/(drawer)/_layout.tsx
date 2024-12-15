import { Drawer } from 'expo-router/drawer';

export default function Layout() {
    return(
        <Drawer
            screenOptions={{
                headerStyle: {backgroundColor: "#091428"},
                headerTintColor: '#C89B3C',
                title: "Home"
            }}
        >
            <Drawer.Screen name="index" options={{title: "Home"}} />
            <Drawer.Screen name="addChampion" options={{title: "Add Champion"}} />
            <Drawer.Screen name="myChampions" options={{title: "myChampions"}} />
        </Drawer>
    )
}