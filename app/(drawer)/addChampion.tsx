import { SimplifiedChampion, Tag } from "@/types";
import { useContext, useState } from "react";
import { View, Text, StyleSheet, Alert, TextInput, Button, Image, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { DataContext } from "@/components/DataProvider";

export default function AddChampion() {
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [blurb, setBlurb] = useState("");
    const [tags, setTags] = useState<Tag[] | null>(null)
    const [image, setImage] = useState<string | null>(null);

    const { champions, addChampion } = useContext(DataContext);

    const handleSubmit = async() => {
        if (!name || !title || !blurb || !tags) {
          Alert.alert("Error", "All fields and an image are required!");
          return;
        }
    
        const newChampion: SimplifiedChampion = {
          id: champions.length + 1,
          name,
          title,
          blurb,
          tags,
          image: {
            full: "https://placehold.co/600x400", // image picker & camera nog toevoegen
            loading: "https://placehold.co/600x400",
          },
        };

        const headers = { method: 'POST', 'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InMxNDY2MDBAYXAuYmUiLCJpYXQiOjE3MzI4NzM4OTB9.AqCxFWDKCjh83sINNUsBRjJ7W4YBGGnfgMKLRwVkf6s' };
        const baseURL = "https://sampleapis.assimilate.be/lol/champions";
        let response = await fetch(baseURL, {headers});
        
        //addChampion(newChampion);
        console.log("champion:" + newChampion)
    };

    const handleImagePicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if(result.canceled) {
            console.log("Image picker canceled");
            return;
        }

        if(result.assets && result.assets[0].uri){
            try{
                const sourceUri = result.assets[0].uri;

                const fileName = sourceUri.split("/").pop();
                const destUri = `${FileSystem.documentDirectory}${fileName}`;

                await FileSystem.copyAsync({
                    from: sourceUri,
                    to: destUri
                });

                setImage(destUri);
            }catch(error){
                console.error(error)
                Alert.alert("Failed to save the image")
            }
        }
    }

    return(
        <View style={styles.main}>
            <Text style={{color: "#C89B3C", fontSize:20, fontWeight:500}}>add your own champion to the league</Text>

            <View style={{marginTop:40}}>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Aatrox"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <View>
                <Text style={styles.label}>Title:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="The Darkin Blade"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>

            <View>
                <Text style={styles.label}>Blurb:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="some lore"
                    value={blurb}
                    onChangeText={setBlurb}
                />
            </View>

            <View>
                <Text style={styles.label}>Tag:</Text>
                <Picker
                    selectedValue={tags?.[0] || null}
                    onValueChange={(value) => setTags([value as Tag])}
                >
                    <Picker.Item label="Select a tag..." value={null} />
                    {Object.values(Tag).map((tag) => (
                        <Picker.Item key={tag} label={tag} value={tag} />
                    ))}
                </Picker>
                {tags && <Text>Selected Tags: {tags.join(", ")}</Text>}
            </View>

            <View style={{marginTop:20}}>
                <Pressable style={styles.pickImage} onPress={handleImagePicker}><Text style={{textAlign: "center", color: "#C89B3C"}}>Pick an image</Text></Pressable>
                {image && (
                    <Image
                        source={{uri: image}}
                        style={styles.image}
                    />
                )}
            </View>
            <View style={{marginTop: 10}}>
                <Button title="Add Champion" onPress={handleSubmit} />  
            </View>          
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        padding: 10,
        backgroundColor: "#091428",
        flex: 1
    },
    label: {
        color: "#C89B3C"
    },
    input: {

    },
    image: {
        height:50,
        width:"auto",
        resizeMode:"contain"
    },
    pickImage: {
        borderColor: "#C89B3C",
        borderWidth: 2,
        padding: 5,
        width: 200,
        marginLeft: "auto",
        marginRight: "auto"
    }
})