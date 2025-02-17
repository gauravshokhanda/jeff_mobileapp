import { View, Text, Image, ScrollView } from "react-native";

export default function KnowMoreScreen() {
  return (
    <ScrollView className="flex-1 bg-white p-4 ">
      {/* Warning Icon */}
      <View className="bg-gray-200 rounded-xl p-4 items-center mt-20">
        <Image
          source={require("../../assets/images/realState/warning.png")} // Add your warning icon image
          className="w-28 h-48"
        />
      </View>

      {/* Information Box */}
      <View className="bg-gray-100 rounded-xl p-4 mt-4">
        <Text className="text-black">
          Now, when users click on <Text className="font-bold">"Know More,"</Text> they'll be taken to knowmore.html for more details. 🚀{"\n"}
        </Text>

        <Text className="text-black font-bold mt-2">ChatGPT said:</Text>
        <Text className="text-black">
          <Text className="font-bold">Be Cautious of Suspicious Calls!</Text>{"\n"}
          Scammers are posing as Army personnel or Public Service officers and asking people to transfer money. These fraudsters use fake identities to gain trust and manipulate victims into making transactions.
        </Text>

        <Text className="text-green-700 font-bold mt-4">How to Stay Safe?</Text>
        <Text className="text-black">✅ Verify the caller’s identity before sharing any details.</Text>
        <Text className="text-black">✅ Never transfer money to unknown individuals.</Text>
        <Text className="text-black">✅ Avoid sharing OTPs, bank details, or personal information.</Text>
        <Text className="text-black">✅ Report suspicious calls to the authorities immediately.</Text>

        <Text className="text-black font-bold mt-4">
          Stay alert and protect yourself from fraud! 🚨
        </Text>
      </View>
    </ScrollView>
  );
}
