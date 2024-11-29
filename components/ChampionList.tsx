import { FlatList, StyleSheet, View, Image, Text, TextInput, Pressable } from "react-native";
import React, { useContext, useState } from "react";
import { Champion, SimplifiedChampion } from "@/types";
import { DataContext } from "./DataProvider";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";

interface ChampionViewProps{
    champion: SimplifiedChampion;
}
  
function ChampionView({champion} : ChampionViewProps){

    const router = useRouter();
    const char = champion;
    return(
        <Pressable onPress={() => {router.push(`/${champion.id}`)}}>
            <View style={styles.parentContainer}>
                <View style={styles.championContainer}>
                    <Image style={styles.image} source={{uri: champion.image.full}}></Image>
                    <View style={styles.containerText}>
                        <Text style={{fontSize: 25, fontWeight: "bold", color: "#091428"}}>{champion.name}</Text>
                        <Text>{champion.title}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}

export default function ChampionList() {
    const { champions, loading, loadData } = useContext(DataContext);
    const [filter, setFilter] = useState("");
    
    const filteredChampions = champions.filter(champion => 
        champion.name.toLowerCase().startsWith(filter.toLowerCase())
    );

    return(
        <View style={{alignItems:"center"}}>
            <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                <Image style={{width: 100, height: 100, objectFit: "contain"}} source={require("../assets/images/pngegg.png")} />
                <Text style={{color: "#C89B3C", fontSize: 20, textTransform: "uppercase"}}>Choose ur champion</Text>
            </View>
            <View style={styles.championList}>
                <TextInput
                    placeholder="Search"
                    onChangeText={(text) => setFilter(text)}
                    value={filter}
                    style={{
                        backgroundColor: "#FAF9F6",
                        borderColor: "#444",
                        borderRadius: 8
                    }}
                />
                <FlatList
                    style={{marginTop: 20}}
                    data={filteredChampions}
                    renderItem={({item}) => <ChampionView champion={item}/>}
                    keyExtractor={(champion) => champion.id.toString()}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    refreshing={loading}
                    onRefresh={() => loadData()}
                />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    championList: {
        width: 400,
        borderColor: "#C89B3C",
        borderWidth: 2,
        borderRadius: 16,
        padding: 10
    },
    parentContainer: {
        backgroundColor: "#FAF9F6",
        borderRadius: 8,
        padding: 8,
        boxShadow: "black"
    },
    championContainer: {
        flexDirection: "row"
    },
    image: {
        width: 100,
        height: 100
    },
    containerText: {
        justifyContent: "center",
        marginLeft: 10
    }
});