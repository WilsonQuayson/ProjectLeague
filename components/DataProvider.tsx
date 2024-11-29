import { Champion, SimplifiedChampion } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";


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

    const addChampion = (newChampion: SimplifiedChampion) => {
        setChampions((prevChampions) => [...prevChampions, newChampion]);
    };
      

    async function loadData(){
        setLoading(true);
        const headers = { 'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InMxNDY2MDBAYXAuYmUiLCJpYXQiOjE3MzI4NzM4OTB9.AqCxFWDKCjh83sINNUsBRjJ7W4YBGGnfgMKLRwVkf6s' };
        const baseURL = "https://sampleapis.assimilate.be/lol/champions";

        let response = await fetch(baseURL, {headers});
        //API Anders aanspreken
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
            })
        );



        setChampions(champions);
        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, [])

    return(
        <DataContext.Provider value={{champions: champions, loading: loading, loadData: loadData, addChampion: addChampion}}>
            {children}
        </DataContext.Provider>
    )
}