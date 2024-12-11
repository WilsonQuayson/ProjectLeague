import { Champion, SimplifiedChampion } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


export interface DataContext{
    champions: SimplifiedChampion[];
    loading: boolean;
    loadData: () => void;
    addChampion: (newChampion: SimplifiedChampion) => void;
    storeData: (champion: SimplifiedChampion) => void;
    getData: (champion: SimplifiedChampion) => void;
}

export const DataContext = createContext<DataContext>({champions: [], loading: false, loadData: () => {}, addChampion: () => {}, storeData: () => {}, getData: () => {}});

export default function DataProvider({children} : {children: React.ReactNode}) {
    const [loading, setLoading] = useState(false);
    const [champions, setChampions] = useState<SimplifiedChampion[]>([]);

    const addChampion = (newChampion: SimplifiedChampion) => {
        setChampions((prevChampions) => [...prevChampions, newChampion]);
    };
      
    const storeData = async (champion : SimplifiedChampion) => {
        try {
            await AsyncStorage.setItem("favorite", JSON.stringify(champion));
            console.log(`Champion ${champion.name} saved successfully.`);
        } catch (error) {
            console.error(`Failed to store champion ${champion.name}:`, error);
        }
    };

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem("favorite");
            if (value !== null) {
              const champion: SimplifiedChampion = JSON.parse(value);
              console.log(`Champion ${champion.name} retrieved successfully.`, champion);
              return champion;
            } else {
              alert("No data found for the specified champion.");
              return undefined;
            }
        } catch (error) {
            console.error(`Failed to retrieve champion:`, error);
            return undefined;
        }
    };

    async function loadData(){
        setLoading(true);
        const headers = { 'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InMxNDY2MDBAYXAuYmUiLCJpYXQiOjE3MzI4NzM4OTB9.AqCxFWDKCjh83sINNUsBRjJ7W4YBGGnfgMKLRwVkf6s' };
        const baseURL = "https://sampleapis.assimilate.be/lol/champions";

        let response = await fetch(baseURL, {headers});
        if (!response.ok) {
            console.error("API error:", response.status, response.statusText);
            return;
        }

        let data: Champion[] = await response.json();

        const champions: SimplifiedChampion[] = Object.values(data).map(
            (champion: Champion) => ({
                id: champion.id,
                name: champion.name,
                title: champion.title,
                blurb: champion.blurb,
                tags: champion.tags,
                image: {
                    full: champion.image.full,
                    loading: champion.image.loading,
                },
                info: champion.info
            })
        );



        setChampions(champions);
        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, [])

    return(
        <DataContext.Provider value={{champions: champions, loading: loading, loadData: loadData, addChampion: addChampion, storeData: storeData, getData: getData}}>
            {children}
        </DataContext.Provider>
    )
}