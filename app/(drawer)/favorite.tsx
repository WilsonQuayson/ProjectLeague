import ChampionList from "@/components/ChampionList";
import DataProvider, { DataContext } from "@/components/DataProvider";
import { Champion, SimplifiedChampion } from "@/types";
import { useContext, useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, FlatList } from "react-native";

export default function Index() {
    const { getData } = useContext(DataContext);


    const champion = getData();
  return (
    <View style={{padding: 20, backgroundColor: "#091428", alignItems: "center", flex: 1}}>
        
    </View>
  );
};
