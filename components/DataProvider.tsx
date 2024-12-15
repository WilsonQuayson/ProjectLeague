import { Champion, SimplifiedChampion } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


export interface DataContext{
    champions: SimplifiedChampion[];
    loading: boolean;
    loadData: () => void;
    addChampion: (newChampion: SimplifiedChampion) => void;
}

export const DataContext = createContext<DataContext>({champions: [], loading: false, loadData: () => {}, addChampion: () => {}});

export default function DataProvider({children} : {children: React.ReactNode}) {
    const [loading, setLoading] = useState(false);
    const [champions, setChampions] = useState<SimplifiedChampion[]>([]);

    const addChampion = async (newChampion: SimplifiedChampion) => {
        setChampions((prevChampions) => [...prevChampions, newChampion]);
    
        try {
            const existingArray = await AsyncStorage.getItem('myChampions');
            let parsedArray: SimplifiedChampion[] = [];
    
            if (existingArray) {
                try {
                    const parsedData = JSON.parse(existingArray);
                    if (Array.isArray(parsedData)) {
                        parsedArray = parsedData;
                    } else {
                        console.warn('Unexpected data format in AsyncStorage. Resetting to an empty array.');
                    }
                } catch (error) {
                    console.warn('Failed to parse existing data. Resetting to an empty array.', error);
                }
            }
    
            parsedArray.push(newChampion);
    
            await AsyncStorage.setItem('myChampions', JSON.stringify(parsedArray));
            console.log('New champion successfully saved to storage!');
        } catch (error) {
            console.error('Error saving new champion to storage:', error);
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
    };

    const initializeStorage = async () => {
        try {
          const existingArray = await AsyncStorage.getItem('myChampions');
          if (!existingArray) {
            await AsyncStorage.setItem('myChampions', JSON.stringify([]));
          }
        } catch (error) {
          console.error('Error initializing storage:', error);
        }
    };

    useEffect(() => {
        loadData();
        initializeStorage();
    }, [])

    return(
        <DataContext.Provider value={{champions: champions, loading: loading, loadData: loadData, addChampion: addChampion}}>
            {children}
        </DataContext.Provider>
    )
}