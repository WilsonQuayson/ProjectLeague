import { Champion, SimplifiedChampion, Tag } from "@/types";
import { useContext, useState } from "react";
import { View, Text, StyleSheet, Alert, TextInput, Button, Image, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { DataContext } from "@/components/DataProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function AddChampion() {
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [blurb, setBlurb] = useState("");
    const [tags, setTags] = useState<Tag[] | null>(null);
    const [image, setImage] = useState<string>("");

    const { champions, addChampion, loadData } = useContext(DataContext);

    const saveObjectToStorage = async (champion: SimplifiedChampion) => {
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
      
          parsedArray.push(champion);
      
          await AsyncStorage.setItem('myChampions', JSON.stringify(parsedArray));
          console.log('Champion successfully saved to storage!');
        } catch (error) {
          console.error('Error saving object to storage:', error);
        }
    };
      

    const handleSubmit = async () => {
        if (!name || !title || !blurb || !tags) {
            Alert.alert("Error", "All fields and an image are required!");
            return;
        }
    
        const newChampion: Champion = {
            id: champions.length + 1,
            name,
            title,
            blurb,
            tags,
            image: {
                full: image,
                loading: image,
            },
            info: {
                attack: 0,
                defense: 0,
                magic: 0,
                difficulty: 0,
            },
            partype: "Mana",
            stats: {
                hp: 0,
                hpperlevel: 0,
                mp: 0,
                mpperlevel: 0,
                movespeed: 0,
                armor: 0,
                armorperlevel: 0,
                attackdamage: 0,
                attackdamageperlevel: 0,
                attackspeed: 0,
                attackspeedperlevel: 0,
            },
        };
    
        const baseURL = "https://sampleapis.assimilate.be/lol/champions";
    
        try {
            const response = await fetch(baseURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InMxNDY2MDBAYXAuYmUiLCJpYXQiOjE3MzI4NzM4OTB9.AqCxFWDKCjh83sINNUsBRjJ7W4YBGGnfgMKLRwVkf6s",
                },
                body: JSON.stringify(newChampion),
            });

            await loadData();
    
            if (response.ok) {
                const addedChampion = await response.json();
                console.log("Added Champion:", addedChampion);
                Alert.alert("Success", "Champion added successfully!");
                addChampion(newChampion);
                saveObjectToStorage(newChampion);
            } else {
                const errorText = await response.text();
                console.error("Failed to add champion:", errorText);
                Alert.alert("Error", "Failed to add the champion. Please try again.");
            };
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", "An unexpected error occurred. Please try again.");
        }
    };
    

    const handleImagePicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (result.canceled) {
            console.log("Image picker canceled");
            return;
        }

        if (result.assets && result.assets[0].uri) {
            try {
                const sourceUri = result.assets[0].uri;
                const fileName = sourceUri.split("/").pop();
                const destUri = `${FileSystem.documentDirectory}${fileName}`;

                await FileSystem.copyAsync({
                    from: sourceUri,
                    to: destUri,
                });

                setImage(destUri);
            } catch (error) {
                console.error(error);
                Alert.alert("Failed to save the image");
            }
        }
    };

    return (
        <View style={styles.main}>
            <Text style={{ color: "#C89B3C", fontSize: 20, fontWeight: "500" }}>
                Add your own champion to the league
            </Text>

            <View style={{ marginTop: 40 }}>
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
                <Text style={styles.label}>Lore:</Text>
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

            <View style={{ marginTop: 20 }}>
                <Pressable style={styles.pickImage} onPress={handleImagePicker}>
                    <Text style={{ textAlign: "center", color: "#C89B3C" }}>Pick an image</Text>
                </Pressable>
                {image && (
                    <Image source={{ uri: image }} style={styles.image} />
                )}
            </View>

            <View style={{ marginTop: 10 }}>
                <Button title="Add Champion" onPress={handleSubmit} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        padding: 10,
        backgroundColor: "#091428",
        flex: 1,
    },
    label: {
        color: "#C89B3C",
    },
    input: {
        borderWidth: 1,
        borderColor: "#C89B3C",
        padding: 8,
        marginTop: 5,
        color: "#fff",
        backgroundColor: "#1A263A",
        borderRadius: 4,
    },
    image: {
        height: 50,
        width: "auto",
        resizeMode: "contain",
    },
    pickImage: {
        borderColor: "#C89B3C",
        borderWidth: 2,
        padding: 5,
        width: 200,
        marginLeft: "auto",
        marginRight: "auto",
    },
});
