import DataProvider from "@/components/DataProvider";
import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <DataProvider>
      <Stack>
        <Stack.Screen name="(drawer)" options={{
          headerShown: false,
          headerTintColor: '#C89B3C'
        }} />
      </Stack>
    </DataProvider>
  );
}

export default RootLayout;