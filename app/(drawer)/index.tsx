import ChampionList from "@/components/ChampionList";
import DataProvider, { DataContext } from "@/components/DataProvider";
import { Champion } from "@/types";
import { useContext, useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, FlatList } from "react-native";

export default function Index() {

  return (
    <View style={{padding: 20, backgroundColor: "#091428", alignItems: "center"}}>
      <ChampionList/>
    </View>
  );
};
