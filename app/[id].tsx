import { DataContext } from "@/components/DataProvider";
import { Champion, SimplifiedChampion } from "@/types";
import { Stack, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

export default function ChampionScreen() {
    const { id } = useLocalSearchParams<{ id: string}>();
    const { champions } = useContext(DataContext);

    const champion: SimplifiedChampion = champions.find((champ) => champ.id.toString() === id.toString())!;
    
    return(
        <View>
            <Stack.Screen options={{
                title: champion.name,
                headerStyle: {backgroundColor: "#091428"},
                headerTintColor: '#C89B3C'
            }}/>
            <ScrollView>
                <View style={styles.main}>
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.championTitle}>{champion.name}</Text>
                            <Text style={styles.championSubTitle}>{champion.title}</Text>
                        </View>
                        <Image style={styles.championImg} source={{uri: champion.image.loading}}/>
                        <Text style={{
                            textAlign: "center",
                            color: "#091428",
                            backgroundColor: "#C89B3C",
                            borderRadius: 8,
                            padding: 5,
                            marginTop: 20
                        }}>{champion.tags}</Text>
                    </View>
                    <Text style={{
                        textAlign: "justify",
                        padding: 20,
                        color: "#C89B3C"
                    }}>{champion.blurb}</Text>
                    <View>
                        <Text>{}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    main:{
        backgroundColor :"#091428",
        padding: 20,
    },
    card:{
        borderColor: "#C89B3C",
        borderWidth: 2,
        borderRadius: 16,
        padding: 30
    },
    championImg:{
        height: 500,
        width: "auto",
        objectFit: "contain",
        marginTop: 20
    },
    championTitle:{
        color:"#C89B3C",
        textAlign: "center",
        fontSize: 50
    },
    championSubTitle:{
        color:"#C89B3C",
        textAlign: "center",
    },
})