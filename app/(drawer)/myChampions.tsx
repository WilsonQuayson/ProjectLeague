import { SimplifiedChampion } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TextInput, Button, Image, Pressable } from "react-native";

export default function myChampions(){
    const [data, setData] = useState<SimplifiedChampion[]>([]);

    const getStoredObjects = async () => {
        try {
          const existingArray = await AsyncStorage.getItem('myChampions');
          return existingArray ? JSON.parse(existingArray) : [];
        } catch (error) {
          console.error('Error retrieving stored objects:', error);
          return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
          const data = await getStoredObjects();
          setData(data);
          console.log('Stored objects:', data);
        };
      
        fetchData();
    }, []);

    return(
        <View style={{padding: 20, backgroundColor: "#091428", alignItems: "center", flex: 1}}>
            {data.map((item, index) => (
                <Text key={index} style={{color: "white"}}>
                    -{item.name}
                </Text>
            ))}
        </View>
    )
}