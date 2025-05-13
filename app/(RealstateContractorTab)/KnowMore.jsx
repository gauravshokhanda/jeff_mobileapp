import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";

export default function KnowMoreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
        <View className=" absolute flex-row items-center justify-between z-10 ">
        <TouchableOpacity onPress={() => router.back()} className="mx-3 mt-20">
          <Ionicons name="arrow-back-circle" size={42} color="black" />
        </TouchableOpacity>
      </View>
      {/* Warning Icon */}
      <View className="bg-gray-200 rounded-xl p-4 items-center">
        <Image
          source={require("../../assets/images/realState/warning.png")} 
          className="w-28 h-48"
        />
      </View>

      {/* Information Box */}
      <View className=" rounded-xl p-10 m-4">
        {/* <Text className="text-black">
          Now, when users click on <Text className="font-bold">"Know More,"</Text> they'll be taken to knowmore.html for more details. 🚀{"\n"}
        </Text> */}

        {/* <Text className="text-black font-bold mt-2">ChatGPT said:</Text> */}
        <Text className="text-black">
          <Text className="font-bold text-xl tracking-widest my-3">Be Cautious of Suspicious Calls!</Text>{"\n"}
          Scammers are posing as Army personnel or Public Service officers and asking people to transfer money. These fraudsters use fake identities to gain trust and manipulate victims into making transactions.
        </Text>

        <Text className="text-sky-700 font-bold my-4 tracking-wider">How to Stay Safe?</Text>
        <Text className="text-black">✅ Verify the caller’s identity before sharing any details.</Text>
        <Text className="text-black">✅ Never transfer money to unknown individuals.</Text>
        <Text className="text-black">✅ Avoid sharing OTPs, bank details, or personal information.</Text>
        <Text className="text-black">✅ Report suspicious calls to the authorities immediately.</Text>

        <Text className="text-black font-bold mt-4 tracking-widest">
          Stay alert and protect yourself from fraud! 🚨
        </Text>
      </View>
    </SafeAreaView>
  );
}
